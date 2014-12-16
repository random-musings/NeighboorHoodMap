

var YelpData = function(yelpResponseData)
{
	this.markers = [];
	this.deals = {};
	this.businesses = [];
	this.listViewData = {};
	this.currentItemCount = 0;
	this.itemsToRetrieve = 10;
	this.isMobile = false;
	this.searchTerms ={};
	this.loadYelpData(yelpResponseData, false);

};

		
		
/*
*  @returns void
*	@description 
*		loads the JSON data from yelp into a retailers array (for use by knockout)
*   	keeps the json data in a businesses object so that additional details can be queried at a later date
*/
YelpData.prototype.loadYelpData = function (yelpResponseData, append)
{

	if(!yelpResponseData)
		return;
	if(!append)
	{
		this.businesses = [];
	}
	
	var numResults  = yelpResponseData.businesses.length;
	var busCount = this.businesses.length;
	for( businessIx in yelpResponseData.businesses)
	{
		var business = yelpResponseData.businesses[businessIx];
		if(business)
		{
			busCount++;
			business.ix = busCount; //record the order of the search results
			var Categories = [];
			for(catIx in business.categories)
			{
				Categories.push(business.categories[catIx][0]);
			}
			var yelpBusiness = new YelpBusiness(
										business.ix,
										business.id,
										business.name,
										business.url,
										this.formatAddress(business),
										business.mobile_url,
										business.rating_img_url_small,
										business.review_count,
										business.location.coordinate.latitude,
										business.location.coordinate.longitude,
										Categories,
										business.deals,
										business.review_count,
										business.snippet_image_url
										);
			this.businesses.push(yelpBusiness);
		}
	}
	this.currentItemCount  = append? this.currentItemCount+ numResults:numResults;
	this.loadLocationMarker();
};


/*
*  @returns string
*	@description 
*	create a colored pin icon - red is normal pin markers
*  green indicates a deal is available
*/
YelpData.prototype.getPinIcon = function(business)
{
	var color = (business.deals.length>0)?PINGREEN:PINRED;
	return GOOGLEPIN.replace(PINCHAR,business.businessIx)
									.replace(PINCOLOR,color);
};


/*
*  @returns void
*	@description 
*			create an array of pin markers so that they can be placed on the google map
*/
YelpData.prototype.loadLocationMarker = function()
{
	//clear out the existing markers

		this.markers = [];

	var businessIx = 0;
	for( businessIx in this.businesses)
	{
		var business = this.businesses[businessIx];
		if(business)
		{
			var pinMarker = this.getPinIcon(business);
			var yelpMarker = new YelpMarker(business.name,
												business.id,
												business.latitude,
												business.longitude,
												pinMarker); //icon
			this.markers.push(yelpMarker);
			
		}
	}
};


/*
*  @returns string
*	@description 
*			create a string corresponding to the business address
*/
YelpData.prototype.formatAddress = function(business)
{
	var address = "";
	address = business.location.address.join('<br/> ');
	address +='<br/>  '+business.location.city+' ';
	address +=business.location.country_code+'  ';
	address +=business.location.postal_code+'  ';
	return address;
}


