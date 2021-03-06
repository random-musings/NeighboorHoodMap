/*
* @class
* This file handles the google map, street view and markers
* 
* 
* javascript reference files
*  https://maps.googleapis.com/maps/api/js?v=3.exp
*/

//create content based on screen size
var infoWindowContent = '<div id="content" class="infoWindowPano" style="width:250px;height:350px;"></div><div id="details" style="	background-color:white;	font-size:1.3em;	width:270px;	top:-8px;	left:-5px;	position:absolute;	z-index:999;" ></div>';
var infoWindowContentMobile = '<div id="content" class="infoWindowPano" style="width:175px;height:250px;"></div><div id="details" style="	background-color:white;	font-size:1em;	width:181px;	top:-8px;	left:-5px;	position:absolute;	z-index:999;" ></div>';

var infoWindowDetails =		''+
											' NAME<br/>'+
											'  ADDRESS <br/> '+
											' <a href="REVIEWURL" target="_blank">REVIEW reviews</a><br/>'+
											'DEALS'+
											'<center><img src="IMAGE" style="left:0:top:0;height:145px" /></center> ';

//will be set in neighborhoodview load
var infoWindow;

/*
* @public
* @constructor
* @param {mapCanvasId}  id of the html div  that will show the map
* @param {initialLocation} GPS coordinates of the map we will show
*/
var GoogleMap = function(mapCanvasId, initialLocation)
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
	};
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
GoogleMap.prototype.addMarker = function(pLocation, pIcon, pTitle)
{
	console.log("in add marker "+pIcon+" "+pTitle);
	var marker = new google.maps.Marker({
		position: pLocation,
		map: this.map,
		icon: pIcon,
		title: pTitle});

    //create the information window
    google.maps.event.addListener(marker, 'click', function() {
    
		infoWindow.open(yelp.map.map,marker);
		var business = yelp.findBusiness (marker);
		var details = "";
		//change markers back to their original icons
		yelp.resetMarkers();
		
		//set the clicked marker to have a yellow icon
		marker.setIcon (GOOGLEYELLOWICON);
	
		google.maps.event.addListener(infoWindow, 'domready', function () {
			
				if(business !== null)
			{
				details = document.createElement("div");
				details.innerHTML = infoWindowDetails.replace('NAME', business.name)
					 .replace('ADDRESS', business.address)
					 .replace('REVIEWURL', business.businessUrl)
					 .replace('REVIEW', business.reviewCount)
					 .replace('IMAGE', business.imageUri)
					 .replace('DEALS',business.deals);
			
			}
			$("#details").empty();
			document.getElementById("details").appendChild( details);
			
		});					
    });
		
	this.mapMarkers.push(marker);
};


		
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

