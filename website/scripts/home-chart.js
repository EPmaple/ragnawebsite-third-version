/*
array of objects
console.log(seasonDataObjects);
console.log(typeof seasonDataObjects);
console.log(typeof [{}]);
*/

function calculateMean(values) {
  // reduce is an array method that iterates over the elements of an array
  // similar to SML, having an accumulator, and starting at an initial value of 0
  const sum = values.reduce((acc, val) => acc + val, 0);
  return sum / values.length;
}

function calculateStandardDeviation(values) {
  const mean = calculateMean(values);
  const squaredDifferences = values.map(val => (val - mean) ** 2);
  const variance = calculateMean(squaredDifferences);
  return Math.sqrt(variance);
}

/*********************************************/
/*********************************************/

let seasons = [];
let memberData = [];
let slimeData = [];
let zoomData = [];
//accessing each object inside 'seasondata'
for (let i = 0; i < seasonDataObjects.length; i++) {
  const object = seasonDataObjects[i];
  seasons.push(object.season_number);
  memberData.push(object.members);
  slimeData.push(object.slimes);
  zoomData.push(object.zooms);
};

/*********************************************/
/*********************************************/

function totalChart() {
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
    document.getElementById('totalChart'),
    config
  );
}

/*********************************************/
/*********************************************/

let slimesOverMember = [];
let zoomOverMember = [];

for (let i = 0; i < memberData.length; i++) {
  const slimes = slimeData[i];
  const members = memberData[i];
  const zooms = zoomData[i];

  const slimeQuotient = parseFloat((slimes/members).toFixed(2));
  const zoomQuotient = parseFloat((zooms/members).toFixed(2));
  //console.log(`slimeQuotient: ${slimeQuotient}, is of type: ${typeof slimeQuotient}`);

  slimesOverMember.push(slimeQuotient);
  zoomOverMember.push(zoomQuotient);
}

function perMemberChart() {
  const data = {
    labels: seasons,
    datasets: [
      {
        label: 'Slimes per member',
        data: slimesOverMember,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        yAxisID: 'y'
      },
      {
        label: 'Zooms per member',
        data: zoomOverMember,
        borderColor: 'rgba(54, 162, 235, 1)', // Customize the line color
        backgroundColor: 'rgba(54, 162, 235, 0.2)', // Customize the area fill color
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: false,
        type: 'linear',
        position: 'left',
        title: {
          display: true,
          text: 'Slimes and Zooms per Member'
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
    document.getElementById('perMemberChart'),
    config
  );
}

/*********************************************/
/*********************************************/

// need the total mean and standard deviation of data across all seasons
const slimeMean = calculateMean(slimesOverMember);
const slimeStandardDeviation = calculateStandardDeviation(slimesOverMember);

// to get the number of standard deviations each data point is above or below the mean
const slimeDeviation = slimesOverMember.map(val => (val - slimeMean) / slimeStandardDeviation);


function barColor() {
  return(ctx) => {
    const standard = 0;
    const values = ctx.raw;
    const color = values > standard ? 'rgba(255, 99, 132, 0.6)' : 'rgba(54, 162, 235, 0.6)';

    return color;
  }
}

function slimeStandardDeviationChart() {
  const data = {
    labels: seasons,
    datasets: [
      {
        label: 'Slimes Standard Deviation',
        data: slimeDeviation,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: barColor(),
        yAxisID: 'y'
      }
    ],
  };
  
  const options = {
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
    type: 'bar',
    data,
    options
  };
  
  const chart = new Chart(
    document.getElementById('slimeStandardDeviationChart'),
    config
  );
};

/*********************************************/
/*********************************************/

const modified_zoomOverMember = zoomOverMember.filter(val => val !== 0);
const zoomOverMember_seasons = seasons.slice(-modified_zoomOverMember.length);
const zoomMean = calculateMean(modified_zoomOverMember);
console.log(zoomMean);
const zoomStandardDeviation = calculateStandardDeviation(modified_zoomOverMember);
const zoomDeviation = modified_zoomOverMember.map(val => val !== 0 ? (val - zoomMean) / zoomStandardDeviation : 0);

function zoomStandardDeviationChart() {
  const data = {
    labels: zoomOverMember_seasons,
    datasets: [
      {
        label: 'Zooms Standard Deviation',
        data: zoomDeviation,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: barColor(),
        yAxisID: 'y'
      }
    ],
  };
  
  const options = {
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
    type: 'bar',
    data,
    options
  };
  
  const chart = new Chart(
    document.getElementById('zoomStandardDeviationChart'),
    config
  );
};


/************** To Run Chart Functions *************/
totalChart();
perMemberChart();
slimeStandardDeviationChart();
zoomStandardDeviationChart();


