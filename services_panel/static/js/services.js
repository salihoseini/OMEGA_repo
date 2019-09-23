var timer = null;
function set_timer() {
    timer = setInterval(function (){
    refresh_orders();
    } , 6000)
}
//set_timer();

function hide_order_anim(order_id){
    var order = document.getElementById('order' + order_id);
    order.classList.add('delete-anim');
    window.setTimeout(function () {order.style.display = 'none'}, 600);
    return true;

}
function hide_preparing_order(order_id){
    var order = document.getElementById("preparing-order" + order_id);
    order.classList.add('delete-anim');
    window.setTimeout(function () {order.style.display = 'none'}, 600);
    return true;
}


function complete_order(order_id) {
     method = "GET";
    data = {"order_id" : order_id};
    url = "/kitchen/complete/order";
    $.ajax({
                   url : url ,
                   method : method ,
                   data : data ,
                   success: function (data) {
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
            "                    <div onclick='complete_order("+ data[d].order_id +")' class=\"accept-icon\">\n" +
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
    data = {"test2" : "ok"};
    url = "/kitchen/get/orders/info";
    $.ajax({
                   url : url ,
                   method : method ,
                   data : data ,
                   success: function (data) {
                       for(user in data){
                           console.log(data[user].name);
                       }
                       show_orders(data)
                   } ,
                   error:function () {
                       alert("Ooooops");
                   }
               });

}

function show_order(order_id, order_info, order_note) {
    var html_code1 = "<div id=\'pos-order" + order_id + "\' class=\"order\">\n" +
        "                            <table  class=\"invoice-table table-header\">\n" +
        "                                <tr style=\"position: relative\">\n" +
        "                                    <th id=\'order" + order_id + "\'>تایید سفارش</th>\n" +
        "                                </tr>\n" +
        "                            </table>\n" +
        "                         <table class=\"invoice-table\">\n" +
        "                            <tr>\n" +
        "                                <th>نام غذا</th>\n" +
        "                                <th>تعداد</th>\n" +
        "                            </tr>";
    var html_code2 = '';
    for (var item in order_info) {
        if(order_info[item].destination === "") {
            html_code2 = html_code2 +
                "<tr>\n" +
                "<td>" + order_info[item].food_name + "</td>\n" +
                "<td>" + order_info[item].num_food + "</td>\n" +
                "</tr>";
        }
    }
    var html_code3 = " </table>\n" +
        "<table class=\"invoice-table\">\n" +
        "                                <tr>\n" +
        "                                <td>یادداشت مشتری</td>\n" +
        "                                    <td>" + order_note + "</td>\n" +
        "                                </tr>\n" +
        "                            </table>"+
        "                        </div>";
    $('#all-orders').append(html_code1 + html_code2 + html_code3);
}

function hide_order(order_id) {
    var order = document.getElementById('pos-order' + order_id);
    order.classList.add('delete-anim');
    window.setTimeout(function () {order.style.display = 'none'}, 600);
    return true;
}

function confirm_services(order_id) {
    var method = "GET";
    var data = {"order_id" : order_id};
    var url = "/services/confirm/order";
    $.ajax({
                   url : url ,
                   method : method ,
                   data : data ,
                   success: function (data) {
                       var num_orders = document.getElementById("orders-num").innerHTML;
                       document.getElementById("orders-num").innerHTML = parseInt(num_orders) - 1;
                       hide_order(order_id);
                   } ,
                   error:function () {
                       alert("Ooooops");
                   }
               });
    
}

function show_order_in_details(order_info, order_id, order_time, order_price, j_day, day, month, year, time, table_number, user_id, order_note) {
    var pos_order = document.getElementById("show-order-details");
    var order_exist = false;

    for (var item2 in order_info) {
        if(!order_info[item2].destination) {
            order_exist = true;
            break;
        }
    }
    if(order_exist) {
        var table_header = "<div id=\'pos-order" + order_id + "\' class=\'order\'>\n" +
            "<span style=\'display: none\' id=\'user-id" + order_id + "\'>" + user_id + "</span> " +
            "<table class=\"invoice-table table-header\" style=\"background-color: #21ba45; color: white\">\n" +
            "                                <tr onclick=\'confirm_services(" + order_id + ")\' style=\"position: relative\">\n" +
            "                                  <th>تایید سفارش</th>\n" +
            "                                </tr>\n" +
            "                            </table>";
        var table_content =
            "<table class=\'invoice-table\'>\n" +
            "<tr>\n" +
            "<th>شماره فاکتور</th>\n" +
            "<th>شماره میز</th>\n" +
            "<th>تاریخ ثبت سفارش</th>\n" +
            "</tr>\n" +
            "<tr>\n" +
            "<td>" + order_id + "</td>\n" +
            "<td>" + table_number + "</td>\n" +
            "<td>\n" +
            "<span>" + j_day + "</span>\n" +
            "<span>،</span>\n" +
            "<span>" + day + "</span>\n" +
            "<span>" + month + "</span>\n" +
            "<span>" + year + "</span><br />\n" +
            "<span>ساعت </span>\n" +
            "<span>" + time + "</span>\n" +
            "</td>\n" +
            "</tr>\n" +
            "</table>\n" +


            "<table class=\'invoice-table\'>\n" +
            "<tr>\n" +
            "<th>نام غذا</th>\n" +
            "<th>تعداد</th>\n" +
            "</tr>\n";
        var table_footer = "</table>\n" +
            "<table class=\"invoice-table\">\n" +
            "                                <tr>\n" +
            "                                <td>یادداشت مشتری</td>\n" +
            "                                    <td>" + order_note + "</td>\n" +
            "                                </tr>\n" +
            "                            </table>" +
            "</div>";
        var html_code = '';
        for (var item in order_info) {
            if (!order_info[item].destination) {
                html_code = html_code +
                    "<tr>\n" +
                    "<td>" + order_info[item].food_name + "</td>\n" +
                    "<td>" + order_info[item].num_food + "</td>\n" +
                    "</tr>";
            }
        }
        $("#show-order-details").append(table_header + table_content + html_code + table_footer);
        var num_preparing_orders = document.getElementById("orders-num");
        document.getElementById("orders-num").innerHTML = parseInt(num_preparing_orders.innerHTML) + 1;
    }
}
function get_orders() {
        var loc = window.location;
        var wsStart = 'ws://';
        if (loc.protocol === 'https:') wsStart = 'wss://';
        var endpoint = wsStart + loc.host + "/admin/get/orders/";
        var socket = new WebSocket(endpoint);
        socket.onmessage = function (e) {
            var json_data = JSON.parse(e.data);
            console.log("message", e);
            if (json_data.type !== 'websocket.disconnect') {
                var dest = json_data.destination;
                var src = json_data.src;
                var order_id = json_data.order_id;
                var order_note = json_data.note;
                if (src === "admin" && dest === "kitchen") {
                    var order_info_without_details = json_data.order_info;
                    show_order(order_id, order_info_without_details, order_note);
                    var orders = document.getElementById("orders-num");
                    document.getElementById("orders-num").innerHTML = parseInt(orders.innerHTML) + 1;
                }
                else if (src === "payment" && dest === "services") {
                    //hide_order(order_id);
                    var order_info = json_data.order_info;
                    var order_time = json_data.order_remaining_time;
                    var order_price = json_data.order_price;
                    var order_j_day = json_data.order_j_day;
                    var order_day = json_data.order_day;
                    var order_month = json_data.order_month;
                    var order_year = json_data.order_year;
                    var order_registration_time = json_data.order_registration_time;
                    var table_number = json_data.table_number;
                    var order_user_id  =json_data.user_id;
                    show_order_in_details(order_info, order_id, order_time, order_price, order_j_day,
                        order_day, order_month, order_year, order_registration_time, table_number, order_user_id,order_note);
                }
            }
        };
        socket.onopen = function (e) {
            document.onclick = function (event) {
                event = event || window.event;
                event = event.target || event.srcElement;
                if (event.nodeName === "TH") {
                    if (event.id.indexOf("order") === 0) {
                        alert(event.id);
                        var data = {
                            'order_id': event.id,
                            'src': 'services',
                            'dst': 'services'
                        };
                        socket.send(JSON.stringify(data));
                        var orders = document.getElementById("orders-num");
                        document.getElementById("orders-num").innerHTML = parseInt(orders.innerHTML) - 1;
                    }
                }

                else if(event.nodeName === "IMG"){
                    if (event.id.indexOf("complete-order") === 0) {
                        var order_id = event.id.substring(14, event.id.length);

                        var user_id = document.getElementById("user-id" + order_id).innerHTML;
                        data = {
                            'order_id': order_id,
                            'user_id': user_id,
                            'src': 'kitchen',
                            'dst': 'complete_order'
                        };
                        socket.send(JSON.stringify(data));
                        var num_preparing_orders = document.getElementById("preparing-orders-num");
                        document.getElementById("preparing-orders-num").innerHTML = parseInt(num_preparing_orders.innerHTML) - 1;
                        hide_preparing_order(order_id);
                    }
                }
            };
            console.log("open", e);
        };
        socket.onerror = function (e) {
            console.log("error", e);
        };
        socket.onclose = function (e) {
            console.log("close", e);

        };

    }
get_orders();
