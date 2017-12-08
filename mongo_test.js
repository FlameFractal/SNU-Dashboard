var MongoClient = require('mongodb').MongoClient

var url = 'mongodb://iws_hack:password@ds111496.mlab.com:11496/nodebb';

var ret;
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  db.collection("trendingevents").find({}).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    ret.push(result);
    db.close();
  });
});
console.log(ret);


/*
things to do:
1. Update the events thing in trending, just append the different events
2. update count
3. 

*/