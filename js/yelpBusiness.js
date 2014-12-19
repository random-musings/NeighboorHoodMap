

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
};

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
	
};


/*
* @returns false/true
* @param {business}  the business we will decide to filter
*	@description 
*		indicates if business meets the filter
*/
YelpBusiness.prototype.matchesFilter = function( filterText, includeDeals)
{
		filterText = filterText.toUpperCase();
		
		if(includeDeals)
		{
			return (this.deals.length>0);
		}
		
				//if filterText==deal then match all those with deals
		if(filterText.toUpperCase()==DEAL)
		{
			return  (this.deals.length>0);
		}
		
		//only apply filters if we have 2 or more characters
		if(!filterText || filterText.length<2)
		{
			return true;
		}
	
		//match on business name
		if(this.name.toUpperCase().indexOf(filterText)>-1)
		{
			return true;
		}
		
		//match on categories
		var categoryIx = 0;
		for(categoryIx in this.categories)
		{
			var category  = this.categories[categoryIx];
			if(category && category.toUpperCase().indexOf(filterText)>-1)
			{
				return true;
			}
		}
		
		//mathc on address
		if(this.address.toUpperCase().indexOf(filterText)>0)
		{
			return true;
		}
		
		//no match made
	return false;
};
