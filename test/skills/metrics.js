/**
 * Tests for metrics skill
 */

const { expect } = require('chai');
const Botmock = require('botkit-mock');
const metricsSkill = require('../../skills/metrics.js');
const Service = require('../../service');

describe('metrics skill', () => {
  const assertMetricsMessage = (message) => {
    expect(message.text).to.be.an('undefined');
    // test message is only visible to user
    expect(message.ephemeral).to.be.true;
    // test message block structure
    expect(message.blocks).to.have.lengthOf(4);
    expect(message.blocks[0].block_id).to.equal('metricsHeader');
    expect(message.blocks[1].type).to.equal('image');
    expect(message.blocks[2].block_id).to.equal('metricsTimeRange');
    expect(message.blocks[3].block_id).to.equal('metricsTimeRangeButtons');
  };

  /**
   * Test bot ignores ambiant messages with metrics text
   */
  describe('hears metrics as ambient', () => {
    it('should ignore', () => {
      const sequence = [
        {
          type: 'ambient',
          user: 'alice',
          channel: 'random',
          messages: [
            {
              text: 'metrics',
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
   * Test bot responds to direct messages with metrics message
   */
  describe('hears metrics as direct_message', () => {
    it('should respond with metrics', () => {
      const sequence = [
        {
          type: 'direct_message',
          user: 'alice',
          channel: 'random',
          messages: [
            {
              text: 'metrics',
              isAssertion: true,
            },
          ],
        },
      ];

      return this.bot.usersInput(sequence).then(assertMetricsMessage);
    });
  });

  /**
   * Test bot responds to direct mention with metrics message
   */
  describe('hears metrics as direct_mention', () => {
    it('should respond with metrics', () => {
      const sequence = [
        {
          type: 'direct_mention',
          user: 'alice',
          channel: 'random',
          messages: [
            {
              text: 'metrics',
              isAssertion: true,
            },
          ],
        },
      ];

      return this.bot.usersInput(sequence).then(assertMetricsMessage);
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
            recognizer: 'U99UTM8C8',
            recognizee: 'U9AGRU64B',
            timestamp: '2019-03-06T18:32:09.154Z',
            message: ':toast: :toast: <@U99UTM8C8> <@U9AGRU64B> Good job creating gratibot!!! #gratibot',
            channel: 'CFV0MBLQJ',
            values: ['gratibot'],
          },
          {
            recognizer: 'U99UTM8C8',
            recognizee: 'U9AGRU64B',
            timestamp: '2019-03-06T18:32:09.154Z',
            message: ':toast: :toast: <@U99UTM8C8> <@U9AGRU64B> Good job creating gratibot!!! #gratibot',
            channel: 'CFV0MBLQJ',
            values: ['gratibot'],
          },
          {
            recognizer: 'U9AGRU64B',
            recognizee: 'U99UTM8C8',
            timestamp: '2019-03-06T18:32:09.154Z',
            message: ':toast: :toast: <@U99UTM8C8> <@U9AGRU64B> Good job creating gratibot!!! #gratibot',
            channel: 'CFV0MBLQJ',
            values: ['gratibot'],
          },
          {
            recognizer: 'U9AGRU64B',
            recognizee: 'U99UTM8C8',
            timestamp: '2019-03-06T18:32:09.154Z',
            message: ':toast: :toast: <@U99UTM8C8> <@U9AGRU64B> Good job creating gratibot!!! #gratibot',
            channel: 'CFV0MBLQJ',
            values: ['gratibot'],
          },
        ]),
      },
    });
    metricsSkill(this.controller, { service });
  });

  afterEach(() => {
    this.controller.shutdown();
  });
});
