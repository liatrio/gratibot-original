var monk = require('monk');

// Connect to mongodb server
const db = monk(process.env.mongodbUri);

db.catch(function(err) {
  throw new Error(err)
});

console.log(process.env.mongodbUri);
console.log(process.env.clientId);
console.log(process.env.clientsecret);
console.log(process.env.signingsecret);

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
