function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 3,
    center: {lat: 41, lng: -87},
    mapTypeId: 'terrain'
  });

  var flightPlanCoordinates = [
    {lat: locationValues.from.latitude, lng: locationValues.from.longitude},
    {lat: locationValues.to.latitude, lng: locationValues.to.longitude}
  ];

  var flightPath = new google.maps.Polyline({
    path: flightPlanCoordinates,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });

  flightPath.setMap(map);
}

function plot(){
  // conditional in case only one airport is selected or something
  if(!locationValues.from.latitude || !locationValues.to.latitude){
    alert('Please select two airports!');
  } else {
    let script = document.createElement('script');
    script.setAttribute('src', 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAySLhIxjqRv7jdCuP6YczDWT-Vh6N6DWE&callback=initMap');
    script.setAttribute('async', '');
    script.setAttribute('defer', '');

    let results = document.getElementById('results');
    while(results.firstChild) results.removeChild(results.firstChild);
    document.getElementById('body').appendChild(script);

    // append distance display
    displayDistance();

    let mapDiv = document.createElement('div');
    mapDiv.id = 'map';
    results.appendChild(mapDiv);
  }
}

// copied from http://www.geodatasource.com/developers/javascript
function calculateDistance(lat1, lon1, lat2, lon2) {
	let radlat1 = Math.PI * lat1/180;
	let radlat2 = Math.PI * lat2/180;
	let theta = lon1-lon2;
	let radtheta = Math.PI * theta/180;
	let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist);
	dist = dist * 180/Math.PI;
	dist = dist * 60 * 1.1515;
	dist = dist * 0.8684;
	return dist;
}

function displayDistance(){
  let distance = Math.round(calculateDistance(locationValues.from.latitude, locationValues.from.longitude, locationValues.to.latitude, locationValues.to.longitude));
  let distanceDiv = document.getElementById('distance');
  let distanceHTML = document.createElement('h2');
  distanceHTML.innerHTML = `Distance: ${distance} Nautical Miles`;
  distanceDiv.appendChild(distanceHTML);
}
