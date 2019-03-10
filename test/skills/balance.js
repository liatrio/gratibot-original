const Botmock = require('botkit-mock');
// const rewire = require('rewire');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const balanceSkill = require('../../skills/balance.js');
const ServiceObj = require('../../service');

const { expect } = chai;
chai.use(chaiAsPromised);

describe('balance skill', () => {
  const mockMongoDb = {
    recognition: {
      count: (filter) => {
        if (undefined !== filter.recognizee) {
          return Promise.resolve(100);
        }

        return Promise.resolve(3);
      },
    },
  };
  const service = new ServiceObj(mockMongoDb);
  describe('hears balance message', () => {
    it('should respond with balance', () => {
      const sequence = [
        {
          type: 'direct_message',
          user: 'alice',
          channel: 'random',
          messages: [
            {
              text: 'balance',
              isAssertion: true,
            },
          ],
        },
      ];

      return this.bot.usersInput(sequence).then((message) => {
        expect(message.text).to.equal('You have received `100` and you have `2` left to give away today');
      });
    });
  });
  beforeEach(() => {
    this.controller = Botmock({
      debug: false,
    });
    this.bot = this.controller.spawn({ type: 'slack' });
    const context = {
      service,
      emoji: ':toast:',
      exemptUsers: [],
    };
    balanceSkill(this.controller, context);
  });
  afterEach(() => {
    this.controller.shutdown();
  });
});
