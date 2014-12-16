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

    //create the information window
    google.maps.event.addListener(marker, 'click', function() {
      // your code goes here!
			
			infoWindow.open(yelp.map.map,marker);
			var business = yelp.findBusiness (marker);
			var details = "";
			
			//add screen shot
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
					
					
					if(business!=null)
				{
					details = document.createElement("div");
					details.innerHTML = infoWindowDetails.replace('NAME',business.name)
						 .replace('ADDRESS', business.address)
						 .replace('REVIEWURL',business.businessUrl)
						 .replace('REVIEW', business.reviewCount);
				
				}
				$("#details").empty();
				document.getElementById("details").appendChild( details);

			});					
    });
		
	this.mapMarkers.push(marker);
};


var infoWindowContent = '<div id="content" style="width:300px;height:450px;"></div><div id="details" style="background-color:white;font-size:1.5em;width:100%;height:150px;top:300px;position:absolute;z-index:999" ></div>';
var infoWindowDetails =		' NAME<br/>'+
																					'  ADDRESS <br/> '+
																					'  <a href="REVIEWURL" target="_new">REVIEW reviews</a>';

var infoWindow = new google.maps.InfoWindow({content:infoWindowContent});
		

		
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

