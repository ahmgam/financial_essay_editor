
function render_chart(id ,data)
{
    id = "E"+String(id);
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
}