from users.models import AdminUser, OnlineUsers, Users, BlockedUsers
from omega_app.models import Food, Category, shoppingCart, SoldProducts, Comment, like, Orders, Order, FoodMedia
from .forms import AdminAuthenticationForm
import jdatetime
from .models import Options
from OMEGA.calender import conver_month, convert_day
from django.utils import timezone


#from .models import Orders
#from django.utils import timezone

def authenticate(request):
    form = AdminAuthenticationForm(request)
    if form.is_valid():
        data = form.cleaned_data
       # data = request.POST.copy()
        user = AdminUser.objects.filter(username=data['username']).first()
        if user is not None and data['password'] == user.password :
            data['user_id'] = user.id
            return data
        else:
            return None
    return None

def get_all_foods():
    foods = Food.objects.filter(trash=False)
    pictures = FoodMedia.objects.filter(trash=False)
    all_foods = list()
    for food in foods:
        info = dict()
        info["food"] = food
        info["picture"] = pictures.filter(food_id=food.id).first()
        all_foods.append(info)
    return all_foods

def get_all_trash_foods():
    foods = Food.objects.filter(trash=True)
    pictures = FoodMedia.objects.filter(trash=False)
    all_foods = list()
    for food in foods:
        info = dict()
        info["food"] = food
        info["picture"] = pictures.filter(food_id=food.id).first()
        all_foods.append(info)
    return all_foods

def delete_one_item(food_id):
    food = Food.objects.get(id=food_id)
    if food:
        food.delete()
        return True
    return False

def food_move_to_trash(food_id):
    food = Food.objects.get(id=food_id)
    food.trash = True
    food.save()
    comments = Comment.objects.filter(food=food)
    likes = like.objects.filter(food=food)
    inCart = shoppingCart.objects.filter(food=food)
    for comment in comments:
        comment.trash = True
        comment.save()
    for l in likes:
        l.trash = True
        l.save()
    for product in inCart:
        product.trash = True
        product.save()
    return True


def get_all_categories():
    return Category.objects.all()

def add_food(request):
    data = request.POST.dict()
    category = Category.objects.get(name=data["category"])
    ''''
    valid_formats = ["jpeg", "jpg", "png", "gif"]
    file_name = str(request.FILES["file"])
    file_format = file_name.split(".")[-1].lower()
    if file_format not in valid_formats:
        return False
    '''
    destination = "True"
    if len(data["destination"]) > 13:
        destination = ""
    if category is not None:
        food = Food(name=data["food_name"], category=Category.objects.get(name=data["category"]), price=data["food_price"],
                    description=data["description"], destination=destination)
        food.save()
        for file_name in request.FILES.keys():
            picture = FoodMedia(picture=request.FILES[file_name], food_id=food.id)
            picture.save()
        return True
    return False

def edit(request , food):
    data = request.POST.dict()
    food.name, food.category, food.price, food.description, food.time_to_prepare = data["food_name"], Category.objects.get(name=data["category"]) , data["food_price"], data[
        "description"], data["time_to_prepare"]
    pictures = FoodMedia.objects.filter(food_id=food.id)
    print("data keys : {}".format(data.keys()))
    print("files : {}".format(request.FILES.keys()))
    files_name = list()
    for pic in pictures:
        files_name.append("file" + str(pic.id))
    for i in range(len(files_name)):
        if files_name[i] not in data.keys():
            valid_formats = ["jpeg", "jpg", "png", "gif"]
            picture_name = str(request.FILES[files_name[i]])
            file_format = picture_name.split(".")[-1].lower()
            if file_format not in valid_formats:
                return False
            pictures[i].picture = request.FILES[files_name[i]]
            pictures[i].save()
    food.save()
    for new_file in request.FILES.keys():
        if "add-file" in new_file:
            picture = FoodMedia(food_id=food.id, picture=request.FILES[new_file])
            picture.save()

    return True

def select_one_item(id):
    food = Food.objects.get(id=id)
    comments = Comment.objects.filter(food=food, trash=False)
    pictures = FoodMedia.objects.filter(food_id=food.id, trash=False)
    comments_list = list()
    for comment in comments:
        date_time = comment.date_addded
        date = str(jdatetime.date.fromgregorian(date=date_time.date())).replace('-', '/')
        comment_info = {'id' : comment.id, 'author':comment.author, 'content':comment.content, 'date':date, 'time':comment.date_addded.time()}
        comments_list.append(comment_info)
    return food, comments_list, pictures

def add_categories(request):
    data = request.POST.dict()
    valid_formats = ["jpeg", "jpg", "png", "gif"]
    file_name = str(request.FILES["file"])
    file_format = file_name.split(".")[-1].lower()
    if file_format not in valid_formats:
        return False
    category = Category(name=data['cat_name'], picture=request.FILES['file'])
    category.save()
    return True

def get_category_by_name(name):
    return Category.objects.get(name=name)

def update_category(request):
    data = request.POST.dict()
    category =  Category.objects.get(id=data['cat_id'])
    category.name = data['cat_name']
    if 'file' not in data.keys():
        category.picture = request.FILES['file']
    category.save()
    return True

def get_online_users():
    return Users.objects.filter(online=True, blocked=False, trash=False).order_by("-id")

def get_all_users():
    users = Users.objects.filter(trash=False).order_by("-id")
    all_users = list()
    for user in users:
        user_info = dict()
        agent = str(user.agent)
        try:
            agent = agent.split("(")[1]
            agent = agent.split(")")[0]
            agent = agent.split(";")[1] + " , " + agent.split(";")[2]
        except:
            agent = agent
        user_info["user"] = user
        user_info["agent"] = agent
        all_users.append(user_info)
    return all_users

def get_blocked_users():
    return Users.objects.filter(blocked=True, trash=False).order_by("-id")

def add_to_blocked_list(user_name):
    user = Users.objects.get(mac_address=user_name)
    user.blocked = True
    user.online = False
    user.save()
    return

def check_blocked(user_id):
    user = Users.objects.get(id=user_id)
    return user.blocked

def update_user_status(user_id, status, table_number, note):
    user = Users.objects.get(id=user_id)
    if status == "go_to_payment":
        user.status = "عملیات پرداخت"
        if 0 < table_number < 25:
            user.table_number = table_number
        else:
            return False
        user.note = note
        user.save()
    return True

def get_user_info(users):
    all_users = list()
    online_users = OnlineUsers.objects.all()
    blocked_users = BlockedUsers.objects.all()
    for user in users:
        each_user = dict()
        each_user['user'] = user
        each_user['online'] = ''
        each_user['blocked'] = ''
        for online_user in online_users:
            if user == online_user.user:
                each_user['online'] = 'True'
        for blocked_user in blocked_users:
            if user == blocked_user.user:
                each_user['blocked'] = 'True'
        all_users.append(each_user)
    return all_users

def unblock_user_by_id(user_id):
    user = Users.objects.get(id=user_id)
    user.blocked = False
    user.save()
    return True

def block_user_by_id(user_id):
    user = Users.objects.get(id=user_id)
    user.blocked = True
    user.save()
    return True

def get_food_from_shopping_cart(user):
    return shoppingCart.objects.filter(user=user, trash=False)


def add_to_order(user_id):
    user = Users.objects.get(id=user_id)
    shopping_cart_for_user= get_food_from_shopping_cart(user)
    for item in shopping_cart_for_user:
        sold_product = SoldProducts(user=item.user, food=item.food, num_food=item.num_food)
        sold_product.save()
        item.delete()
    return


def get_all_comments():
    unconfirmed_comments = Comment.objects.filter(trash=False , confirm=False).order_by("-id")
    confirmed_comments = Comment.objects.filter(trash=False, confirm=True).order_by("-id")
    trash_comments = Comment.objects.filter(trash=True).order_by("-id")
    unconf_list, conf_list, trash_list = list(), list(), list()
    for comment in unconfirmed_comments:
        date_time = comment.date_addded
        date = str(jdatetime.date.fromgregorian(date=date_time.date())).replace('-', '/')
        comment_info = {'id' : comment.id, 'author':comment.author, 'content':comment.content, 'date':date, 'time':comment.date_addded.time(), 'food':comment.food.name}
        unconf_list.append(comment_info)
    for comment in confirmed_comments:
        date_time = comment.date_addded
        date = str(jdatetime.date.fromgregorian(date=date_time.date())).replace('-', '/')
        comment_info = {'id' : comment.id, 'author':comment.author, 'content':comment.content, 'date':date, 'time':comment.date_addded.time(), 'food':comment.food.name}
        conf_list.append(comment_info)
    for comment in trash_comments:
        date_time = comment.date_addded
        date = str(jdatetime.date.fromgregorian(date=date_time.date())).replace('-', '/')
        comment_info = {'id' : comment.id, 'author':comment.author, 'content':comment.content, 'date':date, 'time':comment.date_addded.time(), 'food':comment.food.name}
        trash_list.append(comment_info)

    return conf_list, unconf_list, trash_list


def move_to_trash_comment_by_id(comment_id, comment_type):
    comment = Comment.objects.get(id=comment_id)
    comment.trash = True
    comment.save()
    return True

def confirm_comment_by_id(comment_id):
    comment = Comment.objects.get(id=comment_id)
    comment.confirm = True
    comment.save()
    return True

def recycle_comment_by_id(comment_id):
    comment = Comment.objects.get(id=comment_id)
    comment.trash = False
    comment.save()
    return True

def recycle_food_by_id(food_id):
    food = Food.objects.get(id=food_id)
    comments = Comment.objects.filter(food=food, trash=True)
    likes = like.objects.filter(food=food, trash=True)
    inCart = shoppingCart.objects.filter(food=food, trash=True)
    for comment in comments:
        comment.trash = False
        comment.save()
    for l in likes:
        l.trash = False
        l.save()
    for product in inCart:
        product.trash = False
        product.save()
    food.trash = False
    food.save()
    return True

def delete_item_forever_by_id(food_id):
    food = Food.objects.get(id=food_id)
    food.delete()
    return True

def delete_comment_by_id(comment_id):
    comment = Comment.objects.get(id=comment_id, trash=True)
    comment.delete()
    return True

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
    orders = Order.objects.all()
    for o in orders:
        item = dict()
        item['order_id'] = o.id
        item['user_id'] = o.user.id
        item["table_number"] = o.table_number
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
        item['num_food'] = p.num_food
        item['price'] = p.food.price
        item['t_price'] = item['price'] * item['num_food']
        total_price += item['t_price']
        data.append(item)
    return data, total_price

def confirm_order_by_id(order_id):
    order = Order.objects.get(id=order_id)
    order.confirm_l1 = True
    order.save()
    return True

def get_chart_labels_and_data():
    foods = Food.objects.all()
    today = jdatetime.date.today().strftime("%d")
    print(today)
    now = jdatetime.datetime.now().strftime("%H:%M:%S")
    print(now)
    foods_name = list()
    price = list()
    for food in foods:
        foods_name.append(food.name)
        price.append(food.price)
    data = {'labels': foods_name, 'values':price}
    return data

def get_options():
    return Options.objects.first()

def edit_options(request):
    data = request.POST.dict()
    option = Options.objects.first()
    option.rest_name = data['rest_name']
    option.rest_banner = data['rest_banner']
    if 'bg_img' not in data.keys():
        option.bg_picture = request.FILES['bg_img']
    option.save()
    return True

def delete_picture_by_id(picture_id):
    picture = FoodMedia.objects.get(id=picture_id)
    picture.delete()
    return True

def get_order_time(products):
    time = 0
    for product in products:
        if product.food.time_to_prepare > time:
            time = product.food.time_to_prepare
    return time


def get_all_orders():
    orders = Order.objects.all()
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