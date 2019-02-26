const mongodb = require('./lib/mongo');

mongodb.redemption.insert({foo: "bar"});

mongodb.redemption.find({}).then(function(response) {
  console.log(response);
});
