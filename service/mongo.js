const monk = require('monk');

// Connect to mongodb server
const db = monk(process.env.mongodbUri)

db.then(() => {
  console.log("Connected Properly");
}).catch(err => {
  console.log(process.env.mongodbUri);
  console.log("Failed to connect to the database");
  console.log(err);
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
