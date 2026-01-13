"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from forex.views import nrb_rates, currencyfreaks_rates, fetch_fenegosida_rates

urlpatterns = [
    path('admin/', admin.site.urls),
    path('nrb_rates/', nrb_rates, name='nrb_rates'),
    path("currencyfreaks_rates/", currencyfreaks_rates),
    path("local_metal_rate/", fetch_fenegosida_rates),
]
