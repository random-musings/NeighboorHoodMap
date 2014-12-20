/*
* @class
* YelpReview handles the knockout binding to the html page
* 
* 
* javascript reference files
* YelpData.js
* YelpBusiness.js
* libs/knockout.simpleGrid.3.0.js
* libs/knockout-3.2.0.js
* 
*/


/*
* @public
* @constructor
* @param {yelpRetailers}  the data from yelp that will be shown
* 
*/
var YelpResultsView = function()
{
	this.retailers = ko.observableArray();
	this.markers = ko.observableArray();
		
  this.sortByName = function() {
        this.items.sort(function(a, b) {
            return a.name < b.name ? -1 : 1;
        });
    };
		
/* @public
*	@returns voiid
* @param {business}  the YelpBusiness objec that will be added to the list
*  @description this is the knockout display list
*/
	this.addRetailer = function(business)
	{
		this.retailers.push(business);
	};

/* 
* @public
* @return void
* @param {YelpMarker}  the YelpMarker class is added to the tracked lists
*
*/
	this.addMarker = function(marker)
	{
		this.markers.push(marker);
	};

/* 
* @public
* @return void
* @description remove all retailers from the list
*
*/	
 this.clearRetailers = function()
 {
			this.retailers.removeAll();
 };
 
/* 
* @public
* @return void
* @description remove all markers from the list
*
*/	
 this.clearMarkers = function()
 {
			this.markers.removeAll();
 };
 
};