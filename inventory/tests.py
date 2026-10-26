from decimal import Decimal
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Product


class ProductAPITests(APITestCase):
    def setUp(self):
        self.product1 = Product.objects.create(
            name="Mechanical Keyboard",
            price=Decimal("120.00"),
            quantity=15,
        )
        self.product2 = Product.objects.create(
            name="Gaming Mouse",
            price=Decimal("50.00"),
            quantity=0,
        )

    def test_list_products(self):
        """Test retrieving list of products."""
        response = self.client.get("/api/products/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_retrieve_single_product(self):
        """Test retrieving a single product by ID."""
        response = self.client.get(f"/api/products/{self.product1.id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], "Mechanical Keyboard")
        self.assertEqual(Decimal(response.data["price"]), Decimal("120.00"))
        self.assertEqual(response.data["quantity"], 15)

    def test_create_valid_product(self):
        """Test creating a new product with valid data."""
        data = {
            "name": "USB-C Hub",
            "price": "39.99",
            "quantity": 25,
        }
        response = self.client.post("/api/products/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["name"], "USB-C Hub")
        self.assertEqual(Decimal(response.data["price"]), Decimal("39.99"))
        self.assertEqual(response.data["quantity"], 25)
        self.assertTrue(Product.objects.filter(name="USB-C Hub").exists())

    def test_create_product_blank_name_fails(self):
        """Test that empty or blank name returns validation error."""
        data = {
            "name": "   ",
            "price": "25.00",
            "quantity": 10,
        }
        response = self.client.post("/api/products/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("name", response.data)

    def test_create_product_negative_price_fails(self):
        """Test that negative price returns validation error."""
        data = {
            "name": "Monitor Stand",
            "price": "-10.00",
            "quantity": 5,
        }
        response = self.client.post("/api/products/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("price", response.data)

    def test_create_product_negative_quantity_fails(self):
        """Test that negative quantity returns validation error."""
        data = {
            "name": "Desk Mat",
            "price": "15.00",
            "quantity": -2,
        }
        response = self.client.post("/api/products/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("quantity", response.data)

    def test_update_product(self):
        """Test full update (PUT) of a product."""
        data = {
            "name": "Mechanical Keyboard RGB",
            "price": "140.00",
            "quantity": 20,
        }
        response = self.client.put(f"/api/products/{self.product1.id}/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.product1.refresh_from_db()
        self.assertEqual(self.product1.name, "Mechanical Keyboard RGB")
        self.assertEqual(self.product1.price, Decimal("140.00"))
        self.assertEqual(self.product1.quantity, 20)

    def test_partial_update_product(self):
        """Test partial update (PATCH) of a product."""
        data = {"quantity": 8}
        response = self.client.patch(f"/api/products/{self.product1.id}/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.product1.refresh_from_db()
        self.assertEqual(self.product1.quantity, 8)
        self.assertEqual(self.product1.name, "Mechanical Keyboard")

    def test_delete_product(self):
        """Test deleting a product."""
        response = self.client.delete(f"/api/products/{self.product2.id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Product.objects.filter(id=self.product2.id).exists())

    def test_search_product_by_name(self):
        """Test searching products by name."""
        response = self.client.get("/api/products/?search=Keyboard")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["name"], "Mechanical Keyboard")
