from django.shortcuts import render
from django.http import HttpResponse
import requests
# Create your views here.

def preview_chart(request):
    
    mode,start_date,end_date,ticker,stock=""
    if request.GET.__contains__('mode') : mode=request.GET.get('mode')
    if request.GET.__contains__('start_date') : start_date=request.GET.get('start_date')
    if request.GET.__contains__('end_date') : end_date=request.GET.get('end_date')
    if request.GET.__contains__('ticker') : ticker=request.GET.get('ticker')
    if request.GET.__contains__('stock') : stock=request.GET.get('stock')








    if request.GET.__contains__('test') : 
       return HttpResponse("test is ="+ str(request.GET.get('test','')))
    else :return HttpResponse("no test data")
    
def getData(mode,start_date,end_date,stock,ticker):

        if mode == "eod" or mode == "intraday":
            if ticker!="" and stock=="":
                if start_date =="" and end_date =="": 
                    # get the latest data 
                    r = requests.get('https://api.marketstack.com/v1/'+mode+'/latest?access_key=27f1205b8dcf44c54526e45b80a7b8f0&symbols='+ticker)
                if start_date=="" and end_date!="":
                    # get for end date only
                    r = requests.get('https://api.marketstack.com/v1/'+mode+'/'end_date'?access_key=27f1205b8dcf44c54526e45b80a7b8f0&symbols='+ticker)

                if end_date=="" and start_date!="":
                    # get for start date only
                    r = requests.get('https://api.marketstack.com/v1/'+mode+'/'start_date'?access_key=27f1205b8dcf44c54526e45b80a7b8f0&symbols='+ticker)

                if end_date!="" and start_date!="":
                    # get for the entire period
                    r = requests.get('https://api.marketstack.com/v1/'+mode+'/?access_key=27f1205b8dcf44c54526e45b80a7b8f0&symbols='+ticker+'&date_from='+start_date+'&date_to='+ end_date)

            
            if ticker=="" and stock!="":
                if start_date =="" and end_date =="": 
                    # get the latest data 
                    r = requests.get('https://api.marketstack.com/v1/exchanges/'+stock+'/'+mode+'/latest?access_key=27f1205b8dcf44c54526e45b80a7b8f0)
                if start_date=="" and end_date!="":
                    # get for end date only
                    r = requests.get('https://api.marketstack.com/v1/exchanges/'+stock+'/'+mode+'/'+ end_date+'?access_key=27f1205b8dcf44c54526e45b80a7b8f0')
                if end_date=="" and start_date!="":
                    # get for start date only
                    r = requests.get('https://api.marketstack.com/v1/exchanges/'+stock+'/'+mode+'/'+ start_date+'?access_key=27f1205b8dcf44c54526e45b80a7b8f0')
                if end_date!="" and start_date!="":
                    # get for the entire period
                    r = requests.get('https://api.marketstack.com/v1/exchanges/'+stock+'/'+mode+'/'+ end_date+'?access_key=27f1205b8dcf44c54526e45b80a7b8f0')

            if ticker=="" and stock=="":
                #throw error

        else :
            #throw mode error


# needed data
# mode = {eod , intraday}
# start_date
# end_date
# ticker
# stock

