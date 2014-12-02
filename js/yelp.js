var YELPURI ="http://api.yelp.com/v2/search";
var HTTPMETHOD = "GET"
var CALLBACK ="<CALLBACK";
var LONGITUDE = "<LONGITUDE>";
var LATITUDE = "<LATITITUDE>";
var LOCATION = "<LOCATION>";
var SEARCHTERM = "<SEARCHTERM>";
var TIMESTAMP ="<TIMESTAMP>";
var SW_LATITUDE = 38;
var SW_LONGITUDE = 122;
var NE_LATITUDE = 35;
var NE_LONGITUDE = -118;
var OAUTHCONSUMERKEY = "Eqqi19ncmOaaRY8OlZMPog";
var OAUTHTOKEN = "GkjmQjkZoVeNZyAPIAiCYMl6xctechN8";
var OAUTHSIGNATUREMETHOD = "HMAC-SHA1";
var OAUTHSIGNATURE  ="<OAUTHSIGNATURE>";
var OAUTHCONSUMERSECRET = "zOLX5jD0z9NeF5BQjkkXl2KXV7A";
var OAUTHTOKENSECRET = "Vbxnk7Wr1kZI1Px7KwWhNCqatwg";
var OAUTHNONCE = "<NONCE>";
var OAUTHVERSION = "1.0";


//OAUTH Calculated Parameters
var normalizedParameters = "";
var signatureBaseString = "";
var signature = "";
var authorizationHeader ="";


function freshTimestamp() {
   return OAuth.timestamp();
}
function freshNonce() {
   return OAuth.nonce(11);
}		


var yelpParameters = 
						//"bounds="+SW_LATITUDE+","+SW_LONGITUDE+","+NE_LATITUDE+","+NE_LONGITUDE+
						"callback="+CALLBACK+ //this is a jsonp callback parameter
						"&cli="+LATITUDE+","+LONGITUDE+
						"&location="+LOCATION+
						"&term="+SEARCHTERM
						;
				
						
function parseYelpError(data)
{
	console.log("ERROR PARSING YELP");
	console.log(data);
}
						
function parseYelp(data)
{
	console.log("IN PARSE YELP");
	console.log(data);
}


function getYelpParams()
{
	var location = $("#location").val();
	var latitude = $("#latitude").val();
	var longitude = $("#longitude").val();
	var term = $("#searchTerm").val();
	
	return yelpParameters.replace(SEARCHTERM,term)
								.replace(LOCATION,location)
								.replace(LATITUDE,latitude)
								.replace(LONGITUDE,longitude)
								.replace(CALLBACK,'parseYelp');
}


function sign() {
	var yelpFormParams = getYelpParams()
	var accessor = { consumerSecret: OAUTHCONSUMERSECRET
								 , tokenSecret   : OAUTHTOKENSECRET};
	var message = { method: HTTPMETHOD
								, action: YELPURI
								, parameters: OAuth.decodeForm(yelpFormParams)
								};
	message.parameters.push(["oauth_version", OAUTHVERSION]);
	message.parameters.push(["oauth_consumer_key", OAUTHCONSUMERKEY]);
	message.parameters.push(["oauth_token", OAUTHTOKEN]);
	message.parameters.push(["oauth_timestamp", freshTimestamp()]);
	message.parameters.push(["oauth_nonce", freshNonce()]);
	
	OAuth.SignatureMethod.sign(message, accessor);
	normalizedParameters = OAuth.SignatureMethod.normalizeParameters(message.parameters);
	signatureBaseString = OAuth.SignatureMethod.getBaseString(message);
	signature =  OAuth.getParameter(message.parameters, "oauth_signature");
	authorizationHeader = OAuth.getAuthorizationHeader("", message.parameters);

	//replace GET& with GET\u0026
	signatureBaseString = signatureBaseString.replace("GET&","GET\\u0026");
	
	//console.log("signatureBaseString:"+signatureBaseString);
	//console.log("signature:"+signature+"  encoded:"+ encodeURIComponent(signature));
	//console.log("authorizationHeader:"+authorizationHeader);
	//console.log("normalizedParameters:"+normalizedParameters);
	
	
	//what we will send
	var yelpHttp = YELPURI ;
	var yelpBody =  normalizedParameters
								+ "&oauth_signature="+encodeURIComponent(signature);
	console.log(yelpHttp+"?"+yelpBody);
	
	$.ajaxSetup({cache: false});
	$.ajax({
			url: yelpHttp+"?"+yelpBody,
			dataType: "jsonp",
			type: "GET",
			cache: true, //very very important disables the _=[timestamp] at the end of the request
		//	success:function(data){console.log("success"); parseYelp(data);},
			error: function(data){console.log("error"); console.log(data );},
			jsonpCallback: 'parseYelp'
		});
	return false;
}

