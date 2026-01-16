from django.db import models

# Create your models here.
class RateNotificationLog(models.Model):
    source = models.CharField(max_length=50)  
    last_data_hash = models.CharField(max_length=255)
    emailed_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.source