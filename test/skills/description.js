const { expect } = require('chai');
const Botmock = require('botkit-mock');
const descriptionSkill = require('../../skills/description.js');

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
              text: 'Give :toast: @jon because because because because because',
              isAssertion: true,
            },
          ],
        },
      ];
      return this.bot.usersInput(sequence).then((message) => {
        expect(message.text).to.equal('Awesome, :toast: given to ');
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
              text: 'Give :toast: @jon',
              isAssertion: true,
            },
          ],
        },
      ];
      return this.bot.usersInput(sequence).then((message) => {
        expect(message.text).to.equal('Why is  deserving of :toast: ?');
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
              text: 'Give :toast: @jon because',
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
              text: 'Give :toast: @jon',
            },
            {
              text: 'Because foo bar Because foo bar Because foo bar ',
              isAssertion: true,
            },
          ],
        },
      ];
      return this.bot.usersInput(sequence).then((message) => {
        expect(message.text).to.equal('Awesome! Giving :toast: to ');
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
