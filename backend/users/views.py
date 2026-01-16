from django.shortcuts import render
from .models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response
from datetime import datetime
# Create your views here.


@api_view(['POST'])
def subscribe(request):
    email = request.data.get('email')
    
    if not email:
        return Response({"success": False, "message": "Email is required"})

    try:
        # Check if user exists or create a new one
        user, created = User.objects.get_or_create(email=email)
        user.save()

        return Response({
            "success": True,
            "message": "User subscribed successfully",
            "created": created  # True if new user was created
        })
    except Exception as e:
        return Response({"success": False, "message": str(e)})