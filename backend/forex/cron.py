from django.test import RequestFactory
from .views import currencyfreaks_rates, nrb_rates, get_metal_rates, get_metal_rate_api

def fetch_currencyfreaks_job():
    """Run CurrencyFreaks API to update rates and send notifications if changed"""
    factory = RequestFactory()
    request = factory.get("/currencyfreaks_rates/")
    response = currencyfreaks_rates(request)
    print("CurrencyFreaks cron executed:", response.status_code)

def fetch_nrb_job():
    """Run NRB API to update rates and send notifications if changed"""
    factory = RequestFactory()
    request = factory.get("/nrb_rates/")
    response = nrb_rates(request)
    print("NRB cron executed:", response.status_code)



def fetch_metal_rates_job():
    """Run both metal APIs to update gold/silver rates"""
    factory = RequestFactory()
    
    # GoldAPI.io
    request1 = factory.get("/metal_rates/")
    response1 = get_metal_rates(request1)
    print("Metal GoldAPI cron executed:", response1.status_code)
    
    # Gold-API.com (v2)
    request2 = factory.get("/metal_rates_v2/")
    response2 = get_metal_rate_api(request2)
    print("Metal Gold-API cron executed:", response2.status_code)
