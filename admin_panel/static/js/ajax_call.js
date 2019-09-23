var timer_1 = null;
var timer_2 = null;
function set_timer_1() {
    timer_1 = setInterval(function (){
    refresh_online_users();
    } , 4000)
}
//set_timer_1();

function set_timer_2() {
    timer_1 = setInterval(function (){
    refresh_orders();
    } , 6000)
}
//set_timer_2();

function hide_order_anim(order_id){
    var order = document.getElementById('order' + order_id);
    order.classList.add('delete-anim');
    window.setTimeout(function () {order.style.display = 'none'}, 600);
    return true;

}


function confirm_order(order_id) {
    method = "GET";
    data = {"order_id" : order_id};
    url = "/admin/confirm/order";
    $.ajax({
                   url : url ,
                   method : method ,
                   data : data ,
                   success: function (data) {
                       for(user in data){
                           console.log(data[user].name);
                       }
                       hide_order_anim(order_id);
                   } ,
                   error:function () {
                       alert("Ooooops");
                   }
               });

}

function show_orders(data) {
    $("div").remove(".order-item");

    for (d in data){
        var html_code = "<div id=\'order"+ data[d].order_id +"\' class=\"order-item\" style=\"direction: rtl\">\n" +
            "                    <div class=\"user name\">\n" +
            "                    <span class=\"user-name-text\">میز شماره</span>\n" +
            "                    <span class=\"user-name-text\" style=\"color: #0D47A1; font-weight: bold\">10</span>\n" +
            "                    <span class=\"user-name-text\" style=\"font-weight: bold;font-size: 24px \">،</span>\n" +
            "                    <span class=\"user-name-text total_price\">240000</span>\n" +
            "                    <span class=\"user-name-text\">تومان</span>\n" +
            "                    <span class=\"user-name-text\" style=\"font-weight: bold;font-size: 24px \">،</span>\n" +
            "                    <a class=\"decoration\" href=\"show/invoice/order_id= "+ data[d].order_id +" \"><span class=\"item-text\">مشاهده جزییات</span></a>\n" +
            "                    </div>\n" +
            "                    <div class=\"reject-icon\">\n" +
            "                        <input type=\"image\" class=\"fit-icon\" name=\"delete\" value=\"delete\" src=\"../static/img/delete.svg\">\n" +
            "                    </div>\n" +
            "                    <div class=\"user status\">\n" +
            "                        <span class=\"user-name-text user-status\">پرداخت شده</span>\n" +
            "                    </div>\n" +
            "                    <div onclick=\'confirm_order("+ data[d].order_id +")\' class=\"accept-icon\">\n" +
            "                        <input type=\"image\" class=\"fit-icon\" name=\"delete\" value=\"delete\" src=\"../static/img/unblock.png\">\n" +
            "                    </div>\n" +
            "                    </div>"
        $('#all-orders').append(html_code);
    }
    var total_price = document.getElementsByClassName('total_price');
    for (d1 in data){
        total_price[d1].innerHTML = data[d1].total_price;
    }
    /*
    var user_names = document.getElementsByClassName('user-name');
    var status = document.getElementsByClassName('user-status');
    var user_status = "انتخاب غذا";
    for(d1 in data){
        user_names[d1].innerHTML = data[d1].name;
        if(data[d1].status === "A") user_status = "انتخاب غذا";
        if(data[d1].status === "B") user_status = "عملیات پرداخت";
        if(data[d1].status === "C") user_status = "تکمیل سفارش";
        status[d1].innerHTML = user_status;
    }
    */

}

function refresh_orders() {
    method = "GET";
    data = {"test1" : "ok"};
    url = "/admin/get/orders/info";
    $.ajax({
                   url : url ,
                   method : method ,
                   data : data ,
                   success: function (data) {
                       for(user in data){
                          // console.log(data[user].name);
                       }
                       show_orders(data)
                   } ,
                   error:function () {
                       alert("Ooooops");
                   }
               });

}

function disappear_user(user_name) {
    var user = document.getElementById("user" + user_name);
    user.parentNode.removeChild(user);
}



function add_to_block_user(user_name) {
    var method = "GET";
    var data = {"user_name" : user_name};
    var url = "/admin/add/to/blocked/users";
    $.ajax({
                   url : url ,
                   method : method ,
                   data : data ,
                   success: function (data) {
                       if(data === "ok")
                       disappear_user(user_name);
                   } ,
                   error:function () {
                       alert("Ooooops");
                   }
               });

}

function show_online_users(data) {
    $("div").remove(".user-item");

    for (d in data){
        var html_code = "<div id=\'" + data[d].name + "\' class=\"user-item\">\n" +
        "                   <div class=\"user name\">\n" +
        "                       <img class=\"user-avatar\" src=\"../static/img/avatar1.png\">\n" +
        "                       <span class=\"user-name-text margin-right user-name\">حسین امینی</span>\n" +
        "                   </div>\n" +
        "                    <div class=\"user status\">\n" +
        "                        <span class=\"user-name-text user-status\">سفارش غذا</span>\n" +
        "                    </div>\n" +
        "                    <div class=\"user block-user\">\n" +
        "                        <!--<span class=\"user-name-text\">بلاک</span>-->\n" +
        "                        <input onclick='add_to_block_user(this.name)' type=\"image\" class=\"fit-icon\" name=\'" + data[d].name + "\' value=\"delete\" src=\"../static/img/delete.svg\">\n" +
        "                    </div>\n" +
        "                </div>";
        $('#all-online-users').append(html_code);
    }
    var user_names = document.getElementsByClassName('user-name');
    var status = document.getElementsByClassName('user-status');
    var user_status = "انتخاب غذا";
    for(d1 in data){
        user_names[d1].innerHTML = data[d1].name;
        if(data[d1].status === "A") user_status = "انتخاب غذا";
        if(data[d1].status === "B") user_status = "عملیات پرداخت";
        if(data[d1].status === "C") user_status = "تکمیل سفارش";
        status[d1].innerHTML = user_status;
    }

}


function refresh_online_users() {

    method = "GET";
    data = {"test" : "ok"};
    url = "/admin/get/online/user/info";
    $.ajax({
                   url : url ,
                   method : method ,
                   data : data ,
                   success: function (data) {
                       for(user in data){
                          // console.log(data[user].name);
                       }
                       show_online_users(data)
                   } ,
                   error:function () {
                       alert("Ooooops");
                   }
               });
}