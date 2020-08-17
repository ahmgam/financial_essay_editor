var tickers = [['Microsoft Corp',  'MSFT'],
[ 'Apple Inc',  'AAPL'],
['Amazoncom Inc', 'AMZN'],
[ 'Alphabet Inc Class C',  'GOOG'],
['Alphabet Inc Class A', 'GOOGL'],
['Facebook Inc',  'FB'],
[ 'Vodafone Group Public Limited Company','VOD'],
['Intel Corp', 'INTC']];

var  seriesData = [
    {
      x: new Date(1538778600000),
      y: [6629.81, 6650.5, 6623.04, 6633.33]
    },
    {
      x: new Date(1538780400000),
      y: [6632.01, 6643.59, 6620, 6630.11]
    },
    {
      x: new Date(1538782200000),
      y: [6630.71, 6648.95, 6623.34, 6635.65]
    },
    {
      x: new Date(1538784000000),
      y: [6635.65, 6651, 6629.67, 6638.24]
    },
    {
      x: new Date(1538785800000),
      y: [6638.24, 6640, 6620, 6624.47]
    },
    {
      x: new Date(1538787600000),
      y: [6624.53, 6636.03, 6621.68, 6624.31]
    },
  ];

var seriesDataLinear= [
[1538778600000, 34], 
[1538780400000, 43], 
[1538782200000, 31] , 
[1538784000000, 43], 
[1538785800000, 33], 
[1538787600000, 52]
];
var linedata = [
    {
      x: new Date(1538778600000),
      y: 6604
    }, {
      x: new Date(1538782200000),
      y: 6602
    }, {
      x: new Date(1538784000000),
      y: 6607
    }, {
      x: new Date(1538787600000),
      y: 6620
    }
  ];

var options = {
  series: [ {
  name: 'line',
  type: 'line',
  data: linedata
},{
  name: 'candle',
  type: 'candlestick',
  data: seriesData
}],
  chart: {
  height: 350,
  id: 'candles',
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
  custom: [function({seriesIndex, dataPointIndex, w}) {
    return w.globals.series[seriesIndex][dataPointIndex]
  }, function({ seriesIndex, dataPointIndex, w }) {
    var o = w.globals.seriesCandleO[seriesIndex][dataPointIndex]
    var h = w.globals.seriesCandleH[seriesIndex][dataPointIndex]
    var l = w.globals.seriesCandleL[seriesIndex][dataPointIndex]
    var c = w.globals.seriesCandleC[seriesIndex][dataPointIndex]
    var d =  w.globals.labels[dataPointIndex]
    return (
      'date: '+String(Date(d))+'</br>'+'open : '+String(o) + '</br>' + 'close :'+ String(c) + '</br>' + 'highest :' + String(h) + '</br>' + 'lowest :' + String(l)
    )
  }]
},
xaxis: {
  type: 'datetime'
}
};
var chart = new ApexCharts(document.querySelector("#chart-candlestick"), options);
chart.render();

var optionsBar = {
  series: [{
  name: 'volume',
  data: seriesDataLinear
}],
  chart: {
  height: 160,
  type: 'bar',
  brush: {
    enabled: true,
    target: 'candles'
  },
  selection: {
    enabled: true,
    xaxis: {
      min: new Date(1538778600000).getTime(),
      max: new Date(1538787600000).getTime()
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
},
xaxis: {
  type: 'datetime',
  axisBorder: {
    offsetX: 13
  }
},
yaxis: {
  labels: {
    show: false
  }
}
};

var chartBar = new ApexCharts(document.querySelector("#chart-bar"), optionsBar);
chartBar.render();