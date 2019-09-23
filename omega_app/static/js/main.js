var alter_cart = true;

var timer = null;
function set_timer() {
    timer = setInterval(function (){
    check_blocked();
    } , 10000)
}
//set_timer();

function check_blocked() {
    var user_id = document.getElementById('user').innerHTML;
    method = "GET";
    data = {'user_id' : user_id};
    url = 'admin/check/blocked/user';
    $.ajax({
                   url : url ,
                   method : method ,
                   data : data ,
                   success: function (data) {
                       if(data === "blocked")
                       window.location.href = '';
                       console.log(data);
                   } ,
                   error:function () {
                       alert("Ooooops");
                   }
               });

}


function change_user_status(user_id, status) {
    var method = "GET";
    if(status === "go_to_payment") {
        var table_number = document.getElementById("table-number").value;
        var note = document.getElementById("order-note").value;
        var data = {'user_id' : user_id, 'status' : status, "table_number":table_number, "note":note };
    }
    else{
        table_number = "";
        note = "";
        data = {"user_id": user_id, "status": status};

    }
    var url = 'admin/change/user/status';
    $.ajax({
                   url : url ,
                   method : method ,
                   data : data ,
                   success: function (data) {
                       if(data === "ok")
                       //console.log(data);
                       window.location.href = 'payment/';
                       else
                           alert("شماره میز باید عددی بین 1 تا 25 باشد. لطفا شماره میز درست را وارد کنید.")
                   } ,
                   error:function () {
                       alert("Ooooops");
                   }
               });
}


function middle_like(element) {
    if(element.classList.contains("anim-heart")) {
        element.classList.remove("anim-heart");
    }

    //void anim_id.offsetWidth;
    element.style.display = "block";
    element.classList.add("anim-heart");
    window.setTimeout(function(){element.style.display = 'none';} , 600);
}
function anim_like(id){
    var like_middle =document.getElementById("like-middle");
    var anim_id = document.getElementById('anim' + id);
    if(anim_id.classList.contains("anim-heart")) {
        anim_id.classList.remove("anim-heart");
    }
    anim_id.style.display = "block";
    anim_id.classList.add("anim-heart");
    window.setTimeout(function(){anim_id.style.display = 'none';} , 1000);
}

function Like_double_click(id) {
    liked(id , true);
}


function liked(id , is_double_click) {
    var img_id = 'img-like' + id;
    var img = document.getElementById(img_id);
    var num_like_id = "num-like" + id;
    var element = document.getElementById(num_like_id);
    if(img.name === 'not_liked'){
        img.src = "../static/img/like2.png";
        img.name = 'is_liked';
        if(img.classList.contains("heart")) {
            img.classList.remove("heart");
        }
        void img.offsetWidth;
        img.classList.add("heart");
        anim_like(id);
        element.innerHTML = parseInt(element.innerHTML) + 1;

    }
    else{
        if(!is_double_click) {
            img.src = "../static/img/like.png";
            img.name = 'not_liked';
            if (img.classList.contains("heart")) {
                img.classList.remove("heart");
            }
            void img.offsetWidth;
            img.classList.add("heart");
            element.innerHTML = parseInt(element.innerHTML) - 1;
        }
        else{
            img.src = "../static/img/like2.png";
            img.name = 'is_liked';
            if (img.classList.contains("heart")) {
                img.classList.remove("heart");
            }
            void img.offsetWidth;
            img.classList.add("heart");
            anim_like(id);
        }
    }
}

function show_icon(id) {
    var delete_id = "delete" + id;
    var edit_id = "edit" + id;
    var delete_element = document.getElementById(delete_id);
    var edit_element = document.getElementById(edit_id);
    delete_element.style.display = "block";
    edit_element.style.display = "block";
    if(delete_element.classList.contains("icon-anim2") || edit_element.classList.contains("icon-anim2")){
        delete_element.classList.remove("icon-anim2");
        edit_element.classList.remove("icon-anim2")
    }
    delete_element.classList.add("icon-anim");
    edit_element.classList.add("icon-anim")
}
function hide_icon(id) {
    var delete_id = "delete" + id;
    var edit_id = "edit" + id;
    var delete_element = document.getElementById(delete_id);
    var edit_element = document.getElementById(edit_id);
    if(delete_element.classList.contains("icon-anim") || edit_element.classList.contains("icon-anim")){
        delete_element.classList.remove("icon-anim");
        edit_element.classList.remove("icon-anim");
    }
    delete_element.classList.add("icon-anim2");
    edit_element.classList.add("icon-anim2");
    window.setTimeout(function () { delete_element.style.display = "none";
    edit_element.style.display = "none";} , 500);

}

function hold(id) {
    var delete_id = "delete" + id;
    document.getElementById(delete_id).style.display = "block";
}


function show(id) {
    var comment_pos = document.getElementById(id);
    if(comment_pos.classList.contains('show')){
        comment_pos.classList.remove('show');
    }
    else{
        comment_pos.classList.add('show');
       // window.setTimeout(function (){comment_pos.style = 'display : block'} , 600);

    }
}

function disappear_comment_popup() {
    var bg_color = document.getElementById('bg-color');
    var popup = document.getElementById('popup-add-comment');
    if(bg_color.classList.contains('open-popup-comment-anim')) bg_color.classList.remove('open-popup-comment-anim');
    if(popup.classList.contains('open-popup-comment-anim')) popup.classList.remove('open-popup-comment-anim');
    bg_color.classList.add('close-popup-comment-anim');
    popup.classList.add('close-popup-comment-anim');
    window.setTimeout(function () {
        bg_color.style.display = 'none';
        popup.style.display = 'none';
    }, 500);
}

function show_or_hide_description(food_id){
    var new_id = 'all-desc' + food_id;
    var pos_description = document.getElementById(new_id);
    var description_content = document.getElementById('all-description-text' + food_id);
    if(pos_description.style.display === 'none'){
       // alert("yeeees");
        pos_description.style.display = 'block';
        if(pos_description.classList.contains('close-anim3')){
            pos_description.classList.remove('close-anim3');
        }
        pos_description.classList.add('open-anim3');
        window.setTimeout(function () {description_content.style.display = 'block'}, 500);
        }
    else {
        window.setTimeout(function () {pos_description.style.display = 'none'}, 500);
        description_content.style.display = 'none';
        if(pos_description.classList.contains('open-anim3')){
            pos_description.classList.remove('open-anim3');
        }
        pos_description.classList.add('close-anim3');
        }
}


function add_comment(text) {
    var bg_color = document.getElementById('bg-color');
    var popup = document.getElementById('popup-add-comment');
    if(bg_color.classList.contains('close-popup-comment-anim')) bg_color.classList.remove('close-popup-comment-anim');
    if(popup.classList.contains('close-popup-comment-anim')) popup.classList.remove('close-popup-comment-anim');
    bg_color.classList.add('open-popup-comment-anim');
    popup.classList.add('open-popup-comment-anim');
    document.getElementById("notification-text").innerHTML = text;
    bg_color.style.display = 'block';
    popup.style.display = 'block';
}

function comments(id) {
    var new_id = 'pos-com' + id;
    var pos_comment = document.getElementById(new_id);
    var comment_content = document.getElementById('com' + id);
    if(pos_comment.style.display === 'none'){
       // alert("yeeees");
        pos_comment.style.display = 'block';
        if(pos_comment.classList.contains('close-anim2')){
            pos_comment.classList.remove('close-anim2');
        }
        pos_comment.classList.add('open-anim2');
        window.setTimeout(function () {comment_content.style.display = 'block'}, 500);
        }
    else {
        window.setTimeout(function () {pos_comment.style.display = 'none'}, 500);
        comment_content.style.display = 'none';
        if(pos_comment.classList.contains('open-anim2')){
            pos_comment.classList.remove('open-anim2');
        }
        pos_comment.classList.add('close-anim2');
        }
}
function description(id) {
    var new_id = 'des' + id;
    show(new_id);
}
function show_only(id) {
    var hide_element = document.getElementById(id);
    hide_element.style.display = "block";
}
function hide_only(id) {
    var show_element = document.getElementById(id);
    show_element.style.display = "none";
}

function clc_price(user_id) {
    var method = "GET";
    var data = {"user_id" : user_id};
    var url = 'clc/total/price/';
    $.ajax({
                   url : url ,
                   method : method ,
                   data : data ,
                   success: function (data) {
                       var element = document.getElementById('cart-price');
                       element.innerHTML = data['price'];
                       var cart_element = document.getElementById('price');
                       if(cart_element) cart_element.innerHTML = data['price'] + " تومان";

                   } ,
                   error:function () {
                       alert("Ooooops");
                   }
               });
    return true
}

function send_to_server(food_id , user_id , url , number , op) {
    //alert("in ajax function : " + url + number);
    var method = "GET";
    var data = {"user" : user_id , "food_id" : food_id  , "num" : number , "op" : op};
    $.ajax({
                   url : url ,
                   method : method ,
                   data : data ,
                   success: function (data) {
                       console.log(data);
                       var post_id = "num" + food_id;
                       var element = document.getElementById(post_id);
                       element.innerHTML = data['num'];
                       var in_cart_element = document.getElementById("numm" + food_id);
                       if(in_cart_element) in_cart_element.innerHTML = data['num'];
                       //if(op === 'add') clcPrice(food_id , true);
                       //else clcPrice(food_id, false);
                       clc_price(user_id);


                   } ,
                   error:function () {
                       alert("Ooooops");
                   }
               });
    return true
}

function get_size(obj){
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
}

function sub_cart(element, user_id) {
    var url = "add/to/cart/";
    var food_id =element.getElementsByClassName('food_id')[0].id;
    subFromCart(food_id , user_id , url, true);
}
function add_cart(element , user_id) {
    var url = "add/to/cart";
    var food_id = element.getElementsByClassName('food_id')[0].id;
    addToCart(food_id , user_id , url, true)
}

function show_info_on_cart(data, user_id) {
    //var length = get_size(data);
    $("div").remove(".row-item");
    $("center").remove(".center-test");
    for (d in data){
     //   alert(i+1);
        var html_code = "<div id=\'food" + data[d]['food_id'] +"\' class=\"row-item\">\n" +
            "        <div class=\"name-price-pos\">\n" +
            "            <div>\n" +
            "                <span class=\"cart-food-name\"></span>\n" +
            "            </div>\n" +
            "            <div>\n" +
            "                <span class=\"cart-food-price\"></span>\n" +
            "                <span class=\"cart-food-price\" style=\"font-size: 14px;\">تومان</span>\n" +
            "            </div>\n" +
            "        </div>\n" +
            "        <div class=\"add-sub-pos\">\n" +
            "            <div onclick='sub_cart(this, "+ user_id +")' class=\"btn sub-btn\">\n" +
            "                <span>&minus;</span>\n" +
            "                <span class=\'food_id\' id=\'"+ data[d]['food_id'] +"\'></span>\n" +
            "            </div>\n" +
            "            <span id=\'numm"+ data[d]['food_id'] +"\' class=\'num-item\'></span>\n" +
            "            <div onclick='add_cart(this , "+ user_id +")' class=\"btn cart-add-btn\">\n" +
            "                <span>&plus;</span>\n" +
            "                <span class=\'food_id\' id=\'"+ data[d]['food_id'] +"\'></span>\n" +
            "            </div>\n" +
            "        </div>\n" +
            "        </div>";
        $('#cart-content').append(html_code);
        console.log(d);
    }
    var food_name = document.getElementsByClassName('cart-food-name');
    var food_price = document.getElementsByClassName('cart-food-price');
    var num_item = document.getElementsByClassName('num-item');
    for(j in data){
        food_name[j].innerHTML = data[j]['name'];
        food_price[j*2].innerHTML = data[j]['price'];
        num_item[j].innerHTML = data[j]['number'];
        console.log(data[j]);
    }
}

function show_empty_cart() {
    $("div").remove(".row-item");
    $('center').remove('.center-test');
    var html_code = "<center class=\'center-test\'><p class=\'empty-cart\'>سبد خرید شما خالی است.</p></center>"
    $('#cart-content').append(html_code);
}

function get_from_server(user_id , url){
    var method = "GET";
    var data = {"user" : user_id};

    $.ajax({
                   url : url ,
                   method : method ,
                   data : data ,
                   success: function (data) {
                       console.log(data);
                       if(data === 'empty'){
                           show_empty_cart();
                       }
                       else {
                           show_info_on_cart(data, user_id);
                       }
       //                console.log(data[0]);
                   } ,
                   error:function () {
                       alert("Ooooops");
                   }
               });
    return true
}

function addToCart(food_id , user_id , url, flag) {
   // alert(food_id + user_id + url);
    var post_id = "num" + food_id;
    var element = document.getElementById(post_id);
    var number = element.innerHTML;
    if(flag){
        var in_cart_element = document.getElementById("numm" + food_id);
        number = in_cart_element.innerHTML;
       // in_cart_element.innerHTML = parseInt(number) + 1;
    }

    //element.innerHTML = parseInt(number) + 1;
    var num_id = "pos-num" + food_id;
    var sub_id = "sub" + food_id;

    var num = parseInt(number) + 1;
    var op = "add";

    send_to_server(food_id , user_id , url , num , op);
   // alert("hello");
   // clcPrice(food_id , true);
    show_only(num_id);
    show_only(sub_id);
    alter_cart = true;
}
function subFromCart(food_id , user_id , url, flag) {
    var post_id = "num" + food_id;
    var element = document.getElementById(post_id);
    var number = element.innerHTML;
    if(flag){
        var in_cart_element = document.getElementById("numm" + food_id);
        number = in_cart_element.innerHTML;
    }
    //if(number > 0) {
     //   clcPrice(food_id, false, number);
    //}
    var op = "sub";
    if(parseInt(number) > 1) {
        //element.innerHTML = parseInt(number) - 1;
        //if(flag) {
         //   in_cart_element.innerHTML = parseInt(number) - 1;
        //}
        var num = parseInt(number) - 1;
        send_to_server(food_id , user_id , url , num , op);
    }
    else{
        //element.innerHTML = 0;
        //if(flag) {
        //    in_cart_element.innerHTML = 0;
       // }
        var num_id = "pos-num" + food_id;
        var sub_id = "sub" + food_id;
        hide_only(num_id);
        hide_only(sub_id);
        send_to_server(food_id , user_id , url , 0 , op);
    }
    alter_cart = true
}

function clcPrice(id , isAdd) {
    var price_id = "price" + id;
    var price_element = document.getElementById('price');
    var price = document.getElementById(price_id).innerHTML;

    if(isAdd){
        document.getElementById("cart-price").innerHTML = parseInt(document.getElementById("cart-price").innerHTML) + parseInt(price);
        price_element.innerHTML = document.getElementById("cart-price").innerHTML + " تومان"
    }
    else {
        if(parseInt(document.getElementById("cart-price").innerHTML) > 0) {
            document.getElementById("cart-price").innerHTML = parseInt(document.getElementById("cart-price").innerHTML) - parseInt(price);
            price_element.innerHTML = document.getElementById("cart-price").innerHTML + " تومان "
        }
        else {
            document.getElementById("cart-price").innerHTML = 0;
            price_element.innerHTML = "0" + "تومان ";
        }
    }

}

function showSideMenu() {
    var element = document.getElementById("side-menu-id");
    if(element.style.display === "none"){
        element.style.display = "block";
        element.classList.add("side-menu-show-animation");
        if(element.classList.contains("side-menu-hide-animation")){
            element.classList.remove("side-menu-hide-animation");
        }
    }
    else {
        element.classList.remove("side-menu-show-animation");
        element.classList.add("side-menu-hide-animation");
        window.setTimeout(function () {element.style.display = "none"} , 500);
    }

}


function set_scores() {
    var hide_scores = document.getElementsByClassName("hide-post-score");
    var show_scores = document.getElementsByClassName("show-post-score");
    for (var i=0 ; i < hide_scores.length; i++){
        var score = hide_scores[i].innerHTML;
        var post_id = hide_scores[i].id.substr(10 , hide_scores[i].id.length);
        show_scores[i].innerHTML = score +  ".0";
        for(var j=1 ; j <= parseInt(score) ; j++){
            star = document.getElementById("star" + post_id + j);
            star.style.color = "white";
        }


    }
}

function score() {
    var hide_score = document.getElementById("rest-score");
    var score = hide_score.innerHTML;
    for(var j=1 ; j <= parseInt(score) ; j++){
            star = document.getElementById("star" + j);
            star.style.color = "white";
        }


}

function count_down() {
    if (typeof(Storage) !== "undefined") {
        // Retrieve
        var pos_order_status = document.getElementById("pos-order-status");
        var order_id = document.getElementById("order-id").innerHTML;
        var min = localStorage.getItem("min" + order_id);
        var sec = localStorage.getItem("sec" + order_id);
            if (sec > 0 || (sec === 0 && min > 0)) {
                var pos_min = document.getElementById("min-time-order");
                var min_text = document.getElementById("min-text");
                var pos_sec = document.getElementById("sec-time-order");
                var pos_info = document.getElementById("time-order-info");
                pos_info.style.display = "block";
                var keep_going = true;
                var x = setInterval(function () {
                    if (min > 0) {
                        if (sec === 0) {
                            min = min - 1;
                            sec = 60;
                        }
                        sec = sec - 1;
                    }
                    else {
                        if (sec > 0) {
                            sec = sec - 1;
                            min_text.style.display = "none";
                            pos_min.style.display = "none";
                        }
                        else {
                            if (keep_going) {
                                add_comment("سفارش شما آماده است.");
                                pos_info.style.display = "none";
                                pos_order_status.style.display = "block";
                                document.getElementById("order-status").innerHTML = "سفارش شما آماده است.";

                            }
                            keep_going = false;
                        }
                    }
                    localStorage.setItem("min" + order_id, min);
                    localStorage.setItem("sec" + order_id, sec);
                    pos_min.innerHTML = min;
                    pos_sec.innerHTML = sec;

                }, 1000);
            }
    }
else {
  alert("Sorry, your browser does not support Web Storage...")
}

}

function height_background() {
     var pos_background = document.getElementById("pos-background");
    var height = 0;
    var body = window.document.body;
    if (window.innerHeight) {
        height = window.innerHeight;
    }
    else if (body.parentElement.clientHeight) {
        height = body.parentElement.clientHeight;
    }
    else if (body && body.clientHeight) {
        height = body.clientHeight;
    }
    pos_background.style.height = ((height - pos_background.offsetTop) + "px");

}

function text_limit() {
    get_online_users();
    shopping_cart();
    save_like();
    get_orders();
    update_time();
    height_background();
    //count_down();
    var all_desc = document.getElementsByClassName("description");
    var limited_desc = document.getElementsByClassName("limited-desc");
  //  alert(str.length);
    for(var i=0 ; i < all_desc.length; i++){
        //alert(all_desc[i].innerHTML.substr(0 , 20));
        if(all_desc[i].innerHTML.length > 20){

            limited_desc[i].innerHTML = all_desc[i].innerHTML.substr(0 , 20);
        }
        else{
            limited_desc[i].innerHTML = all_desc[i].innerHTML;
        }
    }
}

function show_foods(id) {
    /*var element = document.getElementById(id);*/
    var element = "#" + id;
    $('html, body').animate({
        scrollTop: $(element).offset().top - 50
      }, 1200);
}



function hide_all_desc(id) {
    var all_id = "all-desc" + id;
    var pos_limit_desc = "limited-description" + id;
    var pos_footer = "post-footer" + id;
    document.getElementById(pos_footer).style.bottom = "40px";
    document.getElementById(pos_limit_desc).style.display = "block";
    document.getElementById(all_id).style.display = "none";
}


function show_all_desc(id) {
    var all_id = "all-desc" + id;
    var pos_limit_desc = "limited-description" + id;
    var pos_footer = "post-footer" + id;
    document.getElementById(pos_footer).style.bottom = 0;
    document.getElementById(pos_limit_desc).style.display = "none";
    document.getElementById(all_id).style.display = "block";

}

function show_cart(user_id , url) {
    var color_back = document.getElementById('color-back');
    var cart_pos = document.getElementById('cart-pos');
    var close_btn = document.getElementById('close-btn');
    var cart_content = document.getElementById('cart-content');
    var summary_table = document.getElementById('summary-table');
    var note = document.getElementById('note');
    var confirm_btn = document.getElementById('confirm');
    color_back.style.display = 'block';
    cart_pos.style.display = 'block';
    window.setTimeout(function () {close_btn.style.display = 'block';}, 500);
    if(color_back.classList.contains('close-anim')){
        color_back.classList.remove('close-anim');
    }
    if(cart_pos.classList.contains('close-anim')){
        cart_pos.classList.remove('close-anim');
    }
    //if(close_btn.classList.contains('open-anim')){
     //   close_btn.classList.remove('open-anim');
   // }
    color_back.classList.add('open-anim');
    cart_pos.classList.add('open-anim');
    window.setTimeout(function () {cart_content.style.display = 'block';
    summary_table.style.display = 'block';
    note.style.display = 'block';
    confirm_btn.style.display = 'block';
    if(cart_content.classList.contains('show-cart-animation')){
        cart_content.classList.remove('show-cart-animation');
    }
    if(summary_table.classList.contains('summary-animation')){
        summary_table.classList.remove('summary-animation');
    }
    summary_table.classList.add('summary-animation');
    cart_content.classList.add('show-cart-animation');
    }, 600);
   // close_btn.classList.add('open-anim');
    //get_from_server(user_id, url);
}
function hide_cart() {
    var color_back = document.getElementById('color-back');
    var cart_pos = document.getElementById('cart-pos');
    var close_btn = document.getElementById('close-btn');
    var note = document.getElementById('note');
    var confirm_btn = document.getElementById('confirm');
    note.style.display = 'none';
    close_btn.style.display = 'none';
    confirm_btn.style.display = 'none';
    document.getElementById('cart-content').style.display = 'none';
    document.getElementById('summary-table').style.display = 'none';
    if(color_back.classList.contains('open-anim')){
        color_back.classList.remove('open-anim');
    }
    if(cart_pos.classList.contains('open-anim')){
        cart_pos.classList.remove('open-anim');
    }
    color_back.classList.add('close-anim');
    cart_pos.classList.add('close-anim');
    window.setTimeout(function () { color_back.style.display = 'none';cart_pos.style.display = 'none';} , 500);
    var user_id = document.getElementById('user').innerHTML;
    //change_user_status(user_id, "A");
}

/*
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}*/


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


function add_item_to_cart(food_id, food_name, price, num_food){
    var html_code = "<div id=\'food" + food_id +"\' class=\"row-item\">\n" +
            "        <div class=\"name-price-pos\">\n" +
            "            <div>\n" +
            "                <span id=\'cart-food-name" + food_id + "\' class=\"cart-food-name\"></span>\n" +
            "            </div>\n" +
            "            <div>\n" +
            "                <span id=\'food-price" + food_id + "\' class=\"cart-food-price\"></span>\n" +
            "                <span class=\"cart-food-price\" style=\"font-size: 14px;\">تومان</span>\n" +
            "            </div>\n" +
            "        </div>\n" +
            "        <div class=\"add-sub-pos\">\n" +
            "            <div id=\'div-cart-sub" + food_id + "\' class=\"btn sub-btn\">\n" +
            "                <img id=\'img-cart-sub" + food_id + "\' src=\"../static/img/minus.png\" class=\"fit-icons\" />\n" +
            "                <span class=\'food_id\' id=\'"+ food_id +"\'></span>\n" +
            "            </div>\n" +
            "            <span id=\'numm"+ food_id +"\' class=\'num-item\'></span>\n" +
            "            <div id=\'div-cart-add" + food_id + "\' class=\"btn cart-add-btn\">\n" +
            "                <img id=\'img-cart-add" + food_id + "\' src=\"../static/img/add.png\" class=\"fit-icons\" />\n" +
            "                <span class=\'food_id\' id=\'"+ food_id +"\'></span>\n" +
            "            </div>\n" +
            "        </div>\n" +
            "        </div>";
    var element = document.getElementById("food" + food_id);
    if(element === null) {
        if (num_food !== 0) {
            $('#cart-content').append(html_code);
            document.getElementById('cart-food-name' + food_id).innerHTML = food_name;
            document.getElementById('food-price' + food_id).innerHTML = price;
            document.getElementById('numm' + food_id).innerHTML = num_food;
        }
    }
    else {
        document.getElementById('cart-food-name' + food_id).innerHTML = food_name;
        document.getElementById('food-price' + food_id).innerHTML = price;
        document.getElementById('numm' + food_id).innerHTML = num_food;
    }
}

function show_num_food_in_cart(food_id, num_food, operation){
    var pos_number = document.getElementById("pos-num" + food_id);
    var number = document.getElementById("num" + food_id);
    number.innerHTML = num_food;
    var sub = document.getElementById('div-sub' + food_id);
    if(num_food > 0) {
        sub.style.display = "block";
        pos_number.style.display = "block";
    }
    else {
        pos_number.style.display = "none";
        sub.style.display = "none";
    }
    var price = document.getElementById("price" + food_id).innerHTML;
    var food_name = document.getElementById("food-name" + food_id).innerHTML;
    var cart_price = document.getElementById('cart-price');
    if(operation === "add") cart_price.innerHTML = parseInt(price) + parseInt(cart_price.innerHTML);
    else if(operation === "sub") cart_price.innerHTML = parseInt(cart_price.innerHTML) - parseInt(price);
    document.getElementById("price").innerHTML = cart_price.innerHTML;
    add_item_to_cart(food_id, food_name, price, num_food);
}

function get_target_element(target_tag1, target_tag2) {
    document.onclick = function (event) {
        event = event || window.event;
        event = event.target || event.srcElement;
        if(event.nodeName === target_tag1 || event.nodeName === target_tag2){
                return event;
        }
    };

}


function shopping_cart() {
    var me = document.getElementById('user').innerHTML;
    var loc = window.location;
    var wsStart = 'ws://';
    if(loc.protocol === 'https:') wsStart = 'wss://';
    var endpoint = wsStart + loc.host + "/admin/shopping/cart/";
    var socket = new WebSocket(endpoint);
    socket.onmessage = function(e) {
        console.log("message", e.data);
        var json_data = JSON.parse(e.data);
        if(json_data.type !== 'websocket.disconnect') {
            var food_id = json_data.food_id;
            var num_food= json_data.num_food;
            var operation = json_data.operation;
            var user_id = json_data.user_id;
            if(user_id === me) {
                show_num_food_in_cart(food_id, num_food, operation);
            }
        }
        //console.log("message", e);
    };
    socket.onopen =  function(e) {
        console.log("hello");
        document.onclick = function (event) {
            event = event || window.event;
            event = event.target || event.srcElement;
            if(event.nodeName === "DIV" || event.nodeName === "IMG"){
                if(event.id.indexOf("div-") === 0 || (event.id.indexOf("img-") === 0 && event.id.indexOf("img-like") !== 0)) {
                    var action_food_id = '';
                    if(event.id.indexOf("div-cart") === 0 || event.id.indexOf("img-cart") === 0) action_food_id = event.id.substring(9, event.id.length);
                    else action_food_id = event.id.substring(4, event.id.length);

                    var data = {
                        "src": "menu",
                        "destination":"admin",
                        "user_id": me,
                        "id": action_food_id
                    };
                    socket.send(JSON.stringify(data))
                }
            }

        };

        console.log("open", e);
    };
    socket.onerror =  function(e) {
        console.log("error", e);
    };
    socket.onclose =  function(e) {
        console.log("close", e);
    };
}

function broadcast_like(food_id, liked) {
    var num_like = document.getElementById("num-like" + food_id);
    if(liked) num_like.innerHTML = parseInt(num_like.innerHTML) + 1;
    else {
        if (parseInt(num_like.innerHTML) > 1)
            num_like.innerHTML = parseInt(num_like.innerHTML) - 1;
        else
            num_like.innerHTML = 0;
    }
}



function save_like() {
    var me = document.getElementById('user').innerHTML;
    var loc = window.location;
    var wsStart = 'ws://';
    if(loc.protocol === 'https:') wsStart = 'wss://';
    var endpoint = wsStart + loc.host + "/admin/save/like/";
    var socket = new WebSocket(endpoint);
    socket.onmessage = function(e) {
        console.log("message", e.data);
         var json_data = JSON.parse(e.data);
        if(json_data.type !== 'websocket.disconnect') {
            var user_id = json_data.user_id;
            var food_id = json_data.food_id;
            var is_liked = json_data.liked;
            var action = json_data.event;
            if(user_id === me){
                if(action === "dblclick")
                    liked(food_id, true);
                else
                    liked(food_id, false);
            }
            if(is_liked !== null){
                if(user_id !== me)
                broadcast_like(food_id, is_liked);
            }
        }
        //console.log("message", e);
    };
    socket.onopen =  function(e) {

        document.ondblclick = function (event) {
            event = event || window.event;
            event = event.target || event.srcElement;
            if(event.nodeName === "IMG" ){
                var food_id = 0;
                if(event.id.indexOf("dbl-like") === 0) {
                    food_id = event.id.substring(8, event.id.length);
                    var data = {
                        "src": "menu",
                        "destination": "admin",
                        "user_id": me,
                        "food_id": food_id,
                        "event": "dblclick"
                    };
                    socket.send(JSON.stringify(data))
                }
            }

            };

        $("img").on('click', function (event) {
            event = event || window.event;
            event = event.target || event.srcElement;
            if(event.id.indexOf("img-like") === 0) {
                    var food_id = event.id.substring(8, event.id.length);
                    var data = {
                        "src": "menu",
                        "destination":"admin",
                        "user_id": me,
                        "food_id": food_id,
                        "event": "click"
                    };
                    socket.send(JSON.stringify(data))
                }
        });
            /*
            = function (event) {
            alert("hello");
            event = event || window.event;
            event = event.target || event.srcElement;
            if(event.nodeName === "IMG" ){
                var food_id = 0;
                if(event.id.indexOf("img") === 0) {
                    food_id = event.id.substring(3, event.id.length);
                    var data = {
                        "src": "menu",
                        "user_id": me,
                        "food_id": food_id,
                        "event": "click"
                    };
                    socket.send(JSON.stringify(data))
                }
            }

            };
*/
          //  event = event || window.event;
          //  event = event.target || event.srcElement;
          //  if (event.nodeName === "IMG") {
          //      alert(event.id);
          //  }
       // };
        console.log("open", e);
    };
    socket.onerror =  function(e) {
        console.log("error", e);
    };
    socket.onclose =  function(e) {
        console.log("close", e);
    };
}


function comment_form_validation(){
    var user_name = document.getElementById("user-name").value;
    var submit = true;
    if(user_name.length === 0){
        document.getElementById("user-name-error").style.display = "block";
        submit = false;
    }
    else {
        document.getElementById("user-name-error").style.display = "none";
    }
    var comment_content = document.getElementById("comment-content").value;
    if(comment_content.length === 0){
        document.getElementById("comment-content-error").style.display = "block";
        submit = false;
    }
    else {
        document.getElementById("comment-content-error").style.display = "none";
    }
    return submit;
}

function change_order_status() {
    var order_id = document.getElementById('order-id').innerHTML;
    var method = "GET";
    var data = {'order_id' : order_id};
    var url = document.getElementById("complete-order-url").innerHTML;
    $.ajax({
                   url : url ,
                   method : method ,
                   data : data ,
                   success: function (data) {
                       console.log(data);
                   } ,
                   error:function () {
                       alert("Ooooops");
                   }
               });
}

function update_time() {
    var pos_time = document.getElementById("remaining-time");
    var pos_info = document.getElementById("time-order-info");
    if(pos_time !== null && pos_info !== null && pos_time.innerHTML !== "not_set") {
        var sec = parseInt(pos_time.innerHTML) % 60;
        var min = parseInt(parseInt(pos_time.innerHTML) / 60);
        var min_text = document.getElementById("min-text");
        var pos_min = document.getElementById("min-time-order");
        if(min === 0){
            min_text.style.display = "none";
            pos_min.style.display = "none";
        }
        var pos_sec = document.getElementById("sec-time-order");
        var pos_order_status = document.getElementById("pos-order-status");
        if ((sec === 0 && min === 0) || isNaN(sec) || isNaN(min)) {
            add_comment("سفارش شما آماده است.");
            pos_info.style.display = "none";
            pos_order_status.style.display = "block";
            document.getElementById("order-status").innerHTML = "سفارش شما آماده است.";
            //change_order_status();
        }
        else {
            if (min !== 0) {
                if (sec === 0) {
                    min = min - 1;
                    sec = 60;
                }
                sec = sec - 1;
            }
            else {
                if (sec !== 0) {
                    sec = sec - 1;
                }

            }
            pos_min.innerHTML = min;
            pos_sec.innerHTML = sec;
            pos_time.innerHTML = parseInt(min) * 60 + parseInt(sec);
            window.setTimeout(update_time, 1000);
        }
    }
    else {
        if(pos_info !== null)
        pos_info.style.display = "none";
    }
    /*
    if (keep_going) {
        var x = setInterval(function () {
            if (min !== 0) {
                if (sec === 0) {
                    min = min - 1;
                    sec = 60;
                }
                sec = sec - 1;
            }
            else {
                if (sec !== 0) {
                    sec = sec - 1;
                    min_text.style.display = "none";
                    pos_min.style.display = "none";
                }
                else {
                    if(keep_going) {
                        add_comment();
                        pos_info.style.display = "none";
                        pos_order_status.style.display = "block";
                        document.getElementById("order-status").innerHTML = "سفارش شما آماده است.";

                    }
                    keep_going = false;
                }
            }
            localStorage.setItem("min" + order_id, min);
            localStorage.setItem("sec" + order_id, sec);
            pos_min.innerHTML = min;
            pos_sec.innerHTML = sec;
        }, 1000);
    }*/
}


function get_orders(){
    var loc = window.location;
    var wsStart = 'ws://';
    if(loc.protocol === 'https:') wsStart = 'wss://';
    var endpoint = wsStart + loc.host + "/admin/get/orders/";
    var socket = new WebSocket(endpoint);
    var me = document.getElementById('user').innerHTML;
    var pos_order_status = document.getElementById("pos-order-status");
    var order_status = document.getElementById("order-status");
    socket.onmessage = function(e) {
        var json_data = JSON.parse(e.data);
        var order_id = json_data.order_id;
        var src = json_data.src;
        var dest = json_data.destination;
        if(order_id !== "error"){
            var user_id = json_data.user_id;
            if(src === "admin" && dest === "menu"){
                if(me === user_id){
                    order_status.innerHTML = "در انتظار تایید آشپزخانه...";
                }
            }
            else if(src === "kitchen" && dest === "menu"){
                if(me === user_id){
                    var time = json_data.time;
                    //pos_order_status.style.display = "none";
                    order_status.innerHTML = "در حال آماده سازی...";
                    var show_time = document.getElementById("time-order-info");
                    var min_text = document.getElementById("min-text");
                    var pos_min = document.getElementById("min-time-order");
                    if(parseInt(time) === 1) {
                        min_text.style.display = "none";
                        pos_min.style.display = "none";
                    }
                    show_time.style.display = "block";
                    document.getElementById("remaining-time").innerHTML = parseInt(time)*60;
                    update_time();
                }
            }
            else if(src === "kitchen" && dest === "complete_order"){
                var complete_user_id = json_data.user_id;
                if(complete_user_id === me) {
                    add_comment("سفارش شما آماده است.");
                    var pos_order_status = document.getElementById("pos-order-status");
                    var pos_info = document.getElementById("time-order-info");
                    pos_info.style.display = "none";
                    pos_order_status.style.display = "block";
                    document.getElementById("order-status").innerHTML = "سفارش شما آماده است.";
                }

            }
        }
        console.log("message", e);
    };
    socket.onopen =  function(e) {
        console.log("open", e);

    };
    socket.onerror =  function(e) {
        console.log("error", e);
    };
    socket.onclose =  function(e) {
        console.log("close", e);

    };

}

function send_comment(url){
    var food_name = document.getElementById("food-name").value;
    var user_name = document.getElementById("user-name");
    var content = document.getElementById("comment-content");
    var user_id = document.getElementById("user").innerHTML;
    if(user_name.value === "") alert("لطفا نام خود را وارد کنید.");
    else if(content.value === "") alert("لطفا متن مورد نظر خود را وارد کنید.");
    else {
        var method = "GET";
        var data = {"food_name": food_name, "user_name": user_name.value, "content": content.value, "user_id": user_id};
        $.ajax({
            url: url,
            method: method,
            data: data,
            success: function (response) {
                console.log(response);
                user_name.value = "";
                content.value = "";
                add_comment("نظر شما با موفقیت ثبت شد.")
            },
            error: function () {
                alert("Ooooops");
            }
        });
    }
}

function show_last_order(user_id) {
    window.location.href = "/last/orders/user_id=" + user_id;

}

function go_to_order(order_id) {
    var user_id = document.getElementById("user").innerHTML;
    window.location.href = "../../after/order/user_id=" + user_id + "/order_id=" + order_id + "/";

}

function show_food(food_id){
   // var bg_color = document.getElementById("bg-color");
    var food = document.getElementById("food" + food_id);

   // if(bg_color.classList.contains('close-popup-comment-anim')) bg_color.classList.remove('close-popup-comment-anim');
   // bg_color.classList.add('open-popup-comment-anim');

   // if(food.classList.contains('close-popup-comment-anim')) food.classList.remove('close-popup-comment-anim');
   // food.classList.add('open-popup-comment-anim');



   // bg_color.style.display = "block";
    food.style.display = "block";
}