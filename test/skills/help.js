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
        expect(message.attachments).to.have.lengthOf(1);

        const attachment = message.attachments[0];
        expect(attachment.color).to.equal('#36a64f');
        expect(attachment.title).to.equal('Gratibot Repo\n');
        expect(attachment.pretext).to.equal("\nHey there :wave: Here's some help with what :toast: can do.\n");
        expect(attachment.fields).to.have.lengthOf(2);
        expect(attachment.fields[0].title).to.equal('Commands');
        expect(attachment.fields[0].value).to.have.string('Specify a user and the amount');
        expect(attachment.fields[1].title).to.equal('Details');
        expect(attachment.fields[1].value).to.have.string('Tag your message with');
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
        expect(message.attachments).to.have.lengthOf(1);

        const attachment = message.attachments[0];
        expect(attachment.color).to.equal('#36a64f');
        expect(attachment.title).to.equal('Gratibot Repo\n');
        expect(attachment.pretext).to.equal("\nHey there :wave: Here's some help with what :toast: can do.\n");
        expect(attachment.fields).to.have.lengthOf(2);
        expect(attachment.fields[0].title).to.equal('Commands');
        expect(attachment.fields[0].value).to.have.string('Specify a user and the amount');
        expect(attachment.fields[1].title).to.equal('Details');
        expect(attachment.fields[1].value).to.have.string('Tag your message with');
      });
    });
  });

  beforeEach(() => {
    this.controller = Botmock({
      debug: false,
    });
    this.bot = this.controller.spawn({ type: 'slack' });
    helpSkill(this.controller);
  });
  afterEach(() => {
    this.controller.shutdown();
  });
});
