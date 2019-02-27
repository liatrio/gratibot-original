const { expect } = require('chai');
const Botmock = require('botkit-mock');
const descriptionSkill = require('../../skills/recognize.js');

describe('description skill', () => {
  describe('hears description as ambient', () => {
    it('should give toast to user', function testToast() {
      const sequence = [
        {
          type: 'ambient',
          user: 'foo',
          channel: 'bar',
          messages: [
            {
              text: 'Give :toast: <@FOO> because because because because because',
              isAssertion: true,
            },
          ],
        },
      ];
      return this.bot.usersInput(sequence).then((message) => {
        expect(message.text).to.equal('Awesome! Giving 1 :toast: to <@FOO>');
      });
    });
    it('should give toast to multiple users', function testToast() {
      const sequence = [
        {
          type: 'ambient',
          user: 'foo',
          channel: 'bar',
          messages: [
            {
              text: 'Give :toast: to <@FOO> and <@BAR> because because because because because',
              isAssertion: true,
            },
          ],
        },
      ];
      return this.bot.usersInput(sequence).then((message) => {
        expect(message.text).to.equal('Awesome! Giving 1 :toast: to <@FOO>,<@BAR>');
      });
    });
    it('should give multiple toast to multiple users', function testToast() {
      const sequence = [
        {
          type: 'ambient',
          user: 'foo',
          channel: 'bar',
          messages: [
            {
              text: 'Give :toast: :toast: to <@FOO> and <@BAR> because because because because because',
              isAssertion: true,
            },
          ],
        },
      ];
      return this.bot.usersInput(sequence).then((message) => {
        expect(message.text).to.equal('Awesome! Giving 2 :toast: to <@FOO>,<@BAR>');
      });
    });
    it('should give multiple toast to single user', function testToast() {
      const sequence = [
        {
          type: 'ambient',
          user: 'foo',
          channel: 'bar',
          messages: [
            {
              text: 'Give :toast: :toast: to <@FOO> because because because because because',
              isAssertion: true,
            },
          ],
        },
      ];
      return this.bot.usersInput(sequence).then((message) => {
        expect(message.text).to.equal('Awesome! Giving 2 :toast: to <@FOO>');
      });
    });
    it('should ask for reason', function testToast() {
      const sequence = [
        {
          type: 'ambient',
          user: 'foo',
          channel: 'bar',
          messages: [
            {
              text: 'Give :toast: <@FOO>',
              isAssertion: true,
            },
          ],
        },
      ];
      return this.bot.usersInput(sequence).then((message) => {
        expect(message.text).to.equal('Why is <@FOO> deserving of :toast: ?');
      });
    });
    it('should not do anything', function testToast() {
      const sequence = [
        {
          type: 'ambient',
          user: 'foo',
          channel: 'bar',
          messages: [
            {
              text: 'Give @jon because',
              isAssertion: true,
            },
          ],
        },
      ];
      return this.bot.usersInput(sequence).then((message) => {
        expect(message.text).to.be.an('undefined');
      });
    });
    it('Should reject reason less than 40 characters', function testToast() {
      const sequence = [
        {
          type: 'ambient',
          user: 'foo',
          channel: 'bar',
          messages: [
            {
              text: 'Give :toast: <@FOO> because',
            },
            {
              text: 'Because',
              isAssertion: true,
            },
          ],
        },
      ];
      return this.bot.usersInput(sequence).then((message) => {
        expect(message.text).to.equal('Distributing :toast: requires a description greater than 40 characters. Please try again');
      });
    });
    it('Should accept reason greater than 40 characters', function testToast() {
      const sequence = [
        {
          type: 'ambient',
          user: 'foo',
          channel: 'bar',
          messages: [
            {
              text: 'Give :toast: <@FOO>',
            },
            {
              text: 'Because foo bar Because foo bar Because foo bar ',
              isAssertion: true,
            },
          ],
        },
      ];
      return this.bot.usersInput(sequence).then((message) => {
        expect(message.text).to.equal('Awesome! Giving 1 :toast: to <@FOO>');
      });
    });
  });
  beforeEach(function doEach() {
    this.controller = Botmock({
      debug: false,
    });
    this.bot = this.controller.spawn({ type: 'slack' });
    descriptionSkill(this.controller);
  });
  afterEach(function doAfter() {
    this.controller.shutdown();
  });
});
