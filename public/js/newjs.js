var forum=[{
	"title": "None",
	"content": "Date: 7 December 2016\ nTime: 6 pm\ nContact: 7048563287\n"
},
{
	"title": "None",
	"content ":"Date: 9 December 2017\ nTime: 11 am\ nContact: 9458213287\n"
},
{
	"title":"Dadri - > Noida City Centre(06 / 12)",
	"content ":"Date: 6 December 2016\ nTime: 5 pm\ nContact: 7048563287\n"
}];
var lostfound=[{
	"title": "SNU -> Sector 16 (07/12)",
	"content": "Date: 7 December 2016\ nTime: 6 pm\ nContact: 7048563287\n"
},
{
	"title": "IGI Airport - > SNU(09 / 12)",
	"content ":"Date: 9 December 2017\ nTime: 11 am\ nContact: 9458213287\n"
},
{
	"title":"Dadri - > Noida City Centre(06 / 12)",
	"content ":"Date: 6 December 2016\ nTime: 5 pm\ nContact: 7048563287\n"
}];
var cineu=
{
	"title":"Cine u",
	"content":""
};
var telecast=
{
	"title":"Telecast Schedule",
	"content":"Today: This, that everything"
};
$(document).ready(function(){
	fixHeights();
	// $('.club-stack > .stack-card-wrapper').height($('.cine-stack').parent().height()*0.22);
	// $.adaptiveBackground.run();

	// TODO: Get full list


	// app.clubs.push(cineu);
	// TODO: GET subscribed list
	// app.clubs.map(function(node, index){
	// 	node["isSubscribe"] = false;
	// });
	// app.clubs[app.clubs.findIndex(x => x.title=="Cine u")]["isSubscribe"] = true;
	getClubData("faction");

	getForums();
	getLostFound();
	getCine();
	getTelecast();

	getClubData("acm");
	getClubData("visuallysnu");
	getClubData("words-ink");
	getClubData("snuphoria");
	getClubData("dhruva");
	getClubData("inferno");
	// getClub()
	// getTrending();
	fixHeights();
});
function fixHeights(){
	$('.forum-stack  .stack-card-wrapper').height($('.forum-stack').parent().height()*0.42);
	$('.club-stack  .stack-card-wrapper').height($('.club-stack').parent().height()*0.21);
	$('.cine-stack  .stack-card-wrapper').height($('.cine-stack').parent().height()*0.46);
}
var app = new Vue({
	el: '#app',
	data: {
		forum:forum,
		lostfound:lostfound,
		clubs:[],
		trends:[],
		cineu:cineu,
		telecast:telecast,
		normalmode:"true",
		forumready: false,
		cineready: false,
		clubready: false,
		trendready: false
		// message: 'Hello Vue!'
	},
	methods :
	{
		tog: function(){
			this.normalmode = !this.normalmode;
		},
		toggle: function(index){
			Vue.set(this.clubs[index],"isSubscribe" ,!this.clubs[index].isSubscribe);
			app.$forceUpdate();
		}
	}
});
function getClubData(sub){
	var request = $.ajax({
		url: "/latest/" + sub,
		type: "get"
	});
	// Callback handler that will be called on success
	request.done(function (response, textStatus, jqXHR){
		var parsedResp = JSON.parse(response);

		var newClub =
		{
			"title" : parsedResp.title,
			"time" : parsedResp.content.slice(parsedResp.content.indexOf('WHEN')+5,parsedResp.content.indexOf('<br />')).trim(),
			"location" : parsedResp.content.slice(parsedResp.content.indexOf('WHERE')+6,parsedResp.content.indexOf('</p>')).trim(),
			"details" : parsedResp.content.slice(parsedResp.content.indexOf('DETAILS')+8,parsedResp.content.indexOf('</p>')).trim(),
			"event_id" : parsedResp.event_id
		}



		app.clubs.push(newClub);
		app.clubready = true;
		console.log(response);
	});
	// Callback handler that will be called on failure
	request.fail(function (jqXHR, textStatus, errorThrown){
		// Log the error to the console
		console.error(
			"The following error occurred: "+
			textStatus, errorThrown
		);
	});
	request.always(function(){
		console.log("End of " + sub);
	});
	// app.clubs.push(cineu);
}
function getForums(){
	var request = $.ajax({
		url: "/getTop3/cabpool",
		type: "get"
	});
	// Callback handler that will be called on success
	request.done(function (response, textStatus, jqXHR){
		// app.forum = JSON.parse(response);
		var pr = JSON.parse(response);
		app.forum = [];
		for(var i=0; i<pr.length; i++)
		{
			parsedResp = pr[i];
			console.log(parsedResp);
			var tempvar =
			{
				"title": parsedResp.title,
				"date" : parsedResp.content.slice(parsedResp.content.indexOf('Date')+5,parsedResp.content.indexOf('<br />')).trim(),
				"time" : parsedResp.content.slice(parsedResp.content.indexOf('Time')+5,parsedResp.content.indexOf('<br />'),parsedResp.content.indexOf('Time')).trim(),
				"contact" : parsedResp.content.slice(parsedResp.content.indexOf('Contact')+8,parsedResp.content.indexOf('</p>')).trim(),
				"event_id" : parsedResp.event_id
			}
			app.forum.push(tempvar);
			// console.log(tempvar,parsedResp);
		}
		console.log(response);
	});

	// Callback handler that will be called on failure
	request.fail(function (jqXHR, textStatus, errorThrown){
		// Log the error to the console
		console.error(
			"The following error occurred: "+
			textStatus, errorThrown
		);
	});

	request.always(function(){
		console.log("Done loading");
	});
}
function getCine()
{
	var request = $.ajax({
		url: "/latest/cineu",
		type: "get"
	});
	// Callback handler that will be called on success
	request.done(function (response, textStatus, jqXHR){
		app.cineu = JSON.parse(response);

		var parsedResp = JSON.parse(response);

		app.cineu["title"] = parsedResp.title;
		app.cineu["time"] = parsedResp.content.slice(parsedResp.content.indexOf('WHEN')+5,parsedResp.content.indexOf('<br />')).trim();
		app.cineu["location"] = parsedResp.content.slice(parsedResp.content.indexOf('WHERE')+6,parsedResp.content.indexOf('<br />',parsedResp.content.indexOf('WHERE'))).trim();
		app.cineu["details"] = parsedResp.content.slice(parsedResp.content.indexOf('DETAILS')+8,parsedResp.content.indexOf('</p>')).trim();
		app.cineu["event_id"] = parsedResp.event_id;

		console.log(response);
	});
	// Callback handler that will be called on failure
	request.fail(function (jqXHR, textStatus, errorThrown){
		// Log the error to the console
		console.error(
			"The following error occurred: "+
			textStatus, errorThrown
		);
	});

	request.always(function(){
		app.cineready = true;
		app.$forceUpdate();
		Vue.nextTick(function () {
			// DOM updated
			fixHeights();
		});
		console.log("Done loading");
	});
}

function getTelecast()
{
	var request = $.ajax({
		url: "/latest/live-telecast",
		type: "get"
	});
	// Callback handler that will be called on success
	request.done(function (response, textStatus, jqXHR){
		var parsedResp = JSON.parse(response);
		app.telecast = {};
		app.telecast["title"] = parsedResp.title;
		app.telecast["time"] = parsedResp.content.slice(parsedResp.content.indexOf('WHEN')+5,parsedResp.content.indexOf('<br />')).trim();
		app.telecast["location"] = parsedResp.content.slice(parsedResp.content.indexOf('WHERE')+6,parsedResp.content.indexOf('</p>')).trim();
		app.telecast["event_id"] = parsedResp.event_id;
		console.log(app.telecast);
	});
	// Callback handler that will be called on failure
	request.fail(function (jqXHR, textStatus, errorThrown){
		// Log the error to the console
		console.error(
			"The following error occurred: "+
			textStatus, errorThrown
		);
	});

	request.always(function(){
		app.cineready = true;
		app.$forceUpdate();
		Vue.nextTick(function () {
			// DOM updated
			fixHeights();
		});
		console.log("Done loading");
	});
}

function getLostFound()
{
	var request = $.ajax({
		url: "/getTop3/lost-and-found",
		type: "get"
	});
	// Callback handler that will be called on success
	request.done(function (response, textStatus, jqXHR){
		var pr = JSON.parse(response);
		app.lostfound = [];
		for(var i=0; i<pr.length; i++)
		{
			parsedResp = pr[i];
			console.log(parsedResp);
			var tempvar =
			{
				"title": parsedResp.title,
				"time" : parsedResp.content.slice(parsedResp.content.indexOf('WHEN')+5,parsedResp.content.indexOf('<br />')).trim(),
				"location" : parsedResp.content.slice(parsedResp.content.indexOf('WHERE')+6,parsedResp.content.indexOf('<br />')).trim(),
				"contact" : parsedResp.content.slice(parsedResp.content.indexOf('CONTACT')+8,parsedResp.content.indexOf('</p>')).trim(),
				"event_id" : parsedResp.event_id
			}
			app.lostfound.push(tempvar);
			// console.log(tempvar,parsedResp);
		}
		// console.log(app.telecast);
		// app.lostfound = JSON.parse(response);
	});

	// Callback handler that will be called on failure
	request.fail(function (jqXHR, textStatus, errorThrown){
		// Log the error to the console
		console.error(
			"The following error occurred: "+
			textStatus, errorThrown
		);
	});

	request.always(function(){
		app.forumready = true;
		app.$forceUpdate();
		Vue.nextTick(function () {
			// DOM updated
			fixHeights();
		});
		console.log("Done loading");
	});
}
function getCurrentUser(){
	var request = $.ajax({
		url: "https://snu-dashboard.herokuapp.com/api/category/5/lost-and-found",
		type: "get"
	});
	console.log("loading");
	// Callback handler that will be called on success
	request.done(function (response, textStatus, jqXHR){

		console.log(response);
	});

	// Callback handler that will be called on failure
	request.fail(function (jqXHR, textStatus, errorThrown){
		// Log the error to the console
		console.error(
			"The following error occurred: "+
			textStatus, errorThrown
		);
	});

	request.always(function(){
		console.log("Done loading");

	})
}
/*

var request = $.ajax({
url: "/Uptrending",
type: "get"
});
// Callback handler that will be called on success
request.done(function (response, textStatus, jqXHR){

console.log(response);
});

// Callback handler that will be called on failure
request.fail(function (jqXHR, textStatus, errorThrown){
// Log the error to the console
console.error(
"The following error occurred: "+
textStatus, errorThrown
);
});

*/
function togFun(){
	app.normalmode = !app.normalmode;
	fixHeights();
}
