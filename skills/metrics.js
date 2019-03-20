
/**
 * Add Header to message
 *
 * @param {object} state Promise chain state
 * @return {object} Promise chain state
 */
const addHeader = (state) => {
  console.debug('Metrics: Add Header');
  state.content.blocks.push(
    {
      type: 'section',
      block_id: 'metricsHeader',
      text: {
        type: 'mrkdwn',
        text: '*Metrics*',
      },
    },
  );
  return state;
};

/**
 * Get graph and add it to message
 *
 * @param {object} state Promise chain state
 * @return {object} Promise chain state
 */
const addGraph = (state) => {
  console.debug('Metrics: Add Graph');

  // TODO add graph
  state.content.blocks.push(
    {
      type: 'image',
      image_url: 'https://mybot.serveo.net/metrics',
      alt_text: 'ALTTEXT',
    },
  );

  return state;
};

/**
 * Add currently displayed time range to message
 *
 * @param {object} state Promise chain state
 * @return {object} Promise chain state
 */
const addContentRange = (state) => {
  console.debug('Metrics: Add Time Range');
  state.content.blocks.push(
    {
      type: 'context',
      block_id: 'metricsTimeRange',
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
 * @return {object} Promise chain state
 */
const addContentButtons = (state) => {
  console.debug('Metrics: Add Buttons');
  state.content.blocks.push(
    {
      type: 'actions',
      block_id: 'metricsTimeRangeButtons',
      elements: [
        {
          type: 'button',
          text: {
            type: 'plain_text',
            emoji: true,
            text: '7 Days',
          },
          value: '7',
        },
        {
          type: 'button',
          text: {
            type: 'plain_text',
            emoji: true,
            text: '30 Days',
          },
          value: '30',
        },
        {
          type: 'button',
          text: {
            type: 'plain_text',
            emoji: true,
            text: '90 Days',
          },
          value: '90',
        },
        {
          type: 'button',
          text: {
            type: 'plain_text',
            emoji: true,
            text: '365 Days',
          },
          value: '365',
        },
      ],
    },
  );
  return state;
};

/**
 * Send message
 *
 * @param {object} state Promise chain state, contains full message
 * @return {object} Promise chain state
 */
const sendReply = (state) => {
  console.debug('Metrics: Reply');
  state.bot.whisper(state.message, state.content);
};

const sendReplyInteractive = (state) => {
  console.debug('Metrics: Interactive Reply');
  state.bot.replyInteractive(state.message, state.content);
};

/**
 * Defines metrics response for Gratibot
 *
 * @param {object} controller Botkit controller
 * @param {object} context Dependecy context from main app, i.e. database service
 */
module.exports = function helper(controller, context) {
  const { service } = context;
  controller.hears(['metrics'], 'direct_message, direct_mention', (bot, message) => {
    console.debug('Metrics: Message Received');
    const content = { blocks: [] };
    Promise.resolve({
      service, bot, message, content, dateRange: 30,
    })
      .then(addHeader)
      .then(addGraph)
      .then(addContentRange)
      .then(addContentButtons)
      .then(sendReply)
      .catch((error) => {
        console.error('There was an error responding to the metrics request', error);
        bot.whisper(message, 'There was an error responding to the metrics request. Check logs for more info');
      });
  });

  controller.on('block_actions', (bot, message) => {
    if (message.actions[0].block_id !== 'metricsTimeRangeButtons') {
      return;
    }
    console.debug('Metrics: Button Click Received');
    const content = { blocks: [] };
    Promise.resolve({
      service, bot, message, content, dateRange: message.actions[0].value,
    })
      .then(addHeader)
      .then(addGraph)
      .then(addContentRange)
      .then(addContentButtons)
      .then(sendReplyInteractive)
      .catch((error) => {
        console.error('There was an error responding to the metrics request', error);
        bot.whisper(message, 'There was an error responding to the metrics request. Check logs for more info');
      });
  });
};
