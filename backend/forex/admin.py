from django.contrib import admin
from .models import (
    CurrencyRate,
    NRBRate,
    LocalMetalRate,
    MetalRate,
    MetalRateTola_v2
)


admin.site.register(CurrencyRate)
admin.site.register(NRBRate)
admin.site.register(LocalMetalRate)
admin.site.register(MetalRate)
admin.site.register(MetalRateTola_v2)

