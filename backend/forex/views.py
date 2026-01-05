# forex/views.py
import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response

NRB_API_URL = "https://www.nrb.org.np/api/forex/v1/app-rate"
NRB_CURRENCIES = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CNY", "INR"]

@api_view(['GET'])
def nrb_rates(request):
    """
    Fetches the latest NRB exchange rates for selected currencies
    """
    try:
        headers = {"User-Agent": "Mozilla/5.0"}
        res = requests.get(NRB_API_URL, headers=headers, timeout=10)
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
            if cur["iso3"] in NRB_CURRENCIES
        ]

        print("Filtered Rates:", filtered_rates)

        return Response({"success": True, "rates": filtered_rates})

    except requests.RequestException as e:
        return Response({"success": False, "message": str(e)}, status=500)
