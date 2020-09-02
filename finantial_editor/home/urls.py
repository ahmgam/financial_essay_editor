
from django.urls import path, re_path
from . import views
#APP_NAME="editor"
urlpatterns = [
path('', views.ArticleView.as_view(),name="home"),
path('dashboard/',views.loadDash,name="dashboard"),
]
