const slime_records = window.slime_records
// seasonNumber already declared in ranking-button.js, which is introduced before this file 
// console.log(slime_records[0]) // {1: {'time': '2023-07-20 14:29:46.408000', 'member_id': '197085461624127488'}}
// console.log(slime_records[0][1]) // {'time': '2023-07-20 14:29:46.408000', 'member_id': '197085461624127488'}
// console.log(slime_records[0][1].time) // '2023-07-20 14:29:46.408000'

// To show the canvas and slider
document.getElementById("js_dailies_chart").style.display = "block"
document.getElementById("js_dailies_slider").style.display = "block"

// console.log(typeof slime_records) slime_records is a list of objects

let timestamps = []
// Extract timestamps and number of slimes
for (let i = 0; i < slime_records.length; i++) {
  const time = slime_records[i][i+1].time
  timestamps.push(time)
}

// Generate an array with a value of 1 for each timestamp (since there's one slime per timestamp)
const slimeCounts = Array.from({length: timestamps.length}, () => 1)
//console.log(slimeCounts)

function dailiesChart() {
  const data = {
    labels: timestamps,
    datasets: [
      {
        label: 'Number of Slimes',
        data: slimeCounts,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 2,
        fill: false,
      }
    ]
  }
  
  const options = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'hour',
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

  const ctx = document.getElementById("js_dailies_chart").getContext("2d")

  const chart = new Chart(ctx, config)
  
  /*
  const chart = new Chart(
    document.getElementById("js_dailies_chart"),
    config
  )
  */
}

dailiesChart()