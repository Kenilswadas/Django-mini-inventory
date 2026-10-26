from decimal import Decimal
from rest_framework import serializers
from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    price = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        min_value=Decimal("0.00"),
        error_messages={
            "min_value": "Price cannot be negative.",
            "invalid": "Price must be a valid number.",
        },
    )
    quantity = serializers.IntegerField(
        min_value=0,
        error_messages={
            "min_value": "Quantity cannot be negative.",
            "invalid": "Quantity must be an integer.",
        },
    )

    class Meta:
        model = Product
        fields = ["id", "name", "price", "quantity", "created_at"]
        read_only_fields = ["id", "created_at"]

    def validate_name(self, value):
        trimmed = value.strip()
        if not trimmed:
            raise serializers.ValidationError("Product name cannot be blank.")
        return trimmed