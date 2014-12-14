/*
* @class
* This file handles the google map, street view and markers
* 
* 
* javascript reference files
*  https://maps.googleapis.com/maps/api/js?v=3.exp
*/


/*
* @public
* @constructor
* @param {mapCanvasId}  id of the html div  that will show the map
* @param {initialLocation} GPS coordinates of the map we will show
*/
var GoogleMap = function(mapCanvasId,initialLocation)
{
	this.mapId = mapCanvasId;
	this.mapLocation = initialLocation;
	this.map = {};
	this.panorama = {};
	this.inPanorama = false;
	this.mapMarkers = [];
	this.initMap();
	this.initPanorama();
	this.infowindow = new google.maps.InfoWindow(); 
};


/*
* @returns void
*	@description 
*		initiailizes the map
*/
GoogleMap.prototype.initMap = function()
{
	this.mapOptions = {
		center: this.mapLocation,
		zoom:ZOOM,
		streetViewControl: false
	}
	 this.map = new google.maps.Map(document.getElementById(this.mapId),
      this.mapOptions);
};


/*
* @returns void
*	@description 
*		initiailizes the street view
*/
GoogleMap.prototype.initPanorama = function()
{
  this.panorama = this.map.getStreetView();
  this.panorama.setPosition(this.mapLocation);
  this.panorama.setPov(/** @type {google.maps.StreetViewPov} */({
    heading: 265,
    pitch: 0
  }));
};


/*
* @returns void
*	@description 
*		Hides or shows the street view
*/
GoogleMap.prototype.toggleStreetView = function()
{
	this.mapOptions.center = this.mapLocation; //recenter the map
  this.inPanorama = !this.panorama.getVisible();
  this.panorama.setVisible(this.inPanorama);

};


/*
* @returns void
*	@description 
*		adds a marker to the map
*   code Credit: https://developers.google.com/maps/documentation/javascript/examples/marker-remove
*/
GoogleMap.prototype.addMarker = function(pLocation,pIcon,pTitle)
{
console.log("in add marker "+pIcon+" "+pTitle);
	var marker = new google.maps.Marker({
		position: pLocation,
		map: this.map,
		icon: pIcon,
		title: pTitle});
	


    // hmmmm, I wonder what this is about...
    google.maps.event.addListener(marker, 'click', function() {
      // your code goes here!
			
			infoWindow.open(yelp.map.map,marker);
			var pano = null;
			google.maps.event.addListener(infoWindow, 'domready', function () {
					if (pano != null) {
							pano.unbind("position");
							pano.setVisible(false);
					}
					pano = new google.maps.StreetViewPanorama(document.getElementById("content"), {
							navigationControl: true,
							navigationControlOptions: { style: google.maps.NavigationControlStyle.ANDROID },
							enableCloseButton: false,
							addressControl: false,
							linksControl: false
					});
					pano.bindTo("position", marker);
					pano.setVisible(true);
			});					
    });
		
	this.mapMarkers.push(marker);
};

var infoWindow = new google.maps.InfoWindow({content:'<div id="content" style="width:250px;height:300px;"></div>'});
		

		
/*
* @returns void
*	@description 
* Sets the map on all markers in the array.
* if map is null then markers are removed
*/
GoogleMap.prototype.setAllMap = function(map) {
  for (var i = 0; i < this.mapMarkers.length; i++) {
    this.mapMarkers[i].setMap(map);
  }
};


/*
* @returns void
*	@description 
* removes markers from map. Keeps them in memory
* call deleteMarkers to remove them from map and delete from memory
* call showMarkers to make them appear again
*/
GoogleMap.prototype.clearMarkers = function() {
  this.setAllMap(null);
};


/*
* @returns void
*	@description 
* shows markers on the map.
* call clearMarkers to remove them from map
* call deleteMarkers to remove them from map and delete from memory
*/
GoogleMap.prototype.showMarkers = function() {
  this.setAllMap(this.map);
};

/*
* @returns void
*	@description 
* deletes markers on the map and in memory
* call clearMarkers to remove them from map but keep them in memory
*/
GoogleMap.prototype.deleteMarkers = function() {
  this.clearMarkers();
  this.mapMarkers = [];
};




/*
console.log("in googlemap.js");
console.log("map "+gmap.mapId);
console.log("map "+document.getElementById("map-canvas"));
console.log("panorama  "+gmap.panorama);


var cafe1=new google.maps.LatLng(36.9602286,-122.0199624);
var cafe1Icon ='http://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=cafe|FFFF00';
var cafe1Title ="cafe1";

var cafe2=new google.maps.LatLng(36.9602286,-122);
var cafe2Icon ='http://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=cafe|FFFF00';
var cafe2Title ="cafe2";

var cafe3=new google.maps.LatLng(36.961,-122.0199624);
var cafe3Icon ='http://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=dollar|00FF00';
var cafe3Title ="cafe3";

console.log("adding markers  "+gmap.mapMarkers);

gmap.addMarker(cafe1,cafe1Icon,cafe1Title);
gmap.addMarker(cafe2,cafe2Icon,cafe2Title);
gmap.addMarker(cafe3,cafe3Icon,cafe3Title);
console.log("adding markers  "+gmap.mapMarkers);
*/