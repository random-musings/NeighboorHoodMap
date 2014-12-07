var map;
var panorama;
var astorPlace = new google.maps.LatLng(40.729884, -73.990988);
var busStop = new google.maps.LatLng(40.729559678851025, -73.99074196815491);
var cafe = new google.maps.LatLng(40.730031233910694, -73.99142861366272);
var bank = new google.maps.LatLng(40.72968163306612, -73.9911389350891);


var googleMapMarkers =[];
//marker CRUD from https://developers.google.com/maps/documentation/javascript/examples/marker-remove
function addMarker(pLocation,pIcon,pTitle)
{
	var marker = new gogle.maps.Marker({
		position: pLocation,
		map: map,
		icon: pIcon,
		title: pTitle});
	googleMapMarkers.push(marker);
}

// Sets the map on all markers in the array.
function setAllMap(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setAllMap(null);
}

// Shows any markers currently in the array.
function showMarkers() {
  setAllMap(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
  clearMarkers();
  googleMapMarkers = [];
}

function initialize() {

  // Set up the map
  var mapOptions = {
    center: astorPlace,
    zoom: 18,
    streetViewControl: false
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);


			
  // Setup the markers on the map
  var cafeMarker = new google.maps.Marker({
      position: cafe,
      map: map,
      icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=cafe|FFFF00',
      title: 'Cafe'
  });

  var bankMarker = new google.maps.Marker({
      position: bank,
      map: map,
      icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=dollar|FFFF00',
      title: 'Bank'
  });

  var busMarker = new google.maps.Marker({
      position: busStop,
      map: map,
      icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=bus|FFFF00',
      title: 'Bus Stop'
  });

  // We get the map's default panorama and set up some defaults.
  // Note that we don't yet set it visible.
  panorama = map.getStreetView();
  panorama.setPosition(astorPlace);
  panorama.setPov(/** @type {google.maps.StreetViewPov} */({
    heading: 265,
    pitch: 0
  }));
}

function toggleStreetView() {
  var toggle = panorama.getVisible();
  if (toggle == false) {
    panorama.setVisible(true);
  } else {
    panorama.setVisible(false);
  }
}

google.maps.event.addDomListener(window, 'load', initialize);

