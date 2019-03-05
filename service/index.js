const moment = require('moment-timezone');

function service(mongodb) {
  this.mongodb = mongodb;
}

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
service.prototype.giveRecognition = function(recognizer, recognizee, message, channel, values) {
    let timestamp = new Date();
    return this.mongodb.recognition.insert(
    {
      recognizer: recognizer,
      recognizee: recognizee,
      timestamp: timestamp,
      message: message,
      channel: channel,
      values: values
    }).then( (response) => {
      //console.log(response);
      return response;
    });
}

/**
* Count the number of recognitions given to a user
*
* @param {string} user Name of Slack user recognized
* @param {int} days Number of days to calculate count for
* @param {string} timezone Timezone to calculate days from
* @return Promise which resolves to result from mongodb count query
**/
service.prototype.countRecognitionsReceived = function(user, timezone = null, days = null) {
  let filter = {recognizee:user}
  if(days && timezone) {
    let userDate = moment(Date.now()).tz(timezone);
    let midnight = userDate.startOf('day');
    midnight = midnight.subtract(days - 1,'days');
    filter.timestamp =
      {
        $gte: new Date(midnight)
      }
  }
  return this.mongodb.recognition.count(filter).then( (response) => {
    //console.log(response);
    return response;
  });
}

/**
* Count the nubmer of recogintions given out by a user
*
* @param {string} user Name of Slack user recognizing others
* @param {int} days Number of days to calculate count for
* @param {string} timezone Timezone to calculate days from
* @return Promise which resolves to result from mongodb count query
**/
service.prototype.countRecognitionsGiven = function(user, timezone = null, days = null) {
  let filter = {recognizer:user}
  if(days && timezone) {
    let userDate = moment(Date.now()).tz(timezone);
    let midnight = userDate.startOf('day');
    midnight = midnight.subtract(days - 1,'days');
    filter.timestamp =
      {
        $gte: new Date(midnight)
      }
  }
  return this.mongodb.recognition.count(filter).then( (response) => {
    //console.log(response);
    return response;
  });
}

/**
* Calculate the score for the top users for this month.
* Score = (Number of recognitions given to user) - (Number of recognitions given to user)/(Distinct number of users that have recognized user)
*
* @param {int} days Number of days to calculate leaderboard for
* @param {string} timezone Timezone to calculate days from
* @return Promise which resolves to leaderboard data. Array [{userID: 'USERNAME_ID', count: COUNT_VALUE, recognizers: ['RECOGNIZER_VALUE'], score: SCORE_VALUE}]
**/
service.prototype.getLeaderboard = function(timezone = null, days = null) {
  let filter = {}
  if(days && timezone) {
    let userDate = moment(Date.now()).tz(timezone);
    let midnight = userDate.startOf('day');
    midnight = midnight.subtract(days - 1,'days');
    filter.timestamp =
      {
        $gte: new Date(midnight)
      }
  }
  return this.mongodb.recognition.find(filter).then( (response) => {

    var recognizees = [];
    for (var i = 0; i < response.length; i++) {
      recognizeeB = response[i];
      if(!recognizees.some( (recognizeeA) => {
        if(recognizeeA.userID == recognizeeB.recognizee) {
          recognizeeA.count++;
          recognizerB = recognizeeB.recognizer;
          if(!recognizeeA.recognizers.some( (recognizerA) => {
            if(recognizerA == recognizerB) {
              return true;
            }
          })) {
            recognizeeA.recognizers.push(recognizerB);
          }
          recognizeeA.score = recognizeeA.count - (recognizeeA.recognizers.length);
          return true;
        }
      })) {
        recognizees.push(
          {
            userID: recognizeeB.recognizee,
            count: 1,
            recognizers: [recognizeeB.recognizer],
            score: 0,
          });
      }
    }
    recognizees.sort( (a, b) => {
      return b.score - a.score;
    });
    recognizees = recognizees.slice(0, 10);
    return recognizees;
  });
}

module.exports = service;