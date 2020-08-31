from django.shortcuts import render,redirect
from django.http import HttpResponse,JsonResponse,HttpResponseRedirect
from django.urls import reverse
import requests
import logging
from djongo.models.fields import ObjectId
from datetime import datetime 
import json
from bson.objectid import ObjectId
from django.contrib.auth.mixins import LoginRequiredMixin
from .models import BlogContent
from django.contrib.auth.models import User

logger = logging.getLogger(__name__)
# Create your views here.
def createBlog (request):
    user = User.objects.get(pk=request.user.id)
    blog = BlogContent.objects.create(title="draft title",content=[],draft=[],author=str(user.username),authorId=user.pk,published=False)
    authid=str(blog.pk)

    return redirect(authid+'/')

def index(request,pk):
    pk=pk.replace('/','')
    try:
        blog= BlogContent.objects.get(pk=ObjectId(pk) )
        user = User.objects.get(pk=request.user.id)
        if user.pk==blog.authorId:  
            return render(request,'editor/edit.html') 
        return HttpResponseRedirect('home/blogcontent_list.html')
    except:
        return HttpResponseRedirect('home/blogcontent_list.html')
    
    

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
    
def addArticle (request):
    data = request.data
    m = BlogContent(content=data,autorId=request.user.id)
    m.save()

# needed data
# mode = {eod , intraday}
# start_date
# end_date
# ticker
# stock
