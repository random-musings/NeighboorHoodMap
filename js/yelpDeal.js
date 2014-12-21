

/*
* @class
* This file holds each deals provided by yelp
* this is called from yelpBusinessWithDeals.js when parsing results from yelp
*/


var YelpDeal =  function(dealName, dealUri)
{
	this.name = dealName;
	this.dealUrl = dealUri;
};