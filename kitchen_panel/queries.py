from omega_app.models import Order
from admin_panel.models import CompletedOrders
from OMEGA.calender import conver_month, convert_day
import jdatetime
from django.utils import timezone
from django.utils.timezone import activate

def orders_info():
    '''
    orders = Orders.objects.all()
    user_ids = list()
    prices = list()
    for order in orders:
        if order.user.id not in user_ids:
            user_ids.append(order.user.id)
            prices.append(order.food.price*order.num_food)
            continue
        else:
            index = user_ids.index(order.user.id)
            prices[index] += order.food.price*order.num_food
    data = list()
    for index in range(len(user_ids)):
        item = dict()
        item['user_id'] = user_ids[index]
        item['total_price'] = prices[index]
        data.append(item)
    '''
    data = list()
    orders = Order.objects.filter(confirm_l1=True)
    for o in orders:
        item = dict()
        item['order_id'] = o.id
        item['user_id'] = o.user.id
        total_price = 0
        for p in o.product.all():
            total_price += (p.food.price * p.num_food)
        item['total_price'] = total_price
        data.append(item)
    return data


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

def complete_order_by_id(order_id):
    order = Order.objects.get(id=order_id)
    completed_order = CompletedOrders(user=order.user)
    completed_order.save()
    for product in order.product.all():
        completed_order.products.add(product)
    order.delete()
    return True

def get_kitchen_orders():
    orders = Order.objects.filter(customer_confirm=True, confirm_l2=False)
    return orders

def get_order_time(products):
    time = 0
    for product in products:
        if product.food.time_to_prepare > time:
            time = product.food.time_to_prepare
    return time

def get_preparing_orders():
    orders = Order.objects.filter(order_status="در حال آماده سازی...")
    data = list()

    if len(orders) > 0:
        for order in orders:
            order_info = dict()
            order_info['order_id'] = order.id
            order_info['user_id'] = order.user.id
            order_info['note'] = order.note
            order_info["table_number"] = order.table_number
            order_info['remaining_time'] = get_order_time(order.product.all())
            order_data , total_price = get_order_by_order_id(order.id)
            order_info["price"] = total_price
            order_info["foods"] = order_data
            gregorian_t = timezone.localtime(order.registration_time)
            j_time = jdatetime.datetime.fromgregorian(datetime=gregorian_t)
            day = j_time.day
            j_day = convert_day(j_time.strftime("%c")[:3])
            month = conver_month(j_time.strftime("%c")[4:7])
            year = j_time.year
            order_info["date"] = {'j_day' : j_day, 'day' : day, 'month' : month, 'year' : year}
            order_info["time"] = "{}:{}:{}".format(j_time.hour, j_time.minute, j_time.second)
            data.append(order_info)
        return data
    else:
        return False

