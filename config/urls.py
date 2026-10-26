from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from inventory.urls import direct_router


def home(request):
    return JsonResponse({
        "project": "Mini Inventory API",
        "status": "running",
        "version": "1.0.0",
        "endpoints": {
            "products_list_create": "/api/products/",
            "products_detail": "/api/products/{id}/",
            "admin": "/admin/",
        },
    })


urlpatterns = [
    path("", home, name="home"),
    path("admin/", admin.site.urls),
    path("api/", include("inventory.urls")),
    path("products/", include(direct_router.urls)),
]
