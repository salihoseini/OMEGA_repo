from django.db import models
from omega_app.models import Users, Product
from django.utils import timezone

class CompletedOrders(models.Model):
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    products = models.ManyToManyField(Product)
    date_added = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return "order_id : {}".format(self.id)

class Options(models.Model):
    rest_name = models.CharField(max_length=40)
    rest_banner = models.TextField()
    bg_picture = models.ImageField(default='../media/optionsImages/default.jpg', upload_to="optionsImages/")

    def __str__(self):
        return self.rest_name
