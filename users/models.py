from django.db import models
from django.utils import timezone

class AdminUser(models.Model):
    username = models.CharField(max_length=80)
    password = models.CharField(max_length=32)

    def __str__(self):
        return self.username

class Users(models.Model):
    mac_address = models.CharField(max_length=25)
    ip_address = models.CharField(max_length=20)
    agent = models.TextField()
    last_seen = models.DateTimeField(default=timezone.now)
    trash = models.BooleanField(default=False)
    name = models.CharField(max_length=120)
    secret_key = models.CharField(max_length=180)
    online = models.BooleanField(default=True)
    status = models.CharField(default='انتخاب غذا', max_length=80)
    order_status = models.CharField(default='', max_length=80)
    blocked = models.BooleanField(default=False)
    table_number = models.IntegerField(default=0)
    note = models.TextField(default="")

    def __str__(self):
        if self.name:
            return self.name
        return self.mac_address


class OnlineUsers(models.Model):

    user = models.OneToOneField(Users, on_delete=models.CASCADE)
    status = models.CharField(max_length=1, default='A')

    def __str__(self):
        return self.user.mac_address


class BlockedUsers(models.Model):
    user = models.OneToOneField(Users, on_delete=models.CASCADE)

    def __str__(self):
        return self.user.mac_address
