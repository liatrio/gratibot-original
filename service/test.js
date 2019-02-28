const mongodb = require('./lib/mongo');

mongodb.recognition.insert({
  recognizer: 'casey',
  recognizee: 'justin',
  timestamp: '2019-02-01 12:34:56',
  message: 'way to go with the thing!',
  channel: '#flywheel',
  value: '#excellence'
});

mongodb.redemption.insert({
  recognizee: 'justin',
  timestamp: '2019-02-01 12:34:56',
  redeemed: 5
});
