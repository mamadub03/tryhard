from django.shortcuts import render,redirect
from django.contrib.auth.hashers import make_password
from .models import CustomUser
# Create your views here.

def index(request):
    return render(request,'index.html')

def leaderboard(request):
    return render(request,'leaderboard.html')

def login(request):
    return render(request,'login.html')

def signup(request):
    if request.method == 'POST':
        # Capture 'name', 'username', 'password1', and 'password2' from the form
        name = request.POST.get('name')
        username = request.POST.get('username')
        password1 = request.POST.get('password1')


        # Validate passwords match

        # Create and save the new user with a hashed password
        user = CustomUser(name=name, username=username)
        user.password = make_password(password1)  # Hash the password before saving
        user.save()

        return redirect('login')  # Redirect to login page after sign-up

    return render(request, 'signup.html')

def timer(request):
    return render(request,'timer.html')