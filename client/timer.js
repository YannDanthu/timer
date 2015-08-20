var timerDep = new Deps.Dependency(); // !!!
var timerInterval;
var startTime;
var initValue = 1;
var remainingTime = 0;
var elapseTime = 0;
var displayRemaining = false;

/**
 * init timer value
 */
function initTimer() {
  console.log("initTimer()");
  Session.set('timeValue', 0);
}

/**
 * build timer gauge
 */
function buildTimer() {
  console.log("buildTimer()");

    var gaugeOptions = {

        chart: {
            type: 'solidgauge'
        },

        title: '',

        pane: {
            center: ['50%', '50%'],
            size: '100%',
            startAngle: 0,
            endAngle: 360,
            background: {
                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
                innerRadius: '60%',
                outerRadius: '100%',
                shape: 'arc'
            }
        },

        tooltip: {
            enabled: false
        },

        // the value axis
        yAxis: {
            stops: [
                [0.1, '#55BF3B'], // green
                [0.8, '#DDDF0D'], // yellow
                [0.95, '#DF5353'] // red
            ],
            lineWidth: 0,
            minorTickInterval: null,
            tickPixelInterval: 0,
            tickWidth: 0,
            title: {
                y: 0
            },
            labels: {
                y: 0
            }
        },

        plotOptions: {
            solidgauge: {
                dataLabels: {
                    y: -15,
                    borderWidth: 0,
                    useHTML: true
                }
            }
        }
    };

    // The time gauge
    $('#container-time').highcharts(Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: initValue,
            title: {
                text: ''
            }
        },

        credits: {
            enabled: false
        },

        series: [{
            name: 'Time',
            data: [0],
            dataLabels: {
                formatter: function() {
                    return '<div style="text-align:center"><span style="font-size:25px;color:' +
                            ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">' + (displayRemaining ? 0 - remainingTime : elapseTime) + '</span><br/>' +
                       '<span style="font-size:12px;color:silver">seconds</span></div>';
                     }
            },
            tooltip: {
                valueSuffix: ' seconds'
            }
        }]

    }));

}

/**
 * Bring timer to life
 */
function updateTimerValue() {
  console.log("updateTimerValue()");

    // calculate elapse and remainingTime
    elapseTime = Math.floor(Date.now() / 1000) - startTime;
    remainingTime = initValue - elapseTime;
    console.log("elapseTime: " + elapseTime);

    updateTimerGauge(elapseTime);
    timerDep.changed(); // !!!
}

/**
 * update timer gauge display with newValue (optional)
 */
function updateTimerGauge(newValue) {
  // Timer gauge
  var chart = $('#container-time').highcharts(),
      point;

  if (chart) {
      point = chart.series[0].points[0];

      if (elapseTime >= initValue) {
          stop();
      }

      point.update(newValue);
  }

}

/**
 * stop the timer
 */
function stop() {
  Meteor.clearInterval(timerInterval);
}

/**
 * start the timer
 */
function start() {
  initValue = $("#initValue").val();
  startTime = Math.floor(Date.now() / 1000);
  remainingTime = initValue;
  elapseTime = 0;

  console.log("initValue: " + initValue);
  buildTimer();
  timerInterval = Meteor.setInterval(updateTimerValue, 1000);
}

/**
 * toggle elapse/remaining time display
 */
function toggleDisplay() {
  displayRemaining = !displayRemaining;
  updateTimerGauge();
}

// template renedered function
Template.timer.rendered = function() {
  console.log("Template.timer.rendered");
  timerDep.depend(); // !!!
  buildTimer();
  $('.icon.button')
    .popup({
      hoverable: true
    })
  ;

}

// template destroyed function
Template.timer.destroyed = function() {
  console.log("Template.timer.destroyed");
  Meteor.clearInterval(timerInterval);
}

// template create function
Template.timer.created = function() {
  console.log("Template.timer.created");
}

// template events
Template.timer.events({
  'click #start': function(){
      // code goes here
      console.log("start button clicked");
      start();
  },
  'click #stop': function(){
      // code goes here
      console.log("stop button clicked");
      stop();
  },
  'click #container-time': function(){
      // code goes here
      console.log("toggleDisplay requested");
      toggleDisplay();
  }
});
