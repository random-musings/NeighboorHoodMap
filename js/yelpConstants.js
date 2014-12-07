
var PINCHAR = "<PINCHAR>";
var GOOGLEPIN="http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld="+PINCHAR+"|DD0000";
var YELPDEALICON="http://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=dollar|00FF00";
var YELPURI ="http://api.yelp.com/v2/search";
var HTTPMETHOD = "GET";
var CALLBACK ="<CALLBACK";
var LONGITUDE = "<LONGITUDE>";
var LATITUDE = "<LATITITUDE>";
var LOCATION = "<LOCATION>";
var RADIUSFILTER = "<RADIUDFILTER>";
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
var YELPPARAMATERS  = 
						"callback="+CALLBACK+ //this is a jsonp callback parameter
						"&cli="+LATITUDE+","+LONGITUDE+
						"&location="+LOCATION+
						"&term="+SEARCHTERM+
						"&radius_filter="+RADIUSFILTER
						;