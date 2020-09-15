from django.shortcuts import render,redirect
from django.http import HttpResponse,JsonResponse,HttpResponseRedirect
from django.urls import reverse,reverse_lazy
import requests
import logging
from djongo.models.fields import ObjectId
from datetime import datetime 
import json
from bson.objectid import ObjectId
from django.contrib.auth.decorators import login_required
from .models import BlogContent,DraftContent,ChartData
from django.contrib.auth.models import User
from django.conf import settings
from django.core.files.storage import FileSystemStorage
import random
import string
import base64
from django.views.generic.edit import DeleteView

logger = logging.getLogger(__name__)
# Create your views here.
@login_required(login_url=reverse_lazy('login')) #redirect when user is not logged in
def createBlog (request):
    user = User.objects.get(pk=request.user.id)
    blog = BlogContent.objects.create(author=str(user.username),authorId=user.pk,published=False)
    draft = DraftContent.objects.create(author=str(user.username),authorId=user.pk,ref=blog )

    return redirect(str(draft.pk)+'/')

@login_required(login_url=reverse_lazy('login')) #redirect when user is not logged in
def index(request,pk):
    pk=pk.replace('/','')
    b_type = ''
    try:
        blog= BlogContent.objects.get(pk=ObjectId(pk))
        b_type='blog'
    except:
        try:
            blog= DraftContent.objects.get(pk=ObjectId(pk))
            b_type='draft'
        except:
            return HttpResponseRedirect('home/blogcontent_list.html')
    user = User.objects.get(pk=request.user.id)
    if user.pk==blog.authorId:  
        if b_type=='blog' :
            draft = DraftContent.objects.create(author=str(user.username),authorId=user.pk,ref=blog)
            draft.content=blog.content
            return redirect(reverse('createBlog')+ str(draft.pk)+'/')
        return render(request,'editor/edit.html') 
    return HttpResponseRedirect('home/blogcontent_list.html')
    
    
@login_required(login_url=reverse_lazy('login')) #redirect when user is not logged in
def preview_chart(request):
    
    start_date,end_date,ticker,stock="","","",""
    if request.GET.__contains__('start_date') : start_date=request.GET.get('start_date')
    if request.GET.__contains__('end_date') : end_date=request.GET.get('end_date')
    if request.GET.__contains__('ticker') : ticker=request.GET.get('ticker')
    if request.GET.__contains__('stock') : stock=request.GET.get('stock')
    logger.error("LOG : start date : "+start_date + " end date : "+ end_date + " ticker : "+ ticker)
    
    try:
        s_date = datetime.strptime(start_date, '%m-%d-%Y')
        e_date = datetime.strptime(end_date, '%m-%d-%Y')
        if e_date.date()<s_date.date():
            e_date,s_date=s_date,e_date
        start_date=s_date.strftime('%Y-%m-%d')
        end_date=e_date.strftime('%Y-%m-%d')
    except ValueError:
        logger.error("Dates mismatch : start date : "+start_date + " end date : "+ end_date + " ticker : "+ ticker)
        return {"error":"unvalid date"}
    
    return JsonResponse(getData(start_date,end_date,stock,ticker),safe=False)
    
@login_required(login_url=reverse_lazy('login')) #redirect when user is not logged in
def create_chart(request):
    
    start_date,end_date,ticker,stock="","","",""
    if request.GET.__contains__('start_date') : start_date=request.GET.get('start_date')
    if request.GET.__contains__('end_date') : end_date=request.GET.get('end_date')
    if request.GET.__contains__('ticker') : ticker=request.GET.get('ticker')
    if request.GET.__contains__('stock') : stock=request.GET.get('stock')
    logger.error("LOG : start date : "+start_date + " end date : "+ end_date + " ticker : "+ ticker)
    
    try:
        s_date = datetime.strptime(start_date, '%m-%d-%Y')
        e_date = datetime.strptime(end_date, '%m-%d-%Y')
        if e_date.date()<s_date.date():
            e_date,s_date=s_date,e_date
        start_date=s_date.strftime('%Y-%m-%d')
        end_date=e_date.strftime('%Y-%m-%d')
    except ValueError:
        logger.error("Dates mismatch : start date : "+start_date + " end date : "+ end_date + " ticker : "+ ticker)
        return {"error":"unvalid date"}
    data = getData(start_date,end_date,stock,ticker)
    chart = ChartData.objects.create(data=data)
        
    return JsonResponse(json.dump({"id":str(chart.pk)}),safe=False)

@login_required(login_url=reverse_lazy('login')) #redirect when user is not logged in
def getData(start_date,end_date,stock,ticker):
    res=[]
    
    if ticker=="" and stock=="":
        res = {'error':'please enter ticker symbol'}
    if ticker!="" and stock=="":
        if start_date =="" and end_date =="": 
            # get the latest data 
            r = 'http://api.marketstack.com/v1/intraday/latest?access_key=27f1205b8dcf44c54526e45b80a7b8f0&symbols='+ticker
            res=processData (r)
        if start_date=="" and end_date!="":
            # get for end date only
            r = 'http://api.marketstack.com/v1/intraday/'+end_date+'T00:00:00+0000?access_key=27f1205b8dcf44c54526e45b80a7b8f0&symbols='+ticker
            res=processData (r)
        if end_date=="" and start_date!="":
            # get for start date only
            r = 'http://api.marketstack.com/v1/intraday/'+start_date+'T00:00:00+0000?access_key=27f1205b8dcf44c54526e45b80a7b8f0&symbols='+ticker
            res=processData (r)
        if end_date!="" and start_date!="":
            # get for the entire period
            r=""
            if end_date==start_date:
                r = 'http://api.marketstack.com/v1/intraday/'+start_date+'T00:00:00+0000?access_key=27f1205b8dcf44c54526e45b80a7b8f0&symbols='+ticker
            else : 
                 r = 'http://api.marketstack.com/v1/eod/?access_key=27f1205b8dcf44c54526e45b80a7b8f0&symbols='+ticker+'&date_from='+start_date+'T00:00:00+0000&date_to='+ end_date+'T00:00:00+0000&sort=ASC'

            res=processData (r)
        
    return res

def processData (route):
    logger.error(route)
    candleData = []
    lineData=[]
    offset = 0
    while (True):
        rawData = requests.get(route + '&offset=' +str(offset)).json()
        if "error" in rawData:
            return "error: " + rawData["error"]["message"]
        totalData = int(rawData['pagination']['total'])
        batchSize = int(rawData['pagination']['count'])
        requestOffset = int(rawData['pagination']['offset'])
        for d in rawData['data']:
            x = {'x':d['date'] , 'y': [d['open'],d['high'],d['low'],d['close']]}
            candleData.append(x)
            z = [d['date'],d['volume']]
            lineData.append(z)

        if (totalData - (batchSize + requestOffset)) <= 0:
            break
        offset = int(rawData['pagination']['offset']) + batchSize

    totalData={'cData': candleData , 'vData':lineData}
    totalData = json.dumps(totalData)

    return totalData

@login_required(login_url=reverse_lazy('login')) #redirect when user is not logged in
def image_upload(request):
    if request.method == 'POST' :
        
        myfile = json.dumps(request.POST)['imgdata']
        myfile=base64.decodebytes(myfile)
        name = lambda : ''.join(random.choice(string.ascii_lowercase) for i in range(15))
        fs = FileSystemStorage()
        filename = fs.save(name+'.jpg', myfile)
        uploaded_file_url = fs.url(filename)
        return JsonResponse(json.dumps({"message":"success","url":uploaded_file_url}))
    return JsonResponse(json.dumps({"message":"error"}))

def viewBlog(request,pk):
    pk=pk.replace('/','')
    b_type = ''
    try:
        blog =BlogContent.objects.get(pk=ObjectId(pk))
    except:
        try:
            blog= BlogContent(DraftContent.objects.get(pk=ObjectId(pk)).ref)
        except:
            return HttpResponseRedirect('home/blogcontent_list.html')
    if blog.published==False:
        return HttpResponseRedirect('home/blogcontent_list.html')
    mydata = list(blog.content)
    for block in mydata:
        if block['type']=='chart':
            chartdata = ChartData.objects.get(pk=ObjectId(block['content']['chartid']))
            block['content']['data']=chartdata.data
    payload = {"title":blog.title,"content":mydata}
    
    return render(request,"home/view.html",payload)

@login_required(login_url=reverse_lazy('login')) #redirect when user is not logged in
def deleteBlog(request,pk):
    pk = str(pk).replace("/","")
    try:
        blog=BlogContent.objects.get(pk=ObjectId(pk))
        if blog.authorId==request.user.id:
            blog.delete()
        else :
            return HttpResponseRedirect("home/dashboard.html")
    except:
        return HttpResponseRedirect("home/dashboard.html")

@login_required(login_url=reverse_lazy('login')) #redirect when user is not logged in
def deleteDraft(request,pk):
    pk = str(pk).replace("/","")
    try:
        blog=DraftContent.objects.get(pk=ObjectId(pk))
        if blog.authorId==request.user.id:
            blog.delete()
        else :
            return HttpResponseRedirect("home/dashboard.html")
    except:
        return HttpResponseRedirect("home/dashboard.html")
# needed data
# mode = {eod , intraday}
# start_date
# end_date
# ticker
# stock
