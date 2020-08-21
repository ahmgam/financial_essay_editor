#from django.db import models
from djongo import models
# Create your models here.


class BlogContent(models.Model):
    content = models.TextField()
    authorId = models.CharField(max_length=100)    
    class Meta:        
        app_label = 'article'