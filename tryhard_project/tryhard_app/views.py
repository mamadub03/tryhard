from django.shortcuts import render,redirect
from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password
from django.contrib.auth import authenticate, login as auth_login
import json
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from .models import CustomUser
from django.template.loader import get_template
# Create your views here.


# @login_required


def index(request):
    return render(request,'index.html')



def lb(request):
    users = CustomUser.objects.order_by('-total_time')
    return render(request, 'lb.html', {'users': users})

def login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        next_url = request.POST.get('next', '/timer/')  # Default to '/dashboard/'


        # Fetch the user from the database
        try:
            user = CustomUser.objects.get(username=username)
            
        except CustomUser.DoesNotExist:
            print('not found')
            return render(request, 'login.html', {'error': 'Invalid username or password'})
        
       
        print("Password from form:", password)
        print("Password hash from DB:", user.password)
        print("Password check result:", check_password(password, user.password))
        # # Check if the password is correct using check_password
        # print("Session before login:", request.session.get('username'))
        if check_password(password.strip(),user.password):  # Compare plain password with hashed password
            # Set session variables to indicate the user is logged in
            # request.session['user_id'] = user.id
            print("Session after login:", request.session.get('username'))
            request.session['username'] = user.username
            return render(request, 'timer.html',{'username':request.session.get('username')})
  # Redirect to the dashboard or next URL
        else:
            
            print('bad login')
            

            print(password)
            print(user.password)

            # Return an error message if the password is incorrect
            return render(request, 'login.html', {'error': 'Invalid username or password'})

    return render(request, 'login.html',{'username':request.session.get('username')})

def signup(request):
    if request.method == 'POST':
        # Capture 'name', 'username', 'password1', and 'password2' from the form
        name = request.POST.get('name')
        username = request.POST.get('username')
        password1 = request.POST.get('password1')


        # Validate passwords match

        # Create and save the new user with a hashed password
        user = CustomUser(name=name, username=username)
        user.password = password1  # Hash the password before saving
        user.save()

        return redirect('login')  # Redirect to login page after sign-up

    return render(request, 'signup.html')

def save_session(request):
    if request.method == 'POST':
        print(request.body)
        try:
            data = json.loads(request.body)
            username = request.session.get('username')
            duration = data.get('duration', 0)

            print(duration)
            print(username)

            if username:

                print("Session in save_session:", request.session.get('username'))
                user = CustomUser.objects.get(username=username)

                user.total_time += duration
                print(user.total_time)
                
                user.save()
                
                return JsonResponse({'status': 'success', 'duration': duration})
            else:
                return "couldnt find"
        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON'}, status=400)
    else:
        return JsonResponse({'status': 'error', 'message': 'Only POST method is allowed'}, status=405)
    


    

def timer(request):
    return render(request,'timer.html')