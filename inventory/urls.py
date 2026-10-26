from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet

router = DefaultRouter()
router.register("products", ProductViewSet, basename="product")

# Direct router for mounts directly at /products/
direct_router = DefaultRouter()
direct_router.register("", ProductViewSet, basename="product-direct")

urlpatterns = [
    path("", include(router.urls)),
]