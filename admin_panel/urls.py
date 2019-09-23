from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    path('login/', auth_views.LoginView.as_view(template_name='admin_authentication.html') , name='admin-login'),
    path('logout/' , auth_views.LogoutView.as_view(template_name='admin_authentication.html') , name='admin-logout') ,
    path('' , views.admin_panel , name='admin-panel'),
    path('food_management/' , views.all_foods , name='all_foods' ),
    path('users_management/' , views.users_management , name='users_management' ),
    path('comments_management/' , views.comments_management , name='comments_management' ),
    path('food_management/add_food/' , views.add_item , name='add_food'),
    path('food_management/add_category/', views.add_category, name='add_category'),
    path('food_management/edit_category/cat_name=<name>', views.edit_category, name='edit_category'),
    path('food_management/delete_category/cat_name=<name>', views.delete_category, name='delete_category_forever'),
    path('food_management/edit/food=<id>/' , views.edit_food , name='edit_food'),
    path('delete/one/item/' , views.delete_item_with_ajax , name='delete_item'),
    path('get/online/user/info/' , views.get_online_users_info , name='online_user_info'),
    path('add/to/blocked/users/' , views.add_to_blocked_users , name='add_to_blocked_users'),
    path('unblock/users/user_id=<user_id>/' , views.unblock_users , name='unblock_users'),
    path('block/users/user_id=<user_id>/' , views.block_users , name='block_users'),
    path('check/blocked/user/' , views.check_blocked_user , name='check_blocked_user'),
    path('change/user/status/' , views.change_status , name='change_user_status'),
    path('delete/one/comment/' , views.delete_comment , name='delete_comment'),
    path('comment/move/to/trash/' , views.comment_move_to_trash , name='comment_move_to_trash'),
    path('confirm/comment/' , views.confirm_comment , name='confirm_comment'),
    path('recycle/comment/' , views.recycle_comment , name='recycle_comment'),
    path('recycle/food/' , views.recycle_food , name='recycle_food'),
    path('delete/item/forever/' , views.delete_item_forever , name='delete_item_forever'),
    path('show/invoice/order_id=<order_id>' , views.show_invoice , name='show_invoice'),
    path('get/orders/info/' , views.get_orders_info , name='get_orders_info'),
    path('confirm/order/' , views.confirm_order , name='confirm_order'),
    path('get/chart/data/' , views.get_chart_data , name='get_chart_data'),
    path('options/' , views.options , name='options'),
    path('delete/picture/' , views.delete_picture , name='delete_picture'),
    path('all-orders/' , views.all_orders , name='all_orders'),


]