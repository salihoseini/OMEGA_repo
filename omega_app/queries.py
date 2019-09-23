from .models import Food, Category, like, Comment, shoppingCart, Orders, Order, Product, FoodMedia
from users.models import Users, OnlineUsers, BlockedUsers
import getmac
import jdatetime
from django.utils import timezone
from admin_panel.models import Options
from OMEGA.calender import conver_month, convert_day


def delete_one_item(food_id):
    food = Food.objects.get(id=food_id)
    if food:
        food.delete()
        return True
    return False

def get_all_comments(foods):
    comments = Comment.objects.filter(trash=False, confirm=True)
    data = dict()
    for food in foods:
        data[food.id] = list()
    for comment in comments:
        date_time = comment.date_addded
        gregorian_t = timezone.localtime(date_time)
        j_time = jdatetime.datetime.fromgregorian(datetime=gregorian_t)
        date = str(jdatetime.date.fromgregorian(date=date_time.date())).replace('-', '/')
        comment_info = {'author':comment.author, 'content':comment.content, 'date':date, 'time':"{}:{}".format(j_time.hour, j_time.minute)}
        data[comment.food.id].append(comment_info)
    return data

def all_foods(user_id):
    foods = Food.objects.filter(trash=False)
    comments = get_all_comments(foods)
    likes_info = all_likes(user_id)
    num_foods_in_cart = get_num_foods(user_id)
    info = list()
    for food in foods:
        if food.id in likes_info.keys():
            liked = likes_info[food.id]
        else:
            liked = ''
        if food.id in num_foods_in_cart.keys():
            num_food = num_foods_in_cart[food.id]
        else:
            num_food = ''
        num_comments = len(comments[food.id])
        if num_comments == 0:
            num_comments = ''
        food_pictures = FoodMedia.objects.filter(food_id=food.id)
        food_picture = food_pictures[0]
        info.append({'food': food, 'food_pictures':food_pictures, 'liked': liked, 'num_likes': clc_num_likes(food),'num_food':num_food,
                     'comments':comments[food.id],  'num_comments':num_comments, 'food_picture':food_picture})
    return info

def clc_num_likes(food):
    likes = like.objects.filter(food=food , liked=True, trash=False)
    return len(likes)

def all_categories():
    return Category.objects.all()

def add_food(request):
    data = request.POST.dict()
    food = Food(name=data["food_name"], category=Category.objects.get(name=data["category"]), price=data["price"],
                description=data["description"], picture=request.FILES["file"])
    food.save()
    return

#--------------------------------------------------------------------------------
#user registration

def get_ip_address(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

def maybe_register_user(request):
    ip_address = get_ip_address(request=request)
    mac_address = getmac.get_mac_address(hostname=str(ip_address))
    agent = request.META['HTTP_USER_AGENT']
    check = Users.objects.filter(mac_address=mac_address).first()

    if check is None :
        user = Users(mac_address=mac_address , ip_address=ip_address , agent=agent)
        user.save()
    user = Users.objects.filter(mac_address=mac_address).first()
    user.last_seen = timezone.now()
    user.save()
    return user.id, user.order_status

def save_like(user_id , food_id):
    user = Users.objects.filter(id=int(user_id)).first()
    food = Food.objects.filter(id=int(food_id)).first()

    check = like.objects.filter(food=food , user=user).first()
    if check is None:
        like_record = like(food=food , user=user)
        like_record.save()
        return True
    if not check.liked :
        check.liked = True
        check.save()
        return True
    else:
        check.liked = False
        check.save()
        return False

def get_default_food():
    return Food.objects.first()


def get_num_foods(user_id):
    user = Users.objects.get(id=user_id)
    cart_info = shoppingCart.objects.filter(user=user, trash=False)
    results = dict()
    for record in cart_info:
        results[record.food.id] = record.num_food
    return results


def all_likes(user_id):
    likes = like.objects.filter(user=Users.objects.get(id=user_id), trash=False)
    likes_info = dict()
    for like_object in likes:
        if like_object.liked:
            likes_info[like_object.food.id] = like_object.liked
        else:
            likes_info[like_object.food.id] = ''
    return likes_info

def save_to_cart(user_id , food_id , number):
    user = Users.objects.get(id=user_id)
    food = Food.objects.get(id=food_id)
    #invoice = Order.objects.filter(user=user, customer_confirm=False).first()
    inCart = shoppingCart.objects.filter(user=user , food=food).first()
    if inCart is not None:
        inCart.num_food += 1
        inCart.save()
        return inCart.num_food
    else:
        record = shoppingCart(user=user , food=food , num_food=number)
        record.save()
        return record.num_food

def sub_from_cart(user_id , food_id):
    user = Users.objects.get(id=user_id)
    food = Food.objects.get(id=food_id)
    inCart = shoppingCart.objects.filter(user=user, food=food).first()
    if inCart is not None:
        if inCart.num_food == 0:
        # inCart.delete()
            return inCart.num_food
        else:
            inCart.num_food -= 1
            inCart.save()
            return inCart.num_food
    else:
        return 0

def get_cart_info_for_user(user_id):
    user = Users.objects.get(id=user_id)
    cart_info = shoppingCart.objects.filter(user=user, trash=False)
    for info in cart_info:
        if info.num_food == 0:
            info.delete()
    return shoppingCart.objects.filter(user=user, trash=False)

def clc_total_price(user_id):
    user = Users.objects.get(id=user_id)
    cart_info = shoppingCart.objects.filter(user=user, trash=False)
    total_price = 0
    for record in cart_info:
        if record.num_food == 0:
            record.delete()
        else:
            total_price += record.food.price*record.num_food
    return total_price

def update_online_users(user_id):
    user = Users.objects.get(id=user_id)
    user.online = True
    user.status = "انتخاب غذا"
    user.save()

def check_blocked(user_id):
    user = Users.objects.get(id=user_id)
    return user.blocked

def save_orders_by_user_id(user_id):
    user = Users.objects.get(id=user_id)
    inCart = shoppingCart.objects.filter(user=user, trash=False)
    order = Order(user=user, customer_confirm=True)
    order.save()
    for product in inCart:
        p = Product(food=product.food, num_food=product.num_food)
        p.save()
        order.product.add(p)
    for record in inCart:
        record.delete()
    return True

def get_options():
    return Options.objects.first()





def clc_time_for_order(order_id):
    order = Order.objects.get(id=order_id)
    time = 0
    for product in order.product.all():
        if product.food.time_to_prepare > time:
            time = product.food.time_to_prepare
    return time

def get_order_by_id(order_id):
    order = Order.objects.get(id=order_id)
    return order

def get_order_status(user_id):
    return Users.objects.get(id=user_id).order_status

def complete_order_process(order_id):
    order = Order.objects.get(id=order_id)
    print("before alternation :  {}".format(order.id))
    order.order_status = "سفارش شما آماده است."
    print("after alternation : {}".format(order.id))
    order.save()
    print("after update : {}".format(order.id))
    return True

def save_comment(data):
    print(data.keys())
    food_name, user_name, content, user_id = data["food_name"], data["user_name"], \
                                             data["content"], data["user_id"]
    user = Users.objects.get(id=user_id)
    user.name = user_name
    user.save()
    food = Food.objects.get(name=food_name)
    comment = Comment(user=user, food=food, content=content, author=user_name)
    comment.save()
    return True


def get_order_time(products):
    time = 0
    for product in products:
        if product.food.time_to_prepare > time:
            time = product.food.time_to_prepare
    return time

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
        item['num_food'] = p.num_food
        item['price'] = p.food.price
        item['t_price'] = item['price'] * item['num_food']
        total_price += item['t_price']
        data.append(item)
    return data, total_price

def get_orders_for_user(user_id):
    user = Users.objects.get(id=user_id)
    orders = Order.objects.filter(user=user).order_by("-id")
    data = list()

    if len(orders) > 0:
        for order in orders:
            order_info = dict()
            order_info['order_id'] = order.id
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