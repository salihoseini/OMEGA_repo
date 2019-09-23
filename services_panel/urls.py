from django.urls import path
from . import views

urlpatterns = [
    path('', views.services , name='services'),
    path('confirm/order/', views.confirm_services , name='confirm_services'),
]