var monk = require('monk');

// Connect to mongodb server
const db = monk(process.env.mongodbUri);

db.catch(function(err) {
  console.log(process.env.mongodbUri);
  throw new Error(err)
});

// Initialize recognition collection
const recognition = db.get('recognition');
recognition.ensureIndex('recognizer');
recognition.ensureIndex('recognizee');
recognition.ensureIndex('timestamp');

// Initialize redemption collection
const redemption = db.get('redemption');

module.exports = {
  recognition: recognition,
  redemption: redemption,
}
