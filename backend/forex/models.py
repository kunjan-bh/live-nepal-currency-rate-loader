from django.db import models
from django.utils import timezone

class CurrencyRate(models.Model):
    """
    Store CurrencyFreaks exchange rates
    """
    data = models.JSONField()  # Stores all rates
    fetched_at = models.DateTimeField(default=timezone.now)  # Timestamp of fetch

    class Meta:
        ordering = ['-fetched_at']  

    def __str__(self):
        return f"CurrencyRate fetched at {self.fetched_at}"



class NRBRate(models.Model):
    code = models.CharField(max_length=10)
    name = models.CharField(max_length=50)
    unit = models.FloatField()
    buy = models.FloatField()
    sell = models.FloatField()
    date = models.DateField()  # NRB rate date
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.code} - {self.date}"
    
    class Meta:
        unique_together = ("code", "date")

class LocalMetalRate(models.Model):
    date = models.CharField(max_length=50)  # Nepali date or "Date not found"
    fine_gold = models.IntegerField()
    tejabi_gold = models.IntegerField(default=0)
    silver = models.IntegerField()
    fetched_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-fetched_at"]

    def __str__(self):
        return f"Local Metal Rate ({self.fetched_at.date()})"

class MetalRate(models.Model):# to save of the (goldapi.io)
    METAL_CHOICES = [
        ('XAU', 'Gold'),
        ('XAG', 'Silver'),
    ]
    
    metal = models.CharField(max_length=3, choices=METAL_CHOICES)
    currency = models.CharField(max_length=3, default='USD')
    price_gram_usd = models.FloatField()  # Updated to store gram price in USD
    fetched_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.metal} - {self.price_gram_usd} {self.currency} per gram at {self.fetched_at}"

class MetalRateTola_v2(models.Model):# to save of the (gold-api.com)
    METAL_CHOICES = [
        ('XAU', 'Gold'),
        ('XAG', 'Silver'),
    ]
    
    metal = models.CharField(max_length=3, choices=METAL_CHOICES)
    currency = models.CharField(max_length=3, default='USD')
    price_tola_npr = models.FloatField()  # Updated to store gram price in USD
    fetched_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.metal} - {self.price_tola_npr} {self.currency} per gram at {self.fetched_at}"

# forex/models.py

