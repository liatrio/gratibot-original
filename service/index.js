const mongo = require('./mongo');

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
    //write in the current timestamp
    //return the promise that we get back from mongodb insert
    let timestamp = new Date();
    return mongo.recognition.insert(
    {
      recognizer: recognizer,
      recognizee: recognizee,
      timestamp: timestamp,
      message: message,
      channel: channel,
      values: values
    }).then( (response) => {
      console.log(response);
      return response;
    });
  },
  /**
  * Count the number of recognitions given to a user
  *
  * @param {string} user Name of Slack user recognized
  * @param {int} days Number of days to calculate count for
  * @return Promise which resolves to result from mongodb count query
  **/
  countRecognitionsReceived: function(user, days) {
    let filter = {recognizee:user}
    if(undefined != days && days) {
      let date = Date.now() - 86400000 * days
      filter.timestamp = 
      {
        $gte: new Date(date)
      }
    }
    return mongo.recognition.count(filter).then( (response) => {
      console.log(response);
      return response;
    });
  },
  /**
  * Count the nubmer of recogintions given out by a user
  *
  * @param {string} user Name of Slack user recognizing others
  * @param {int} days Number of days to calculate count for
  * @return Promise which resolves to result from mongodb count query
  **/
  countRecognitionsGiven: function(user, days) {
    let filter = {recognizer:user}
    if(undefined != days && days) {
      let date = Date.now() - 86400000 * days
      filter.timestamp = 
      {
        $gte: new Date(date)
      }
    }
    return mongo.recognition.count(filter).then( (response) => {
      console.log(response);
      return response;
    });
  },

  /**
  * 
  *
  * @param {string} user Name of Slack user recognizing others
  * @param {int} days Number of days to calculate count for
  * @return Promise which resolves to result from mongodb count query
  **/
  /*
  dailyRecognitions: function(user) {
    let filter = {recognizer:user}
    let date = Date.now() - (Date.now() % 86400000)
    filter.timestamp = 
    {
      $gte: new Date(date)
    }
    return mongo.recognition.count(filter).then( (response) => {
      console.log(response);
      return response;
    });
  },
  */

  /**
  * Calculate the score for the top users for this month.
  * Score = (Number of recognitions given to user) - (Number of recognitions given to user)/(Distinct number of users that have recognized user)
  *
  * @param {int} days Number of days to calculate leaderboard for
  * @return Promise which resolves to leaderboard data. Array [{user: 'USERNAME', score: SCORE_VALUE}]
  **/
  getLeaderboard: function(user, days) {
    /*recogReceived = countRecognitionsReceived(
    *return mongo.recognition.find({ recognizee:user }).then( (response) => {
    * console.log(response);
    * //response[0]
    * let count = 0;
    * for(i=0; i<response.length; i++) {
    *   count++;
    *   //response[i]
    * }
    * console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! ' + count);
    * return response;
    });
    **/ 
    return Promise.resolve([{user: 'scribbles', score: 1000000}]); // TODO replace with promise which resolves to leaderboard data
  }
}
