from django.shortcuts import render , redirect
from .queries import *
from django.http import HttpResponse
import json
import pytz


def home(request):

    user_id, order_status = maybe_register_user(request=request)
    if order_status == "در حال آماده سازی...":
        order_status = ""
    blocked = check_blocked(user_id)
    options = get_options()
    if blocked:
        return render(request=request, template_name='blocked.html')
    update_online_users(user_id=user_id)
    foods = all_foods(user_id)
    categories = all_categories()
    likes = all_likes(user_id)
    cart_total = clc_total_price(user_id)
    cart_info = get_cart_info_for_user(user_id)

    #print (foods)
    #print(likes)
    return render(request=request , template_name='home.html' , context={'posts' : foods , 'categories' : categories , 'user' : user_id , 'order_status':order_status, 'likes' : likes, 'cart_total':cart_total,
                                                                         'options':options, 'cart_info':cart_info})

def about(request):
    return render(request=request , template_name='about.html')


def admin_authentication(request):
    return
def test(request):
    if request.method == 'GET':
        user_id , post_id = request.GET["user"] , request.GET["food_id"]
        if save_like(user_id , post_id):
            return HttpResponse("True")
        else:
            return HttpResponse("False")
    return redirect('home')

def add_to_cart(request):
    if request.method == 'GET':
        user_id , food_id , num , op = request.GET["user"] , request.GET["food_id"] , request.GET["num"] , request.GET["op"]
        data = dict()
        if op == "add":
            data['num'] = save_to_cart(user_id, food_id, num)
            return HttpResponse(json.dumps(data) , content_type="application/json")
        elif op == "sub":
            data['num'] = sub_from_cart(user_id, food_id)
            return HttpResponse(json.dumps(data), content_type="application/json")
    return

def get_cart_info(request):
    if request.method == "GET":
        user_id = request.GET["user"]
        cart_info = get_cart_info_for_user(user_id)
        if len(cart_info) == 0:
            return HttpResponse('empty')
        data = dict()
        for i in range(len(cart_info)):
            item = dict()
            item['name'] = cart_info[i].food.name
            item['food_id'] = cart_info[i].food.id
            item['number'] = cart_info[i].num_food
            item['price'] = cart_info[i].food.price
            data[str(i)] = item
        print(data)
        return HttpResponse(json.dumps(data) , content_type="application/json")

def blocked(request):
    return render(request=request, template_name='blocked.html')

def payment(request):
    user_id, _ = maybe_register_user(request=request)
    context = {'user' : user_id}
    return render(request=request, template_name='payment.html', context=context)

def phase2(request):
    return render(request=request, template_name='phase2.html')

def save_orders(request):
    user_id = request.GET['user_id']
    save_orders_by_user_id(user_id)
    return HttpResponse("True")

def clc_order_price(request):
    user_id = request.GET['user_id']
    price = clc_total_price(user_id)
    data = {'price' : price}
    return HttpResponse(json.dumps(data) , content_type="application/json")

def after_order(request, user_id, order_id):
    order = get_order_by_id(order_id)
    if order.order_status != "سفارش شما آماده است.":
        now = timezone.datetime.now()
        tz = pytz.timezone("Asia/Tehran")
        now = tz.localize(now)
        confirm_time = timezone.localtime(order.confirm_time)
        left_seconds = (now - confirm_time).seconds
        order_time_sec = order.preparing_time * 60
        order_remaining_time = order_time_sec - left_seconds
        ready = False
        if order_remaining_time <= 0:
            order_remaining_time = 'not_set'
            ready = True
            if order.order_status == "در حال آماده سازی...":
                order.order_status = "سفارش شما آماده است."
                order.save()
    else:
        ready = True
        order_remaining_time = 'not_set'

    return render(request=request, template_name="prepare_order.html", context={'user':user_id, 'order':order.product.all(),
                                                                                'order_status':order.order_status,
                                                                                'order_id':order_id,
                                                                                "remaining_time" : order_remaining_time,
                                                                                "ready" : ready})

def complete_order(request):
    data = request.GET.dict()
    order_id = data["order_id"]
    complete_order_process(order_id)
    return HttpResponse("ok")

def send_comment(request):
    data = request.GET.dict()
    save_comment(data)
    return HttpResponse("Ok")

def last_orders(request, user_id):
    orders = get_orders_for_user(user_id)
    preparing_order = True
    if not orders:
        preparing_order = ""
    return render(request=request, template_name="last_orders.html", context={'preparing_order':preparing_order, 'user':user_id,
                                                                                'preparing_orders':orders})