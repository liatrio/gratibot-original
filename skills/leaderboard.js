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
  return state.service.getLeaderboard('America/Los_Angeles', state.dateRange).then(leaderboard => ({ ...state, leaderboard }));
};

/**
* Fetch icons for each user in leaderboard and inject them in state
*
* @param {object} state Promise chain state
* @retrun {object} Promise chain state
*/
const getUserIcons = (state) => {
  console.debug('Get user icons');
  const promises = [];
  const users = [...new Set(state.leaderboard.recognizers
    .concat(state.leaderboard.recognizees)
    .map(user => user.userID))];
  users.forEach((user) => {
    promises.push(new Promise((resolve, reject) => {
      state.bot.api.users.info({ user }, (error, response) => {
        if (error) {
          console.error(`Error fetching user info for '${user}'`, error);
          resolve(error);
          return;
        }
        resolve({ user, icon: response.user.profile.image_72 });
      });
    }));
  });
  return Promise.all(promises).then((result) => {
    const icons = {};
    result.forEach((userIcon) => {
      icons[userIcon.user] = userIcon.icon;
    });
    return { ...state, icons };
  });
};

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
      type: 'section',
      block_id: 'heading',
      text: {
        type: 'mrkdwn',
        text: '*Leaderboard*',
      },
    },
  );
  return state;
};

/**
 * Add user list as fields (two condensed columns) to message content
 *
 * @param {object} state Promise chain state
 * @retrun {object} Promise chain state
 */
/*
const addContentUsers = (state) => {
  console.debug('Add user list as section fields');
  const fields = [];
  state.leaderboard.forEach((user, index) => {
    fields.push({
      type: 'mrkdwn',
      text: `*${rank[index]}* <@${user.userID}> *Score:* ${user.score}`
    });
  });
  state.content.blocks.push({ type: 'section', fields });
  return state;
};
*/

/**
 * Add user list including images (very large) to message content
 *
 * @param {object} state Promise chain state
 * @retrun {object} Promise chain state
 */
/*
const addContentUsersImage = (state) => {
  console.debug('Add user list with images');
  state.leaderboard.forEach((user, index) => {
    state.content.blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*${rank[index]} <@${user.userID}>*\n *Score:* ${user.score}`
      },
      accessory: {
        type: 'image',
        image_url: state.icons[user.userID],
        alt_text: `<@${user.userID}>`
      },
    });
  });
  return state;
};
*/

/**
 * Add user list as context (small, light grey) blocks to message content
 *
 * @param {object} state Promise chain state
 * @retrun {object} Promise chain state
 */
const addContentUsersContext = (state) => {
  console.debug('Add user list as context blocks');

  const userToScoreBlock = (user, index) => ({
    type: 'context',
    elements: [
      { type: 'mrkdwn', text: `<@${user.userID}> *${rank[index]} - Score:* ${Math.round(user.score * 100) / 100}\n` },
    ],
  });

  state.content.blocks.push({
    type: 'section',
    block_id: 'recognizersTitle',
    text: {
      type: 'mrkdwn',
      text: '*Top Givers*',
    },
  });
  state.content.blocks.push(...state.leaderboard.recognizers.map(userToScoreBlock));

  state.content.blocks.push({
    type: 'section',
    block_id: 'recognizeesTitle',
    text: {
      type: 'mrkdwn',
      text: '*Top Receivers*',
    },
  });
  state.content.blocks.push(...state.leaderboard.recognizees.map(userToScoreBlock));
  return state;
};

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
      type: 'context',
      block_id: 'timeRange',
      elements: [
        {
          type: 'plain_text',
          text: `Last ${state.dateRange} days`,
          emoji: true,
        },
      ],
    },
  );
  return state;
};

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
      type: 'actions',
      block_id: 'timeRangeButtons',
      elements: [
        {
          type: 'button',
          text: {
            type: 'plain_text',
            emoji: true,
            text: 'Today',
          },
          value: '1',
        },
        {
          type: 'button',
          text: {
            type: 'plain_text',
            emoji: true,
            text: 'Week',
          },
          value: '7',
        },
        {
          type: 'button',
          text: {
            type: 'plain_text',
            emoji: true,
            text: 'Month',
          },
          value: '30',
        },
        {
          type: 'button',
          text: {
            type: 'plain_text',
            emoji: true,
            text: 'Year',
          },
          value: '365',
        },
      ],
    },
  );
  return state;
};

/**
 * Send message containing state content
 *
 * @param {object} state Promise chain state
 * @retrun {object} Promise chain state
 */
const sendReply = (state) => {
  console.debug('Send reply message');
  state.bot.whisper(state.message, state.content);
};

const sendReplyInteractive = (state) => {
  console.debug('Send reply message');
  state.bot.replyInteractive(state.message, state.content);
};

/**
 * Create bot listeners to handle leaderboard request and actions
 *
 * @param {object} controller Botkit controller
 * @param {object} context Dependency context from main app
 */
module.exports = function helper(controller, context) {
  const { service } = context;
  controller.hears(['leader'], 'direct_message, direct_mention', (bot, message) => {
    console.debug('Received leaderboard message/mention');
    const content = { blocks: [] };

    Promise.resolve({
      service, bot, message, content, dateRange: 30,
    })
      .then(getLeaderboard)
      .then(addContentHeading)
    // These are alternative layouts for the user list. I am leaving them here
    // intentionally in case we decide to use them later
    // .then(addContentUsers)
    // .then(addContentUsersImage)
      .then(addContentUsersContext)
      .then(addContentRange)
      .then(addContentButtons)
      .then(sendReply)
      .catch((error) => {
        console.error('There was an error responding to leaderboard request', error);
        bot.whisper(message, 'There was an error responding to leaderboard request. Check logs for more info');
      });
  });

  controller.on('block_actions', (bot, message) => {
    if (message.actions[0].block_id !== 'timeRangeButtons') {
      return;
    }

    console.debug('Received leaderboard message/mention');
    const content = { blocks: [] };

    Promise.resolve({
      service, bot, message, content, dateRange: message.actions[0].value,
    })
      .then(getLeaderboard)
      .then(addContentHeading)
    // These are alternative layouts for the user list. I am leaving them here
    // intentionally in case we decide to use them later
    // .then(addContentUsers)
    // .then(addContentUsersImage)
      .then(addContentUsersContext)
      .then(addContentRange)
      .then(addContentButtons)
      .then(sendReplyInteractive)
      .catch((error) => {
        console.error('There was an error responding to leaderboard request', error);
        bot.whisper(message, 'There was an error responding to leaderboard request. Check logs for more info');
      });
  });
};
