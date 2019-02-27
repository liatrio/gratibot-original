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
  **/
  giveRecognition: function(recognizer, recognizee, message, channel, values) {

  },
  /**
  * Count the number of recognitions given to a user
  *
  * @param {string} user Name of Slack user recognized
  * @param {int} days Number of days to calculate count for
  * @return int
  **/
  countRecognitionsGiven: function(user, days) {
    return 0;
  },
  /**
  * Count the nubmer of recogintions given out by a user
  *
  * @param {string} user Name of Slack user recognizing others
  * @param {int} days Number of days to calculate count for
  * @return int
  **/
  countRecognitionsReceived: function(user, days) {
  },

  /**
  * Calculate the score for the top then users.
  * Score = (Number of recognitions given to user) - (Number of recognitions given to user)/(Distinct number of users that have recognized user)
  *
  * @param {int} days Number of days to calculate leaderboard for
  * @return Array [{user: 'USERNAME', score: SCORE_VALUE}]
  **/
  getLeaderboard: function(days) {
    return ;
  }
}
