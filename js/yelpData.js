

var YelpData = function(yelpResponseData)
{
	this.markers = {};
	this.deals = {};
	this.businesses = [];
	this.listViewData = {};
	this.currentItemCount = 0;
	this.itemsToRetrieve = 10;
	this.isMobile = false;
	this.searchTerms ={};
	this.offset =0;
	this.loadYelpData(yelpResponseData, false);

};

YelpData.prototype.loadYelpData = function (yelpResponseData, append)
{
	if(!append)
	{
		this.businesses = [];
	}
	var businessIx = 0;
	var numResults  = yelpResponseData.businesses.length;
	for( businessIx in yelpResponseData.businesses)
	{
		var business = yelpResponseData.businesses[businessIx];
		if(business)
		{
			this.businesses[ Math.abs(this.offset) + Math.abs(businessIx)] = business;
		}
	}
	this.offset  = append? this.offset+ numResults:numResults;
	this.LoadLocationMarker(append);
};

YelpData.prototype.LoadLocationMarker = function(append)
{
	//clear out the existing markers
	if(!append)
	{
		this.markers = [];
	}
	var businessIx = 0;
	for( businessIx in this.businesses)
	{
		var business = this.businesses[businessIx];
		if(business)
		{
			var yelpMarker = new YelpMarker(business.name,
												business.id,
												business.location.coordinate.latitude,
												business.location.coordinate.longitude,
												GOOGLEPIN.replace(PINCHAR,businessIx)); //icon
			this.markers.push(yelpMarker);
		}
	}
};

YelpData.prototype.LoadDealMarkers = function(append)
{
	var businessIx = 0;
	for(businessIx in this.businesses)
	{
		var business = this.businesses[businessIx];
		if(business && business.deals)
		{
			var yelpMarker = new YelpMarker(business.name,
																			business.id,
																			business.location.coordinate.latitude,
																			business.location.coordinate.longitude,
																			YELPDEALICON);
			this.markers.push(yelpMarker);
		}
	}
};

YelpData.prototype.FormatListView = function(isMobile)
{
	var businessHTML = "";
	var businessIx = 0;
	for( businessIx in this.businesses)
	{
		var business = this.businesses[businessIx];
		if(business)
		{
			businessHTML += "<hr/>";
			businessHTML += this.FormatBusiness(business, isMobile);
		}
	}
	console.log("YELP DATA FormatListView:"+businessHTML);
	return businessHTML;
};

YelpData.prototype.FormatBusiness = function(business,isMobile)
{
	var businessHTML = "";
	if(business)
	{
		var url = isMobile?business.mobile_url:business.url;
		businessHTML += "<a href='"+url+"'>"+business.name+"</a> ";
		businessHTML += "<img src='"+business.rating_img_url_small+"'/><br/>";
		businessHTML += " "+business.categories[0][0]+"<br/>";
	//	businessHTML += business.snippet_text+"<br/>";
		
		if(business.deals || business.gift_certificates)
		{ 
			var couponCount = 0;
			if(business.deals)
				couponCount += business.deals.length;
			if(business.gift_certificates)
				couponCount += business.gift_certificates.length;
			businessHTML += "Coupons:"+couponCount+"<br/>";
		}
	}
	return businessHTML;
}