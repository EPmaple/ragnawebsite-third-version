const slime_records = window.slime_records
// seasonNumber already declared in ranking-button.js, which is introduced before this file 

// To show the canvas and slider
document.querySelectorAll('.js_chart_container').forEach((chartContainer) => {
  chartContainer.style.display = 'block'
})

/**************************************/
/**************************************/

// Assuming the original timestamp format is "YYYY-MM-DD HH:mm:ss.ssssss"
function convertToISOFormat(timestamp) {
  const parts = timestamp.split(" ");
  const datePart = parts[0];
  const timePart = parts[1];
  const milliseconds = parseFloat(`0.${timePart.split('.')[1]}`).toFixed(2).substr(2); // Rounding to 2 decimal places and removing the leading "0."
  const isoTimestamp = `${datePart}T${timePart.split('.')[0]}.${milliseconds}Z`;
  return isoTimestamp; // ex.) '2023-07-21T23:21:49.99Z'
}

/**************************************/
/**************************************/

// slime_records is an object of objects
let timestamps = []
for (const key in slime_records) { // each key: {1: {'time': '2023-07-20 14:29:46.408000', 'member_id': '197085461624127488'}}
  const innerObject = slime_records[key] // each innerObject: {'time': '2023-07-20 14:29:46.408000', 'member_id': '197085461624127488'}
  const timeElement = innerObject['time'] // each timeElement: '2023-07-20 14:29:46.408000'
  timestamps.push(timeElement)
}

// Convert each timestamp in the array to ISO format
const ISOtimestamps = timestamps.map(convertToISOFormat); // ex.) '2023-07-21T23:21:49.99Z'
const UNIXtimestamps = ISOtimestamps.map((timestamp) => Date.parse(timestamp)) // Unix timestamp, ex.) 1689863386410; converts timestamp of ISOformat to a timestamp that is of UNIXformat
//console.log(ISOtimestamps)

// convert timestamp of str format '2023-07-20 14:29:46.408000' to JS date object
const dateObjects = timestamps.map((timestamp) => new Date(timestamp))
//dateObjects.sort((a, b) => a - b) // sort in ascending order
//console.log(dateObjects)

// Generate an array with a value of 1 for each timestamp (since there's one slime per timestamp)
const slimeCounts = Array.from({length: timestamps.length}, () => 1)
//console.log(slimeCounts)

/**************************************/
/**************************************/

// creates hourlyCounts, an object that stores date+hour that have valid slime counts
// creates hourlyLabels, an array that have continuous timestamps from the beginning of the ragna season to the end
// finally creates hourlyData, an array containing corresponding counts to the timestamps in hourly Labels
function dailiesChart() {
  try {
    // create an object to store hourly counts
    const hourlyCounts = {}

    // iterate through the date objects and increment the hourly counts
    dateObjects.forEach((date) => {
      const day = date.toISOString().slice(0, 10)// format of ISO string: 'YYYY-MM-DDTHH:mm:ss.sssZ', ex.) "2023-07-22T12:34:56.789Z"; slice to get the date in "YYYY-MM-DD" format
      const hour = date.toISOString().slice(11, 13) // slice to get 'HH' from the ISO string
      //console.log(`date: ${date}, day: ${day}, hour: ${hour}, date.toISOString's hour: ${date.toISOString().slice(11, 13)}, toNumber: ${typeof date.toISOString().slice(11, 13)}`)
      const label = `${day} ${hour.padStart(2, '0')}:00` // Format the label as "YYYY-MM-DD HH:00"; padStart, if the hour is a single-digit number, a leading '0' will be added to the string

      hourlyCounts[label] = (hourlyCounts[label] || 0) + 1
    })
    //console.log(hourlyCounts)

    // get the earliest and latest timestamps in ms
    const earliestTimestamp = Math.min(...UNIXtimestamps)
    const latestTimestamp = Math.max(...UNIXtimestamps)
    // generate an array of timestamps for each hour between the earliest and latest timestamps
    const continuousTimestamps = []
    let currentTimestamp = earliestTimestamp
    while (currentTimestamp <= latestTimestamp) {
      continuousTimestamps.push(currentTimestamp)
      currentTimestamp += 3600000 // Add 1 hour in milliseconds
    }

    // Create array for the hourly labels and corresponding counts, ensuring that all hours are accounted for
    const hourlyLabels = continuousTimestamps.map((timestamp) => {
      const date = new Date(timestamp) // convert UNIX timestamp to JS date objects
      const day = date.toISOString().slice(0, 10)
      const hour = date.toISOString().slice(11, 13)
      return `${day} ${hour.padStart(2, '0')}:00`
    })

    let hourlyData = hourlyLabels.map((label) => hourlyCounts[label] || 0)
    //console.log(hourlyLabels)
    //console.log(hourlyData)

    const datasets = [
      {
        label: 'Number of Slimes',
        data: hourlyData,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 2,
        fill: false,
        pointRadius: 0,
      }
    ]

    //draw graph
    const data = {
      labels: hourlyLabels,
      datasets: datasets,
    }
    
    const options = {
      interaction: {
        mode: 'nearest',
        intersect: false
      },
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'hour',
            displayFormats: {
              hour: 'MM/dd HH:00' // Format the x-axis labels as "MM/DD HH:00"
            },
            tooltipFormat: 'MM/dd HH:mm' // Format the tooltip as "MM/DD HH:mm"
          }
        },
        y: {
          beginAtZero: true,
          stepSize: 1,
          type: 'linear',
        }
      },
      responsive: true,
      maintainAspectRatio: false,
    }
    
    const config = {
      type: "line",
      data,
      options
    }
  
    const chart = new Chart(
      document.getElementById("js_dailies_chart"),
      config
    )

    //console.log(hourlyData)

    let originalHourlyData = _.cloneDeep(hourlyData)

    const slider = document.getElementById("js_dailies_slider")
    slider.setAttribute('max', hourlyData.length)
    slider.setAttribute('value', hourlyData.length)
    slider.addEventListener("input", (event) => {
      // to update the visibility of the line graph based on the slider value
      const sliderValue = event.target.value
      const showLinesCount = sliderValue

      hourlyData = _.cloneDeep(originalHourlyData)

      datasets.forEach((dataset) => {
        dataset.data.forEach((_, index) => {
          // if index < showLinesCounts, dataset.data[index] = hourlyData[index]; else, dataset.data[index] = null
          dataset.data[index] = index < showLinesCount ? hourlyData[index] : null

          //console.log(`sliderValue: ${sliderValue}, dataLength: ${dataLength}, showLinesCounts: ${showLinesCount}, dataset.data[index]: ${dataset.data[index]}`)
        })
      })

      chart.update()
    })
    

  } catch (error) {
    console.error("An error occurred in dailiesChart(): ", error.message)
  }
}

/**************************************/
/**************************************/

// dayNumber needs to be an int from 0 to 6
function getDayName(dayNumber) {
  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  return weekdays[dayNumber]
}

function hourlyChart() {
  try{
    // initialize empty object, inside this object, is a key value pair, str:object, such str is a weekday, and object is hour:slimes
    const dayAndHour = {}

    dateObjects.forEach((date) => {
      const hour = `${date.toISOString().slice(11, 13)}:00` // ex. output, 13:00
      const day = date.getDay() // returns an int representing the day of the week, 0:Sunday, 6:Saturday

      if (!dayAndHour[day]) {
        dayAndHour[day] = {}
      }
      dayAndHour[day][hour] = (dayAndHour[day][hour] || 0) + 1
    })
    // example output of dayAndHour: const dayAndHour = {
    //0: { "00:00": 5, "01:00": 3, "02:00": 7 },     representing hours on Sunday
    //1: { "00:00": 8, "01:00": 2, "02:00": 1 },     representing hours on Monday
    //};

    const continuousTimestamps = ['00:00', '01:00', '02:00', '03:00','04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', "13:00", '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']

    const namedArrays = {}

    for (const day in dayAndHour) {
      // create an array for each day's hourly data
      const hourlyData = continuousTimestamps.map((hour) => dayAndHour[day][hour] || 0)
      
      // set the named array using the day name (e.g. MondayHourlyData)
      namedArrays[getDayName(day) + "HourlyData"] = hourlyData
    }
    // const namedArrays = {
    // 'SundayHourlyData': [3, 5, 0, ....],
    // 'MondayHourlyData': [6, 2, 4, ....],
    //}
    //console.log(namedArrays)
    //console.log(namedArrays.FridayHourlyData)
    //console.log(dayAndHour)
    const hourlyLabels = continuousTimestamps

    // draw grpah
    const data = {
      labels: hourlyLabels,
      datasets: [{
        label: 'Sunday Hourly Counts',
        data: namedArrays.SundayHourlyData,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 2,
        fill: false,
      },{
        label: 'Monday Hourly Counts',
        data: namedArrays.MondayHourlyData,
        borderColor: 'rgba(136, 56, 145, 1)',
        backgroundColor: 'rgba(136, 56, 145, 0.2)',
        borderWidth: 2,
        fill: false,
      },{
        label: 'Tuesday Hourly Counts',
        data: namedArrays.TuesdayHourlyData,
        borderColor: 'rgba(222, 217, 226, 1)',
        backgroundColor: 'rgba(222, 217, 226, 0.2)',
        borderWidth: 2,
        fill: false,
      },{
        label: 'Wednesday Hourly Counts',
        data: namedArrays.WednesdayHourlyData,
        borderColor: 'rgba(105, 165, 131, 1)',
        backgroundColor: 'rgba(105, 165, 131, 0.2)',
        borderWidth: 2,
        fill: false,
      },{
        label: 'Thursday Hourly Counts',
        data: namedArrays.ThursdayHourlyData,
        borderColor: 'rgba(149, 15, 81, 1)',
        backgroundColor: 'rgba(149, 15, 81, 0.2)',
        borderWidth: 2,
        fill: false,
      },{
        label: 'Friday Hourly Counts',
        data: namedArrays.FridayHourlyData,
        borderColor: 'rgba(200, 74, 8, 1)',
        backgroundColor: 'rgba(200, 74, 8, 0.2)',
        borderWidth: 2,
        fill: false,
      },{
        label: 'Saturdayday Hourly Counts',
        data: namedArrays.SaturdayHourlyData,
        borderColor: 'rgba(128, 173, 173, 1)',
        backgroundColor: 'rgba(128, 173, 173, 0.2)',
        borderWidth: 2,
        fill: false,
      }]
    }

    const options = {
      scales: {
        x: {
          stacked: true,
          type: 'category',
          position: 'bottom',
          stepSize: 1,
          min: 0, max: 23,
          ticks: {
            callback: function (value) {
              return value + ':00' // Format the x-axis labels to show the hour in 24-hour format
            }
          }
        },
        y: {
          stacked: true,
        }
      },
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        datalabels: {
          anchor: 'end',
          align: 'top',
          formatter: (value, context) => {
            const datasetArray = []
            context.chart.data.datasets.forEach((dataset) => {
              if (dataset.data[context.dataIndex] != undefined) {
                datasetArray.push(dataset.data[context.dataIndex])
              }
            })

            // if you have more values on the array, it will automatically scale
            // if you have less values, it will reduce itself b/c of the undefined filter
            function totalSum(total, datapoint) {
              return total + datapoint
            }

            // reduce the array into a single value
            let sum = datasetArray.reduce(totalSum, 0)
            //console.log(context.datasetIndex)
            //console.log(datasetArray.length) datasetArray.length currently is equal to 4, for we only have 4 days of data
            if (context.datasetIndex === datasetArray.length - 1) {
              return sum
            } else {
              return ''
            }
          }
        }
      },
    }



    const config = {
      type: 'bar',
      data,
      options,
      plugins: [ChartDataLabels]
    }

    const chart = new Chart(
      document.getElementById("js_hourly_chart"),
      config
    )
  } catch (error) {
    console.error("An error occurred in hourlyChart(): ", error.message)
  }
}

/**************************************/
/**************************************/

function dayChart() {
  try{
    // initialize needed data
    const dayCounts = {}
    // Iterate through the date objects and increment the hourly counts
    dateObjects.forEach((date) => {
      // getDay() returns an integer, such that 0=Sunday, 1=Monday
      const day = date.getDay()
      dayCounts[day] = (dayCounts[day] || 0) + 1
    })

    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const dayLabels = weekdays

    let dayData = []
    for (i = 0; i < 7; i++) {
      dayData.push(dayCounts[i] || 0)
    }

    // draw grpah
    const data = {
      labels: dayLabels,
      datasets: [{
        label: 'daily Counts',
        data: dayData,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 2,
        fill: false,
      }]
    }

    const options = {
      scales: {
        x: {
          type: 'category',
          position: 'bottom',
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    }

    const config = {
      type: 'bar',
      data,
      options,
      plugins: [ChartDataLabels]
    }

    const chart = new Chart(
      document.getElementById("js_day_chart"),
      config
    )
  } catch (error) {
    console.error("An error occurred in dayChart(): ", error.message)
  }
}

/**************************************/
/**************************************/

dailiesChart() 
hourlyChart() 
dayChart()