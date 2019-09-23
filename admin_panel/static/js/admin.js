function redirect(){
    window.location = "/";
}
function send_food_to_server(id , operation){

    var food_id = {id: id , type:operation};
$.ajax({
    url: 'http://192.168.43.40/admin/food_management/',
    type: 'POST',
    contentType: 'application/json; charset=utf-8',
    data: $.toJSON(food_id),
    dataType: 'text',
    success: function(result) {
        alert(result.Result);
    }
});
}

function Hello() {
    alert("hello");

}

function add_cat(url) {
    var params = 'width=750, height=500, scrollbars=no,resizable=no,status=no,location=center,toolbar=no,menubar=no,left=200,top=200';
    window.open(url, 'add_category', params)
}

function get_cat_info(url){
    var cat = document.getElementsByName('category')[0];
    if(cat.value.indexOf("---") === -1) {
        var new_url = url + cat.value;
        window.location.href = new_url;
    }
}


function delete_category_forever(url){
    var cat = document.getElementById("all-categories").value;
    var new_url = url + cat;
    window.location.href = new_url
}

function disappear_delete_cat_confirm_box(){
    var bg_color = document.getElementById('bg-color');
    var popup = document.getElementById('popup-delete-category');
    if(bg_color.classList.contains('open-anim')) bg_color.classList.remove('open-anim');
    if(popup.classList.contains('open-anim')) popup.classList.remove('open-anim');
    bg_color.classList.add('close-anim');
    popup.classList.add('close-anim');
    window.setTimeout(function () {
    bg_color.style.display = 'none';
    popup.style.display = 'none';
    }, 500);

}

function show_delete_cat_confirm_box() {
    var bg_color = document.getElementById('bg-color');
    var popup = document.getElementById('popup-delete-category');
    if(bg_color.classList.contains('close-anim')) bg_color.classList.remove('close-anim');
    if(popup.classList.contains('close-anim')) popup.classList.remove('close-anim');
    bg_color.classList.add('open-anim');
    popup.classList.add('open-anim');
    bg_color.style.display = 'block';
    popup.style.display = 'block';
}

function delete_category() {
    var cat = document.getElementById("all-categories").value;
    if(cat.indexOf("---") === -1) {
        show_delete_cat_confirm_box();
    }
}


function register_category(url) {
    console.log("start sending data to server...");
    var method = "GET";
    var cat_name = document.getElementsByName('cat_name')[0].value;
    var formData = new FormData();
    var fileSelect = document.getElementById('file');
    if(fileSelect.files && fileSelect.files.length === 1){
     var file = fileSelect.files[0];
     formData.set("file", file , file.name);
    }
    formData.set('food_id', cat_name);
    //var data = {"food_id" : cat_name, 'csrf' : csrf, 'file' : file};
    $.ajax({
                   url : url ,
                   method : method ,
                   data : formData ,
                   success: function (response) {
                       console.log(response);
                       if(response === 'True'){
                           console.log("Ok");
                          // delete_food(food_id);
                       }
                       else {
                           alert("متاسفانه مشکلی در ارسال اطلاعات به سرور اتفاق افتاده است. لطفا دوباره تلاش کنید.")
                           console.log("hello");
                       }
                   } ,
                   error:function () {
                       alert("Ooooops");
                   }
               });
    return true

}
function delete_food(food_id) {
    //alert(food_id);
    var food = document.getElementById("food" + food_id);
    food.classList.add('delete-anim');
    window.setTimeout(function () {food.style.display = 'none'}, 600);
    return true
}

function delete_item(url, food_id, redirect_url){
    //alert(food_id);
    var method = "GET";
    var data = {"food_id" : food_id};
    $.ajax({
                   url : url ,
                   method : method ,
                   data : data ,
                   success: function (response) {
                       console.log(response);
                       if(response === 'True'){
                           console.log("Ok");
                           delete_food(food_id);
                           window.setTimeout(function () {window.location.href = redirect_url;}, 800)
                       }
                       else {
                           alert("متاسفانه مشکلی در ارسال اطلاعات به سرور اتفاق افتاده است. لطفا دوباره تلاش کنید.")
                           console.log("hello");
                       }
                   } ,
                   error:function () {
                       alert("Ooooops");
                   }
               });
    return true
}


function recycle_food(url, food_id, redirect_url) {
    var method = "GET";
    var data = {"food_id" : food_id};
    $.ajax({
                   url : url ,
                   method : method ,
                   data : data ,
                   success: function (response) {
                       console.log(response);
                       if(response === 'True'){
                           console.log("Ok");
                           delete_food(food_id);
                           window.setTimeout(function () {window.location.href = redirect_url;}, 800)
                       }
                       else {
                           alert("متاسفانه مشکلی در ارسال اطلاعات به سرور اتفاق افتاده است. لطفا دوباره تلاش کنید.")
                           console.log("hello");
                       }
                   } ,
                   error:function () {
                       alert("Ooooops");
                   }
               });
    return true
}

var comment = '';
function delete_comment_anim(comment_id, comment_type){
    if (comment_type === 'unconf') {
        comment = document.getElementById("unconf-com" + comment_id);
    }
    else if(comment_type === 'conf'){
        comment = document.getElementById("conf-com" + comment_id);
    }
    else if(comment_type === 'edit'){
        comment = document.getElementById("edit-com" + comment_id);
        var num_comment = document.getElementById('num-comment');
        num_comment.innerHTML = parseInt(num_comment.innerHTML) - 1;
    }
    else{
        comment = document.getElementById("del-com" + comment_id);
    }
    comment.classList.add('delete-anim');
    window.setTimeout(function () {comment.style.display = 'none'}, 600);
    return true
}

function cancel_deleting() {
    var bg_color = document.getElementById('bg-color');
    var popup = document.getElementById('popup-delete-food');
    if(bg_color.classList.contains('open-anim')) bg_color.classList.remove('open-anim');
    if(popup.classList.contains('open-anim')) popup.classList.remove('open-anim');
    bg_color.classList.add('close-anim');
    popup.classList.add('close-anim');
    window.setTimeout(function () {bg_color.style.display = 'none';
    popup.style.display = 'none';}, 500);

}

function show_confirm_box(food_id) {
    var element = document.getElementById('food-in-trash');
    element.innerHTML = food_id;
    var bg_color = document.getElementById('bg-color');
    var popup = document.getElementById('popup-delete-food');
    if(bg_color.classList.contains('close-anim')) bg_color.classList.remove('close-anim');
    if(popup.classList.contains('close-anim')) popup.classList.remove('close-anim');
    bg_color.classList.add('open-anim');
    popup.classList.add('open-anim');
    bg_color.style.display = 'block';
    popup.style.display = 'block';

}


function show_user_info(user_name) {
    var user_device_element = document.getElementById("device" + user_name);
    var user_device = user_device_element.innerHTML;
    var user_info = document.getElementById("user-info");
    user_info.innerHTML = user_device;
    var bg_color = document.getElementById('bg-color');
    var popup = document.getElementById('popup-delete-food');
    if(bg_color.classList.contains('close-anim')) bg_color.classList.remove('close-anim');
    if(popup.classList.contains('close-anim')) popup.classList.remove('close-anim');
    bg_color.classList.add('open-anim');
    popup.classList.add('open-anim');
    bg_color.style.display = 'block';
    popup.style.display = 'block';
}

function add_online_users(user_name, status, user_id, device_name, name) {
    var html_code1 = "<div id=\'user" + user_name + "\' class=\"user-item\">\n" +
        "                           <div style=\'cursor: pointer\' onclick=\"show_user_info('" + user_name + "')\" class=\"user name\">\n" +
        "                               <img class=\"user-avatar\" src=\"../static/img/avatar1.png\">\n";
    var html_code2 = '';
    if (name === ""){
        html_code2 ="<span class=\"user-name-text user-margin-right user-name\">کاربر شماره </span>\n" +
        "            <span id=\'" + user_name + "\' class=\"user-name-text user-name\">" + user_id + "</span>\n";
    }
    else
    {
        html_code2 = "<span id=\'" + user_name + "\' class=\"user-name-text user-margin-right user-name\">" + name + "</span>\n";
    }

    var html_code3 =" <span id=\'device" + user_name + "\' style=\"display: none\" class=\"user-name-text user-margin-right user-name\">" + device_name + "</span>\n" +
        "                           </div>\n" +
        "                            <div class=\"user status\">\n" +
        "                                <span id=\'" + user_name + "status\' class=\"user-name-text user-status\">" + status + "</span>\n" +
        "                            </div>\n" +
        "                            <div class=\"user block-user\">\n" +
        "                                <!--<span class=\\\"user-name-text\\\">بلاک</span>-->\n" +
        "                                <input onclick=\"add_to_block_user('" + user_name + "')\" type=\"image\" class=\"fit-icon\"  value=\"delete\" src=\"../static/img/delete.svg\">\n" +
        "                            </div>\n" +
        "                        </div>";
    $('#all-online-users').append(html_code1 + html_code2 + html_code3);
    var userstatus = document.getElementById(user_name + "status");
    userstatus.innerHTML = status;
}

function delete_online_user(user_name) {
    var user_id = "user" + user_name;
    $("div").remove("#" + user_id);
}

function get_online_users() {
    var loc = window.location;
    var wsStart = 'ws://';
    if(loc.protocol === 'https:') wsStart = 'wss://';
    var endpoint = wsStart + loc.host + "/admin/get/online/users/";
    var socket = new WebSocket(endpoint);
    socket.onmessage = function(e) {
        var json_data = JSON.parse(e.data);
        console.log(json_data.type);
        if(json_data.type !== 'websocket.disconnect') {
            var src = json_data.src;
            var dst = json_data.destination;
            var user_id = json_data.user_id;
            var username = json_data.username;
            if(src === "admin" && dst === "admin_offline_user"){
                disappear_user(username)
            }
            else {
                var device_name = json_data.device_name;
                var status = json_data.status;
                var name = json_data.name;
                if (document.getElementById("user" + username) === null && src === "menu" && dst === "admin")
                    add_online_users(username, status, user_id, device_name, name);

            }
        }
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

get_online_users();


function show_order(order_id, price, table_number){
    var host ="http://" +  window.location.host;
    var html_code = "<tr id=\'" + order_id + "\'>\n" +
        "                            <td style='text-align: right'>\n" +
        "                                <span>میز شماره </span>\n" +
        "                                <span>" + table_number + "</span>\n" +
        "                                <span> ، </span>\n" +
        "                                <span>" + price + "</span>\n" +
        "                                <span> تومان</span>\n" +
        "                            </td>\n" +
        "                            <td>پرداخت شده</td>\n" +
        "                            <td>\n" +
        "                                <a class=\"admin-text-link\" href=\'"+ host + "/admin/show/invoice/order_id=" + order_id + "\'>مشاهده جزئیات</a>\n" +
        "                            </td>\n" +
        "                            </tr>";
    $('#all-orders').append(html_code);
}

function hide_order(order_id) {
    var order = document.getElementById('pos-order' + order_id);
    order.classList.add('delete-anim');
    window.setTimeout(function () {order.style.display = 'none'}, 600);
    return true;
}

function get_orders(){
    var loc = window.location;
    var wsStart = 'ws://';
    if(loc.protocol === 'https:') wsStart = 'wss://';
    var endpoint = wsStart + loc.host + "/admin/get/orders/";
    var socket = new WebSocket(endpoint);
    socket.onmessage = function(e) {
        var json_data = JSON.parse(e.data);
        console.log("message", e);
        if(json_data.type !== 'websocket.disconnect') {
            var dest = json_data.destination;
            var src = json_data.src;
            var order_id = json_data.order_id;
            if(src === "payment" && dest === "admin") {
                if (order_id !== 'no_order') {
                    var user_name = json_data.user_name;
                    var received_user_status = json_data.status;
                    var table_number = json_data.table_number;
                    document.getElementById(user_name + "status").innerHTML = received_user_status;
                    var price = json_data.price;
                    show_order(order_id, price, table_number);
                }
            }
            else if(src === "admin" && dest === "kitchen"){
                hide_order(order_id);
            }
        }
    };
    socket.onopen = function (e) {
        document.onclick = function (event) {
            event = event || window.event;
            event = event.target || event.srcElement;
            if(event.nodeName === "INPUT"){
                if(event.id.indexOf("order") === 0){
                    var data = {
                        'order_id': event.id,
                        'src' : 'admin',
                        'destination': 'kitchen'
                    };
                    socket.send(JSON.stringify(data));
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

get_orders();

function delete_item_forever(url, food_id) {
    var method = "GET";
    var data = {"food_id" : food_id};
    $.ajax({
                   url : url ,
                   method : method ,
                   data : data ,
                   success: function (response) {
                       console.log(response);
                       if(response === 'True'){
                           console.log("Ok");
                           cancel_deleting();
                           delete_food(food_id);
                           window.setTimeout(function () {window.location.href = redirect_url;}, 800)
                       }
                       else {
                           alert("متاسفانه مشکلی در ارسال اطلاعات به سرور اتفاق افتاده است. لطفا دوباره تلاش کنید.")
                           console.log("hello");
                       }
                   } ,
                   error:function () {
                       alert("Ooooops");
                   }
               });
    return true

}

function delete_comment(comment_id, url, comment_type, redirect_url) {
    var method = "GET";
    var data = {"comment_id" : comment_id};
    delete_comment_anim(comment_id, comment_type);
  //  var num_comment = document.getElementById('num-comment');
   // num_comment.innerHTML = parseInt(num_comment.innerHTML) - 1;
    $.ajax({
                   url : url,
                   method : method ,
                   data : data ,
                   success: function (response) {
                       console.log(response);
                       if(response === 'True'){
                           console.log("Ok");
                       }
                       window.location.href = redirect_url;
                   } ,
                   error:function () {
                       alert("Ooooops");
                   }
               });
}

function comment_move_to_trash(comment_id, url, comment_type, redirect_url, redirect) {
    var method = "GET";
    var data = {"comment_id" : comment_id, 'type' : comment_type};
    delete_comment_anim(comment_id, comment_type);
  //  var num_comment = document.getElementById('num-comment');
   // num_comment.innerHTML = parseInt(num_comment.innerHTML) - 1;
    $.ajax({
                   url : url,
                   method : method ,
                   data : data ,
                   success: function (response) {
                       console.log(response);
                       if(response === 'True'){
                           console.log("Ok");
                       }
                       if(redirect)
                       window.location.href = redirect_url;
                   } ,
                   error:function () {
                       alert("Ooooops");
                   }
               });
}

function confirm_comment(comment_id, send_url, redirect_url) {
    var method = "GET";
    var data = {"comment_id" : comment_id};
    $.ajax({
                   url : send_url,
                   method : method ,
                   data : data ,
                   success: function (response) {
                       console.log(response);
                       if(response === 'True'){
                           console.log("Ok");
                       }
                       window.location.href = redirect_url;
                   } ,
                   error:function () {
                       alert("Ooooops");
                   }
               });
}

function recycle_comment(comment_id, send_url, redirect_url) {
    var method = "GET";
    var data = {"comment_id" : comment_id};
    $.ajax({
                   url : send_url,
                   method : method ,
                   data : data ,
                   success: function (response) {
                       console.log(response);
                       if(response === 'True'){
                           console.log("Ok");
                       }
                       window.location.href = redirect_url;
                   } ,
                   error:function () {
                       alert("Ooooops");
                   }
               });
}

function validate_image(file_name) {
    var allowed_extensions = ["jpg", "jpeg", "png", "gif"];
    var file_extension = file_name.split('.').pop().toLowerCase(); // split function will split the filename by dot(.), and pop function will pop the last element from the array which will give you the extension as well. If there will be no extension then it will return the filename.

    for(var i = 0; i <= allowed_extensions.length; i++)
    {
        if(allowed_extensions[i]===file_extension)
        {
            return true; // valid file extension
        }
    }

    return false;

}

function form_validation(){
    var exist_error = false;
    var form = document.forms["add_food_form"];
    var food_name = form["food_name"].value;
    var food_cat = form["category"].value;
    var food_price = form['food_price'].value;
    var food_picture = form['file'].value;
    var show_error = document.getElementById('show-error');
    if(food_name.length === 0 || food_name.trim().length === 0 ){
        var name_error = document.getElementById('food-name-error');
        name_error.style.display = "block";
        exist_error = true;
    }
    if (food_cat.indexOf("----") !== -1) {
        var cat_error = document.getElementById('category-error');
        cat_error.style.display = "block";
        exist_error = true;
    }
    if(isNaN(parseInt(food_price))){
        var price_error = document.getElementById('price-error');
        price_error.style.display = "block";
        exist_error = true;
    }
    var file_error = document.getElementById('invalid-format-error');
    var no_file_error = document.getElementById('no-selected-file-error');
    if(food_picture === ""){
        file_error.style.display = 'none';
        no_file_error.style.display = "block";
        exist_error = true;
    }
    else {
        if(!validate_image(food_picture)){
            no_file_error.style.display = 'none';
            file_error.style.display = "block";
            exist_error = true;
        }
    }
    if(exist_error){
        show_error.style.display = "block";
        window.scrollTo(0, 0);
        return false
    }
}

function edit_form_validation() {
    var exist_error = false;
    var form = document.forms["edit_food_form"];
    var food_name = form["food_name"].value;
    var food_cat = form["category"].value;
    var food_price = form['food_price'].value;
    var food_picture = form['file'].value;
    var show_error = document.getElementById('show-error');
    if(food_name.length === 0 || food_name.trim().length === 0 ){
        var name_error = document.getElementById('food-name-error');
        name_error.style.display = "block";
        exist_error = true;
    }
    if (food_cat.indexOf("----") !== -1) {
        var cat_error = document.getElementById('category-error');
        cat_error.style.display = "block";
        exist_error = true;
    }
    if(isNaN(parseInt(food_price))){
        var price_error = document.getElementById('price-error');
        price_error.style.display = "block";
        exist_error = true;
    }
    var file_error = document.getElementById('invalid-format-error');
    if(food_picture !== ""){
        if(!validate_image(food_picture)){
            file_error.style.display = "block";
            exist_error = true;
        }
    }
    if(exist_error){
        show_error.style.display = "block";
        window.scrollTo(0, 0);
        return false
    }
}

function cat_form_validation() {
    var exist_error = false;
    var form = document.forms["add-cat-form"];
    var cat_name = form["cat_name"].value;
    var cat_picture = form['file'].value;
    if(cat_name.length === 0 || cat_name.trim().length === 0 ){
        var name_error = document.getElementById('cat-name-error');
        name_error.style.display = "block";
        exist_error = true;
    }
    var file_error = document.getElementById('invalid-format-error');
    var no_file_error = document.getElementById('no-selected-file-error');
    if(cat_picture === ""){
        file_error.style.display = 'none';
        no_file_error.style.display = "block";
        exist_error = true;
    }
    else {
        if(!validate_image(cat_picture)){
            no_file_error.style.display = 'none';
            file_error.style.display = "block";
            exist_error = true;
        }
    }
    if(exist_error){
        window.scrollTo(0, 0);
        return false
    }
}

function cat_edit_form_validation() {
    var exist_error = false;
    var form = document.forms["edit-cat-form"];
    var cat_name = form["cat_name"].value;
    var cat_picture = form['file'].value;
    if(cat_name.length === 0 || cat_name.trim().length === 0 ){
        var name_error = document.getElementById('cat-name-error');
        name_error.style.display = "block";
        exist_error = true;
    }
    var file_error = document.getElementById('invalid-format-error');
    if(cat_picture !== ""){
        if(!validate_image(cat_picture)){
            file_error.style.display = "block";
            exist_error = true;
        }
    }
    if(exist_error){
        window.scrollTo(0, 0);
        return false
    }
}
function show_or_hide_error(element, error_id, number) {
    var cat = document.getElementById("all-categories").value;
    var edit_category = document.getElementById("edit-category");
    var delete_category = document.getElementById("delete-category");
    if(cat.indexOf("---") === -1) {
        if (edit_category.classList.contains("opacity")) {
            edit_category.classList.remove("opacity");
        }
        if (delete_category.classList.contains("opacity")) {
            delete_category.classList.remove("opacity");
        }
    }
    else{
        edit_category.classList.add("opacity");
        delete_category.classList.add("opacity");
        }

    var error = document.getElementById(error_id);
    if(number){
        if(isNaN(parseInt(element.value))){
            error.style.display = "block";
        }
        else {
            error.style.display = "none";
        }
    }
    else {
        if (element.value.indexOf("----") === -1) {
            if (element.value.trim().length !== 0) {
                error.style.display = "none";
            }
            else {
                error.style.display = "block";
            }
        }
        else {
            error.style.display = "block";
        }
    }
}

function add_file_input_to_html(file_id) {

    var html_code = "<div class=\"row\">\n" +
        "        <label class=\"label-text\">انتخاب تصویر </label><span>* :</span>\n" +
        "        <input name=\"add-file" + file_id + "\" type=\"file\" class=\"input file-input\" /><br />\n" +
        "        <span id=\"no-selected-file-error" + file_id + "\" style=\"display: none\" class=\"error margin-right\">* لطفا تصویری برای غذا انتخاب کنید.(فرمت های مجاز: jpeg, jpg, png, gif)</span><br />\n" +
        "        <span id=\"invalid-format-error" + file_id + "\" style=\"display: none\" class=\"error margin-right\">* فرمت تصویر انتخاب شده مجاز نیست. فرمت های مجاز: jpeg, jpg, png, gif</span>\n" +
        "    </div>";
    $("#all-media").append(html_code);
}


function add_media() {
    var num_file = document.getElementsByClassName("file-input").length;
    add_file_input_to_html(parseInt(num_file)+1);


}

function disappear_picture(picture_id) {
    var picture = document.getElementById("picture" + picture_id);
    var input = document.getElementById("pos-input" + picture_id);
    picture.classList.add("delete-anim");
    window.setTimeout(function () {picture.style.display = "none";
    input.style.display = "none";}, 900);


}

function delete_picture(url, picture_id) {
    var method = "GET";
    var data = {"picture_id" : picture_id};
    $.ajax({
                   url : url ,
                   method : method ,
                   data : data ,
                   success: function (response) {
                       console.log(response);
                        disappear_picture(picture_id);
                   } ,
                   error:function () {
                       alert("Ooooops");
                   }
               });


}
