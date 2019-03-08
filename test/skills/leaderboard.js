/**
 * Tests for leaderboard skill
 */

const { expect } = require('chai');
const Botmock = require('botkit-mock');
const leaderboardSkill = require('../../skills/leaderboard.js');
const Service = require('../../service');

describe('leaderboard skill', () => {
  const assertLeaderboardMessage = (message) => {
    expect(message.text).to.be.an('undefined');
    // Test for correct number of blocks: heading, 2x users, time range, buttons
    expect(message.blocks).to.have.lengthOf(5);
    // Test for leaderboard heading block
    expect(message.blocks[0].type).to.equal('section');
    expect(message.blocks[0].text.text).to.equal('*Leaderboard*');
    // Test for time range
    expect(message.blocks[3].type).to.equal('context');
    expect(message.blocks[3].elements[0].text).to.equal('Last 30 days');
    // Test for action buttons
    expect(message.blocks[4].type).to.equal('actions');
    expect(message.blocks[4].elements).to.have.lengthOf(4);
  };
  /**
   * Test bot ignores ambiant messages with leaderboard text
   */
  describe('hears help as ambient', () => {
    it('should ignore', () => {
      const sequence = [
        {
          type: 'ambient',
          user: 'alice',
          channel: 'random',
          messages: [
            {
              text: 'leaderboard',
              isAssertion: true,
            },
          ],
        },
      ];

      return this.bot.usersInput(sequence).then((message) => {
        expect(message).to.be.empty;
      });
    });
  });

  /**
   * Test bot responds to direct messages with leaderboard message
   */
  describe('hears help as direct_message', () => {
    it('should respond with leaderboard', () => {
      const sequence = [
        {
          type: 'direct_message',
          user: 'alice',
          channel: 'random',
          messages: [
            {
              text: 'leaderboard',
              isAssertion: true,
            },
          ],
        },
      ];

      return this.bot.usersInput(sequence).then(assertLeaderboardMessage);
    });
  });

  /**
   * Test bot responds to direct mention with leaderboard message
   */
  describe('hears help as direct_mention', () => {
    it('should respond with leaderboard', () => {
      const sequence = [
        {
          type: 'direct_mention',
          user: 'alice',
          channel: 'random',
          messages: [
            {
              text: 'leaderboard',
              isAssertion: true,
            },
          ],
        },
      ];

      return this.bot.usersInput(sequence).then(assertLeaderboardMessage);
    });
  });

  beforeEach(() => {
    this.controller = Botmock({
      debug: false,
    });
    this.bot = this.controller.spawn({ type: 'slack' });
    const service = new Service({
      recognition: {
        find: () => Promise.resolve([
          {
            recognizer: 'UC7EHD74L',
            recognizee: 'U99UTM8C8',
            timestamp: '2019-03-06T18:32:09.154Z',
            message: ':toast: :toast: <@U99UTM8C8> <@U9AGRU64B> Good job creating gratibot!!! #gratibot',
            channel: 'CFV0MBLQJ',
            values: ['gratibot'],
          },
          {
            recognizer: 'UC7EHD74L',
            recognizee: 'U9AGRU64B',
            timestamp: '2019-03-06T18:32:09.154Z',
            message: ':toast: :toast: <@U99UTM8C8> <@U9AGRU64B> Good job creating gratibot!!! #gratibot',
            channel: 'CFV0MBLQJ',
            values: ['gratibot'],
          },
        ]),
      },
    });
    leaderboardSkill(this.controller, { service });
  });

  afterEach(() => {
    this.controller.shutdown();
  });
});
