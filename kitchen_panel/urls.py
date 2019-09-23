from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    path('' , views.kitchen_panel , name='kitchen-panel'),
    path('get/orders/info/' , views.get_orders_info , name='get_orders_info'),
    path('show/invoice/order_id=<order_id>/' , views.show_invoice , name='kitchen_show_invoice'),
  #  path('complete/order/' , views.complete_order , name='complete_order'),


]