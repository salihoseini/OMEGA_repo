from channels.routing import ProtocolTypeRouter, URLRouter
from django.conf.urls import url
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator, OriginValidator
from admin_panel.consumers import UserStatus, GetOrders, ShoppingCart, Like

application = ProtocolTypeRouter({
    # Empty for now (http->django views is added by default)
    'websocket':AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            URLRouter(
                [
                  #  url(r"^admin/get/online/users/(?P<userId>[\w.@+-]+)/$", UserStatus),
                    url("admin/get/online/users/", UserStatus),
                    url("admin/get/orders/", GetOrders),
                    url("admin/shopping/cart/", ShoppingCart),
                    url("admin/save/like/", Like),
                ]
            )
        )
    )
})