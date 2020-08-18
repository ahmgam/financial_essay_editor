
from django.urls import path, re_path
from . import views
#APP_NAME="editor"
urlpatterns = [
re_path('chart_preview/', views.preview_chart),
re_path('', views.index),

]
