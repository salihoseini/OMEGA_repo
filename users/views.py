from django.shortcuts import render
from django.contrib.auth.forms import UserCreationForm

def register(request):
    #form = UserCreationForm()
    if(request.method == 'POST'):
        data = request.POST.dict()
        username = data["username"]
        email = data["email"]
        password = data["password"]
        conf_password = data["conf-password"]
        info = {
            'username' :  username ,
            'email' : email ,
            'password' : password ,
            'confPassword' : conf_password ,
        }

        return render(request=request , template_name='valid.html' , context={'info' : info})
    else:
        print("yeeeees")
        return render(request=request , template_name='register.html')
