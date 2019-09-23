from django.shortcuts import render , redirect
#from .forms import AdminAuthenticationForm
from .queries import *
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
#from django.contrib import messages
from .fusioncharts import FusionCharts
import json

@login_required
def admin_panel(request):
    orders = orders_info()
    if len(orders) == 0:
        order_exist = ''
    else:
        order_exist = True
    online_users = get_online_users()
    users_info = list()
    if len(online_users) == 0:
        online_user_exist = ''
    else:
        online_user_exist = True
        for online_user in online_users:
            user = dict()
            user['user_name'] = online_user.mac_address
            user['user_id'] = online_user.id
            user["name"] = online_user.name
            print("name : {}".format(user["name"]))
            agent = str(online_user.agent)
            agent = agent.split("(")[1]
            agent = agent.split(")")[0]
            agent = agent.split(";")[1] + " , " + agent.split(";")[2]
            user['device_name'] = agent
            user["status"] = online_user.status
            users_info.append(user)
    return render(request=request , template_name='loggedIn_admin.html', context={'orders':orders,
                                                                                  'order_exist':order_exist,
                                                                                  'online_users_exist':online_user_exist,
                                                                                  'online_users':users_info})


@login_required
def all_foods(request):
    if request.method == 'POST':
        data = request.POST.dict()
        print(data)
        if 'delete.x' in data.keys() and 'delete.y' in data.keys():
            delete_one_item(data["food_id"])

    foods = get_all_foods()
    trash_foods = get_all_trash_foods()
    return render(request=request , template_name='show_foods.html' , context={'foods':foods, 'trash_foods':
                                                                               trash_foods})

@login_required
def add_item(request):
    if request.method == "POST":
        add_food(request=request)
        return redirect('all_foods')
    categorys = get_all_categories()
    context = {
        'categorys' : categorys ,
    }
    return render(request=request , template_name='add_item.html' , context=context)

@login_required
def edit_food(request , id):
    food, comments, pictures = select_one_item(id)
    num_comments = len(comments)
    if num_comments == 0:
        num_comments = ''
    categories = get_all_categories()
    if request.method == 'POST':
        edit(request , food)
        return redirect('all_foods')
    else:
        if food:
            return render(request=request, template_name='edit_food.html' , context={'food' : food , 'categories' : categories, 'comments':comments, 'num_comments':num_comments, 'pictures':pictures})
    return render(request=request , template_name='error.html')


@login_required
def delete_item_with_ajax(request):
    if request.method == 'GET':
        food_id = request.GET['food_id']
        success = food_move_to_trash(food_id)
        if success:
            return HttpResponse('True')
        else:
            return HttpResponse("False")
    else:
        return HttpResponse('False')

@login_required
def add_category(request):
    if request.method == 'POST':
        add_categories(request=request)
        return redirect('add_food')
    return render(request=request, template_name='add_category.html')

@login_required
def edit_category(request, name):
    if request.method == 'POST':
        update_category(request)
        return redirect('add_food')
    category = get_category_by_name(name[1:])
    if category:
        context = {
            'category' : category
        }
        return render(request=request, template_name='edit_category.html', context=context)
    else:
        return render(request=request, template_name='add_category.html')

@login_required
def get_online_users_info(request):
    online_users = get_online_users()
    print(online_users)
    if len(online_users) != 0:
        data = dict()
        for i in range(len(online_users)):
            user = dict()
            user['name'] = online_users[i].mac_address
            user['status'] = online_users[i].status
            data[str(i)] = user
#        print(data)
        return HttpResponse(json.dumps(data) , content_type="application/json")
    else:
        return HttpResponse("empty")

@login_required
def add_to_blocked_users(request):
    user_name = request.GET["user_name"]
    add_to_blocked_list(user_name)
    return HttpResponse("ok")

def check_blocked_user(request):
    user_id = request.GET['user_id']
    blocked = check_blocked(user_id)
    if blocked:
        return HttpResponse('blocked')
    return HttpResponse('ok')

def change_status(request):
    user_id = request.GET["user_id"]
    status = request.GET["status"]
    if status == "go_to_payment":
        table_number = request.GET["table_number"]
        try:
            table_number = int(table_number)
        except:
            return HttpResponse("bad_table_number")
        note = request.GET["note"]
        flag = update_user_status(user_id, status, table_number, note)
        if flag:
            return HttpResponse("ok")
        else:
            return HttpResponse("bad_table_number")

@login_required
def users_management(request):
    users = get_all_users()


   # blocked_users = get_blocked_users()
    #all_users = get_user_info(users)
    return render(request=request, template_name='user_management.html', context={'all_users':users})

@login_required
def unblock_users(request, user_id):
    unblock_user_by_id(user_id)
    return redirect('users_management')

@login_required
def block_users(request, user_id):
    block_user_by_id(user_id)
    return redirect('users_management')

@login_required
def delete_comment(request):
    comment_id = request.GET['comment_id']
    delete_comment_by_id(comment_id)
    return HttpResponse("True")

@login_required
def comments_management(request):
    confirmed_comments, unconfirmed_comments, trash_comments = get_all_comments()
    num_unconf_comments = len(unconfirmed_comments)
    num_conf_comments = len(confirmed_comments)
    num_trash_comments = len(trash_comments)
    return render(request=request, template_name='comments_management.html',
                  context={'conf_comments':confirmed_comments,
                           'unconf_comments':unconfirmed_comments,
                           'trash_comments':trash_comments,
                           'num_unconf':num_unconf_comments, 'num_conf':num_conf_comments,
                           'num_trash':num_trash_comments})

@login_required
def comment_move_to_trash(request):
    comment_id = request.GET['comment_id']
    comment_type = request.GET['type']
    move_to_trash_comment_by_id(comment_id, comment_type)
    return HttpResponse("True")

@login_required
def confirm_comment(request):
    comment_id = request.GET['comment_id']
    confirm_comment_by_id(comment_id)
    return HttpResponse("True")

@login_required
def recycle_comment(request):
    comment_id = request.GET['comment_id']
    recycle_comment_by_id(comment_id)
    return HttpResponse("True")

@login_required
def recycle_food(request):
    food_id = request.GET['food_id']
    recycle_food_by_id(food_id)
    return HttpResponse("True")

@login_required
def delete_item_forever(request):
    food_id = request.GET['food_id']
    delete_item_forever_by_id(food_id)
    return HttpResponse("True")

@login_required
def show_invoice(request, order_id):
    data, total_price = get_order_by_order_id(order_id)
    return render(request=request, template_name='show_invoice.html', context={'info':data, 'total_price':total_price})

@login_required
def get_orders_info(request):
    orders = orders_info()
    return HttpResponse(json.dumps(orders) , content_type="application/json")

@login_required
def confirm_order(request):
    order_id = request.GET['order_id']
    confirm_order_by_id(order_id)
    return HttpResponse("ok")

@login_required
def get_chart_data(request):
    data = get_chart_labels_and_data()
    return HttpResponse(json.dumps(data), content_type="application/json")

@login_required
def options(request):
    if request.method == 'POST':
        edit_options(request)
    ooptions = get_options()
    return render(request=request, template_name='options.html', context={'options' : ooptions})

@login_required
def delete_category(request, name):
    name = name[1:]
    category = get_category_by_name(name)
    if category is not None:
        category.delete()
    return redirect('add_food')

@login_required
def delete_picture(request):
    picture_id = request.GET["picture_id"]
    delete_picture_by_id(picture_id)
    return HttpResponse("Ok")

@login_required
def all_orders(request):
    orders = get_all_orders()
    if orders:
        order_exist = True
    else:
        order_exist = ''

    print("order exist : {}".format(order_exist))
    return render(request=request, template_name="all_orders.html", context={"orders" : orders, "order_exist":order_exist})
