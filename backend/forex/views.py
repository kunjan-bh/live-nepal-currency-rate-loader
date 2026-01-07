# forex/views.py
import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
from decouple import config

NRB_API_URL = "https://www.nrb.org.np/api/forex/v1/app-rate"
CURRENCY_FREAKS_URL = "https://api.currencyfreaks.com/v2.0/rates/latest"
API_KEY = config("CURRENCY_FREAKS_API_KEY")
CURRENCIES = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CNY", "INR"]

@api_view(['GET'])
def nrb_rates(request):
    """
    Fetches the latest NRB exchange rates for selected currencies
    """
    try:
        headers = {"User-Agent": "Mozilla/5.0"}
        res = requests.get(NRB_API_URL, headers=headers, timeout=10)
        print("NRB API Response:", res.text)  # Debug
        res.raise_for_status()
        data = res.json()
        print("NRB API Response:", data)  # Debug

        if not isinstance(data, list) or len(data) == 0:
            return Response({"success": True, "rates": []})

        # Filter only the currencies we want
        filtered_rates = [
            {
                "code": cur["iso3"],
                "name": cur["name"],
                "unit": cur["unit"],
                "buy": cur["buy"],
                "sell": cur["sell"],
                "date": cur["date"],
            }
            for cur in data
            if cur["iso3"] in CURRENCIES
        ]

        print("Filtered Rates:", filtered_rates)

        return Response({"success": True, "rates": filtered_rates})

    except requests.RequestException as e:
        return Response({"success": False, "message": str(e)}, status=500)





@api_view(["GET"])
def currencyfreaks_rates(request):
    """
    Fetch exchange rates from CurrencyFreaks v2 API
    Base currency: USD
    """
    try:
        if not API_KEY:
            return Response({"success": False, "message": "API_KEY not set"}, status=500)

        url = f"{CURRENCY_FREAKS_URL}?apikey={API_KEY}"
        res = requests.get(url, timeout=10)
        res.raise_for_status()
        data = res.json()

        rates = data.get("rates", {})
        
        date = data.get("date")
        if not rates:
            return Response({"success": True, "rates": []})

        # Only include your major currencies
        filtered_rates = []
        for code in CURRENCIES:
            if code in rates:
                rate = float(rates[code])
                
                filtered_rates.append({
                    "code": code,
                    "name": code,
                    "unit": 1,
                    "buy": round(rate * 0.995, 4),
                    "sell": round(rate * 1.005, 4),
                    "date": date,
                })
        print("Filtered Rates:", filtered_rates)

        return Response({"success": True, "base": "USD", "rates": filtered_rates})

    except requests.RequestException as e:
        return Response({"success": False, "message": str(e)}, status=500)

