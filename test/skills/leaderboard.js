/**
 * Tests for leaderboard skill
 */

const { expect } = require('chai');
const Botmock = require('botkit-mock');
const leaderboardSkill = require('../../skills/leaderboard.js');

describe('leaderboard skill', () => {
  const assertLeaderboardMessage = (message) => {
    expect(message.text).to.be.an('undefined');
    // expect(message.attachments).to.have.lengthOf(1);
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
              text: 'help',
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
    it('should respond with help text', () => {
      const sequence = [
        {
          type: 'direct_mention',
          user: 'foo',
          channel: 'bar',
          messages: [
            {
              text: 'help',
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
    leaderboardSkill(this.controller);
  });

  afterEach(() => {
    this.controller.shutdown();
  });
});
