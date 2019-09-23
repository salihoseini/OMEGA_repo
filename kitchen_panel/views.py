from django.shortcuts import render
from .queries import *
from django.http import HttpResponse
import json
# Create your views here.

def kitchen_panel(request):
    orders = get_kitchen_orders()
    order_exist = ''
    num_orders = len(orders)
    preparing_orders = get_preparing_orders()
    preparing_order = ''
    if not preparing_orders:
        num_preparing_orders = 0
    else:
        if len(preparing_orders) != 0:
            flag = False
            for o in preparing_orders:
                for foods in o["foods"]:
                    if foods["destination"]:
                        preparing_order = True
                        flag = True
                        break
                if flag:
                    break
        if preparing_order:
            num_preparing_orders = len(preparing_orders)
        else:
            num_preparing_orders = 0
    return render(request=request, template_name='kitchen_panel.html', context={'orders':orders, 'order_exist':order_exist,
                                                                                'preparing_order':preparing_order,
                                                                                'preparing_orders':preparing_orders,
                                                                                'num_orders':num_orders,
                                                                                'num_preparing_orders':num_preparing_orders})


def get_orders_info(request):
    orders = orders_info()
    return HttpResponse(json.dumps(orders) , content_type="application/json")

def show_invoice(request, order_id):
    data, total_price = get_order_by_order_id(order_id)
    return render(request=request, template_name='kitchen_show_invoice.html', context={'info':data, 'total_price':total_price})

def complete_order(request):
    order_id = request.GET['order_id']
    complete_order_by_id(order_id)
    return HttpResponse("Ok")

