

var YelpBusiness = function(
									businessIx,
									businessId,
									businessName,
									businessUrl,
									mobileUrl,
									ratingsImg,
									reviewCount,
									latitude,
									longitude,
									yelpCategories,
									yelpDeals,
									reviewSnippet,
									reviewUrl)
{
	this.name = businessName;
	this.businessId = businessId;
	this.businessIx = businessIx;
	this.businessUrl = businessUrl;
	this.ratingsImg = ratingsImg;
	this.reviewCount = reviewCount;
	this.mobileUrl = mobileUrl;
	this.latitude = latitude;
	this.longitude = longitude;
	this.categories = [];
	this.deals = [];
	this.loadDeals(yelpDeals);
	this.loadCategories(yelpCategories);
	this.review = reviewSnippet;
	this.reviewUrl = reviewUrl;
};


YelpBusiness.prototype.loadDeals = function (deals)
{
	this.deals=[];
	for (dealIx in deals)
	{
		var yelpDeal = deals[dealIx];
		if(yelpDeal)
		{
			this.deals.push(yelpDeal);
		}
	}
}

YelpBusiness.prototype.loadCategories = function (categories)
{
	this.categories=[];
	
	for (categoryIx in categories)
	{
		var category = categories[categoryIx];
		if(category)
		{
			this.categories.push(category);
		}
	}
	
}


