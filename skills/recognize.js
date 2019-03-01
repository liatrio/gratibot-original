/*
Module for detecting recognition
*/

const emoji = process.env.EMOJI || ':toast:';
const minLength = 20;
const failImageURL = 'https://media0.giphy.com/media/ac7MA7r5IMYda/giphy-downsized.gif?cid=6104955e5c763d742e4f524832508da2';

const userRegex = /<@([a-zA-Z0-9]+)>/g;
const tagRegex = /#(\S+)/g;
const emojiRegex = new RegExp(emoji, 'g');

const extractUsers = (state) => {
  state.users = state.message.text.match(userRegex);

  // make sure there was a mention in the message
  if (!state.users) {
    return new Promise((resolve, reject) => state.bot.whisper(state.message, 'Forgetting something?  Try again...this time be sure to mention who you want to recognize with `@user`', reject));
  }

  // pull out userid
  state.users = state.users.map(user => user.slice(2, -1));

  return state;
};

const checkForSelfRecognition = (state) => {
  // block giving recognition to myself
  if (state.users.indexOf(state.message.user) >= 0) {
    const reply = {
      text: `Nice try <@${state.message.user}>`,
      attachments: [
        {
          title: 'fail',
          image_url: failImageURL,
        },
      ],
    };
    return new Promise(() => state.bot.reply(state.message, reply));
  }

  return state;
};

const checkMessageLength = (state) => {
  // Strips users _ emoji out of message
  state.full_message = state.message.text;
  const trimmedMessage = state.full_message.replace(/\s*<.*?>\s*/g, '').replace(emojiRegex, '');

  if (trimmedMessage.length < minLength) {
    return new Promise((resolve, reject) => {
      state.bot.startConversation(state.message, (err, convo) => {
        convo.ask({ ephemeral: true, text: `Please provide more details why you are giving ${emoji}` }, (response, newConvo) => {
          if (err) {
            reject(err);
          } else if (response.text.length < minLength) {
            newConvo.next();
            reject(new Error(`Giving ${emoji} requires a description greater than ${minLength} characters. Please try again`));
          } else {
            resolve(state);
          }
        });
      });
    });
  }

  return state;
};

const sendRecognition = (state) => {
  const { message } = state;
  const count = (message.text.match(emojiRegex) || []).length;
  const tags = (message.text.match(tagRegex) || []).map(tag => tag.slice(1));
  const recognizees = [];

  state.users.forEach((u) => {
      state.bot.api.users.info({user: u }, function getInfo(err, response) {
        recognizees.push(response.user.id);
      });
    });

  state.users.forEach((u) => {
    [...Array(count)].forEach(() => {
      // TODO: call service to write recognition to DB
      state.bot.api.users.info({user: message.user}, function(err, response) {
        const recognizer = response.user.id;
        state.service.countRecognitionsGiven(response.user.id,response.user.tz,1).then( (response) => {
          if (response + recognizees.length <= 20) {
            state.users.forEach((u) => {
              state.bot.api.users.info({user: u}, function(err, response) {
                state.service.giveRecognition(recognizer, response.user.id, state.full_message, '#flywheel', ['#excellence', '#energy']);
              });
            });
            console.log('should be valid and fine');
          }
          else {
              console.log('Should reject for daily limit reach');
          }
        });
      });
      console.log(`Recording recognition for ${u} from ${message.user} in channel ${message.channel} with tags ${tags}`);
    });
    // TODO: add the new balance to the message
    state.bot.say({
      text: `You just got recognized by <@${message.user}> in <#${message.channel}>!\n>>>${message.text}`,
      channel: u,
    });
  });
  return state;
};

const whisperReply = (state) => {
  // TODO: add # left to give for today in the whisper below
  const reply = 'Your recognition has been sent.  Well done!';

  return new Promise((resolve, reject) => {
    state.bot.whisper(state.message, reply, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(state);
      }
    });
  });
};

module.exports = function listener(controller, service) {
  controller.hears([emoji], 'ambient', (bot, message) => {
    const statePromise = Promise.resolve({
      bot,
      message,
      service,
    });

    return statePromise
      .then(extractUsers)
      .then(checkForSelfRecognition)
      .then(checkMessageLength)
      .then(sendRecognition)
      .then(whisperReply)
      .catch(error => bot.whisper(message, error.message));
  });
};
