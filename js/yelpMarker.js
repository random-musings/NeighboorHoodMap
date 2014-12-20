/*
* @class
* This file handles the marker data for each result returned 
* this is called from YelpData when parsing results from yelp
* 
*/

var YelpMarker  =  function(name, businessIx, latitude, longitude,icon)
{
	this.name = name;
	this.businessIx = businessIx;
	this.latitude = latitude;
	this.longitude = longitude;
	this.icon = icon;
}