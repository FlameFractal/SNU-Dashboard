var express = require('express');
var path = require('path');
var http = require('http');
var request = require('request-promise');
var bodyParser = require('body-parser')

var app = express();
var MongoClient = require('mongodb').MongoClient


app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

/* Define all the routes here*/
app.use("/css", express.static(__dirname+'/ui/css'));
app.use("/img", express.static(__dirname+'/ui/img'));
app.use("/js", express.static(__dirname+'/ui/js'));
app.use("/vendor", express.static(__dirname+'/ui/vendor'));

site_url = "https://snu-dashboard.herokuapp.com"
var url = 'mongodb://iws_hack:password@ds111496.mlab.com:11496/nodebb';
page_id = {"cabpool":6, "faction":7, "cineu":8}

//front page as response should be sent
app.get('/', function (req, res) {

    
  request(site_url+'/api/', function(err, resp, body){
    if (err) throw err
    if (! JSON.parse(body)["loggedIn"]) {
      console.log("prasanna sucks")
    }
  })
  //front-end: // check login user
  // template static homepage
    

  });

// api to get the latest post for each club
/* output format:
{"title":"Cine u","content":"
\"0_1510937289318_cineu.png\"

\n","event_id":"8_3"}

*/ 
app.get('/latest/:page', function (req, res) {

  var latest_post = {}
  var page = req.params.page
  var page_body
  var post_body

  request(site_url+'/api/category/'+page_id[page]+'/'+page, function(err, resp, body){
    if (err) throw err
      page_body = JSON.parse(body)
    request(site_url+"/api/topic/"+page_body["topics"][page_body["topics"].length-1].slug, function(err, resp, body){
      if (err) throw err
        post_body = JSON.parse(body)
      console.log("post_body",post_body);
      latest_post["title"] =  post_body["title"]
      latest_post["content"] = post_body["posts"][0]["content"]
      latest_post["event_id"] = post_body["category"]["cid"] + "_" + post_body["posts"][0]["tid"]
      console.log(JSON.stringify(latest_post))
      res.send(JSON.stringify(latest_post));
    })
  })
});

// get 3 latest cabpool/lostandfound posts
/*
output format:
[{"title":"Pari Chowk -> SNU (07/12)","content":"
Date: 7 December 2017
\nTime: 2:30pm
\nContact: 8492847473

\n","event_id":"6_8"},{"title":"SNU -> Sector 16 (07/12)","content":"
Date: 7 December 2016
\nTime: 6pm
\nContact: 7048563287

\n","event_id":"6_6"},{"title":"IGI Airport -> SNU (09/12)","content":"
Date: 9 December 2017
\nTime: 11am
\nContact: 9458213287

\n","event_id":"6_5"}]


*/
app.get('/getTop3/:page', function (req, res) {

  var top3_posts = [] 
  var page = req.params.page
  var page_body

  request(site_url+'/api/category/'+page_id[page]+'/'+page, function (err, resp, body) {
    if (err) throw err
      page_body = JSON.parse(body)
    request(site_url+"/api/topic/"+page_body["topics"][page_body["topics"].length-1].slug, function (err, resp, body) {
      if (err) throw err
        post_body = JSON.parse(body)
      top3_posts[0] = {}
      top3_posts[0]["title"] =  post_body["title"]
      top3_posts[0]["content"] = post_body["posts"][0]["content"]
      top3_posts[0]["event_id"] = post_body["category"]["cid"] + "_" + post_body["posts"][0]["tid"]
      request(site_url+"/api/topic/"+page_body["topics"][page_body["topics"].length-2].slug, function (err, resp, body) {
        if (err) throw err
          post_body = JSON.parse(body)
        top3_posts[1] = {}
        top3_posts[1]["title"] =  post_body["title"]
        top3_posts[1]["content"] = post_body["posts"][0]["content"]
        top3_posts[1]["event_id"] = post_body["category"]["cid"] + "_" + post_body["posts"][0]["tid"]
        request(site_url+"/api/topic/"+page_body["topics"][page_body["topics"].length-3].slug, function (err, resp, body) {
          if (err) throw err
            post_body = JSON.parse(body)
          top3_posts[2] = {}
          top3_posts[2]["title"] =  post_body["title"]
          top3_posts[2]["content"] = post_body["posts"][0]["content"]
          top3_posts[2]["event_id"] = post_body["category"]["cid"] + "_" + post_body["posts"][0]["tid"]
          res.send(JSON.stringify(top3_posts));
        })
      })
    })
  })
});

// update trending in DB
/*
post input: 
for single click and single event
{"user_id":1,"events":"8_3"}
for multiple events
{"user_id":1,"events":"8_3;9_4;"} semicolan seperated event ids

output: updation happens in DB
*/
app.post('/Uptrending',function(req,res){
  var putInDB = req.body; // format {"user_id":number,"events":all_events_that_the_user_id_going}
  console.log(putInDB);
  res.send(req.body);
  updateUserEvents(putInDB["user_id"],putInDB["events"]);
  var s = "" + putInDB["events"]
  var all_eve = s.split(";");
  console.log(all_eve);
  for (var i in all_eve){
    console.log(all_eve[i]);
    updateCount(all_eve[i]);
  }
  // api for checking which user is logged in: x = https://snu-dashboard.herokuapp.com/api/category/5/lost-and-found
  // x["privileges"]["uid"] 1 - admin, 5 - cineu, 6 - faction
  // if this is 0 then there is not user

  // topic_count = x["topic_count"]
  // loop over all of them
  //event id = x["topics"][0]["cid"] + "_" + x["topics"][0]["tid"]

});

// functiont to update user events in db
function updateUserEvents(inp_user_id,ind_events){
  
  var eve_app = "";
  // update event value in DB
  MongoClient.connect(url,function(err,db){
    if(err) throw err;
    var myquery = { user_id: inp_user_id };
    db.collection("trending").find(myquery).toArray(function(err, result) {
      if (err) throw err;
      console.log("event result[0]",result[0]);
      eve_app += result[0]["events"];
      db.close();

      //append the new event
      eve_app +=ind_events;

      // update event value in DB
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var myquery = { user_id: inp_user_id };
        var newvalues = { user_id: inp_user_id, events: eve_app };
        db.collection("trending").updateOne(myquery, newvalues, function(err, res) {
          if (err) throw err;
          console.log("1 document updated");
          db.close();
        });
      });
      

      });
  });
  

}
//function to update count in db
function updateCount(inp_event_id){
  
  var c = 0;
  //get count value from DB
  console.log("event_id=",inp_event_id);
  MongoClient.connect(url,function(err,db){
    if(err) throw err;
    var q = {event_id:inp_event_id};
    console.log("q=",q);
    db.collection("trendingevents").find(q).toArray(function(err, result) {
      if (err) throw err;
      console.log("result[0]",result[0]);
      if(result[0]!=undefined)
        c = result[0]["count"];
      console.log("c=",c);
      db.close();

      //increment count value
      c = c + 1;
      console.log("c=c+1",c);
      // update count value in DB
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var myquery = { event_id: inp_event_id };
        var newvalues = { "event_id": inp_event_id, "count": c };
        console.log("updation",newvalues);
        db.collection("trendingevents").updateOne(myquery, newvalues, function(err, res) {
          if (err) throw err;
          console.log("1 document updated");
          db.close();
        });
      });

      });
  });
  

}
// api to getTrending 
/*
output format:
[{"event_id":"8_3","count":3}]
*/
app.get('/getTrending',function(req,res){
  var arr = [];
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    db.collection("trendingevents").find({}).toArray(function(err, result) {
      if (err) throw err;
      console.log(result);
      arr = result;
      var trending = []
      console.log("arr",arr);
      for(i in arr){
        console.log("arr",arr);
        trending[i] = {}
        trending[i]["event_id"] = arr[i]["event_id"];
        trending[i]["count"] = arr[i]["count"];
      }
      console.log("trending:",JSON.stringify(trending))
      res.send(JSON.stringify(trending));


    });
    db.close();
  });

});

var port = process.env.PORT || 8987;  // Use 8080 for local development because you might already have apache running on 80
app.listen(port, function () {
  console.log(`snu-dashboardd listening on port ${port}!`);
});
