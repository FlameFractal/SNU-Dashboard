var express = require('express');
var path = require('path');
var http = require('http');
var request = require('request-promise');

var app = express();

/* Define all the routes here*/
app.use("/css", express.static(__dirname+'/ui/css'));
app.use("/img", express.static(__dirname+'/ui/img'));
app.use("/js", express.static(__dirname+'/ui/js'));
app.use("/vendor", express.static(__dirname+'/ui/vendor'));

site_url = "https://snu-dashboard.herokuapp.com"
page_id = {"cabpool":6, "faction":7, "cineu":8}

app.get('/', function (req, res) {

    request(site_url+'/api/', function(err, resp, body){
      if (err) throw err
      if (! JSON.parse(body)["loggedIn"]) {
        console.log("prasanna sucks")
      }
    })
    // check login user
    // template static homepage

  });

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
      latest_post["title"] =  post_body["title"]
      latest_post["content"] = post_body["posts"][0]["content"]
      console.log(JSON.stringify(latest_post))
      res.send(JSON.stringify(latest_post));
    })
  })
});

// get 3 latest cabpool/lostandfound posts
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

      request(site_url+"/api/topic/"+page_body["topics"][page_body["topics"].length-2].slug, function (err, resp, body) {
        if (err) throw err
          post_body = JSON.parse(body)
        top3_posts[1] = {}
        top3_posts[1]["title"] =  post_body["title"]
        top3_posts[1]["content"] = post_body["posts"][0]["content"]

        request(site_url+"/api/topic/"+page_body["topics"][page_body["topics"].length-3].slug, function (err, resp, body) {
          if (err) throw err
            post_body = JSON.parse(body)
          top3_posts[2] = {}
          top3_posts[2]["title"] =  post_body["title"]
          top3_posts[2]["content"] = post_body["posts"][0]["content"]

          res.send(JSON.stringify(top3_posts));
        })
      })
    })
  })
});

var port = process.env.PORT || 8987;  // Use 8080 for local development because you might already have apache running on 80
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
