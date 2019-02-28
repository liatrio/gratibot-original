var monk = require('monk');

const db = monk(process.env.mongodbUri);

db.catch(function(err) {
  throw new Error(err)
});

module.exports = {
  recognition: db.get('recognition'),
  redemption: db.get('redemption')
}
