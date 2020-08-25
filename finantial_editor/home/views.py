from django.shortcuts import render, redirect
from django.views.generic.list import ListView
from django.views.generic.edit import CreateView
from editor.models import BlogContent
from django.contrib.auth.models import User
from django.urls import reverse_lazy
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.views import LogoutView,LoginView
# Create your views here.
class ArticleView (ListView):
    model= BlogContent
    template_name="home/blogcontent_list.html"

class SignUp (CreateView):
    form_class = UserCreationForm
    template_name="registration/user_create.html"
    success_url=reverse_lazy('login')

class logoutView (LogoutView):
    next_page=reverse_lazy('home')

class loginView(LoginView):
    success_url=reverse_lazy('home')
    
    

