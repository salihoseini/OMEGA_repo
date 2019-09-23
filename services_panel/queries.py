from omega_app.models import Order
import jdatetime
from OMEGA.calender import convert_day, conver_month
from django.utils import timezone


def get_order_by_order_id(order_id):
    '''
    orders = Orders.objects.filter(user=Users.objects.get(id=user_id))
    total_price = 0
    data = list()
    for order in orders:
        item = dict()
        item['food_name'] = order.food.name
        item['num_food'] = order.num_food
        item['price'] = order.food.price
        item['t_price'] = item['price']*item['num_food']
        total_price += item['t_price']
        data.append(item)

    '''
    '''
    order = Order.objects.filter(user=Users.objects.get(id=user_id)).first()
    total_price = 0
    data = list()
    for p in order.product.all():
        item = dict()
        item['food_name'] = p.food.name
        item['num_food'] = p.num_food
        item['price'] = p.food.price
        item['t_price'] = item['price'] * item['num_food']
        total_price += item['t_price']
        data.append(item)
    return data, total_price
    '''
    order = Order.objects.get(id=order_id)
    total_price = 0
    data = list()
    for p in order.product.all():
        item = dict()
        item['food_name'] = p.food.name
        item["destination"] = p.food.destination
        item['num_food'] = p.num_food
        item['price'] = p.food.price
        item['t_price'] = item['price'] * item['num_food']
        total_price += item['t_price']
        data.append(item)
    return data, total_price

def get_order_time(products):
    time = 0
    for product in products:
        if product.food.time_to_prepare > time:
            time = product.food.time_to_prepare
    return time


def get_services_orders():
    orders = Order.objects.filter(confirm_l1=True, confirm_services=False)
    data = list()

    if len(orders) > 0:
        for order in orders:
            order_info = dict()
            order_info['order_id'] = order.id
            order_info['user_id'] = order.user.id
            order_info['note'] = order.note
            order_info["table_number"] = order.table_number
            order_info['remaining_time'] = get_order_time(order.product.all())
            order_data, total_price = get_order_by_order_id(order.id)
            order_info["price"] = total_price
            order_info["foods"] = order_data
            gregorian_t = timezone.localtime(order.registration_time)
            j_time = jdatetime.datetime.fromgregorian(datetime=gregorian_t)
            day = j_time.day
            j_day = convert_day(j_time.strftime("%c")[:3])
            month = conver_month(j_time.strftime("%c")[4:7])
            year = j_time.year
            order_info["date"] = {'j_day': j_day, 'day': day, 'month': month, 'year': year}
            order_info["time"] = "{}:{}:{}".format(j_time.hour, j_time.minute, j_time.second)
            data.append(order_info)
        return data
    else:
        return False

def confirm_services_by_order_id(order_id):
    order = Order.objects.get(id=order_id)
    order.confirm_services = True
    order.save()
    return True