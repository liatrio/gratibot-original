/**
* Respond to requests to display leaderboard
*/

const rank = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'];

/**
 * Get leaderboard and inject it in state
 *
 * @param {object} state Promise chain state
 * @retrun {object} Promise chain state
 */
const getLeaderboard = (state) => {
  console.debug('Get leaderboard data');
  return state.service.getLeaderboard(30).then((leaderboard) => {return {...state, leaderboard}});
}

/**
* Fetch icons for each user in leaderboard and inject them in state
*
* @param {object} state Promise chain state
* @retrun {object} Promise chain state
*/
const getUserIcons = (state) => {
  console.debug('Get user icons');
  var promises = [];
  state.leaderboard.forEach((user) => {
    promises.push(new Promise((resolve, reject) => {
      state.bot.api.users.info({user: user.userID}, (error, response) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(response.user.profile.image_72);
      })
    }));
  });
  return Promise.all(promises).then((icons) => {return {...state, icons}});
}

/**
 * Add heading to message content
 *
 * @param {object} state Promise chain state
 * @retrun {object} Promise chain state
 */
const addContentHeading = (state) => {
  console.debug('Add leaderboard heading');
  state.content.blocks.push(
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*Leaderboard*"
      }
    }
  );
  return state;
}

/**
 * Add user list as fields (two condensed columns) to message content
 *
 * @param {object} state Promise chain state
 * @retrun {object} Promise chain state
 */
const addContentUsers = (state) => {
  console.debug('Add user list as section fields');
  let fields = [];
  state.leaderboard.forEach((user, index) => {
    fields.push({type: 'mrkdwn', text: `*${rank[index]}* <@${user.userID}> *Score:* ${user.score}`});
  });
  state.content.blocks.push({type: 'section', fields: fields});
  return state;
}

/**
 * Add user list including images (very large) to message content
 *
 * @param {object} state Promise chain state
 * @retrun {object} Promise chain state
 */
const addContentUsersImage = (state) => {
  console.debug('Add user list with images');
  state.leaderboard.forEach((user, index) => {
    state.content.blocks.push({
      type: "section",
      text: { type: "mrkdwn", text: `*${rank[index]} <@${user.userID}>*\n *Score:* ${user.score}`},
      accessory: { "type": "image", "image_url": state.icons[index], "alt_text": `<@${user.userID}>` }});
  });
  return state;
}

/**
 * Add user list as context (small, light grey) blocks to message content
 *
 * @param {object} state Promise chain state
 * @retrun {object} Promise chain state
 */
const addContentUsersContext = (state) => {
  console.debug('Add user list as context blocks');
  let elements;
  state.leaderboard.forEach((user, index) => {
    state.content.blocks.push({
      type: 'context',
      elements: [
        { type: "image", image_url: state.icons[index], alt_text: `<@${user.userID}>` },
        { type: "mrkdwn", text: `<@${user.userID}> *${rank[index]} - Score:* ${user.score}\n`},
      ]
    });
  });
  return state;
}

/**
 * Add currently displayed time range to message content as context element
 *
 * @param {object} state Promise chain state
 * @retrun {object} Promise chain state
 */
const addContentRange = (state) => {
  console.debug('Add time range');
  state.content.blocks.push(
    {
      "type": "context",
      "elements": [
        {
          "type": "plain_text",
          "text": "Last 30 days",
          "emoji": true
        }
      ]
    }
  );
  return state;
}

/**
 * Add buttons to select time range to message content
 *
 * @param {object} state Promise chain state
 * @retrun {object} Promise chain state
 */
const addContentButtons = (state) => {
  console.debug('Add action buttons');
  state.content.blocks.push(
    {
      "type": "actions",
      "elements": [
        {
          "type": "button",
          "text": {
            "type": "plain_text",
            "emoji": true,
            "text": "Today"
          },
          "value": "1"
        },
        {
          "type": "button",
          "text": {
            "type": "plain_text",
            "emoji": true,
            "text": "Week"
          },
          "value": "7"
        },
        {
          "type": "button",
          "text": {
            "type": "plain_text",
            "emoji": true,
            "text": "Month"
          },
          "value": "30"
        },
        {
          "type": "button",
          "text": {
            "type": "plain_text",
            "emoji": true,
            "text": "Year"
          },
          "value": "365"
        }
      ]
    }
  );
  return state;
}

/**
 * Send message containing state content
 *
 * @param {object} state Promise chain state
 * @retrun {object} Promise chain state
 */
const sendReply = (state) => {
  console.debug('Send reply message');
  state.bot.reply(state.message, state.content);
}

/**
 * Create bot listeners to handle leaderboard request and actions
 *
 * @param {object} controller Botkit controller
 * @param {object} context Dependency context from main app
 */
module.exports = function helper(controller, context) {
  const { service } = context;
  const emoji = process.env.EMOJI || ':toast:';
  const rank = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'];
  controller.hears(['leaderboard'], 'direct_message, direct_mention', (bot, message) => {
    console.debug('Received leaderboard message/mention');
    let content = {blocks: []};
    let state = {bot, content};

    Promise.resolve({service, bot, message, content})
    .then(getLeaderboard)
    .then(getUserIcons)
    .then(addContentHeading)
    // .then(addContentUsers) // display users as
    // .then(addContentUsersImage)
    .then(addContentUsersContext)
    .then(addContentRange)
    .then(addContentButtons)
    .then(sendReply)
    .catch((error) => {
      console.error('There was an error responding to leaderboard request', error);
      bot.whisper('There was an error responding to leaderboard request. Check logs for more info');
    });
  });
};
