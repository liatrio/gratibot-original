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
    return { recognizees: aggregateDataRecognizees(response), recognizers: aggregateDataRecognizers(response) };
  });
}

function aggregateDataRecognizers(response) {
  var recognizers = [];
  for (var i = 0; i < response.length; i++) {
    recognizerB = response[i];
    //check if there is a unique recognizer in the current entry, recognizerB
    if(!recognizers.some( (recognizerA) => {
      //recognizer exists in array recognizers so we update that entry's score and increment count
      if(recognizerA.userID == recognizerB.recognizer) {
        recognizerA.count++;
        recognizerBRecognizer = recognizerB.recognizer;
        //check if there is a unique recognizer in current entry, recognizerBRecognizer
        if(!recognizerA.recognized.some( (recognizerARecognizer) => {
          if(recognizerARecognizer == recognizerBRecognizer) {
            return true;
          }
        })) {
          recognizerA.recognized.push(recognizerBRecognizer);
        }
        //add 1 to the score so the score is not 0 when a user only has recognitions from 1 person
        recognizerA.score = recognizerA.count - (recognizerA.count/recognizerA.recognized.length) + 1;
        return true;
      }
    })) {
      recognizers.push(
        {
          userID: recognizerB.recognizer,
          count: 1,
          recognized: [recognizerB.recognizee],
          score: 1,
        });
    }
  }
  //sort recognizees by score in descending order
  recognizers.sort( (a, b) => {
    return b.score - a.score;
  });
  //keep the top 10 users
  recognizers = recognizers.slice(0, 10);
  return recognizers;
}

function aggregateDataRecognizees(response) {
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
        recognizeeA.score = recognizeeA.count - (recognizeeA.count/recognizeeA.recognizers.length) + 1;
        return true;
      }
    })) {
      recognizees.push(
        {
          userID: recognizeeB.recognizee,
          count: 1,
          recognizers: [recognizeeB.recognizer],
          score: 1,
        });
    }
  }
  //sort recognizees by score in descending order
  recognizees.sort( (a, b) => {
    return b.score - a.score;
  });
  //keep the top 10 users
  recognizees = recognizees.slice(0, 10);
  return recognizees;
}

/**
* Calculate the daily usage of Gratibot.
*
* @param {int} days Number of days to calculate usage for
* @param {string} timezone Timezone to calculate based on
* @return Promise which resolves to an object which contains a list of dates and counts
*
**/
service.prototype.getMetrics = function(timezone = null, days = null) {
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
    return aggragateUsageByDate(response, timezone, days);
  });
}

function aggragateUsageByDate(response, timezone, days) {
  let data = Array(days);
  for(let i = 0; i < days; i++) {
    data[i] = [i, 0]; //TODO fill with Date instead of index
  }
  
  let recognitionDate = null;
  let currentTime = null;
  let index;
  for (let i = 0; i < response.length; i++) {
    if (timezone) {
      recognitionDate = moment(response[i].timestamp).tz(timezone);
      currentTime = moment(Date.now()).tz(timezone);
    } else {
      recognitionDate = moment(response[i].timestamp);
      currentTime = moment(Date.now());
    }
    index = currentTime.diff(recognitionDate, 'days');
    data[(days - 1) - index][1]++; // Days are arranged oldest first
  }
  // var fs = require('fs');

  var JSDOM  = require('jsdom').JSDOM;
  var jsdom = new JSDOM('<body><div id="container"></div></body>', {runScripts: 'dangerously'});
  var window = jsdom.window;

  var anychart = require('anychart')(window);
  var anychartExport = require('anychart-nodejs')(anychart);
  
  var chart = anychart.area();
  var series = chart.area(data);
  chart.bounds(0,0,1000,1000);
  chart.container('container');
  chart.yAxis().labels().enabled(false);
  chart.xAxis().labels().enabled(false);
  chart.draw();
  /*

  anychartExport.exportTo(chart, 'png').then(function(image) {
    fs.writeFile('anychart.png', image, function(fsWriteError) {
      if (fsWriteError) {
        console.log(fsWriteError);
      } else {
        console.log('Complete');
      }
    });
  }, function(generationError) {
    console.log(generationError);
  });

  */
  return anychartExport.exportToSync(chart, 'png')
}
module.exports = service;
