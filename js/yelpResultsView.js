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
		
	this.addRetailer = function(business)
	{
		this.retailers.push(business);
	}
		
	this.addMarker = function(marker)
	{
		this.markers.push(marker);
	}
		
 this.clearRetailers = function()
 {
			this.retailers.removeAll();
 }
 
 this.clearMarkers = function()
 {
			this.markers.removeAll();
 }
 
};