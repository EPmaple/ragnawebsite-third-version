// to access the 'sort_order' value from the script tag
const seasonNumber = window.seasonNumber;
const seasonDataObject = window.seasonDataObject;
window.sortOrder = `sort_slimes=asc`;
//console.log(JSON.stringify(seasonDataObject));
//console.log(typeof JSON.stringify(seasonDataObject));

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
    const { name, slimes, zooms, ranking_slimes } = object;
    
    const rowClass = determineRankRow(ranking_slimes);
  
    const html = `
      <tr class="${rowClass}">
        <td class="ranking_number">#${ranking_slimes}</td>
        <td class="text">${name}</td>
        <td class="text">${slimes}</td>
        <td class="text">${zooms}</td>
      </tr>
    `;

    tableBodyHTML += html;
  }

  document.querySelector('.js-table-grid').innerHTML = tableBodyHTML;
}

/*****************************************************/
/*****************************************************/

function toSortData(seasonDataObject, sortOrder) {
  let sortedSeasonDataObject;

  if (sortOrder.startsWith("sort_name")) {
    if (sortOrder.endsWith("asc")) {
      sortedSeasonDataObject = Object.values(seasonDataObject).sort(function(a, b) {
        return b.name.localeCompare(a.name);
      });
    } else {
      sortedSeasonDataObject = Object.values(seasonDataObject).sort(function(a, b) {
        return a.name.localeCompare(b.name);
      });
    }
  } else if (sortOrder.startsWith("sort_slimes")) {
    if (sortOrder.endsWith("asc")) {
      sortedSeasonDataObject = Object.values(seasonDataObject).sort(function(a, b) {
        return a.slimes - b.slimes;
      });
    } else {
      sortedSeasonDataObject = Object.values(seasonDataObject).sort(function(a, b) {
        return b.slimes - a.slimes;
      });
    }
  } else if (sortOrder.startsWith("sort_zooms")) {
    if (sortOrder.endsWith("asc")) {
      sortedSeasonDataObject = Object.values(seasonDataObject).sort(function(a, b) {
        return a.zooms - b.zooms;
      });
    } else {
      sortedSeasonDataObject = Object.values(seasonDataObject).sort(function(a, b) {
        return b.zooms - a.zooms;
      });
    }
  }

  //console.log(`seasonDataObject: ${JSON.stringify(seasonDataObject)}`)
  //console.log(`sortedSeasonDataObject: ${sortedSeasonDataObject}`);
  return sortedSeasonDataObject;
};

//console.log(typeof toSortData(seasonDataObject, "sort_name=asc")); // typeof object
//console.log(toSortData(seasonDataObject, "sort_name=asc")); //z to a, works
//console.log(toSortData(seasonDataObject, "sort_name=desc")); //#, a to z, works
//console.log(toSortData(seasonDataObject, "sort_slimes=asc")); // up from 0,works
//console.log(toSortData(seasonDataObject, "sort_slimes=desc")); // down to 0, works
//console.log(toSortData(seasonDataObject, "sort_zooms=asc")); // up from 0, works
//console.log(toSortData(seasonDataObject, "sort_zooms=desc")); // down to 0, works


function toSortDataWrapper(group) {
  let sortedSeasonDataObject;
  console.log(`window.sortOrder beforehand: ${window.sortOrder}, group: ${group}`)

  if (window.sortOrder.startsWith(`sort_${group}`)) {
    if (window.sortOrder.endsWith('asc')) {
      sortedSeasonDataObject = toSortData(seasonDataObject, `sort_${group}=desc`);
      window.sortOrder = `sort_${group}=desc`;
    } else if (window.sortOrder.endsWith('desc')) {
      sortedSeasonDataObject = toSortData(seasonDataObject, `sort_${group}=asc`);
      window.sortOrder = `sort_${group}=asc`;
    };
  } else { //does not start with sort_${group}, ex. not sort_name
    sortedSeasonDataObject = toSortData(seasonDataObject, `sort_${group}=desc`);
    window.sortOrder = `sort_${group}=desc`;
  };

  console.log(`window.sortOrder afterwards: ${window.sortOrder}`)
  //console.log(typeof sortedSeasonDataObject);
  //console.log(JSON.stringify(sortedSeasonDataObject));
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

/*
  // Set the 'active' class for the current sort_order
  if (sort_order.startsWith('sort_name') && group === 'name') {
    tableHeader.classList.add('active');
  } else {
    tableHeader.classList.remove('active');
  }
  */

