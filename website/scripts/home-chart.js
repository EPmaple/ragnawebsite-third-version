console.log(jsonDataString);
console.log(typeof jsonDataString);
console.log(typeof [{}]);

let seasons = [];
let memberData = [];
let slimeData = [];
let zoomData = [];
//accessing each object inside 'seasondata'
for (let i = 0; i < jsonDataString.length; i++) {
  const object = jsonDataString[i];
  seasons.push(object.season_number);
  memberData.push(object.members);
  slimeData.push(object.slimes);
  zoomData.push(object.zooms);
};

const data = {
  labels: seasons,
  datasets: [
    {
      label: 'Number of Slimes',
      data: slimeData,
      borderColor: 'rgba(255, 99, 132, 1)',
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      yAxisID: 'y'
    },
    {
      label: 'Number of Members',
      data: memberData,
      borderColor: 'rgba(54, 162, 235, 1)', // Customize the line color
      backgroundColor: 'rgba(54, 162, 235, 0.2)', // Customize the area fill color
    },
    {
      label: 'Number of Zooms',
      data: zoomData,
      borderColor: 'rgba(240, 240, 240, 1)', // Customize the line color
      backgroundColor: 'rgba(240, 240, 240, 0.2)', // Customize the area fill color
    },
  ],
};


const options = {
  scales: {
    y: {
      beginAtZero: false,
      type: 'logarithmic',
      position: 'left',
      title: {
        display: true,
        text: 'Slimes/Members/Zooms'
      },
    }
  },
  interaction: {
    mode: 'nearest',
    intersect: false
  },
  plugins: {
    tooltip: {
      callbacks: {
        title: function(context) {
          // Modify the tooltip title based on the x-axis label
          return 'Ragna Season ' + context[0].label;
        }
      }
    }
  },
};

//config
const config = {
  type: 'line',
  data,
  options
};

const chart = new Chart(
  document.getElementById('ragnaChart'),
  config
);