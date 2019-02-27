// const db = require('./lib/mongo');

module.exports = {
  /**
  * Add recognition document to database
  *
  * @param {string} recognizer Name of Slack user giving recognition
  * @param {string} recognizee Name of Slack user receiving recognition
  * @param {string} message Slack message
  * @param {string} channel Slack channel the message was posted in
  * @param {array} values List of Liatrio values taged in message (#excellence)
  * @return Promise resolves to result from mongodb insert
  **/
  giveRecognition: function(recognizer, recognizee, message, channel, values) {
    return Promise.resolve({}); // TODO replace with promise returned from mongodb query
  },
  /**
  * Count the number of recognitions given to a user
  *
  * @param {string} user Name of Slack user recognized
  * @param {int} days Number of days to calculate count for
  * @return Promise which resolves to result from mongodb count query
  **/
  countRecognitionsGiven: function(user, days) {
    return Promise.resolve({}); // TODO replace with promise returned from mongodb query
  },
  /**
  * Count the nubmer of recogintions given out by a user
  *
  * @param {string} user Name of Slack user recognizing others
  * @param {int} days Number of days to calculate count for
  * @return Promise which resolves to result from mongodb count query
  **/
  countRecognitionsReceived: function(user, days) {
    return Promise.resolve({}); // TODO replace with promise returned from mongodb query
  },

  /**
  * Calculate the score for the top then users.
  * Score = (Number of recognitions given to user) - (Number of recognitions given to user)/(Distinct number of users that have recognized user)
  *
  * @param {int} days Number of days to calculate leaderboard for
  * @return Promise which resolves to leaderboard data. Array [{user: 'USERNAME', score: SCORE_VALUE}]
  **/
  getLeaderboard: function(days) {
    return Promise.resolve([{user: 'scribbles', score: 1000000}]); // TODO replace with promise which resolves to leaderboard data
  }
}
