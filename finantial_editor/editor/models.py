#from django.db import models
from djongo import models
# Create your models here.


class BlogContent(models.Model):
    _id = models.ObjectIdField()
    title=models.CharField(max_length=100,null=False,default="blank title")
    content = models.JSONField(default=[])
    author=models.CharField(max_length=100)
    authorId = models.IntegerField(max_length=6)    
    published= models.BooleanField(default=False)
    createdAt = models.DateTimeField(auto_now=True)
    modifiedAt= models.DateTimeField(auto_now_add=True)
    class Meta:        
        app_label = 'article'

class DraftContent(models.Model):
    _id = models.ObjectIdField()
    title=models.CharField(max_length=100,null=False,default="blank title")
    content = models.JSONField(default=[])
    ref = models.ForeignKey(BlogContent,on_delete=models.SET_NULL)
    author=models.CharField(max_length=100)
    authorId = models.IntegerField(max_length=6)    
    createdAt = models.DateTimeField(auto_now=True)
    modifiedAt= models.DateTimeField(auto_now_add=True)
    class Meta:        
        app_label = 'article'

class ChartData (models.Model):
    data= models.JSONField()
    article = models.ForeignKey(BlogContent,on_delete=models.CASCADE)
    class Meta:        
        app_label = 'article'