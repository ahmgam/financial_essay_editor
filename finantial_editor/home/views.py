from django.shortcuts import render, redirect
from django.views.generic.list import ListView
from django.views.generic.edit import CreateView
from editor.models import BlogContent,DraftContent
from django.contrib.auth.models import User
from django.urls import reverse_lazy
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.views import LogoutView,LoginView
from django.http import HttpResponseRedirect
# Create your views here.
class ArticleView (ListView):
    model= BlogContent
    template_name="home/blogcontent_list.html"
    def get_queryset(self):
        return BlogContent.objects.filter(published=True)
    
class SignUp (CreateView):
    form_class = UserCreationForm
    template_name="registration/user_create.html"
    success_url=reverse_lazy('login')

class logoutView (LogoutView):
    next_page=reverse_lazy('home')

class loginView(LoginView):
    success_url=reverse_lazy('home')
    template_name= "registration/login.html"
    
    
def loadDash(request):
    if request.user.is_authenticated:
        myblogs = BlogContent.objects.filter(authorId=request.user.id)
        mydrafts = DraftContent.objects.filter(authorId=request.user.id)
        payload = {"blogs":myblogs,"drafts":mydrafts}
        return render(request,"home/dashboard.html",payload)
    
    return HttpResponseRedirect('home/blogcontent_list.html')

    

    
