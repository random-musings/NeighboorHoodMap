
Git Repostitory
https://github.com/random-musings/NeighboorHoodMap

How to use
A working demo of the map is here 
http://www.scr-inc.com/yelp/neighborhood/neighborhoodview.html
copy the above link into the address bar of a web browser like firefox, chrome or ie

To customize this for your website you need to switch out the yelp API Keys
The following variables in the yelpConstants.js need to be changed
	var OAUTHCONSUMERKEY = "Eqqi19ncmOaaRY8OlZMPog";
	var OAUTHTOKEN = "GkjmQjkZoVeNZyAPIAiCYMl6xctechN8";
	var OAUTHCONSUMERSECRET = "zOLX5jD0z9NeF5BQjkkXl2KXV7A";
	var OAUTHTOKENSECRET = "Vbxnk7Wr1kZI1Px7KwWhNCqatwg";

Dependancies
google map API
https://developers.google.com/maps/documentation/javascript/examples/streetview-simple

Yelp API 
http://www.yelp.com/developers/documentation/v2/search_api

* the yelp api hooks the keys to a domain. To use your own keys simply change 
  the following variables in the yelpConstants.js
	var OAUTHCONSUMERKEY = "Eqqi19ncmOaaRY8OlZMPog";
	var OAUTHTOKEN = "GkjmQjkZoVeNZyAPIAiCYMl6xctechN8";
	var OAUTHCONSUMERSECRET = "zOLX5jD0z9NeF5BQjkkXl2KXV7A";
	var OAUTHTOKENSECRET = "Vbxnk7Wr1kZI1Px7KwWhNCqatwg";

Knockout js 
http://www.knockoutjs.com

Oauth Library (for connecting to Yelp)
https://developers.google.com/accounts/docs/OAuth2

How it works

this application searches yelp for businesses in the San francisco area.
markers are place on the google map indicating the location of each business.
The businesses are shown 10 (or 4 if on mobile) at a time in a list view.
The markers are clickable and display address information as well as
link to the reviews that this restaurant has received.

The user can scroll through the list by clicking on the << and >> buttons at the bottom 
of the list.  
The list can be filtered by 
1. typing text into the "filter:" textbox.
2. clicking of the "coupons" check box.

Filtering the results
The business list is changed to match the "filter" when three or more characters are typed
into the filter text box.  
The filter matches on the following criteria
1. business name
2. yelp category
3. address

If the "coupons" text is checked off the business will be shown if 
the business has deals.

Changes for  mobile & smaller screens
If the screen does not meet the minimum width of 400px or a minimum height of 800px
1. the list of businesses will be placed at the far right edge of the screen. 
2. the list of businesses will be cut to 4 (as opposed to 10).

An <-- arrow button at the top of the list can be used to pull the list from the right side
of the screen to the left side of the screen.

the --> arrow button (which only appears when the list is on the left side of the screen)
will move the list box to the right side of the screen so it is out of the way when viewing
the map.


Map Markers
Markers have been placed on the map to show the location of the restaurant on the map
Clicking on a marker brings up an info that displays
	1. a picture of the cuisine/restaurant
	2. the address of the restaurant
	3. the number of reviews posted to the restaurant
	4. a link to the restaurants yelp review page.
	5. a link to the yelp deals
The selected marker changes to yellow.

A restaurant marker will be red unless deals/coupons are available.
Restaurants with deals/coupons will have a green marker.

Navigation
* The map can be zoomed in or out
* The markers can be clicked on to provide additional 
  information and links to the restaurants yelp page
* << and >> scroll through the list of restaurants
* The --> and <-- buttons will move the business list to the left or right side of the screen.
* The business name in the list is clickable it will bring up the restaurants yelp window.

