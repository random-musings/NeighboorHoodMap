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
	this.yelpData.loadYelpData(data, true);
	
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
	return YELPPARAMETERS.replace(SEARCHTERM,YELPSEARCHTERM)
								.replace(CALLBACK, this.callBack)
								.replace(RADIUSFILTER, this.radius)
								.replace(OFFSET, offset);
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
	if(lastSearchResultCount< LIMIT || this.offset >MAXRESULTS)
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
		if( business && business.matchesFilter( this.filterText,$("#dealFilter").is(':checked')))
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
 @description load the businesses  from Yelp as well as from the YelpBusinessWithDeals array
*/
Yelp.prototype.loadBusinesses = function(offset)
{
	//load businesses with deals
	var ix;
	for (	ix in YelpBusinessDeals)
	{
		this.yelpData.businesses.push(YelpBusinessDeals[ix]);
		this.offset++;
	}
	
	//search yelp
	this.searchYelp(offset);
};


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
		signatureBaseString = signatureBaseString.replace("GET&", "GET\\u0026");
		
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
				error: function (xhr, status, errorThrown) { yelp.errorInAjax(xhr, status, errorThrown);}
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
};


/*
* @returns void
*	@description 
*   reloads  businesses into the knockout observable array
*  called when the coupons is clicked or unclicked
*/
Yelp.prototype.reload = function()
{
	this.loadResultsView(this.currentViewWindow);
};

/*
* @returns void
*	@description 
*   reloads  businesses into the knockout observable array
*  called when the the search filter is changed
*/
Yelp.prototype.filterResults = function ()
{
	this.currentViewWindow = 0;
	if($(this.termId).val().length>=3 || $(this.termId).val().length===0 )
	{
		this.reload();
	}
	
};


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
};


/*
* @returns YelpBusiness
* @param {marker} the google marker from the map
*	@description 
*		using the title of the marker find a business in yelpData and return it
*/
Yelp.prototype.findBusiness = function (marker)
{
	var title = marker.title;
	var yelpIx;
	for(yelpIx in this.yelpData.businesses)
	{
		 var business = this.yelpData.businesses[yelpIx];
		 if(business.name === title)
		 {
				return business;
		 }
	}
	return null;
};


/*
* @returns void
* @param {leftPosition  the css position to move the searchBar to
*	@description 
*		loads the previous LIMIT(10) results into the knockout observable array
*/
Yelp.prototype.moveLeft = function()
{
	$("#searchBar").css('left', LISTLEFTPCT);
	$("#btnMoveLeft").hide();
	$("#btnMoveRight").show();
};



/*
* @returns void
* @param {leftPosition  the css position to move the searchBar to
*	@description 
*		loads the previous LIMIT(10) results into the knockout observable array
*/
Yelp.prototype.moveRight = function()
{
	$("#searchBar").css('left', LISTRIGHTPCT);
	$("#btnMoveLeft").show();
	$("#btnMoveRight").hide();
};




/*
* @returns void
*	@description 
* this is called when a marker is clicked - all markers are set back to their original red marker 
* 
*/
Yelp.prototype.resetMarkers = function( )
{
	var ix;
	var allMarkerIx;

	//go through all map markers
	for( ix in  this.map.mapMarkers)
	{
	
		//match them against the map markers that are currently being shown
		for(allMarkerIx in this.yelpData.markers)
		{
			var currMarker = this.map.mapMarkers[ix];
			var yelpMarker =  this.yelpData.markers[allMarkerIx];
			if(yelpMarker && currMarker)
			{
				if(yelpMarker.name === currMarker.title)
				{
					currMarker.setIcon ( yelpMarker.icon);
				}
			}
		}
	}
	
};