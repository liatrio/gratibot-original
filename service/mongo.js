var monk = require('monk');

// Connect to mongodb server
const db = monk(process.env.mongodbUri).catch(err => {
  console.log("Failed to connect to the database");
  console.log(err);
});

// Initialize recognition collection
const recognition = db.get('recognition').catch(err => {
  console.log("Failed to get recognition");
  console.log(err);
});
recognition.ensureIndex('recognizer');
recognition.ensureIndex('recognizee');
recognition.ensureIndex('timestamp');

// Initialize redemption collection
const redemption = db.get('redemption').catch(err => {
  console.log("Failed to get redemption");
  console.log(err);
});


module.exports = {
  recognition: recognition,
  redemption: redemption,
}
