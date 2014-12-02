var streetViewUrl ="https://maps.googleapis.com/maps/api/streetview";
//var nytimesUrl = "http://api.nytimes.com/svc/news/v3/content";
var nytimesUrl = "http://api.nytimes.com/svc/search/v2/articlesearch.json";
var nyApiKey ="188e8e47721930617c2b6a94315d7d08:19:70231359";
var wikiApi = "http://en.wikipedia.org/w/api.php";


var NEWSARTICLE = "<a href='<LINK>'><HEADER></a><br/><br/>";
var HEADER = "<HEADER>";
var LINK = "<LINK>";

var WIKILINK = "<a href='<LINK>'><HEADER></a><br/><br/>";

function parseNews(data)
{
	
	var docHtml = '';
	for(var newsIx in data.response.docs)
	{
			var doc = data.response.docs[newsIx];
			if(doc)
			{
				docHtml += NEWSARTICLE.replace(HEADER,doc.headline.main)
															.replace(LINK,doc.web_url);
			}
	}
	var divElt = document.createElement("div");
	divElt.innerHTML = docHtml;
	$("#nytimes-articles").empty();
	$("#nytimes-articles").append (divElt);
	console.log("ny times loaded PASSED" );
}


function parseWiki(data,data1,data2)
{
	var wikiHtml = '';
	var pageIdIx;
	/*
	for(pageIdIx in data.query.pageids)
	{
	var pageId = data.query.pageids[pageIdIx];
		var pageLinks = data.query.pages[pageId].links;
		if(pageLinks)
		{
			for(pageLinkIx in pageLinks)
			{
				var page = pageLinks[pageLinkIx];
				if(page)
				{
					wikiHtml += WIKILINK.replace(HEADER,page.title)
															.replace(LINK,'#');
				}
			}
		}
		
	}
	 var $wikiElem = $('#wikipedia-links');
	 	var divElt = document.createElement("div");
	divElt.innerHTML = wikiHtml;
	$wikiElem.empty();
	$wikiElem.append (divElt);
	*/
	console.log('IN PARSE WIKI'+data);
}

    // load streetview image
function LoadStreetViewImage()
{ 
		var $body = $('body');
		var streetData =$('#street').val();
		var cityData = $('#city').val();
		var data = "?location="+streetData+"%20"+cityData+
								"&size=600x600";
		$body.append('<img class="bgimg" src="'+ streetViewUrl+data+'">');
}


function LoadNyTimes()
{
 
	var cityData = $('#city').val();
	var nyRequest ="?q="+cityData;
	nyRequest += "&sort=newest";
	nyRequest += "&api-key="+nyApiKey;
		
	 console.log(nytimesUrl+nyRequest);
	 $.getJSON(nytimesUrl+nyRequest, function(data){parseNews(data);});
}

function LoadWiki()
{

	var wikiUri ="http://en.wikipedfdfddia.org/w/api.php?format=json&action=opensearch&prop=links&search=london&indexpageids";

	 /*$.ajax({
            crossDomain: true,
            type:"GET",
            contentType: "application/json; charset=utf-8",
            url: wikiUri,
						async :false,
            dataType: "jsonp",                
            jsonpCallback: 'parseWiki'
        });
*/
	$.ajax({
			url: wikiUri,
			dataType: "jsonp",
			success: function(data){parseWiki(data);}
			}
			);
}

function loadData() 
{
  
  var $wikiElem = $('#wikipedia-links');
  var $nytHeaderElem = $('#nytimes-header');
  var $nytElem = $('#nytimes-articles');
  var $greeting = $('#greeting');
	$wikiElem.text("");
  $nytElem.text("");
	console.log("in loadData");
	//Load Wiki
	LoadWiki();
 
		// load background image
		LoadStreetViewImage();

		//Load new york times
		LoadNyTimes();
		
		
			$.getJSON({
			url: "http://www.google.ca",
			dataType: "test/html",
		success:function(data){console.log("went to google");},
		}).error(function(data){console.log("error"); console.log(data);})
		.always(function(){console.log("failed");});
console.log("after going to google");
    return false;
};

$('#form-container').submit(loadData);


