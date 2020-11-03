
from django.urls import path, re_path
from . import views

#APP_NAME="editor"
urlpatterns = [
path('chart_preview/', views.preview_chart),
path('edit/<str:pk>/', views.index,name="editBlog"),
path('edit/',views.createBlog,name='createBlog'),
path('view/<str:pk>/',views.viewBlog,name='viewBlog'),
path('deleteBlog/<str:pk>/',views.deleteBlog,name='deleteblog'),
path('deleteDraft/<str:pk>/',views.deleteDraft,name='deletedraft'),


]
