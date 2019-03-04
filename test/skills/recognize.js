const Botmock = require('botkit-mock');
const rewire = require('rewire');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const recognizeSkill = require('../../skills/recognize.js');
const ServiceObj = require('../../service');

const { expect } = chai;
chai.use(chaiAsPromised);
describe('recognize skill', () => {
  describe('hears emoji', () => {
    it('should ignore missing mention', () => {
      const sequence = [
        {
          type: 'ambient',
          user: 'alice',
          channel: 'random',
          messages: [
            {
              text: 'nobody gets :toast:',
              isAssertion: true,
            },
          ],
        },
      ];

      return this.bot.usersInput(sequence).then((message) => {
        expect(message.ephemeral).to.be.true;
        expect(message.text).to.equal('Forgetting something?  Try again...this time be sure to mention who you want to recognize with `@user`');
      });
    });

    it('should ignore self recognition', () => {
      const sequence = [
        {
          type: 'ambient',
          user: 'ALICE',
          channel: 'random',
          messages: [
            {
              text: '<@ALICE> gets :toast: for being the best ever',
              isAssertion: true,
            },
          ],
        },
      ];

      return this.bot.usersInput(sequence).then((message) => {
        expect(message.text).to.equal('Nice try <@ALICE>');
      });
    });

    it('should recognize 1 emoji for 1 recipient', () => {
      const sequence = [
        {
          type: 'ambient',
          user: 'ALICE',
          channel: 'random',
          messages: [
            {
              text: '<@BOB> gets :toast: because he is doing very well at his job today',
              isAssertion: true,
            },
          ],
        },
      ];
      return this.bot.usersInput(sequence).then((message) => {
        expect(message.text).to.equal('Your recognition has been sent. Well done! You have 1 :toast: remaining');
        expect(message.ephemeral).to.be.true;
      });
    });

    it('should recognize 2 emojis for 1 recipient', () => {
      const sequence = [
        {
          type: 'ambient',
          user: 'ALICE',
          channel: 'random',
          messages: [
            {
              text: '<@BOB> gets :toast: :toast: because he is doing a great job',
              isAssertion: true,
            },
          ],
        },
      ];

      return this.bot.usersInput(sequence).then((message) => {
        expect(message.ephemeral).to.be.true;
        expect(message.text).to.equal('Your recognition has been sent. Well done! You have 0 :toast: remaining');
      });
    });

    it('should recognize 2 emojis for 2 recipient', () => {
      const sequence = [
        {
          type: 'ambient',
          user: 'ALICE',
          channel: 'random',
          messages: [
            {
              text: '<@BOB> <@CAROL> gets :toast: :toast: because they are',
              isAssertion: true,
            },
          ],
        },
      ];

      return this.bot.usersInput(sequence).then((message) => {
        expect(message.ephemeral).to.be.true;
        expect(message.text).to.equal('Sorry <@ALICE> a maximum of 5 :toast: are allowed per day');
      });
    });
  });

  describe('hears description as ambient', () => {
    it('should give toast to user', () => {
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
        expect(message.text).to.equal('Your recognition has been sent. Well done! You have 1 :toast: remaining');
      });
    });
    it('should give toast to multiple users', () => {
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
        expect(message.text).to.equal('Your recognition has been sent. Well done! You have 0 :toast: remaining');
      });
    });
    it('should give multiple toast to multiple users', () => {
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
        expect(message.text).to.equal('Sorry <@foo> a maximum of 5 :toast: are allowed per day');
      });
    });
    it('should give multiple toast to single user', () => {
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
        expect(message.text).to.equal('Your recognition has been sent. Well done! You have 0 :toast: remaining');
      });
    });
    it('should ask for reason', () => {
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
        expect(message.text).to.equal('Please provide more details why you are giving :toast:');
      });
    });
    it('should not do anything', () => {
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
    it('Should reject reason less than 20 characters', () => {
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
        expect(message.text).to.equal('Giving :toast: requires a description greater than 20 characters. Please try again');
      });
    });
    it('Should accept reason greater than 20 characters', () => {
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
        expect(message.text).to.equal('Your recognition has been sent. Well done! You have 1 :toast: remaining');
      });
    });
  });

  beforeEach(() => {
    this.controller = Botmock({
      debug: false,
    });
    this.bot = this.controller.spawn({ type: 'slack' });
    const idField = '_id';
    const mongodb = {
      recognition: {
        count: () => {
          const response = 3;
          return Promise.resolve(response);
        },
        insert: (document) => {
          const response = document;
          response[idField] = 3;
          return Promise.resolve(response);
        },
      },
    };
    const service = new ServiceObj(mongodb);
    recognizeSkill(this.controller, service);
  });
  afterEach(() => {
    this.controller.shutdown();
  });
});

describe('recognize', () => {
  const recognize = rewire('../../skills/recognize.js');
  describe('extractUsers', () => {
    const extractUsers = recognize.__get__('extractUsers');

    it('should handle no matches', () => {
      const state = {
        message: {
          text: 'foo bar',
        },
      };
      expect(extractUsers(state)).to.eventually.be.empty;
    });

    it('should handle 1 match', () => {
      const state = {
        message: {
          text: 'foo <@UAU5J2XEU> bar',
        },
      };
      extractUsers(state);
      expect(state.users).to.have.members(['UAU5J2XEU']);
    });

    it('should handle 2 match', () => {
      const state = {
        message: {
          text: '<@UAUXXXX> foo <@UAU5J2XEU> bar',
        },
      };
      extractUsers(state);
      expect(state.users).to.have.members(['UAUXXXX', 'UAU5J2XEU']);
    });
  });
});
