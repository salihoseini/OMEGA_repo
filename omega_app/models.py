from django.db import models
from django.utils import timezone
from users.models import Users
import jdatetime
timezone.activate("Asia/Tehran")

# Create your models here.


class Category(models.Model):
    name = models.CharField(max_length=100)
    date = models.DateTimeField(default=timezone.now)
    picture = models.ImageField(default='../media/foodImages/default.jpg' , upload_to="foodImages/")
    trash = models.BooleanField(default=False)

    def __str__(self):
        return self.name

class Food(models.Model):
    name = models.CharField(max_length=100)
    category = models.ForeignKey(Category , on_delete=models.CASCADE)
    price = models.IntegerField()
    description = models.TextField()
    num_like = models.IntegerField(default=0)
    num_comments = models.IntegerField(default=0)
    added_date = models.DateTimeField(default=timezone.datetime.now)
    #picture = models.ImageField(upload_to="foodImages/" , default='../media/foodImages/default.jpg')
    trash = models.BooleanField(default=False)
    time_to_prepare = models.IntegerField(default=10)
    destination = models.CharField(default="True", max_length=10)

    def __str__(self):
        return self.name

class shoppingCart(models.Model):
    user = models.ForeignKey(Users , on_delete=models.CASCADE)
    food = models.ForeignKey(Food, on_delete=models.CASCADE)
    date_added = models.DateTimeField(default=timezone.now)
    num_food = models.IntegerField(default=0)
    trash = models.BooleanField(default=False)

    def __str__(self):
        return str(self.user.mac_address) + " " + str(self.num_food) + " " + str(self.food.name)

class Orders(models.Model):
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    food = models.ForeignKey(Food, on_delete=models.CASCADE)
    date_added = models.DateTimeField(default=timezone.now)
    num_food = models.IntegerField(default=0)

    def __str__(self):
        return "products_id : {}".format(self.id)

class Product(models.Model):
    food = models.ForeignKey(Food, on_delete=models.CASCADE)
    num_food = models.IntegerField(default=0)

    def __str__(self):
        return "product_id : {}".format(self.id)


class Order(models.Model):
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    product = models.ManyToManyField(Product)
    date_added = models.DateTimeField(default=timezone.now)
    confirm_l1 = models.BooleanField(default=False)
    confirm_l2 = models.BooleanField(default=False)
    customer_confirm = models.BooleanField(default=False)
    show_admin = models.BooleanField(default=False)
    order_status = models.CharField(default='', max_length=80)
    preparing_time = models.IntegerField(default=0)
    registration_time = models.DateTimeField(default=timezone.datetime.now)
    confirm_time = models.DateTimeField(default=timezone.datetime.now)
    note = models.TextField(default="")
    table_number = models.IntegerField(default=0)
    confirm_services = models.BooleanField(default=False)
    def __str__(self):
        return "order_id : {}".format(self.id)



class SoldProducts(models.Model):
    user = models.ForeignKey(Users, on_delete=models.SET_NULL, null=True)
    food = models.ForeignKey(Food, on_delete=models.SET_NULL, null=True)
    date_added = models.DateTimeField(default=timezone.now)
    num_food = models.IntegerField(default=0)
    def __str__(self):
        return "products_id : {}".format(self.id)


#default_category = Category.objects.first()
#default_food = Food.objects.first()
#defalt_user = Users.objects.first()

class like(models.Model):
    food = models.ForeignKey(Food , on_delete=models.CASCADE)
    date = models.DateTimeField(default=timezone.now)
    user = models.ForeignKey(Users , on_delete=models.CASCADE)
    liked = models.BooleanField(default=True)
    trash = models.BooleanField(default=False)
    def __str__(self):
        if self.liked:
            liked = 'liked'
        else:
            liked = 'unlike'
        return str(self.user.mac_address) + " " + liked +  " " +  str(self.food.name)


class Comment(models.Model):
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    food = models.ForeignKey(Food, on_delete=models.CASCADE)
    date_addded = models.DateTimeField(default=timezone.now)
    author = models.CharField(max_length=80)
    content = models.TextField()
    trash = models.BooleanField(default=False)
    confirm = models.BooleanField(default=False)

    def __str__(self):
        return str(self.author) + " comented on " + str(self.food.name)


class FoodMedia(models.Model):
    food_id = models.IntegerField(default=0)
    picture = models.ImageField(upload_to="foodImages/" , default='../media/foodImages/default.jpg')
    trash = models.BooleanField(default=False)

    def __str__(self):
        return "food" + str(self.food_id)
