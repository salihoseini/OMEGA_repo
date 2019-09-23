from django.contrib import admin
from .models import Category, Food, like, Comment, shoppingCart, SoldProducts, Order, Product, FoodMedia

admin.site.register(Category)
admin.site.register(Food)
admin.site.register(like)
admin.site.register(shoppingCart)
admin.site.register(Comment)
admin.site.register(SoldProducts)
admin.site.register(Order)
admin.site.register(Product)
admin.site.register(FoodMedia)