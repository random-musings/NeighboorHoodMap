

var YelpBusiness = function(
									businessIx,
									businessId,
									businessName,
									businessUrl,
									businessImage,
									businessAddress,
									mobileUrl,
									ratingsImg,
									reviewCount,
									latitude,
									longitude,
									yelpCategories,
									yelpDeals,
									reviewCount,
									reviewUrl)
{
	this.name = businessName;
	this.businessId = businessId;
	this.businessIx = businessIx;
	this.businessUrl = businessUrl;
	this.imageUri = businessImage;
	this.ratingsImg = ratingsImg;
	this.reviewCount = reviewCount;
	this.mobileUrl = mobileUrl;
	this.address = businessAddress;
	this.latitude = latitude;
	this.longitude = longitude;
	this.categories = [];
	this.deals = [];
	this.loadDeals(yelpDeals);
	this.loadCategories(yelpCategories);
	this.reviewCount = reviewCount;
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


