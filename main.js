// make a tree for autocomplete
let nameTree = {};
let locationValues = {
  to: {
    longitude: null,
    latitude: null
  },
  from: {
    longitude: null,
    latitude: null
  }
};

function Node(value, isTermEnd, airport){
  this.value = value;
  this.children = {};
  this.isTermEnd = isTermEnd; // do i really need this? could just go until there are no children
  this.associatedAirport = airport || null;
}

function createTree(dataSet){
  // loop through array of objects
  for(let i in dataSet){
    buildOutChildNodes(dataSet[i]);
  }
}

function buildOutChildNodes(airportObj){
  // this builds nodes out for the name city and code of an airport
  let arrayOfValues = ["name", "city", "code"];
  for(let i = 0; i < arrayOfValues.length; i++){
    // make tree by following parent and building out child nodes
    let airportValue = airportObj[arrayOfValues[i]];

    // find if parent letter already exists in nameTree
    if(!nameTree[airportValue[0]]){
      nameTree[airportValue[0]] = new Node(airportValue[0], false);
    }

    // set currentParent to the desired object in nameTree
    let parentNode = nameTree[airportValue[0]];
    for(let j = 1; j < airportValue.length; j++){
      // if parentNode already has this letter as it's child, select that object
      if(parentNode.children[airportValue[j]]){
        parentNode = parentNode.children[airportValue[j]];
      } else {
        // if it doesnt, then create that child node
        if(j === airportValue.length - 1){
          // if we're at the end of the airportValue, flag this node as a possible ending place
          parentNode.children[airportValue[j]] = new Node(airportValue[j], true, airportObj);
        } else {
          // make new child node that is not an ending place
          parentNode.children[airportValue[j]] = new Node(airportValue[j], false);
        }
        // set new parentNode
        parentNode = parentNode.children[airportValue[j]];
      }
    }
  }
}

createTree(airportData);

// return an array of results from search
function searchThroughTree(searchTerm){
  let currentNode = nameTree[searchTerm[0].toUpperCase()];
  let resultsArray = [];
  let completedChildSearch = false;
  for(let i = 1; i < searchTerm.length; i++){
    currentNode = currentNode.children[searchTerm[i]] || currentNode.children[searchTerm[i].toUpperCase()];
  }
  return findResultsChildrenRecursively(currentNode);
}

// searches through parentNode's children to find all child nodes associated with truthy isTermEnd values
function findResultsChildrenRecursively(parentNode){
  let resultsArray = [];
  // since this search was originally intended to find airports by incomplete name,
  // I had to take into account the possibility of a complete name being the search term
  // thus, the if statement below
  if(!Object.keys(parentNode.children).length){
    resultsArray.push(parentNode);
  } else {
    for(let i in parentNode.children){
      let childNode = parentNode.children[i];
      if(childNode.isTermEnd){
        resultsArray.push(childNode.associatedAirport);
      }
      if(Object.keys(childNode.children).length){
        resultsArray = resultsArray.concat(findResultsChildrenRecursively(childNode));
      }
    }
  }
  return resultsArray;
}

function submitSearch(toOrFrom){
  let displayElement = document.getElementById(`${toOrFrom}-airport-display`);
  // removes all children already displayed
  while(displayElement.firstChild){
    displayElement.removeChild(displayElement.firstChild);
  }
  let searchTerm = document.getElementById(`${toOrFrom}-airport-name-input`).value;
  // find results
  let results = searchThroughTree(searchTerm);
  if(results.length === 1){
    // shows single airport in card format
    displayFoundAirport(null, results[0], toOrFrom);
  } else {
    // shows multiple airports
    createResults(results, toOrFrom, displayElement);
  }
}

function createResults(resultArray, toOrFrom, displayElement){
  let resultsLimit = resultArray.length < 15 ? resultArray.length : 15;
  // adds new results to display element
  for(let i = 0; i < resultsLimit; i++){
    let resultHTML = document.createElement('p');
    resultHTML.innerHTML = resultArray[i].name;
    resultHTML.id = `${toOrFrom}-found-airport-${i}`;
    // the line below caused significant hackiness, as I
    // had trouble passing the result into displayFoundAirport,
    // thus, I had to set an id number and toOrFrom on the class
    // of each result element
    resultHTML.setAttribute('onclick', 'displayFoundAirport');
    resultHTML.setAttribute('style', 'border: 1px solid #5e5c59');
    resultHTML.setAttribute('class', 'found-airport');
    resultHTML.onclick = displayFoundAirport;
    displayElement.appendChild(resultHTML);
  }
}

function displayFoundAirport(e, airportParameter, toOrFrom){
  let foundAirport;
  if(!toOrFrom){
    // hacky? why, yes.
    toOrFrom = e.target.id.split("-")[0];
  }

  if(e === null){
    if(!airportParameter.name){
      foundAirport = airportParameter.associatedAirport;
    } else {
      foundAirport = airportParameter;
    }
  } else {
    // find object by exact name
    foundAirport = searchThroughTree(document.getElementById(`${toOrFrom}-found-airport-${e.target.id[e.target.id.length - 1]}`).innerHTML)[0].associatedAirport;
  }

  // replace whatever is in the input with foundAirport

  // removes all children already displayed
  let display = document.getElementById(`${toOrFrom}-airport-display`);
  while(display.firstChild){
    display.removeChild(display.firstChild);
  }

  // this will display info about the airport in a more prominent fashion on the page
  let resultHTML = document.createElement('div');
  resultHTML.setAttribute('class', 'result-div');
  let nameHTML = document.createElement('h2');
  nameHTML.innerHTML = foundAirport.name;
  let codeHTML = document.createElement('p');
  codeHTML.innerHTML = `Code: ${foundAirport.code}`;
  let cityHTML = document.createElement('p');
  cityHTML.innerHTML = `City: ${foundAirport.city}`;
  let latitudeHTML = document.createElement('p');
  latitudeHTML.innerHTML = `Latitude: ${foundAirport.latitude}`;
  let longitudeHTML = document.createElement('p');
  longitudeHTML.innerHTML = `Longitude: ${foundAirport.longitude}`;
  let displayElement = document.getElementById(`${toOrFrom}-airport-display`);
  resultHTML.appendChild(nameHTML);
  resultHTML.appendChild(codeHTML);
  resultHTML.appendChild(cityHTML);
  resultHTML.appendChild(latitudeHTML);
  resultHTML.appendChild(longitudeHTML);
  displayElement.appendChild(resultHTML);

  // set locationValues for use in map plot function
  locationValues[toOrFrom].latitude = foundAirport.latitude;
  locationValues[toOrFrom].longitude = foundAirport.longitude;
}
