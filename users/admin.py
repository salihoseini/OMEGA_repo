from django.contrib import admin
from .models import AdminUser, Users, OnlineUsers, BlockedUsers

admin.site.register(AdminUser)
admin.site.register(Users)
admin.site.register(OnlineUsers)
admin.site.register(BlockedUsers)

