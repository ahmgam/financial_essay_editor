from django.shortcuts import render
from django.http import HttpResponse,JsonResponse
import requests
# Create your views here.
def index (request):
    return render(request, 'edit/edit.html')

def preview_chart(request):
    
    start_date,end_date,ticker,stock=""
    if request.GET.__contains__('start_date') : start_date=request.GET.get('start_date')
    if request.GET.__contains__('end_date') : end_date=request.GET.get('end_date')
    if request.GET.__contains__('ticker') : ticker=request.GET.get('ticker')
    if request.GET.__contains__('stock') : stock=request.GET.get('stock')
    
    return JsonResponse(getData(start_date,end_date,stock,ticker),safe=False)
    
def getData(start_date,end_date,stock,ticker):
    res={}
    if ticker=="" and stock=="":
        res = {'error':'please enter ticker symbol'}

    if ticker!="" and stock=="":
        if start_date =="" and end_date =="": 
            # get the latest data 
            r = 'http://api.marketstack.com/v1/intraday/latest?access_key=27f1205b8dcf44c54526e45b80a7b8f0&symbols='+ticker
            res=processData (r)
        if start_date=="" and end_date!="":
            # get for end date only
            r = 'http://api.marketstack.com/v1/intraday/'+end_date+'?access_key=27f1205b8dcf44c54526e45b80a7b8f0&symbols='+ticker
            res=processData (r)
        if end_date=="" and start_date!="":
            # get for start date only
            r = 'http://api.marketstack.com/v1/intraday/'+start_date+'?access_key=27f1205b8dcf44c54526e45b80a7b8f0&symbols='+ticker
            res=processData (r)
        if end_date!="" and start_date!="":
            # get for the entire period
            r = 'http://api.marketstack.com/v1/eod/?access_key=27f1205b8dcf44c54526e45b80a7b8f0&symbols='+ticker+'&date_from='+start_date+'&date_to='+ end_date
            res=processData (r)
        
    return res

def processData (route):
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

    totalData={'cData':candleData , 'vData':lineData}
    return totalData
    


# needed data
# mode = {eod , intraday}
# start_date
# end_date
# ticker
# stock
