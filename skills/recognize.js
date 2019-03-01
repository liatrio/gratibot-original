/*
Module for detecting recognition
*/

const emoji = process.env.EMOJI || ':toast:';
const userRegex = /<@([a-zA-Z0-9]+)>/g;
const tagRegex = /#(\S+)/g;
const emojiRegex = new RegExp(emoji, 'g');

/*
  messageText: a raw slack message to parse

  returns
    a list of users
*/
function extractUsers(messageText) {
  return (messageText.match(userRegex) || [])
    .map(user => user.slice(2, -1));
}

/*
  messageText: a raw slack message to parse

  returns
    a list of tags
*/
function extractTags(messageText) {
  return (messageText.match(tagRegex) || [])
    .map(user => user.slice(1));
}

/*
  messageText: a raw slack message to parse

  returns
    a count of the number of emojis in the message
*/
function countEmojis(messageText) {
  return (messageText.match(emojiRegex) || []).length;
}

function trimLength(message, emojii) {
  const removeEmoji = new RegExp(emojii, 'g');
  let fullMessage = message.text;
  // Strips users _ emoji out of message
  fullMessage = fullMessage.replace(/(\s)+(<.*?>)|(<.*?>)(\s)+/g, '');
  fullMessage = fullMessage.replace(removeEmoji, '');
  return fullMessage;
}

function getUsers(message) {
  const fullMessage = message.text;
  const catchUsers = fullMessage.match(/<.*?>/g);
  const uniqueUsers = [...new Set(catchUsers)];
  return uniqueUsers;
}

module.exports = function listener(controller, service) {
  function doSuccess(newConvo, users, bot, count, printEmoji, uniqueUser, message, tags) {
    newConvo.say({ ephemeral: true, text: `Awesome! Giving ${count} ${printEmoji} to ${uniqueUser}` });
    users.forEach((u) => {

        bot.api.users.info({user: u}, function(err, response) {
            let timezone = response.user.tz;

            service.countRecognitionsGiven('casey',timezone,1).then( (response) => {
                console.log('Daily Recog for case = ' + response);
            });
        });


      [...Array(count)].forEach(() => {
        // TODO: call service to write recognition to DB
        console.log(`Recording recognition for ${u} from ${message.user} in channel ${message.channel} with tags ${tags}`);
      });
      // TODO: add the new balance to the message
      bot.say({
        text: `You just got recognized by <@${message.user}> in <#${message.channel}>!\n>>>${message.text}`,
        channel: u,
      });
    });
    // TODO: add # left to give for today in the whisper below
    bot.whisper(message, 'Your recognition has been sent.  Well done!');
  }

  controller.hears([emoji], 'ambient', (bot, message) => {
    const count = countEmojis(message.text);
    const users = extractUsers(message.text);
    const tags = extractTags(message.text);

    // make sure there was a mention in the message
    if (users.length === 0) {
      bot.whisper(message, 'Forgetting something?  Try again...this time be sure to mention who you want to recognize with `@user`');
      return;
    }

    // block giving recognition to myself
    if (users.indexOf(message.user) >= 0) {
      bot.reply(message, {
        text: `Nice try <@${message.user}>`,
        attachments: [
          {
            title: 'fail',
            image_url: 'https://media0.giphy.com/media/ac7MA7r5IMYda/giphy-downsized.gif?cid=6104955e5c763d742e4f524832508da2',
          },
        ],
      });
      return;
    }


    bot.api.users.info({user: message.user}, function(err, response) {
      //console.log('Person timezone ' + response.user.tz);
      //console.log('Person giving rec ' + response.user.name);
      service.countRecognitionsGiven(response.user.id,response.user.tz,1).then( (response) => {
          if (response < 5)
          {
              console.log('should be valid and fine');
          }
          else
          {
              console.log('Should reject for daily limit reach');
          }

      });
    });


    const trimmedMessage = trimLength(message, emoji);
    const uniqueUser = getUsers(message);
    bot.startConversation(message, (err, convo) => {
      if (trimmedMessage.length < 40) {
        convo.ask({ ephemeral: true, text: `Why is ${uniqueUser} deserving of ${emoji} ?` }, (response, newConvo) => {
          if (response.text.length < 40) {
            newConvo.say({ ephemeral: true, text: `Distributing ${emoji} requires a description greater than 40 characters. Please try again` });
            newConvo.next();
          } else {
            doSuccess(newConvo, users, bot, count, emoji, uniqueUser, message, tags);
            newConvo.next();
          }
        });
      } else {
        doSuccess(convo, users, bot, count, emoji, uniqueUser, message, tags);
      }
    });
  });
};
