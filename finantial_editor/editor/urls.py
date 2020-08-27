
from django.urls import path, re_path
from . import views
#APP_NAME="editor"
urlpatterns = [
path('chart_preview/', views.preview_chart),
path('edit/<str:pk>/', views.index),
path('edit/',views.createBlog,name='createBlog')

]
