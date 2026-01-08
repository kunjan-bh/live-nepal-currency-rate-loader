# forex/views.py
import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
from decouple import config
from datetime import datetime
from .models import CurrencyRate, NRBRate
from datetime import timedelta
from django.utils import timezone


NRB_API_URL = "https://www.nrb.org.np/api/forex/v1/rate"
CURRENCY_FREAKS_URL = "https://api.currencyfreaks.com/v2.0/rates/latest"
API_KEY = config("CURRENCY_FREAKS_API_KEY")
CURRENCIES = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CNY", "INR"]


@api_view(["GET"])
def nrb_rates(request):
    headers = {"User-Agent": "Mozilla/5.0"}
    today = datetime.now().date()
    today_str = today.strftime("%Y-%m-%d")

    # 1️⃣ Check if today's rates already exist in DB
    if NRBRate.objects.filter(date=today).exists():
        print(f"Using cached NRB rates from DB for {today_str} (already fetched today).")
        last_saved = NRBRate.objects.filter(date=today)
        filtered = [
            {
                "code": rate.code,
                "name": rate.name,
                "unit": rate.unit,
                "buy": rate.buy,
                "sell": rate.sell,
                "date": rate.date
            }
            for rate in last_saved
        ]
        return Response({"success": True, "last_updated": filtered[0]["date"], "rates": filtered, "cached": True})

    # 2️⃣ No today's rates: Fetch new data
    print(f"Fetching new NRB rates for {today_str}...")
    try:
        res = requests.get(f"{NRB_API_URL}?date={today_str}", headers=headers, timeout=10)
        res.raise_for_status()
        res_json = res.json()
        payload = res_json.get("data", {}).get("payload")
        published_date = payload.get("date") or today_str
        rates_list = payload.get("rates", [])

        if payload and rates_list:
            print(f"Successfully fetched NRB rates for {published_date}.")
            filtered = [
                {
                    "code": cur["currency"]["iso3"],
                    "name": cur["currency"]["name"],
                    "unit": cur["currency"]["unit"],
                    "buy": float(cur["buy"]),
                    "sell": float(cur["sell"]),
                    "date": published_date,
                }
                for cur in rates_list
                if cur["currency"]["iso3"] in CURRENCIES
            ]

            # Save to DB
            for rate in filtered:
                NRBRate.objects.update_or_create(
                    code=rate["code"], date=rate["date"],
                    defaults={
                        "name": rate["name"],
                        "unit": rate["unit"],
                        "buy": rate["buy"],
                        "sell": rate["sell"]
                    }
                )

            return Response({"success": True, "last_updated": filtered[0]["date"], "rates": filtered, "cached": False})

        else:
            print("No payload in NRB response, falling back to latest DB rates.")
            raise Exception("No payload")

    except Exception as e:
        print(f"Error fetching NRB rates: {str(e)}. Falling back to latest DB rates.")
        # Fallback to latest saved rates from DB
        last_saved = NRBRate.objects.filter(code__in=CURRENCIES).order_by('-date')
        if not last_saved.exists():
            print("No NRB rates available in DB.")
            return Response({"success": False, "message": "NRB rates not available yet"})

        # Group by latest date (assume all codes have same latest date)
        latest_date = last_saved.first().date
        last_saved = last_saved.filter(date=latest_date)
        filtered = [
            {
                "code": rate.code,
                "name": rate.name,
                "unit": rate.unit,
                "buy": rate.buy,
                "sell": rate.sell,
                "date": rate.date
            }
            for rate in last_saved
        ]
        return Response({"success": True, "last_updated": filtered[0]["date"], "rates": filtered, "cached": True})


@api_view(["GET"])
def currencyfreaks_rates(request):
    """
    Fetch currency rates from CurrencyFreaks API.
    - Fetch every 1h Monday–Friday
    - Weekend: return last stored rate
    - If API fails: return cached data
    """
    try:
        today_weekday = datetime.today().weekday()  # 0=Mon, 6=Sun
        now = timezone.now()

        # Always get latest record
        last_entry = CurrencyRate.objects.order_by("-fetched_at").first()
        use_cached = False

        if last_entry:
            last_fetched = last_entry.fetched_at

            if today_weekday >= 5:  # Sat/Sun
                use_cached = True
                print("Weekend: Using cached CurrencyFreaks data from DB.")
            elif now - last_fetched < timedelta(hours=1):
                use_cached = True
                print("Recent fetch (<1 hour): Using cached CurrencyFreaks data from DB.")

        if use_cached and last_entry:
            return Response({
                "success": True,
                "base": "USD",
                "rates": last_entry.data,
                "cached": True,
                "last_updated": last_entry.fetched_at
            })

        # Fetch new data
        print("Fetching new data from CurrencyFreaks API...")
        if not API_KEY:
            raise Exception("API_KEY not set")

        res = requests.get(
            f"{CURRENCY_FREAKS_URL}?apikey={API_KEY}",
            timeout=10
        )
        res.raise_for_status()

        data = res.json()
        rates_data = data.get("rates", {})
        date = data.get("date")

        filtered_rates = []
        for code in CURRENCIES:
            if code in rates_data:
                rate = float(rates_data[code])
                filtered_rates.append({
                    "code": code,
                    "name": code,
                    "unit": 1,
                    "buy": round(rate * 0.995, 4),
                    "sell": round(rate * 1.005, 4),
                    "date": date,
                })

        CurrencyRate.objects.create(data=filtered_rates)
        print("Successfully fetched and saved new CurrencyFreaks rates.")

        return Response({
            "success": True,
            "base": "USD",
            "rates": filtered_rates,
            "cached": False
        })

    except Exception as e:
        print(f"Error fetching CurrencyFreaks rates: {str(e)}. Falling back to cached data.")
        if last_entry:
            return Response({
                "success": True,
                "base": "USD",
                "rates": last_entry.data,
                "cached": True,
                "warning": "Live fetch failed, showing last available data",
                "last_updated": last_entry.fetched_at
            })

        print("No CurrencyFreaks rates available in DB.")
        return Response({
            "success": False,
            "message": str(e)
        }, status=500)