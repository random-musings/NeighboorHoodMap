/*
* @class
* This file holds each business returned by yelp
* this is called from YelpData when parsing results from yelp
*/


/*
* @public
* @constructor
* @description 
*		loads the JSON data from yelp into an object
*/
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
									yelpDeals)
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
	this.printDetails();
};

/*
* @public
* @returns void
* @description 
*		loads deals into an array 
*/
YelpBusiness.prototype.loadDeals = function (deals)
{
	this.deals=[];
	var dealIx;
	for (dealIx in deals)
	{
		var yelpDeal = deals[dealIx];
		if(yelpDeal)
		{
			this.deals.push(yelpDeal);
		}
	}
};


/*
* @public
* @returns void
* @description 
*		loads the main category headers into an array so we can use 
*		the category to filter the businesses from the list
*/
YelpBusiness.prototype.loadCategories = function (categories)
{
	this.categories=[];
	var categoryIx;
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
* @returns true if the business name, address, categories matches the filterText - 
*						returns true if includeDeals is true and the business has 1 or more deals in the array
* @param {filterText}  the string used to match 
* @param {includeDeals} if true then if the business has deals the function will return true regardless of the filterText match
*	@description 
*		indicates if business matches the filterText or includeDeals is true and this business has deals
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
		
		//match on address
		if(this.address.toUpperCase().indexOf(filterText)>0)
		{
			return true;
		}
		
		//no match made
	return false;
};



YelpBusiness.prototype.printDetails = function()
{

	console.log(" \"name\":\""+this.name+"\",\n"+
						"\"businessId\":\""+this.businessId+"\",");
	console.log("\"businessIx\":"+this.businessIx+",");
	console.log("\"businessUrl\":\""+this.businessUrl+"\",");
	console.log("\"imageUri\":\""+this.imageUri+"\",");
	console.log("\"ratingsImg\":\""+this.ratingsImg+"\",");
	console.log("\"reviewCount\":"+this.reviewCount+",");
	console.log("\"mobileUrl\":\""+this.mobileUrl+"\",");
	console.log("\"address\":\""+this.address+"\",");
	console.log("\"latitude\":"+this.latitude+",");
	console.log("\"longitude\":"+this.longitude+",");
	console.log("\"categories\":\""+this.categories.join("\",\"")+"\",");
	console.log("\"deals\":["+this.deals.join("\",\"")+"],");
	
	console.log(" new YelpBusiness(");
	console.log(" 							"+this.businessIx+",");
	console.log(" 							"+this.businessId+"\",");
	console.log(" 	 \""+this.name+"\",");
	console.log("    \""+this.businessUrl+"\",");
	console.log("     \""+this.imageUri+"\",");
	console.log("	\""+this.address+"\",");
	console.log("	\""+this.mobileUrl+"\",");
	console.log("	\""+this.ratingsImg+"\",");
	console.log("	"+this.reviewCount+",");
	console.log("	"+this.latitude+",");
	console.log("		"+this.longitude+",");
	console.log("     ["+this.categories.join("\",\"")+"],");
	console.log("	  ["+this.deals.join("\",\"")+"]);");

};