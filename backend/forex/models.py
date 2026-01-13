from django.db import models
from django.utils import timezone

class CurrencyRate(models.Model):
    """
    Store CurrencyFreaks exchange rates
    """
    data = models.JSONField()  # Stores all rates
    fetched_at = models.DateTimeField(default=timezone.now)  # Timestamp of fetch

    class Meta:
        ordering = ['-fetched_at']  # Latest first

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