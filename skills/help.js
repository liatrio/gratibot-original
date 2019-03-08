/*
Module for defining help command for Gratibot.
*/
module.exports = function helper(controller, context) {
  const { emoji } = context;
  controller.hears(['help'], 'direct_message, direct_mention', (bot, message) => {
    bot.whisper(message, {
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: ":wave: Hi there, let's take a look at what I can do!",
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '*Give Recognition*',
          },
        },
        {
          type: 'divider',
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `You can give up to \`5\` recognitions per day.\n\nFirst, make sure I have been invited to the channel you want to recognize someone in.  Then, write a brief message describing what someone did, \`@mention\` them and include the ${emoji} emoji...I'll take it from there!`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `> Thanks <@alice> for helping me fix my pom.xml ${emoji}`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'Recognize multiple people at once!',
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `> <@bob> and <@alice> crushed that showcase! ${emoji}`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'Use `#tags` to call out specific Liatrio values that were demonstrated. ',
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `> I love the #energy in your Terraform demo <@alice>! ${emoji}`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'The more emojis you add, the more recognition they get.',
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `> <@alice> just pushed the cleanest code I've ever seen! ${emoji} ${emoji} ${emoji}`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '*View Balance*',
          },
        },
        {
          type: 'divider',
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: "Send me a direct message with `balance` and I'll let you know how many recognitions you have left to give and how many you have received.",
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `> You have received 0 ${emoji} and you have 5 ${emoji} remaining to give away today`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '*View Leaderboard*',
          },
        },
        {
          type: 'divider',
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: "Send me a direct message with `leaderboard` and I'll show you who is giving and receiving the most recognition.",
          },
        },
      ],
    });
  });
};
