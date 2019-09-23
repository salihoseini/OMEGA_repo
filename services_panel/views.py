from django.shortcuts import render
from django.http import HttpResponse
import json
from .queries import *

def services(request):
    orders = get_services_orders()
    order_exist = ""
    service_orders = list()
    num_orders = 0
    if orders:
        for o in orders:
            for food in o["foods"]:
                if food["destination"] == "":
                    order_exist = True
                    if o not in service_orders:
                        service_orders.append(o)
        num_orders = len(service_orders)
    print("order_exist : {}".format(order_exist))
    return render(request=request, template_name="services.html", context={'orders':service_orders, 'order_exist':order_exist,'num_orders':num_orders})


def confirm_services(request):
    order_id = request.GET["order_id"]
    confirm_services_by_order_id(order_id)
    return HttpResponse("Ok")