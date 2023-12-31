const seasonNumber = window.seasonNumber;
const seasonDataObjects = window.jsonSeasonData;
//console.log(seasonDataObjects) // example object: 7: {id: 8, name: 'Cats On Mars', slimes: 3, zooms: 0, ranking_slimes: 10, time_between_slimes: "21:14:12"

window.sortOrder = `sort_slimes=asc`;

/*****************************************************/
/*****************************************************/

function determineRankRow(ranking_slimes) {
  let rowClass;

  switch (ranking_slimes) {
    case 1:
      rowClass = "first_rank_row";
      break;
    case 2:
      rowClass = "second_rank_row";
      break;
    case 3:
      rowClass = "third_rank_row";
      break;
    default:
      rowClass = "tbody_row";
      break;
  }
  return rowClass;
};

/*****************************************************/
/*****************************************************/

function tbodyHTML(sortedSeasonDataObject) {
  let tableBodyHTML = '';

  //accessing each object inside 'seasondata'
  for (let i = 0; i < sortedSeasonDataObject.length; i++) {
    
    const object = sortedSeasonDataObject[i];
    const { name, slimes, zooms, ranking_slimes, time_between_slimes } = object;
    
    const rowClass = determineRankRow(ranking_slimes);
  
    const html = `
      <tr class="${rowClass}">
        <td class="ranking_number">#${ranking_slimes}</td>
        <td class="text">${name}</td>
        <td class="text">${slimes}</td>
        <td class="text">${zooms}</td>
        <td class="text">${time_between_slimes}</td>
      </tr>
    `;

    tableBodyHTML += html;
  }

  document.querySelector('.js-table-grid').innerHTML = tableBodyHTML;
}

/*****************************************************/
/*****************************************************/

//   { time_between_slimes: "21:14:12" }, { time_between_slimes: "1 day, 6:23:37" }
// handles null values and timeStr of two different formats
function parseTime(timeStr) {
  // to handle 'null' values for 'time_between_slimes'
  if (timeStr === null) return null;

  const isDayFormat = timeStr.includes('day')

  // format is "days, hours:minutes:seconds"
  if (isDayFormat) {
    const [days, time] = timeStr.split(',')
    const [hours, minutes, seconds] = time.split(':').map(Number)
    return (parseInt(days) || 0) * 86400 + hours * 3600 + minutes * 60 + seconds
  } else { // timeStr doesn't contain 'day', of format "hours:minutes:seconds"
    const [hours, minutes, seconds] = timeStr.split(':').map(Number)
    return hours * 3600 + minutes * 60 + seconds
  }
}


function toSortData(seasonDataObjects, sortOrder) {
  let sortedSeasonDataObject;

  if (sortOrder.startsWith("sort_name")) {
    if (sortOrder.endsWith("asc")) {
      sortedSeasonDataObject = Object.values(seasonDataObjects).sort(function(a, b) {
        return b.name.localeCompare(a.name);
      });
    } else {
      sortedSeasonDataObject = Object.values(seasonDataObjects).sort(function(a, b) {
        return a.name.localeCompare(b.name);
      });
    }
  } else if (sortOrder.startsWith("sort_slimes")) {
    if (sortOrder.endsWith("asc")) {
      sortedSeasonDataObject = Object.values(seasonDataObjects).sort(function(a, b) {
        return a.slimes - b.slimes;
      });
    } else {
      sortedSeasonDataObject = Object.values(seasonDataObjects).sort(function(a, b) {
        return b.slimes - a.slimes;
      });
    }
  } else if (sortOrder.startsWith("sort_zooms")) {
    if (sortOrder.endsWith("asc")) {
      sortedSeasonDataObject = Object.values(seasonDataObjects).sort(function(a, b) {
        return a.zooms - b.zooms;
      });
    } else {
      sortedSeasonDataObject = Object.values(seasonDataObjects).sort(function(a, b) {
        return b.zooms - a.zooms;
      });
    }
  } else if (sortOrder.startsWith("sort_time_between_slimes")) {
    if (sortOrder.endsWith('asc')) {
      sortedSeasonDataObject = Object.values(seasonDataObjects).sort(function(a, b) {
        const timeA = parseTime(a.time_between_slimes)
        const timeB = parseTime(b.time_between_slimes)

        // To handle null values, push them to the end of the sorted list
        if (timeA === null && timeB === null) return 0
        if (timeA === null) return 1
        if (timeB === null) return -1

        return timeA - timeB
      })
    } else {
      sortedSeasonDataObject = Object.values(seasonDataObjects).sort(function(a, b) {
        const timeA = parseTime(a.time_between_slimes)
        const timeB = parseTime(b.time_between_slimes)

        if (timeA === null && timeB === null) return 0
        if (timeA === null) return -1
        if (timeB === null) return 1
        return timeB - timeA
      })
    }
  }
  /*
  let storage = []
  for (let i = 0; i < sortedSeasonDataObject.length; i++) {
    const object = sortedSeasonDataObject[i];
    const { time_between_slimes } = object;
    storage.push(time_between_slimes)
  }
  console.log(storage)
  */
  return sortedSeasonDataObject;
};

//console.log(typeof toSortData(seasonDataObjects, "sort_name=asc")); // typeof object
//console.log(toSortData(seasonDataObjects, "sort_name=asc")); //z to a, works
//console.log(toSortData(seasonDataObjects, "sort_name=desc")); //#, a to z, works
//console.log(toSortData(seasonDataObjects, "sort_slimes=asc")); // up from 0,works
//console.log(toSortData(seasonDataObjects, "sort_slimes=desc")); // down to 0, works
//console.log(toSortData(seasonDataObjects, "sort_zooms=asc")); // up from 0, works
//console.log(toSortData(seasonDataObjects, "sort_zooms=desc")); // down to 0, works


function toSortDataWrapper(group) {
  let sortedSeasonDataObject;
  //console.log(`window.sortOrder beforehand: ${window.sortOrder}, group: ${group}`)

  if (window.sortOrder.startsWith(`sort_${group}`)) {
    if (window.sortOrder.endsWith('asc')) {
      sortedSeasonDataObject = toSortData(seasonDataObjects, `sort_${group}=desc`);
      window.sortOrder = `sort_${group}=desc`;
    } else if (window.sortOrder.endsWith('desc')) {
      sortedSeasonDataObject = toSortData(seasonDataObjects, `sort_${group}=asc`);
      window.sortOrder = `sort_${group}=asc`;
    };
  } else { //does not start with sort_${group}, ex. not sort_name
    sortedSeasonDataObject = toSortData(seasonDataObjects, `sort_${group}=desc`);
    window.sortOrder = `sort_${group}=desc`;
  };

  //console.log(`window.sortOrder afterwards: ${window.sortOrder}, group: ${group}`)
  tbodyHTML(sortedSeasonDataObject);
};

/*****************************************************/
/*****************************************************/

//when header clicked, check current window.sortOrder, remove class 
//as group is passed in, add class with the help of the group parameter
function updateCaretIcon(group) {
  document.querySelectorAll('.js_table_header').forEach((tableHeader) => {
    tableHeader.classList.remove('caret-up', 'caret-down');
  });

  const tableHeader = document.querySelector(`[data-group="${group}"]`);
  if (window.sortOrder.startsWith(`sort_${group}`)) {
    if (window.sortOrder.endsWith('asc')) {
      tableHeader.classList.add('caret-down')
    } else if (window.sortOrder.endsWith('desc')) {
      tableHeader.classList.add('caret-up')
    };
  } else { //does not start with sort_${group}, ex. not sort_name
     tableHeader.classList.add('caret-down')
  };
};

/*****************************************************/
/******************* initialization ***************************/

//initializaiton: to add clickEvent to the tableHeaders
document.querySelectorAll('.js_table_header').forEach((tableHeader) => {
  //console.log(`${typeof tableHeader.dataset.group}, ${tableHeader.dataset.group}`);
  // example result of above line: string, name
  const group = tableHeader.dataset.group;

  tableHeader.addEventListener('click', () => {
    updateCaretIcon(group);
    toSortDataWrapper(group);
  });
});

//initialization: to set up default HTML data in tbody
toSortDataWrapper('slimes');

/******************* initialization *********************/
/****************************************************************/

