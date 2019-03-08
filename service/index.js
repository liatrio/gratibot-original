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
  console.debug('Sending a recognition given to database');
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
    return response;
  });
}

/**
* Count the number of recognitions given to a user
*
* @param {string} user Name of Slack user recognized
* @param {int} days Number of days to calculate count for
* @param {string} timezone Timezone for a user to calculate days
* @return Promise which resolves to result from mongodb count query
**/
service.prototype.countRecognitionsReceived = function(user, timezone = null, days = null) {
  console.debug('Getting the recognitions a user received');
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
    return response;
  });
}

/**
* Count the nubmer of recogintions given out by a user
*
* @param {string} user Name of Slack user recognizing others
* @param {int} days Number of days to calculate count for
* @param {string} timezone Timezone for a user to calculate days
* @return Promise which resolves to result from mongodb count query
**/
service.prototype.countRecognitionsGiven = function(user, timezone = null, days = null) {
  console.debug('Getting the recognitions a user gave');
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
    return response;
  });
}

/**
* Calculate the score for the top users for this month.
* Score = (Number of recognitions given to user) - (Number of recognitions given to user)/(Distinct number of users that have recognized user)
*
* @param {int} days Number of days to calculate leaderboard for
* @param {string} timezone Timezone for a user to calculate days
* @return Promise which resolves to an object which contains a list of recognizees and recognizers.
*
* Each leaderboard list has the following structure
* Array [{userID: 'USERNAME_ID', count: COUNT_VALUE, recognizers: ['RECOGNIZER_VALUE'], score: SCORE_VALUE}]
**/
service.prototype.getLeaderboard = function(timezone = null, days = null) {
  //get only the entries from the specifc day from midnight
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
    return aggregateData(response);
  });
}

function aggregateData(response) {
  var recognizees = [];
  for (var i = 0; i < response.length; i++) {
    recognizeeB = response[i];
    //check if there is a unique recognizee in the current entry, recognizeeB
    if(!recognizees.some( (recognizeeA) => {
      //recognizee exists in array recognizees so we update that entry's score and increment count
      if(recognizeeA.userID == recognizeeB.recognizee) {
        recognizeeA.count++;
        recognizerB = recognizeeB.recognizer;
        //check if there is a unique recognizer in current entry, recognizerB
        if(!recognizeeA.recognizers.some( (recognizerA) => {
          if(recognizerA == recognizerB) {
            return true;
          }
        })) {
          recognizeeA.recognizers.push(recognizerB);
        }
        recognizeeA.score = recognizeeA.count - (recognizeeA.count/recognizeeA.recognizers.length);
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
  //sort recognizees by score in descending order
  recognizees.sort( (a, b) => {
    return b.score - a.score;
  });
  //keep the top 10 users
  recognizees = recognizees.slice(0, 10);
  return {recognizees: recognizees, recognizers: recognizees};
}

module.exports = service;
