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
