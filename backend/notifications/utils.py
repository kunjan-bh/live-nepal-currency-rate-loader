from django.shortcuts import render

# Create your views here.
# utils/email.py
from django.core.mail import send_mail
from django.conf import settings
from users.models import User

import hashlib
import json
from .models import RateNotificationLog

def send_rate_update_email(subject, message):
    recipients = list(
        User.objects.filter(is_subscribed=True)
        .values_list("email", flat=True)
    )

    if not recipients:
        print("No subscribers found. Skipping email.")
        return

    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        recipients,
        fail_silently=False,
    )



def notify_if_changed(source, data, email_subject, email_body):
    """
    source: unique name (NRB, METAL, etc.)
    data: python dict/list of rates
    """
    serialized = json.dumps(data, sort_keys=True)
    data_hash = hashlib.md5(serialized.encode()).hexdigest()

    log = RateNotificationLog.objects.filter(source=source).first()

    if log and log.last_data_hash == data_hash:
        print(f"No change detected for {source}")
        return  # ❌ no change → no email

    # ✅ change detected
    send_rate_update_email(email_subject, email_body)

    RateNotificationLog.objects.update_or_create(
        source=source,
        defaults={"last_data_hash": data_hash}
    )

    print(f"Email sent for {source}")
