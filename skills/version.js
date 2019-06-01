/*
Module for defining version command for Gratibot.
*/

const pjson = require('../package.json');

module.exports = function listener(controller, context) {
  controller.hears(['version'], 'direct_message, direct_mention', (bot, message) => {
    bot.whisper(message, {
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `Version: \`${pjson.version}\``,
          },
        },
      ],
    });
  });

  controller.hears(['thunderfury', 'Thunderfury'], 'direct_message, direct_mention, ambient', (bot, message) => {
    bot.reply(message, 'Did someone say :thunderfury_blessed_blade_of_the_windseeker:[Thunderfury, Blessed Blade of the Windseeker]:thunderfury_blessed_blade_of_the_windseeker:?');
  });
};
