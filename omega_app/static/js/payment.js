var timer = null;
function set_timer() {
    timer = setInterval(function (){
    check_blocked();
    } , 10000)
}
//set_timer();

function payment_load(){
    get_orders();
    get_online_users();
}

function check_blocked() {
    var user_id = document.getElementById('user').innerHTML;
    method = "GET";
    data = {'user_id' : user_id};
    url = '../admin/check/blocked/user';
    $.ajax({
                   url : url ,
                   method : method ,
                   data : data ,
                   success: function (data) {
                       if(data === "blocked")
                       window.location.href = '../';
                       console.log(data);
                   } ,
                   error:function () {
                       alert("Ooooops");
                   }
               });

}


function change_user_status(user_id, status) {
    var method = "GET";
    var data = {'user_id' : user_id, 'status' : status, 'finish' : true};
    var url = '../admin/change/user/status';
    $.ajax({
                   url : url ,
                   method : method ,
                   data : data ,
                   success: function (data) {
                       console.log(data);
                       window.location.href = '../phase2/';
                   } ,
                   error:function () {
                       alert("Ooooops");
                   }
               });
}

function send_order(user_id) {
     var method = "GET";
    var data = {'user_id' : user_id};
    var url = '../save/orders';
    $.ajax({
                   url : url ,
                   method : method ,
                   data : data ,
                   success: function (data) {
                       console.log(data);
                       window.location.href = '../phase2/';
                   } ,
                   error:function () {
                       alert("Ooooops");
                   }
               });
}

function get_orders(){
    var loc = window.location;
    var wsStart = 'ws://';
    if(loc.protocol === 'https:') wsStart = 'wss://';
    var endpoint = wsStart + loc.host + "/admin/get/orders/";
    var socket = new WebSocket(endpoint);
    var confirm_btn = document.getElementById('confirm-btn');
    var me = document.getElementById('user').innerHTML;
    socket.onmessage = function(e) {
        var json_data = JSON.parse(e.data);
        var src = json_data.src;
        var dest = json_data.destination;
        var order_id = json_data.order_id;
        var user_id = json_data.user_id;
        if(order_id !== 'no_order') {
            window.location.href = "../after/order/user_id=" + user_id + "/order_id=" + order_id + "/";
        }
        console.log("message", e);
    };
    socket.onopen =  function(e) {
        console.log("open", e);
        confirm_btn.onclick = function () {
            var data = {
              'user_id' : me,
              'src' : 'payment'
            };
            socket.send(JSON.stringify(data));
        }

    };
    socket.onerror =  function(e) {
        console.log("error", e);
    };
    socket.onclose =  function(e) {
        console.log("close", e);

    };

}

function get_online_users() {
    var user_id = document.getElementById('user').innerHTML;
    var loc = window.location;
    var wsStart = 'ws://';
    if(loc.protocol === 'https:') wsStart = 'wss://';
    var endpoint = wsStart + loc.host + "/admin/get/online/users/";
    var socket = new WebSocket(endpoint);
    socket.onmessage = function(e) {
        var json_data = JSON.parse(e.data);
        if(json_data.type === 'websocket.disconnect') {
            var data = {
            "src":"menu",
            "destination":"check_online",
            "user_id":user_id
        };
        socket.send(JSON.stringify(data));
        }
        console.log("message", e);
    };
    socket.onopen =  function(e) {
        console.log("open", e);
        var data = {
            "src":"menu",
            "destination":"admin",
            "user_id":user_id
        };
        socket.send(JSON.stringify(data));
    };
    socket.onerror =  function(e) {
        console.log("error", e);
    };
    socket.onclose =  function(e) {
        console.log("close", e);
    };
}
