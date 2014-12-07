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
					locationId, //the html element containing the text string
					latitudeId, //the html element for the latitude 
					longitudeId, //html element id for the longitude
					termId, //html element ID for the search phrase
					radius, //the max distance to search
					businessListElt //the html element to store businesses in
					)
{
	this.map = map;
	this.callBack = yelpCallBackFunction;
	this.yelpData ={};
	this.locationId = locationId;// $("#location").val();
	this.latitudeId = latitudeId; //$("#latitude").val();
	this.longitudeId = longitudeId; //$("#longitude").val();
	this.termId = termId; //$("#searchTerm").val();
	this.radius = radius; //"5000" ft
	this.businessListElt = businessListElt; 
};

/*
* @returns long
*	@description 
*		gets the UTC time in milliseconds since 1970
*/
Yelp.prototype.freshTimestamp = function()
{
 return OAuth.timestamp();
}


/*
* @returns 11 random characters
*	@description 
*		gets a 11 character salt to use for encrypting the secret keys
*/
Yelp.prototype.freshNonce = function()
{
 return OAuth.nonce(11);
}

/*
* @returns void
*	@description 
*		prints out the error encountered when the ajax call to yelp fails
*/
Yelp.prototype.parseYelpError = function(data)
{
	console.log("ERROR PARSING YELP");
	console.log(data);
}


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
	this.yelpData = new YelpData(data,false);
	var divElt = document.createElement("div");
	divElt.innerHTML = this.yelpData.FormatListView();
	$(this.businessListElt).innerHTML="";
	$(this.businessListElt).empty();
	$(this.businessListElt).append(divElt);
	
	//clear & add the map markers
	this.map.deleteMarkers();
	var i=0;
	for(i in this.yelpData.markers)
	{
		var yelpMarker = this.yelpData.markers[i];
		if(yelpMarker)
		{
			this.map.addMarker( 
					new google.maps.LatLng(yelpMarker.latitude, yelpMarker.longitude),
					yelpMarker.icon,
					yelpMarker.name);
		}
	}
}


/*
* @returns string
*	@description 
*		fills in the YELP url with the correct search information from the form
*/
Yelp.prototype.getYelpParams = function()
{
	var location= $(this.locationId).val();//"#location"
	var latitude = $(this.latitudeId).val();//"#latitude"
	var longitude = $(this.longitudeId).val();//"#longitude"
	var term = $(this.termId).val();//"#searchTerm"
	return YELPPARAMATERS.replace(SEARCHTERM,term)
								.replace(LOCATION,location)
								.replace(LATITUDE,latitude)
								.replace(LONGITUDE,longitude)
								.replace(CALLBACK,this.callBack)
								.replace(RADIUSFILTER,this.radius);
}


/*
* @returns false
*	@description 
*		initiaies the call to yelp
*/
Yelp.prototype.searchYelp = function()
{
	var signatureBaseString = "";
	var normalizedParameters = "";
	var signature = "";
	var yelpFormParams = this.getYelpParams();
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
			jsonpCallback: this.callBack
		});
	return false;
};

