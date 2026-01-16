from django.db import models

# Create your models here.
class User(models.Model):
    email = models.EmailField(unique=True)
    is_subscribed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email