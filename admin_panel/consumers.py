import asyncio
import json
from channels.consumer import AsyncConsumer
from channels.db import database_sync_to_async
from users.models import Users
from omega_app.models import shoppingCart, Order, Product, Food, like
from django.utils import timezone
import jdatetime
from OMEGA.calender import conver_month, convert_day

class UserStatus(AsyncConsumer):
    online_users = list()
    channel_names = list()
    async def websocket_connect(self,  event):

        self.sending_page = 'admin'
        await self.channel_layer.group_add(
            self.sending_page,
            self.channel_name
        )

        print("connected", event)
        await self.send({
            'type': 'websocket.accept',
            "text": "hello world"
        })
       # user_id = self.scope['url_route']['kwargs']['userId']
       # username = await self.get_user_by_id(user_id)
        #await self.send({
        #    'type': 'websocket.send',
        #    'text': "hello world",
        #})

    async  def websocket_receive(self,  event):
        received_data = json.loads(event.get("text"))
        src = received_data.get("src")
        dst = received_data.get("destination")
        try:
            change_status = received_data.get("user_status")
        except:
            change_status = False
        if src == "menu" and dst == "admin":
            user_id = int(received_data.get("user_id"))
            self.online_users.append(user_id)
            self.channel_names.append(self.channel_name)
            user = await self.get_user_by_id(user_id, change_status)
            agent = str(user.agent)
            agent = agent.split("(")[1]
            agent = agent.split(")")[0]
            device_name = agent.split(";")[1] + " , " + agent.split(";")[2]
            user_data = {
                "username" : user.mac_address,
                "status" : user.status,
                "user_id": user.id,
                "device_name": device_name,
                "src": "menu",
                "destination": "admin",
                "name": user.name
            }
            #broadcast the message event
            await self.channel_layer.group_send(
                self.sending_page,
                {
                    "type": "user_id",
                    "text": json.dumps(user_data)
                }

            )

        else:
            user_name = received_data.get("user_name")
            response = await self.block_user(user_name)
            data = {
                "src":"admin",
                "destination":"admin",
                "response":response
            }
            await self.channel_layer.group_send(
                self.sending_page,
                {
                    "type": "user_id",
                    "text": json.dumps(data)
                }

            )

        print("receive", event)

    #send actual message
    async def websocket_disconnect(self,  event):
        index = self.channel_names.index(self.channel_name)
        user_id = self.online_users[index]
        self.online_users.remove(self.online_users[index])
        self.channel_names.remove(self.channel_names[index])
        if user_id not in self.online_users:
            user_name = await self.offline_user(user_id)
            data = {
                "src":"admin",
                "destination":"admin_offline_user",
                "user_id": user_id,
                "username":user_name
            }
            await self.channel_layer.group_send(
                self.sending_page,
                {
                    "type": "user_id",
                    "text": json.dumps(data)
                }

            )
        print("disconnected", event)

    async def user_id(self, event):
        await self.send({
            "type":  "websocket.send",
            "text": event["text"]
        })

    @database_sync_to_async
    def get_user_by_id(self, user_id, change_status):
        user = Users.objects.get(id=user_id)
        if not user.online:
            user.online = True
            if not change_status:
                user.save()
        if change_status:
            user.status = "انتخاب غذا"
            user.save()
        return user

    @database_sync_to_async
    def block_user(self, user_name):
        user = Users.objects.get(mac_address=user_name)
        user.blocked = True
        return True

    @database_sync_to_async
    def check_online_users(self, user_id):
        return Users.objects.get(id=user_id)

    @database_sync_to_async
    def offline_user(self, user_id):
        user = Users.objects.get(id=user_id)
        user.online = False
        user.save()
        return user.mac_address


class GetOrders(AsyncConsumer):
    async def websocket_connect(self,  event):
        await self.send({
            'type': 'websocket.accept',
            "text": "hello world"
        })
        self.sending_page = 'order_admin'
        await self.channel_layer.group_add(
            self.sending_page,
            self.channel_name
        )

        print("connected", event)

    async  def websocket_receive(self,  event):
        print("receive", event)
        received_data = json.loads(event.get("text"))
        src = received_data.get("src")
        if src == 'payment':
            user_id = int(received_data.get("user_id"))
            order, user = await self.save_records_to_orders(user_id)
            confirm_order, user_id, time, table_number = await self.kitchen_confirm_order(order.id)
            info, price, date_info, time_info, order_note = await self.get_order_info(order.id)


            if order:
                order_price = await self.clc_order_price(order)
                #print("user id is  : {}, order_price is : {}".format(user_id, order_price))
                order_data = {
                    "order_id": order.id,
                    "price": order_price,
                    "user_id": user_id,
                    "status": user.status,
                    "table_number":order.table_number,
                    "user_name": user.mac_address,
                    "src": "payment",
                    "destination": 'admin'
                }

                kitchen_data = {
                    "confirm": True,
                    "src": "payment",
                    "destination": "kitchen",
                    "order_id": order.id,
                    "table_number": table_number,
                    "order_info": info,
                    "order_price": price,
                    "order_remaining_time": time,
                    "order_j_day": date_info["j_day"],
                    "order_day": date_info["day"],
                    "order_month": date_info["month"],
                    "order_year": date_info["year"],
                    "order_registration_time": time_info,
                    "user_id": user_id,
                    "note": order_note
                }

                services_data = {
                    "confirm": True,
                    "order_exist":"l",
                    "src": "payment",
                    "destination": "services",
                    "order_id": str(order.id),
                    "table_number": table_number,
                    "order_info": info,
                    "order_price": price,
                    "order_remaining_time": time,
                    "order_j_day": date_info["j_day"],
                    "order_day": date_info["day"],
                    "order_month": date_info["month"],
                    "order_year": date_info["year"],
                    "order_registration_time": time_info,
                    "user_id": user_id,
                    "note": order_note
                }

            else:
                order_data = {
                    "order_id": "no_order",
                    "src": "payment",
                    "target": "admin"
                }
                kitchen_data = {
                "order_id": "no_order",
                "src": "payment",
                "target": "kitchen"
                }
                services_data = {
                "order_id": "no_order",
                "src": "payment",
                "target": "services"
                }

            # broadcast the message event
            await self.channel_layer.group_send(
                self.sending_page,
                {
                    "type": "order",
                    "text": json.dumps(order_data)
                }
            )

            await self.channel_layer.group_send(
                self.sending_page,
                {
                    "type": "order",
                    "text": json.dumps(kitchen_data)
                }
            )
            await self.channel_layer.group_send(
                self.sending_page,
                {
                    "type": "order",
                    "text": json.dumps(services_data)
                }
            )

        elif src == 'admin':
            dst = received_data.get("destination")
            if dst == "kitchen":
                order_id = int(received_data.get("order_id")[5:])
                confirm_order, order_info, user_id, order_note= await self.admin_confirm_order(order_id)
                if confirm_order:
                    #order_price = await self.clc_order_price(confirm_order)
                    data = {
                        "confirm": True,
                        "src": "admin",
                        "destination": "kitchen",
                        "order_info": order_info,
                        "note": order_note,
                        "order_id": order_id
                    }
                    order_data_for_user = {
                        "confirm": True,
                        "src": "admin",
                        "destination": "menu",
                        "order_id": order_id,
                        "user_id": str(user_id)
                    }
                    await self.channel_layer.group_send(
                        self.sending_page,
                        {
                            "type": "order",
                            "text": json.dumps(data)
                        }

                    )
                    await self.channel_layer.group_send(
                        self.sending_page,
                        {
                            "type": "order",
                            "text": json.dumps(order_data_for_user)
                        }

                    )
        elif src == 'kitchen':
            dst = received_data.get("dst")
            if dst == "menu" or dst == "kitchen":
                order_id = int(received_data.get("order_id")[5:])
                confirm_order, user_id, time, table_number = await self.kitchen_confirm_order(order_id)
                info, price, date_info, time_info, order_note = await self.get_order_info(order_id)
                if confirm_order:
                    data = {
                        "confirm": True,
                        "src": "kitchen",
                        "destination": "kitchen",
                        "order_id": order_id,
                        "table_number": table_number,
                        "order_info": info,
                        "order_price": price,
                        "order_remaining_time": time,
                        "order_j_day" : date_info["j_day"],
                        "order_day" : date_info["day"],
                        "order_month" : date_info["month"],
                        "order_year" : date_info["year"],
                        "order_registration_time" : time_info,
                        "user_id":user_id,
                        "note": order_note
                    }
                    order_data_for_user = {
                        "confirm": True,
                        "src": "kitchen",
                        "destination": "menu",
                        "order_id": order_id,
                        "user_id": str(user_id),
                        "time": time
                    }

                    await self.channel_layer.group_send(
                        self.sending_page,
                        {
                            "type": "order",
                            "text": json.dumps(data)
                        }

                    )
                    await self.channel_layer.group_send(
                        self.sending_page,
                        {
                            "type": "order",
                            "text": json.dumps(order_data_for_user)
                        }

                    )
            else:
                order_id = int(received_data.get("order_id"))
                user_id = int(received_data.get("user_id"))
                change_order_status = await self.complete_order(order_id)
                if change_order_status:
                    data = {
                        'src': 'kitchen',
                        'destination': 'complete_order',
                        'user_id': str(user_id),
                        'command': 'complete_order'
                    }
                    await self.channel_layer.group_send(
                        self.sending_page,
                        {
                            "type": "order",
                            "text": json.dumps(data)
                        }

                    )
            print("order_id is : {}".format(order_id))



    #send actual message
    async def websocket_disconnect(self,  event):
        print("disconnected", event)

    async def order(self, event):
        await self.send({
            "type":  "websocket.send",
            "text": event["text"]
        })

    @database_sync_to_async
    def complete_order(self, order_id):
        order = Order.objects.get(id=order_id)
        order.confirm_l2 = True
        order.order_status = "سفارش شما آماده است."
        order.save()
        return True

    @database_sync_to_async
    def save_records_to_orders(self, user_id):
        user = Users.objects.get(id=user_id)
        user.status = "تکمیل سفارش"
        inCart = shoppingCart.objects.filter(user=user, trash=False)
        if len(inCart) == 0:
            return False
        order = Order(user=user, customer_confirm=True, confirm_l1=True, order_status="در انتظار تایید مدیریت...",
                      note=user.note, confirm_services=False, table_number=user.table_number, registration_time=timezone.datetime.now())
        order.save()
        for product in inCart:
            if product.num_food > 0:
                p = Product(food=product.food, num_food=product.num_food)
                p.save()
                order.product.add(p)
        for record in inCart:
            record.delete()
        user.save()

        return order, user

    async def clc_order_price(self, order):
        price = 0
        for product in order.product.all():
            price += (product.food.price * product.num_food)
        print("price : {}".format(price))
        return price

    @database_sync_to_async
    def admin_confirm_order(self, order):
        #order = Order.objects.get(id=order_id)
        order.order_status = "در انتظار تایید آشپزخانه..."
        order.confirm_l1 = True
        order.save()
        data = list()
        for p in order.product.all():
            item = dict()
            item['food_name'] = p.food.name
            item['num_food'] = p.num_food
            item['destination'] = p.food.destination
            data.append(item)
        return order, data, order.user.id, order.note
    @database_sync_to_async
    def kitchen_confirm_order(self, order_id):
        order = Order.objects.get(id=order_id)
        time = 0
        for product in order.product.all():
            if product.food.time_to_prepare > time:
                time = product.food.time_to_prepare
        order.confirm_l2 = True
        order.preparing_time = time
        order.save()
        return True, order.user.id, time, order.table_number
    @database_sync_to_async
    def get_order_info_without_details(self, order_id):
        order = Order.objects.get(id=order_id)
        data = list()
        for p in order.product.all():
            item = dict()
            item['food_name'] = p.food.name
            item['num_food'] = p.num_food
            data.append(item)
        return data
    @database_sync_to_async
    def get_order_info(self, order_id):
        order = Order.objects.get(id=order_id)
        total_price = 0
        data = list()
        for p in order.product.all():
            item = dict()
            item['food_name'] = p.food.name
            item['num_food'] = p.num_food
            item["destination"] = p.food.destination
            item['price'] = p.food.price
            item['t_price'] = item['price'] * item['num_food']
            total_price += item['t_price']
            data.append(item)
        order.order_status = "در حال آماده سازی..."
        order.confirm_time = timezone.datetime.now()
        j_time = jdatetime.datetime.fromgregorian(datetime=timezone.localtime(order.registration_time))
        #j_time = order.registration_time
        day = j_time.day
        j_day = convert_day(j_time.strftime("%c")[:3])
        month = conver_month(j_time.strftime("%c")[4:7])
        year = j_time.year
        order_registration_date_info = {'j_day': j_day, 'day': day, 'month': month, 'year': year}
        order_registration_time_info = "{}:{}:{}".format(j_time.hour, j_time.minute, j_time.second)

        '''
        now = timezone.datetime.now()
        order.confirm_time = now
        j_time = jdatetime.datetime.fromgregorian(datetime=now)
        day = j_time.day
        j_day = convert_day(j_time.strftime("%c")[:3])
        month = conver_month(j_time.strftime("%c")[4:7])
        year = j_time.year
        order_registration_date_info = {'j_day': j_day, 'day': day, 'month': month, 'year': year}
        order_registration_time_info = "{}:{}:{}".format(j_time.hour, j_time.minute, j_time.second)
        '''
        order.save()
        return data, total_price, order_registration_date_info, order_registration_time_info, order.note



class ShoppingCart(AsyncConsumer):
    async def websocket_connect(self,  event):
        await self.send({
            'type': 'websocket.accept',
            "text": "hello world"
        })
        self.sending_page = 'shopping_cart_admin'
        await self.channel_layer.group_add(
            self.sending_page,
            self.channel_name
        )

        print("connected", event)

    async  def websocket_receive(self,  event):
        print("receive", event)
        received_data = json.loads(event.get("text"))
        src = received_data.get("src")
        if src == "menu":
            action_food_id = received_data.get("id")
            food_id = int(action_food_id[3:])
            operation = action_food_id[:3]
            user_id = received_data.get("user_id")
            user = Users.objects.get(id=user_id)
            num_food, op = await self.cart_alternation(user, food_id, operation)
            data = {
                "src": "menu",
                "destination": "menu",
                "user_id": user_id,
                "food_id": food_id,
                "num_food": num_food,
                "operation": op
            }
            await self.channel_layer.group_send(
                    self.sending_page,
                    {
                        "type": "shopping_cart",
                        "text": json.dumps(data)
                }

            )

    #send actual message
    async def websocket_disconnect(self,  event):
        print("disconnected", event)

    async def shopping_cart(self, event):
        await self.send({
            "type":  "websocket.send",
            "text": event["text"]
        })
    @database_sync_to_async
    def cart_alternation(self, user, food_id, operation):
        food = Food.objects.get(id=food_id)
        inCart = shoppingCart.objects.filter(user=user, food=food).first()
        if inCart is None:
            if operation == "add":
                record = shoppingCart(user=user, food=food, num_food=1)
                record.save()
                return record.num_food, "add"
            elif operation == "sub":
                return 0, 0
        else:
            if operation == "add":
                inCart.num_food += 1
                inCart.save()
                return inCart.num_food, "add"
            elif operation == "sub":
                if inCart.num_food > 0:
                    inCart.num_food -= 1
                    inCart.save()
                    return inCart.num_food, "sub"
                else:
                    return 0, 0


class Like(AsyncConsumer):
    async def websocket_connect(self,  event):
        await self.send({
            'type': 'websocket.accept',
            "text": "hello world"
        })
        self.sending_page = 'like'
        await self.channel_layer.group_add(
            self.sending_page,
            self.channel_name
        )

        print("connected", event)

    async  def websocket_receive(self,  event):
        print("receive", event)
        received_data = json.loads(event.get("text"))
        src = received_data.get("src")
        if src == "menu":
            user_id = int(received_data.get("user_id"))
            food_id = int(received_data.get("food_id"))
            action = received_data.get("event")
            print("user_id = {}, food_id = {}".format(user_id, food_id))
            liked = await self.save_like(user_id, food_id, action)
            data = {
            "src": "menu",
            "destination": "menu",
            "user_id": str(user_id),
            "food_id": food_id,
            "liked": liked,
            "event": action
            }
            await self.channel_layer.group_send(
                self.sending_page,
                {
                    "type": "like_type",
                    "text": json.dumps(data)
                }

            )


    #send actual message
    async def websocket_disconnect(self,  event):
        print("disconnected", event)

    async def like_type(self, event):
        await self.send({
            "type":  "websocket.send",
            "text": event["text"]
        })

    @database_sync_to_async
    def save_like(self, user_id, food_id, event):
        user = Users.objects.get(id=user_id)
        food = Food.objects.get(id=food_id)
        like_record = like.objects.filter(user=user, food=food).first()
        if like_record is None:
            like_record = like(user=user, food=food)
            like_record.save()
            return True
        else:
            if like_record.liked:
                if event == "dblclick":
                    return None
                else:
                    like_record.liked = False
                    like_record.save()
                    return False
            else:
                like_record.liked = True
                like_record.save()
                return True

