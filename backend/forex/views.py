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

    try:
        res = requests.get(NRB_API_URL+"?date=2026-01-08", headers=headers, timeout=10)
        res.raise_for_status()
        res_json = res.json()
        payload = res_json.get("data", {}).get("payload")
        # print(payload)
        published_date = payload.get("date") or today 
        # print(published_date)
        rates_list = payload.get("rates", [])
        print(payload)

        if payload:
            print("payload")
            filtered = [
                {
                    "code": cur["currency"]["iso3"],
                    "name": cur["currency"]["name"],
                    "unit": cur["currency"]["unit"],
                    "buy": float(cur["buy"]),
                    "sell": float(cur["sell"]),
                    "date": published_date,   # use top-level date
                }
                for cur in rates_list
                if cur["currency"]["iso3"] in CURRENCIES
            ]


            # 3️⃣ Save to DB
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

            return Response({"success": True, "last_updated": filtered[0]["date"], "rates": filtered})

        else:
            # 4️⃣ No payload: fetch last saved rates from DB
            last_saved = NRBRate.objects.filter(code__in=CURRENCIES).order_by('-date')
            if not last_saved.exists():
                return Response({"success": False, "message": "NRB rates not available yet"})

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

            return Response({"success": True, "last_updated": filtered[0]["date"], "rates": filtered})

    except Exception as e:
        # fallback to last saved rates if fetch fails
        last_saved = NRBRate.objects.filter(code__in=CURRENCIES).order_by('-date')
        if last_saved.exists():
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
            return Response({"success": True, "last_updated": filtered[0]["date"], "rates": filtered})
        
        return Response({"success": False, "message": str(e)}, status=500)




@api_view(["GET"])
def currencyfreaks_rates(request):
    """
    Fetch currency rates from CurrencyFreaks API.
    - Fetch every 1h Monday–Friday
    - Weekend: return last stored rate
    - If API fails: return cached data
    """
    try:
        today = datetime.today().weekday()  # 0=Mon, 6=Sun
        now = timezone.now()

        # Always get latest record
        last_entry = CurrencyRate.objects.order_by("-fetched_at").first()
        use_cached = False

        if last_entry:
            last_fetched = last_entry.fetched_at

            if today >= 5:  # Sat/Sun
                use_cached = True
            elif now - last_fetched < timedelta(hours=1):
                use_cached = True

        if use_cached and last_entry:
            return Response({
                "success": True,
                "base": "USD",
                "rates": last_entry.data,
                "cached": True,
                "last_updated": last_entry.fetched_at
            })

        # Fetch new data
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

        return Response({
            "success": True,
            "base": "USD",
            "rates": filtered_rates,
            "cached": False
        })

    except Exception as e:
        if last_entry:
            return Response({
                "success": True,
                "base": "USD",
                "rates": last_entry.data,
                "cached": True,
                "warning": "Live fetch failed, showing last available data",
                "last_updated": last_entry.fetched_at
            })

        return Response({
            "success": False,
            "message": str(e)
        }, status=500)
