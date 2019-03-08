const { expect } = require('chai');
const Botmock = require('botkit-mock');
const helpSkill = require('../../skills/help.js');

describe('help skill', () => {
  describe('hears help as ambient', () => {
    it('should ignore', () => {
      const sequence = [
        {
          type: 'ambient',
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

      return this.bot.usersInput(sequence).then((message) => {
        expect(message).to.be.empty;
      });
    });
  });

  describe('hears help as direct_message', () => {
    it('should respond with help text', () => {
      const sequence = [
        {
          type: 'direct_message',
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

      return this.bot.usersInput(sequence).then((message) => {
        expect(message.text).to.be.an('undefined');
        expect(message.blocks).to.have.lengthOf(18);
      });
    });
  });

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

      return this.bot.usersInput(sequence).then((message) => {
        expect(message.text).to.be.an('undefined');
        expect(message.blocks).to.have.lengthOf(18);
      });
    });
  });

  beforeEach(() => {
    this.controller = Botmock({
      debug: false,
    });
    this.bot = this.controller.spawn({ type: 'slack' });
    const context = {
      emoji: ':toast:',
    };
    helpSkill(this.controller, context);
  });
  afterEach(() => {
    this.controller.shutdown();
  });
});
