/*
* @class
* This file handles the yelp calls and puts everything on the google map
* 
* 
* javascript reference files
* YelpConstants.js
* YelpData.js
*	GoogleMap.js
* Oauth.js
* Sha.js
* jquery.min.js
*/

/*
* @public
* @constructor
* @param {map}  the GoogleMap object
* @param {initialLocation} GPS coordinates of the map we will show
*/
var Yelp = function(map, //the google map to add/remove markers from
					yelpCallBackFunction, //the function called after yelp returns
					termId, //html element ID for the filter phrase
					radius, //the max distance to search
					businessListElt //the html element to store businesses in
					)
{
	this.resultsView = new YelpResultsView();
	this.map = map;
	this.callBack = yelpCallBackFunction;
	this.yelpData = new YelpData(null);
	this.termId = termId; //$("#searchTerm").val();
	this.radius = radius; //"5000" ft
	this.businessListElt = businessListElt; 
	this.offset = 0; //used to count the number of businesses we recieved back from yelp
	this.currentViewWindow = 0; // used to control the offset  on the knockout observable array
	this.filterText =""; //this will filter out businesses 
};

/*
* @returns long
*	@description 
*		gets the UTC time in milliseconds since 1970
*/
Yelp.prototype.freshTimestamp = function()
{
 return OAuth.timestamp();
};


/*
* @returns 11 random characters
*	@description 
*		gets a 11 character salt to use for encrypting the secret keys
*/
Yelp.prototype.freshNonce = function()
{
 return OAuth.nonce(11);
};


/*
* @returns void
*	@description 
*		when the call to yelp succeeds this parses the returned data and 
*		updates map markers
*/
Yelp.prototype.fillYelpData = function(data)
{
	console.log("IN PARSE YELP");
	console.log(data);
	this.yelpData.loadYelpData(data,true);
	
	//search yelp again (if we can expect to get more results)
	this.loadMoreBusinesses(data.businesses.length);
};


/*
* @returns string
*	@description 
*		fills in the YELP url with the correct search information from the form
*/
Yelp.prototype.getYelpParams = function(offset)
{
	return YELPPARAMATERS.replace(SEARCHTERM,"show")
								.replace(CALLBACK,this.callBack)
								.replace(RADIUSFILTER,this.radius)
								.replace(OFFSET,offset);
};


/*
* @returns void
*	@description 
*		fills our yelpData with businesses (to a maximum of 100)
*		stops searching yelp if we get more than MAXRESULTS or
*    if the previous search returned less than LIMIT(20) businesses
*/
Yelp.prototype.loadMoreBusinesses = function(lastSearchResultCount)
{

		//check to see if we received less businesses than LIMIT (20) cause the  search has returned all businesses that matched
		//or check to see if we already have more than MAXRESULTS(100) businesses that were found
		if(lastSearchResultCount< LIMIT || this.yelpData.offset >MAXRESULTS)
		{
			this.loadResultsView(this.currentViewWindow);
			//we met our limit so load
			ko.applyBindings(this.resultsView.retailers,document.getElementById(this.businessListElt));
		}else
		{
			this.offset += LIMIT;
			this.searchYelp(this.offset);
		}
}


/*
*	@returns void
*	@description 
*		loads the knockout observable array as well as 
*/
Yelp.prototype.loadResultsView = function(offset )
{

	//clean up the existing map
	this.resultsView.clearMarkers();
	this.resultsView.clearRetailers();
	this.map.deleteMarkers();
	
	//get the filter text in case it changed
	this.filterText = $(searchTerm).val();
	
	var ix = 0;
	var actualIndex = offset;
	while (ix<DISPLAYLIMIT && actualIndex < this.yelpData.businesses.length)
	{
		var business = this.yelpData.businesses[actualIndex];
		if( business && this.matchesFilter(business, this.filterText))
		{
			//fill the list view
			this.resultsView.addRetailer(business);
			
			//put markers on the map
			var yelpMarker = this.yelpData.markers[actualIndex];
			this.resultsView.addMarker(yelpMarker);
			this.map.addMarker( 
						new google.maps.LatLng(yelpMarker.latitude, yelpMarker.longitude),
						yelpMarker.icon,
						yelpMarker.name);
			ix++;
		}
		actualIndex++;
	}
	
}


/*
*	@returns false
*	@description 
*		initiates a call to yelp
*/
Yelp.prototype.searchYelp = function(offset)
{
		var signatureBaseString = "";
		var normalizedParameters = "";
		var signature = "";
		var yelpFormParams = this.getYelpParams(offset);
		var accessor = { consumerSecret: OAUTHCONSUMERSECRET
									 , tokenSecret   : OAUTHTOKENSECRET};
		var message = { method: HTTPMETHOD
									, action: YELPURI
									, parameters: OAuth.decodeForm(yelpFormParams)
									};
		message.parameters.push(["oauth_version", OAUTHVERSION]);
		message.parameters.push(["oauth_consumer_key", OAUTHCONSUMERKEY]);
		message.parameters.push(["oauth_token", OAUTHTOKEN]);
		message.parameters.push(["oauth_timestamp", this.freshTimestamp()]);
		message.parameters.push(["oauth_nonce", this.freshNonce()]);
		
		OAuth.SignatureMethod.sign(message, accessor);
		normalizedParameters = OAuth.SignatureMethod.normalizeParameters(message.parameters);
		signatureBaseString = OAuth.SignatureMethod.getBaseString(message);
		signature =  OAuth.getParameter(message.parameters, "oauth_signature");
		

		//replace GET& with GET\u0026 cause yelp fails if we leave it in
		signatureBaseString = signatureBaseString.replace("GET&","GET\\u0026");
		
		//what we will send
		var yelpHttp = YELPURI;
		var yelpBody =  normalizedParameters
									+ "&oauth_signature="+encodeURIComponent(signature);
		var yelpUrl = yelpHttp+"?"+yelpBody;
		console.log(yelpUrl);
		
		$.ajax({
				url: yelpUrl,
				dataType: "jsonp",
				type: "GET",
				cache: true, //very very important disables the _=[timestamp] at the end of the request
				success: function(data){this.fillYelpData(data);},
				jsonpCallback: this.callBack,
				error: function (xhr, status, errorThrown) { yelp.errorInAjax(xhr,status,errorThrown);}
			});
		return false;
};


/*
* @returns void
*	@description 
*		if the ajax call to yelp fails information is printed to the console
*/
Yelp.prototype.errorInAjax = function(xhr, status, errorThrown)
{
	console.log("ERROR");
	console.log(xhr+" "+status+" "+errorThrown);
	console.log("offset = "+this.offset);

};


/*
* @returns false/true
* @param {business}  the business we will decide to filter
*	@description 
*		indicates if business meets the filter
*/
Yelp.prototype.matchesFilter = function(business,filterText)
{
		filterText = filterText.toUpperCase();
		
		if($("#dealFilter").checked())
		{
			return (business.deals.length>0);
		}
		
				//if filterText==deal then match all those with deals
		if(filterText.toUpperCase()==DEAL)
		{
			return  (business.deals.length>0);
		}
		
		//only apply filters if we have 2 or more characters
		if(!filterText || filterText.length<2)
		{
			return true;
		}
	
		
		//match on business name
		if(business.name.toUpperCase().indexOf(filterText)>-1)
		{
			return true;
		}
		
		//match on categories
		var categoryIx = 0;
		for(categoryIx in business.categories)
		{
			var category  = business.categories[categoryIx];
			if(category && category.toUpperCase().indexOf(filterText)>-1)
			{
				return true;
			}
		}
		
		//no match made
	return false;
};


Yelp.prototype.applyFilter = function()
{
	this.filterText= $(this.searchTerm).val();
	this.currentViewWindow = 0;
	this.loadResultsView(this.currentViewWindow);
};


/*
* @returns void
*	@description 
*	loads the next LIMIT(10) results into the knockout observable array
*/
Yelp.prototype.loadNext = function ()
{
	if(	this.currentViewWindow < this.yelpData.businesses.length)
	{
		this.currentViewWindow += DISPLAYLIMIT;
	}
	this.loadResultsView(this.currentViewWindow);
}


/*
* @returns void
*	@description 
*		loads the previous LIMIT(10) results into the knockout observable array
*/
Yelp.prototype.loadPrev = function ()
{
	if(this.currentViewWindow >0)
	{
		this.currentViewWindow -= DISPLAYLIMIT;
	}
	if(this.currentViewWindow <0)
	{
		this.currentViewWindow = 0;
	}	
	this.loadResultsView(this.currentViewWindow);
}
