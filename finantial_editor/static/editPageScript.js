/*
Id notations : 
every Id consist of : 
1- "E" in the begining
2- number of item , the E and the number is the id of the whole element
3- last 2 charachters distinguishes the element components as following :
- "ME" : main edit area
- "Mp" : main preview area
- "DD" : donne button div
- "IP" : initial preview div
- "PA" : preview area div
- "ED" : edit buttons div
- "EB" : edit button 
- "DB" : delete button
- "SB" : done editing button
- "Tx" : textarea of text block
- "BI" : Browse button input 
- "MC" : main table creation div
- "RT" : input of rows number of table
- "CT" : input of columns number of table
- "CB" : Create button
- "TE" : table edit div
- "TP" : table preview div
- "TB" : table
- "TS" : ticker select
- "DF" : start date of ticker data
- "DT" : end date of ticker data
- "CC" : candles chart
- "VC" : volume chart

Stored data shape :
- for text blocks :
{'id' : number,
  'type':'text',
  'content': HTML_Content}

- for image block :
{'id': number,
'type': 'image',
'content':URL}

- for table blocks : 
{'id': number,
'type':'table',
'content':{
  'rows':number,
  'cols':number,
  'values':[n, n ,...]}

- for chart :
  {'id': number,
'type': 'chart',
'content':{
  'datefrom': Date,
  'dateto': Date,
  'ticker': ticker,
  'chartid': ChartData.id (null for draft)
}}
*/
var tickers = [['Microsoft Corp',  'MSFT'],
[ 'Apple Inc',  'AAPL'],
['Amazoncom Inc', 'AMZN'],
[ 'Alphabet Inc Class C',  'GOOG'],
['Alphabet Inc Class A', 'GOOGL'],
['Facebook Inc',  'FB'],
[ 'Vodafone Group Public Limited Company','VOD'],
['Intel Corp', 'INTC']];

document.addEventListener('input', function (event) {
	// Only run if the change happened in the #editor
    var event_id=String (event.target.id);
    var myId=event_id.substring(0,event_id.length-2);
    if (event_id.endsWith("TX")==true)
    {
      var compiled = document.querySelector('#'+String(myId+"IP"));
      compiled.innerHTML = marked(String(event.target.value), { sanitize: true });
    }
    

}, false);

function titleEdit()
{
  document.getElementById("title_input").style.display="block";
  document.getElementById("title").style.display="none";
  document.getElementById("title_done").style.display="block";
  document.getElementById("title_edit").style.display="none";
}
function titleDone()
{
  
  d=document.getElementById("title_input");
  c=document.getElementById("title");
  if (d.value=="")
  {
    window.alert("title cannot be empty");
    return;
  }

  d.style.display="none";
  c.style.display="block";
  c.value=d.value;
  document.getElementById("title_done").style.display="none";
  document.getElementById("title_edit").style.display="block";
  var resp = {"message":"save title","data":String(d.value)};
  chatSocket.send(JSON.stringify(resp));
}
function autoheight(x) {
    x.style.height = "5px";
    x.style.height = (15+x.scrollHeight)+"px";
  }
    /*
function mEnter(m)
    {
        //window.alert(m.getAttribute("id"));
        var x = document.getElementById(m.getAttribute("id")+"ED");
        x.style.display = "block";
        var y = document.getElementById(m.getAttribute("id")+"DD");
        y.style.display = "block";


    }
    function mLeave(m)
    {
        //window.alert(m.getAttribute("id"));
        var x = document.getElementById(m.getAttribute("id")+"ED");
        x.style.display = "none";
        var y = document.getElementById(m.getAttribute("id")+"DD");
        y.style.display = "none";
  
    }
   */
function createTable(m)
{
  var myid=String (m.getAttribute("id"));
  var id=myid.substring(0,myid.length-2);
  var tableRows =document.getElementById(id+"RT").value;
  var tableCols =document.getElementById(id+"CT").value;
  if (tableRows=="" || tableCols=="")
  {
    window.alert("please enter number of rows and columns correctly");
    return;
  }
  tableCols=parseInt(tableCols);
  tableRows=parseInt(tableRows);
  var myTable = document.createElement("TABLE");
  var myTableHeader = document.createElement("thead");
  var myTableBody = document.createElement("tbody");
  
  myTable.className="table";
  for (var i = 1 ; i< tableRows+1;i++)
  {
    var myRow = document.createElement("TR");
    for (var j = 1 ; j< tableCols+1; j++)
    {
      var myCol ;
      if (i==1 || j==1)
      {
        myCol= document.createElement("TH");
        myCol.setAttribute("scope","row");
      }
      else {myCol= document.createElement("TD");}
      var tableInput = document.createElement("input");
      tableInput.id = id+ "T"+ String(i) + ":" + String(j);
      tableInput.style.border="none";
      tableInput.style.resize="none";
      tableInput.type="text";
      if (i==1)
      {

      }

      if (j==1)
      {
        
      }
      myCol.appendChild(tableInput);
      myRow.appendChild(myCol);
    }
    if (i==1)
    {
      myRow.setAttribute("scope","col");
      myTableHeader.appendChild(myRow);
    }
    else {myTableBody.appendChild(myRow);}
  }
  myTable.appendChild(myTableHeader);
  myTable.appendChild(myTableBody);
  var tableEditArea = document.getElementById(id+"TE");
  tableEditArea.appendChild(myTable);
  var createArea = document.getElementById(id+"MC");
  createArea.style.display="none";
  var editArea = document.getElementById(id+"ME");
  editArea.style.display="block";
  
}
function editBlock(m)
    {
        var myid=String (m.getAttribute("id"));
        var id=myid.substring(0,myid.length-2);
        var x = document.getElementById(id+"MP");
        x.style.display = "none";
        var y = document.getElementById(id+"ME");
        y.style.display = "block";
    }

function deleteBlock(m)
    {
        var myid=String (m.getAttribute("id"));
        var id=myid.substring(0,myid.length-2);
        var x = document.querySelector("#"+id);
        var resp = {"message":"delete block","data":{"id":id.substring(1)}};
        chatSocket.send(JSON.stringify(resp));
        x.remove();
    }

function doneBlock(m)
    {
        var myid=String (m.getAttribute("id"));
        var id=myid.substring(0,myid.length-2);
        var mode=String (document.getElementById(id).getAttribute("data"));
        if (mode=="text")
        {
        var id=myid.substring(0,myid.length-2);
        var content = document.getElementById(id+"IP");
        if (content.innerHTML==""){window.alert("you shold write something before saving it"); return;}
        var x = document.getElementById(id+"ME");
        x.style.display = "none";
        var y = document.getElementById(id+"MP");
        y.style.display = "block";
        
        var prev = document.getElementById(id+"PA");
        prev.innerHTML= content.innerHTML;
        var d = document.querySelector("#"+id+"ME");
        d.style.display="none";
        var resp = {"message":"save draft","data":{"id": id.substring(1),"type":"text","content":String(document.getElementById(id+"PA").innerHTML).replace(/"/g, "'")}};
        chatSocket.send(JSON.stringify(resp));
        }
        if (mode=="image")
        {
          var id=myid.substring(0,myid.length-2);

          var content = document.getElementById(id+"BI");
          var prev = document.getElementById(id+"PA");
          var img = document.createElement("img");
          var fReader = new FileReader();
          fReader.readAsDataURL(content.files[0]);
          
          //img.setAttribute("src",content.value);
          if (prev.childElementCount==1){prev.firstChild.remove();}
          fReader.onloadend = function(event){img.src = event.target.result;}
          if (typeof img.naturalWidth != "undefined" && img.naturalWidth == 0) 
            {
              window.alert("image is not loaded properly, check the selected file");
              return;
            }
          prev.appendChild(img);
          var resp = {"message":"save draft","data":{"id": id.substring(1),"type":"image","content":String(img.src)}};
          chatSocket.send(JSON.stringify(resp));
          var d = document.querySelector("#"+id+"ME");
          d.style.display="none";
          var x = document.getElementById(id+"ME");
          x.style.display = "none";
          var y = document.getElementById(id+"MP");
          y.style.display = "block";
        }
        if (mode=="table")
        {
          document.getElementById(id + "TP").innerHTML="";
          var myTable = document.createElement("TABLE");
          var myTableHeader = document.createElement("thead");
          var myTableBody = document.createElement("tbody");
          var tableRows =parseInt(document.getElementById(id+"RT").value);
          var tableCols =parseInt(document.getElementById(id+"CT").value);
          myTable.className="table";
          var arr = []
          for (var i = 1 ; i< tableRows+1;i++)
          {
            var myRow = document.createElement("TR");
            for (var j = 1 ; j< tableCols+1; j++)
            {
             var myCol ;
              if (i==1 || j==1)
              {
                myCol= document.createElement("TH");
                myCol.setAttribute("scope","row");
              }
              else {myCol= document.createElement("TD");}
              var tableInput = document.getElementById(id+ "T"+ String(i) + ":" + String(j));
              if (tableInput.value=="")
              {
                window.alert("please fill in all table");
                return;
              }
              myCol.appendChild(document.createTextNode(tableInput.value));
              myRow.appendChild(myCol);
              arr.append(String(tableInput.value));
            }
            if (i==1)
            {
              myRow.setAttribute("scope","col");
              myTableHeader.appendChild(myRow);
            }
            else {myTableBody.appendChild(myRow);}
          }

          myTable.appendChild(myTableHeader);
          myTable.appendChild(myTableBody);
          var tableEditArea = document.getElementById(id+"TP");
          tableEditArea.appendChild(myTable);
          document.getElementById(id+"ME").style.display="none";
          document.getElementById(id+"MP").style.display="block";
          var resp = {"message":"save table","data":{"id": id.substring(1),"type":"table","content":{"rows":String(tableRows),"cols":String(tableCols),"values":arr}}};
          chatSocket.send(JSON.stringify(resp));
        }
        if (mode=="chart")
        {
          if (document.getElementById(id + "CC").innerHTML!="")
          {

            document.getElementById(id + "CC").innerHTML="";
            document.getElementById(id + "VC").innerHTML="";
            document.getElementById(id + "MP").lastChild.remove();
          }
          var selectedTicker = document.getElementById(id+"TS");
          selectedTicker=selectedTicker.options[selectedTicker.selectedIndex].value;
          var selectedStartDate= document.getElementById(id+"DF").value;
          if (selectedStartDate=="" || selectedEndDate=="")
          {
            window.alert("you shold select start and end date correctly");
            return;
          }
          selectedStartDate=String(selectedStartDate).replace("/","-").replace("/","-");
          var selectedEndDate= document.getElementById(id+"DT").value;
          selectedEndDate=String(selectedEndDate).replace("/","-").replace("/","-");
          var currentURL = window.location.href;
          var xmlhttp = new XMLHttpRequest();
          var url = String(currentURL)+"chart_preview/?ticker="+String(selectedTicker)+"&start_date="+String(selectedStartDate)+"&end_date="+String(selectedEndDate);
          var data={};
          xmlhttp.onreadystatechange = function() {if (this.readyState == 4 && this.status == 200) {data = JSON.parse(this.responseText);}};
          xmlhttp.open("GET", url, false);
          xmlhttp.send();
          data=JSON.parse(data);
          if ("error" in data)
          {
            window.alert("error getting data")
          }
          else 
          {
            var resp = {"message":"save draft","data":{"id": id.substring(1),"type":"chart","content":{"datefrom":String(selectedStartDate),"dateto":String(selectedEndDate),"ticker":String(selectedTicker),"chartid":""}}};
            chatSocket.send(JSON.stringify(resp));
            var options = {
              series: [ {
              name: 'candle',
              type: 'candlestick',
              data: data.cData
            }],
              chart: {
              height: 350,
              id: id+'OC',
              type: 'line',
            },
            title: {
              text: 'CandleStick Chart',
              align: 'left'
            },
            stroke: {
              width: [3, 1]
            },
            
            tooltip: {
              shared: true,
              custom: [function({series,seriesIndex, dataPointIndex, w}) {
                return w.globals.series[seriesIndex][dataPointIndex]
              }, function({ seriesIndex, dataPointIndex, w }) {
                var o = w.globals.seriesCandleO[seriesIndex][dataPointIndex]
                var h = w.globals.seriesCandleH[seriesIndex][dataPointIndex]
                var l = w.globals.seriesCandleL[seriesIndex][dataPointIndex]
                var c = w.globals.seriesCandleC[seriesIndex][dataPointIndex]
                var d =  w.globals.labels[dataPointIndex]

                return (
                  ('date: '+String(d)+'</br>'+'open : '+String(o) + '</br>' + 'close :'+ String(c) + '</br>' + 'highest :' + String(h) + '</br>' + 'lowest :' + String(l))
                )
              }]
            },
            xaxis: {
              type: 'datetime'
            },
            yaxis: {
              tooltip: {
                shared: true,
                enabled: true
              }
            }
                        };
                        var chart = new ApexCharts(document.querySelector("#"+String(id)+"CC"), options);
                        chart.render();
            
                        var optionsBar = {
              series: [{
              name: 'volume',
              data: data.vData
            }],
              chart: {
              height: 160,
              type: 'bar',
              brush: {
                enabled: true,
                target: id+'OC'
              },
              selection: {
                enabled: true,
                xaxis: {
                  type: 'datetime'
                },
                fill: {
                  color: '#ccc',
                  opacity: 0.4
                },
                stroke: {
                  color: '#0D47A1',
                }
              },
            },
            dataLabels: {
              enabled: false
            },
            plotOptions: {
              bar: {
                columnWidth: '80%',
                colors: {
                  ranges: [{
                    from: -1000,
                    to: 0,
                    color: '#F15B46'
                  }, {
                    from: 1,
                    to: 10000,
                    color: '#FEB019'
                  }],
            
                },
              }
            },
            stroke: {
              width: 0
            }, tooltip: {
              followCursor: true,
              shared: true,
              custom: [function({series,seriesIndex, dataPointIndex, w}) {
                return w.globals.series[seriesIndex][dataPointIndex]
              }, function({ seriesIndex, dataPointIndex, w }) {
                var o = series[seriesIndex][dataPointIndex]
                var d =  w.globals.labels[dataPointIndex]
                return (
                  'date: '+String(d)+'</br>'+'volume : '+String(o) 
                )
              }]
            },
            xaxis: {
              type: 'datetime',
              axisBorder: {
                offsetX: 13
              }
            },
            yaxis: {
              labels: {
                show: true
              }
            }
                        };
            
                        var chartBar = new ApexCharts(document.querySelector("#"+String(id)+"VC"), optionsBar);
                        chartBar.render();
            
                        document.getElementById(id+"ME").style.display="none";
                        document.getElementById(id+"MP").style.display="block";
          }

        }
    }

function addBlock(){

        c=document.querySelector("#blocks").childElementCount;
        if (c!=0)
        {
        last_id = String(document.getElementById("blocks").children[c-1].getAttribute("id"));
        last_id= last_id.substring(1,last_id.length);
        c = parseInt(last_id);

        }
        //create box 
        var newele= document.createElement("DIV");
        newele.id="E"+String(c+1);
        newele.className="row";
        //newele.setAttribute("onmouseenter","mEnter(this)");
        //newele.setAttribute("onmouseleave","mLeave(this)");
        newele.setAttribute("style","background-color:lavender;margin: 10px;border-radius: 10px;");
        newele.setAttribute("data","text");


        //create main edit area
        var main_edit_area = document.createElement("DIV");
        main_edit_area.className="row";
        main_edit_area.id="E"+String(c+1)+"ME";
        main_edit_area.setAttribute("style","background-color:lavender;");
        //create main preview area
        var main_preview_area = document.createElement("DIV");
        main_preview_area.className="row";
        main_preview_area.id="E"+String(c+1)+"MP";
        main_preview_area.setAttribute("style","background-color:lavender;display:none;");

        //textbox div area
        var txtarea = document.createElement("div");
        txtarea.className="col-md-6";
        txtarea.setAttribute("class","col-md-6");
        txtarea.setAttribute("style","background-color:lavender;display:block;width: 40%;");
        //done button div
        var btnDonear = document.createElement("div");
        btnDonear.className="col-md-6";
        btnDonear.id="E"+String(c+1)+"DD";
        //initial preview div
        var initial_preview = document.createElement("div");
        initial_preview.className="col-md-6";
        initial_preview.setAttribute("class","col-md-6");
        initial_preview.id="E"+String(c+1)+"IP";
        initial_preview.setAttribute("style","background-color:lavender;display:block;width: 40%;word-break:break-all;white-space: pre-wrap;");

        //preview area 
        var prvarea = document.createElement("div");
        prvarea.className="col-md-6";
        prvarea.id="E"+String(c+1)+"PA";
        prvarea.setAttribute("style","background-color:lavender;display:block;word-break:break-all;white-space: pre-wrap;");

        //button edit div
        var btnEditar = document.createElement("div");
        btnEditar.className="col-md-6";
        btnEditar.id="E"+String(c+1)+"ED";


        //edit button
        var btnEdit = document.createElement("button");
        btnEdit.setAttribute("onclick","editBlock(this)");
        btnEdit.innerText="Edit";
        btnEdit.id="E"+String(c+1)+"EB";
        btnEdit.className="btn btn-info";
        //delete button
        var btnDel = document.createElement("button");
        btnDel.setAttribute("onclick","deleteBlock(this)");
        btnDel.innerText="Delete";
        btnDel.id="E"+String(c+1)+"DB";
        btnDel.className="btn btn-danger";
        //done button
        var btnDone = document.createElement("button");
        btnDone.setAttribute("onclick","doneBlock(this)");
        btnDone.innerText="Done";
        btnDone.id="E"+String(c+1)+"SB";
        btnDone.className="btn btn-success";
        //create editor 
        var txtbx= document.createElement("textarea");
        txtbx.id="E"+String(c+1)+"TX";
        txtbx.setAttribute("onkeyup","autoheight(this)");
        txtbx.setAttribute("style","border: none;resize:vertical;width:100%;white-space: pre-wrap;overflow-wrap: break-word;");

   

        //combining all together
        btnEditar.appendChild(btnDel);
        btnEditar.appendChild(btnEdit);
        btnDonear.appendChild(btnDone);
        txtarea.appendChild(txtbx);

        main_edit_area.appendChild(txtarea);
        main_edit_area.appendChild(initial_preview);
        main_edit_area.appendChild(btnDonear);
        main_preview_area.appendChild(prvarea);
        main_preview_area.appendChild(btnEditar);


        newele.appendChild(main_edit_area);
        newele.appendChild(main_preview_area);
 

        document.querySelector("#blocks").append(newele);
        //Simplemde editor declaration
        //var simplemde = new SimpleMDE({ element: document.getElementById("E"+String(c+1)+"TX") });

        }

function addImage()
{
  c=document.querySelector("#blocks").childElementCount;
  if (c!=0)
  {
  last_id = String(document.getElementById("blocks").children[c-1].getAttribute("id"));
  last_id= last_id.substring(1,last_id.length);
  c = parseInt(last_id);

  }
  //create box 
  var newele= document.createElement("DIV");
  newele.id="E"+String(c+1);
  newele.className="row";
  //newele.setAttribute("onmouseenter","mEnter(this)");
  //newele.setAttribute("onmouseleave","mLeave(this)");
  newele.setAttribute("style","background-color:lavender;margin: 10px;border-radius: 10px;");
  newele.setAttribute("data","image");


        //create main edit area
       var main_edit_area = document.createElement("DIV");
        main_edit_area.className="row";
        main_edit_area.id="E"+String(c+1)+"ME";
        main_edit_area.setAttribute("style","background-color:lavender;");
        //create main preview area
        var main_preview_area = document.createElement("DIV");
        main_preview_area.className="row";
        main_preview_area.id="E"+String(c+1)+"MP";
        main_preview_area.setAttribute("style","background-color:lavender;display:none;");


        

        //done button div
        var btnDonear = document.createElement("div");
        btnDonear.className="col-md-6";
        btnDonear.id="E"+String(c+1)+"DD";
        //btnDonear.setAttribute("style",  "position:relative;right: 20px;");
        
        //preview area 
        var prvarea = document.createElement("div");
        prvarea.className="col-md-6";
        prvarea.id="E"+String(c+1)+"PA";
        prvarea.setAttribute("style","background-color:lavender;display:block;allign:center;");

        //button edit div
        var btnEditar = document.createElement("div");
        btnEditar.className="col-md-6";
        btnEditar.id="E"+String(c+1)+"ED";


        //edit button
        var btnEdit = document.createElement("button");
        btnEdit.setAttribute("onclick","editBlock(this)");
        btnEdit.innerText="Edit";
        btnEdit.id="E"+String(c+1)+"EB";
        btnEdit.className="btn btn-info";

        //delete button
        var btnDel = document.createElement("button");
        btnDel.setAttribute("onclick","deleteBlock(this)");
        btnDel.innerText="Delete";
        btnDel.id="E"+String(c+1)+"DB";
        btnDel.className="btn btn-danger";
        //done button
        var btnDone = document.createElement("button");
        btnDone.setAttribute("onclick","doneBlock(this)");
        btnDone.innerText="Done";
        btnDone.id="E"+String(c+1)+"SB";
        btnDone.className="btn btn-success";
  
        //browse button
        var btnBrowse = document.createElement("button");
        btnBrowse.innerText="Browse";
        btnBrowse.className="btn btn-info";
        //browse input 
        var browseInput = document.createElement("input");
        browseInput.id="E"+String(c+1)+"BI";
        browseInput.setAttribute("type","file")
        browseInput.setAttribute("accept","image/jpeg")

   

        //combining all together
        btnBrowse.appendChild(browseInput);

        btnEditar.appendChild(btnDel);
        btnEditar.appendChild(btnEdit);
        btnDonear.appendChild(btnBrowse);
        btnDonear.appendChild(btnDone);



        main_edit_area.appendChild(btnDonear);
        main_preview_area.appendChild(prvarea);
        main_preview_area.appendChild(btnEditar);


        newele.appendChild(main_edit_area);
        newele.appendChild(main_preview_area);
        document.querySelector("#blocks").append(newele);
}

function addTable()
 {
  c=document.querySelector("#blocks").childElementCount;
  if (c!=0)
  {
  last_id = String(document.getElementById("blocks").children[c-1].getAttribute("id"));
  last_id= last_id.substring(1,last_id.length);
  c = parseInt(last_id);
  }
  //create box 
  var newele= document.createElement("DIV");
  newele.id="E"+String(c+1);
  newele.className="row";
  //newele.setAttribute("onmouseenter","mEnter(this)");
  //newele.setAttribute("onmouseleave","mLeave(this)");
  newele.setAttribute("style","background-color:lavender;margin: 10px;border-radius: 10px;");
  newele.setAttribute("data","table");

  //create main creation area
  var main_create_area = document.createElement("DIV");
  main_create_area.className="row";
  main_create_area.id="E"+String(c+1)+"MC";
  main_create_area.setAttribute("style","background-color:lavender;");
  
  //create main edit area
  var main_edit_area = document.createElement("DIV");
  main_edit_area.className="row";
  main_edit_area.id="E"+String(c+1)+"ME";
  main_edit_area.setAttribute("style","background-color:lavender;");
  main_edit_area.style.display="none";
  //create main preview area
  var main_preview_area = document.createElement("DIV");
  main_preview_area.className="row";
  main_preview_area.id="E"+String(c+1)+"MP";
  main_preview_area.setAttribute("style","background-color:lavender;display:none;");
  main_preview_area.style.display="none";

  //table size input notations
  var creationText = document.createElement("p");
  creationText.innerText="Pleaes enter number of rows and columns : ";
  
  // table row input
  var txtRows= document.createElement("input");
  txtRows.id="E"+String(c+1)+"RT";
  txtRows.setAttribute("onkeyup","autoheight(this)");
  txtRows.setAttribute("type","number");
  txtRows.setAttribute("style","border: none;resize:none;width:60px;"); 
  
  // just notations 
  var x = document.createElement("p");
  x.innerText="×";

  //table col input
  var txtCols= document.createElement("input");
  txtCols.id="E"+String(c+1)+"CT";
  txtCols.setAttribute("onkeyup","autoheight(this)");
  txtCols.setAttribute("type","number");
  txtCols.setAttribute("style","border: none;resize:none;width:60px;"); 

  //Crete button
  var btnCreate = document.createElement("button");
  btnCreate.setAttribute("onclick","createTable(this)");
  btnCreate.innerText="Done";
  btnCreate.id="E"+String(c+1)+"CB";
  btnCreate.className="btn btn-success";
 
  //table edit div
  var tableEdit = document.createElement("DIV");
  tableEdit.className="col-md-6";
  tableEdit.id="E"+String(c+1)+"TE";
  tableEdit.setAttribute("style","background-color:lavender;");
 
  //done button div
  var btnDonear = document.createElement("div");
  btnDonear.className="col-md-6";
  btnDonear.id="E"+String(c+1)+"DD";

  //done button 
  var btnDone = document.createElement("button");
  btnDone.setAttribute("onclick","doneBlock(this)");
  btnDone.innerText="Done";
  btnDone.id="E"+String(c+1)+"SB";
  btnDone.className="btn btn-success";

 
  //table preview div
  var tablePreview = document.createElement("DIV");
  tablePreview.className="col-md-6";
  tablePreview.id="E"+String(c+1)+"TP";
  tablePreview.setAttribute("style","background-color:lavender;");

  //button edit div
  var btnEditar = document.createElement("div");
  btnEditar.className="col-md-6";
  btnEditar.id="E"+String(c+1)+"ED";

  
  //edit button
  var btnEdit = document.createElement("button");
  btnEdit.setAttribute("onclick","editBlock(this)");
  btnEdit.innerText="Edit";
  btnEdit.id="E"+String(c+1)+"EB";
  btnEdit.className="btn btn-info";
 

  //delete button
  var btnDel = document.createElement("button");
  btnDel.setAttribute("onclick","deleteBlock(this)");
  btnDel.innerText="Delete";
  btnDel.id="E"+String(c+1)+"DB";
  btnDel.className="btn btn-danger";


  main_create_area.appendChild(creationText);
  main_create_area.appendChild(txtRows);
  main_create_area.appendChild(x);
  main_create_area.appendChild(txtCols);
  main_create_area.appendChild(btnCreate);

  btnDonear.appendChild(btnDone);
  main_edit_area.appendChild(tableEdit);
  main_edit_area.appendChild(btnDonear);

  btnEditar.appendChild(btnEdit);
  btnEditar.appendChild(btnDel);
  main_preview_area.appendChild(tablePreview);
  main_preview_area.appendChild(btnEditar);

  newele.appendChild(main_create_area);
  newele.appendChild(main_edit_area);
  newele.appendChild(main_preview_area);

  document.querySelector("#blocks").append(newele);

 }

 function addChart()
 {
  c=document.querySelector("#blocks").childElementCount;
  if (c!=0)
  {
  last_id = String(document.getElementById("blocks").children[c-1].getAttribute("id"));
  last_id= last_id.substring(1,last_id.length);
  c = parseInt(last_id);
  }
  //create box 
  var newele= document.createElement("DIV");
  newele.id="E"+String(c+1);
  newele.className="row";
  //newele.setAttribute("onmouseenter","mEnter(this)");
  //newele.setAttribute("onmouseleave","mLeave(this)");
  newele.setAttribute("style","background-color:lavender;margin: 10px;border-radius: 10px;");
  newele.setAttribute("data","chart");

  //create main edit area
  var main_edit_area = document.createElement("DIV");
  main_edit_area.className="row";
  main_edit_area.id="E"+String(c+1)+"ME";
  main_edit_area.setAttribute("style","background-color:lavender;");

  //create main preview area
  var main_preview_area = document.createElement("DIV");
  main_preview_area.className="row";
  main_preview_area.id="E"+String(c+1)+"MP";
  main_preview_area.setAttribute("style","background-color:lavender;display:none;");
  main_preview_area.style.display="none";
  //create ticker select combo-box
  var tickerSelect = document.createElement("select");
  tickerSelect.type="select-one";
  tickerSelect.id="E"+String(c+1)+"TS";
  for (i=0;i<8;i++)
  {
    var option = document.createElement("option");
    option.text=tickers[i][0];
    option.value=tickers[i][1];
    tickerSelect.appendChild(option);
  }
  //ticker select notathion
  var tickerNotation = document.createElement("span");
  tickerNotation.innerText="select ticker from list";

  //create start date input 
  var dateDiv = document.createElement("div");
  dateDiv.className="input-daterange input-group";
  dateDiv.setAttribute("data-provide","datepicker");
  
  var nowdate= new Date();
  nowdate = String(nowdate.getDate())+"/"+String(nowdate.getMonth()+1)+"/"+String(nowdate.getFullYear());

  var dateFrom = document.createElement("input");
  dateFrom.id= "E"+String(c+1)+"DF"
  dateFrom.defaultValue=nowdate;
  dateFrom.className="input-sm form-control";
  dateFrom.name="start";
  dateFrom.type="text";
  dateFrom.setAttribute("data-date-format","mm/dd/yyyy");
  dateFrom.onclick = function (){
    $('input[id=\"'+String(this.id)+'\"]').datepicker({
    format: 'dd/mm/yyyy',
    todayHighlight: true,
    autoclose: true,
})

};
  var toNotation = document.createElement("span");
  toNotation.innerText="to";
  toNotation.className="input-group-addon";

  var dateTo = document.createElement("input");
  dateTo.id= "E"+String(c+1)+"DT"
  dateTo.defaultValue=nowdate;
  dateTo.className="input-sm form-control";
  dateTo.name="end";
  dateTo.type="text";
  dateTo.setAttribute("data-date-format","mm/dd/yyyy");
  dateTo.onclick = function (){
    $('input[id=\"'+String(this.id)+'\"]').datepicker({
    format: 'dd/mm/yyyy',
    todayHighlight: true,
    autoclose: true,
})

};


  //done button 
  var btnDone = document.createElement("button");
  btnDone.setAttribute("onclick","doneBlock(this)");
  btnDone.innerText="Done";
  btnDone.id="E"+String(c+1)+"SB";
  btnDone.className="btn btn-success";

  //button edit div
  var btnEditar = document.createElement("div");
  btnEditar.className="col-md-6";
  btnEditar.id="E"+String(c+1)+"ED";
  
    
  //edit button
  var btnEdit = document.createElement("button");
  btnEdit.setAttribute("onclick","editBlock(this)");
  btnEdit.innerText="Edit";
  btnEdit.id="E"+String(c+1)+"EB";
  btnEdit.className="btn btn-info";
   
  
  //delete button
  var btnDel = document.createElement("button");
  btnDel.setAttribute("onclick","deleteBlock(this)");
  btnDel.innerText="Delete";
  btnDel.id="E"+String(c+1)+"DB";
  btnDel.className="btn btn-danger";

 
  
  //Candles chart canvas
  var candleChart = document.createElement("div");
  candleChart.id= "E"+String(c+1) + "CC";
  
  //volume chart canvas
  var volumeChart = document.createElement("div");
  volumeChart.id="E"+ String(c+1)+ "VC";

  dateDiv.appendChild(dateFrom);
  dateDiv.appendChild(toNotation);
  dateDiv.appendChild(dateTo);

  btnEditar.appendChild(btnEdit);
  btnEditar.appendChild(btnDel);

  main_edit_area.appendChild(tickerNotation);
  main_edit_area.appendChild(tickerSelect);
  main_edit_area.appendChild(dateDiv);
  main_edit_area.appendChild(btnDone);

  main_preview_area.appendChild(candleChart);
  main_preview_area.appendChild(volumeChart);
  main_preview_area.appendChild(btnEditar);

  newele.appendChild(main_edit_area);
  newele.appendChild(main_preview_area);

  document.querySelector("#blocks").append(newele);

 }
// Listen for changes to inputs and textareas

function publishBlog()
{
  var content = [];
  var blocks = document.getElementById("blocks");
  if (blocks.childElementCount==0){window.alert("there is no blocks in blog, write something to save");}
  else {
    var tit = {"id":"0","type":"title","content": document.getElementById("title").innerText};
    content.append(tit);
    for (var i =0;i<blocks.childElementCount;i++)
    {
      var child = blocks.children[i];
      var id =child.id;
      if (document.getElementById(id+"ME").style.display=="block")
      {
        window.alert("you shold finish editing all blocks first");
        break;
      }
      var blockType = child.getAttribute("data");
      if (blockType=="text")
      {
        var resp = {"id": id.substring(1),"type":"text","content":String(document.getElementById(id+"PA").innerHTML).replace(/"/g, "'")};
        content.append(resp);
      }
      if (blockType=="image")
      {
        var imgElem = document.getElementById(id+"PA").firstChild
        var canvas = document.createElement("canvas");
        canvas.width = imgElem.clientWidth;
        canvas.height = imgElem.clientHeight;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(imgElem, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        var payload = {"imgdata":dataURL.replace(/^data:image\/(png|jpg);base64,/, "")};
        var xmlhttp = new XMLHttpRequest();
        var url = String(window.location.host)+"blog/uploadimg/";
        var data={};
        xmlhttp.onreadystatechange = function() {if (this.readyState == 4 && this.status == 200) {data = JSON.parse(this.responseText);}};
        xmlhttp.open("POST", url, false);
        xmlhttp.send(payload);
        data=JSON.parse(data);
        if (data.message=='error')
        {
          window.alert("error uploading image");
          return;
        }
        var resp = {"id": id.substring(1),"type":"image","content":String(data.url)};
        content.append(resp);

      }
      if (blockType=="table")
      {
        var tableRows =parseInt(document.getElementById(id+"RT").value);
        var tableCols =parseInt(document.getElementById(id+"CT").value);
        var arr = []
        for (var i = 1 ; i< tableRows+1;i++)
        {
          for (var j = 1 ; j< tableCols+1; j++)
          {

            var tableInput = document.getElementById(id+ "T"+ String(i) + ":" + String(j));
            arr.append(String(tableInput.value));
          }
        }
        var resp ={"id": id.substring(1),"type":"table","content":{"rows":String(tableRows),"cols":String(tableCols),"values":arr}};
        content.append(resp);

      }
      if (blockType=="chart")
      {
        var selectedTicker = document.getElementById(id+"TS");
        selectedTicker=selectedTicker.options[selectedTicker.selectedIndex].value;
        var selectedStartDate= document.getElementById(id+"DF").value;
        selectedStartDate=String(selectedStartDate).replace("/","-").replace("/","-");
        var selectedEndDate= document.getElementById(id+"DT").value;
        selectedEndDate=String(selectedEndDate).replace("/","-").replace("/","-");
        var currentURL = window.location.href;
        var xmlhttp = new XMLHttpRequest();
        var url = String(currentURL)+"chart_create/?ticker="+String(selectedTicker)+"&start_date="+String(selectedStartDate)+"&end_date="+String(selectedEndDate);
        var data={};
        xmlhttp.onreadystatechange = function() {if (this.readyState == 4 && this.status == 200) {data = JSON.parse(this.responseText);}};
        xmlhttp.open("GET", url, false);
        xmlhttp.send();
        data=JSON.parse(data);

        var resp = {"id": id.substring(1),"type":"chart","content":{"datefrom":String(selectedStartDate),"dateto":String(selectedEndDate),"ticker":String(selectedTicker),"chartid":data.id}};

        content.append(resp);

      }
      

    }
  }
  var req = {"message":"save blog","data": content};
  chatSocket.send(JSON.stringify(req));
  window.location.replace(window.location.host+"/view/"+ String(window.location.pathname).substring(-25) );

}


  const chatSocket = new WebSocket(
    'ws://'
    + window.location.host
    + '/ws/'
    + String(window.location.pathname).substring(-25) 
);
chatSocket.onopen= function(e){
  chatSocket.send(Json.stringify({"message":"get title"}));
  chatSocket.send(JSON.stringify({"message":"get draft"}));
}
chatSocket.onmessage = function(e) {
    const data = JSON.parse(e);
    var turndownService = new TurndownService();
    data=data.sort(function(a, b)
 {
  var x = a['id']; var y = b['id'];
  return ((x < y) ? -1 : ((x > y) ? 1 : 0));});
    var count = Object.keys(data).length;
    for (var i = 0;i<count;i++)
    {
      if (data[i].type=='title'){document.getElementById('title_input').value=data[i].content;}
      if (data[i].type=='text')
      {
        addBlock();
        blockid='E'+ document.querySelector('#blocks').lastElementChild.id;
        document.getElementById(blockid+'TX').value=turndownService.turndown(data[i].content);
      }
      if (data[i].type=='image')
      {
        addImage();
        blockid='E'+ document.querySelector('#blocks').lastElementChild.id;
        document.getElementById(blockid+'MP').href=data[i].content;
        document.getElementById(blockid+'MP').style.display='block';
        document.getElementById(blockid+'ME').style.display='none';

      }
      if (data[i].type=='table')
      {
        addTable();
        blockid='E'+ document.querySelector('#blocks').lastElementChild.id;
        document.getElementById(blockid+'RT').value=data[i].content.rows;
        document.getElementById(blockid+'CT').value=data[i].content.cols;
        createTable(document.getElementById(blockid+'CB'))
        r= parseInt(data[i].content.rows);
        c=parseInt(data[i].content.cols);
        for (var i =1;i<r+1;i++)
        {
          for (var j =1;j<c+1;j++)
          {
            document.getElementById(blockid+'T'+String(i)+':'+String(j)).value=data[i].content.table[(i-1)*c + j-1];
          }
        }


      }
      if (data[i].type=='chart')
      {
        addChart();
        blockid='E'+ document.querySelector('#blocks').lastElementChild.id;
        document.getElementById(blockid+'TS').options.selection=data[i].content.ticker;
        document.getElementById(blockid+'DF').value=data[i].content.datefrom;
        document.getElementById(blockid+'DT').value=data[i].content.dateto;
      }
      
    
      value=e[i].content;
      document.getElementById('E'+String(key))

    }
    
    document.querySelector('#chat-log').value += (data.message + '\n');
};

chatSocket.onclose = function(e) {
    console.error('Chat socket closed unexpectedly');
};


