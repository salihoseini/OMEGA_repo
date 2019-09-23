from django.urls import path
from . import views

urlpatterns = [
    path('', views.home , name='Omega-project-home'),
    path('phase2/', views.phase2 , name='phase2'),
    path('about/', views.about , name='about-page'),
    path('just/test/' , views.test , name='test') ,
    path('add/to/cart/' , views.add_to_cart , name='add_to_cart') ,
    path('clc/total/price/' , views.clc_order_price , name='clc_total_price') ,
    path('get/cart/info/' , views.get_cart_info , name='get_cart_info') ,
    path('you/were/blocked/' , views.blocked , name='blocked') ,
    path('payment/' , views.payment , name='payment') ,
    path('save/orders/' , views.save_orders , name='save_orders') ,
    path('complete/order/' , views.complete_order , name='complete_order') ,
    path('send/comment/' , views.send_comment , name='send_comment') ,
    path('last/orders/user_id=<user_id>' , views.last_orders , name='last_orders') ,
    path('after/order/user_id=<user_id>/order_id=<order_id>/' , views.after_order , name='after_order') ,
]