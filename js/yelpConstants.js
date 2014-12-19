
var CALLBACK = "<CALLBACK>";
var CATEGORYFILTER = "";
var DEAL = "DEAL";  //the string to filter out businesses that don't offer coupons/deals
var DISPLAYLIMIT = 10;
var DISPLAYLIMITMOBILE = 4;
var PINRED = "DD0000";
var PINGREEN = "00AA00";
var PINCHAR = "<PINCHAR>";
var PINCOLOR = "<PINCOLOR>";
var GOOGLEPIN = "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld="+PINCHAR+"|"+PINCOLOR;
var GOOGLEYELLOWICON = "http://google.com/mapfiles/ms/micons/yellow-dot.png";
var YELPDEALICON = "http://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=dollar|00FF00";
var YELPURI = "http://api.yelp.com/v2/search";
var HTTPMETHOD = "GET";
var RADIUSFILTER = "<RADIUSFILTER>";
var SEARCHTERM = "<SEARCHTERM>";
var TIMESTAMP = "<TIMESTAMP>";
var STYLETAG = "<CSS>";
var LIMIT = 20; //yelp limits on max businesses to pull at one time
var MAXRESULTS = 1000; //the number of businesses to pull
var LATITUDE = 36.135645;
var LONGITUDE = -115.161512;
var LOCATION = "2901 Las Vegas Blvd S  Las Vegas, NV 89109";
var OFFSET = "<OFFSET>";
var OAUTHCONSUMERKEY = "Eqqi19ncmOaaRY8OlZMPog";
var OAUTHTOKEN = "GkjmQjkZoVeNZyAPIAiCYMl6xctechN8";
var OAUTHSIGNATUREMETHOD = "HMAC-SHA1";
var OAUTHSIGNATURE  ="<OAUTHSIGNATURE>";
var OAUTHCONSUMERSECRET = "zOLX5jD0z9NeF5BQjkkXl2KXV7A";
var OAUTHTOKENSECRET = "Vbxnk7Wr1kZI1Px7KwWhNCqatwg";
var OAUTHNONCE = "<NONCE>";
var OAUTHVERSION = "1.0";
var MOBILE = false;
var MOBILEHEIGHT= 800;
var MOBILEWIDTH= 400;
var LISTRIGHTPCT = "80%";
var LISTRIGHTPCTMOBILE = "90%";
var LISTLEFTPCT = "0%";
var YELPPARAMATERS  = 
						"callback="+CALLBACK+ //this is a jsonp callback parameter
						"&category_filter="+CATEGORYFILTER+
						"&cli="+LATITUDE+","+LONGITUDE+
						"&limit="+LIMIT+
						"&location="+LOCATION+
						"&term="+SEARCHTERM+
						"&radius_filter="+RADIUSFILTER+
						"&offset="+OFFSET+
						"&sort=2"
						;
var ZOOM =  14;


var SELECTEDMARKER="";
