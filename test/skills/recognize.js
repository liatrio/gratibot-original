const Botmock = require('botkit-mock');
const rewire = require('rewire');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const recognizeSkill = require('../../skills/recognize.js');

const { expect } = chai;
chai.use(chaiAsPromised);

describe('recognize skill', () => {
  describe('hears emoji', () => {
    it('should ignore missing mention', function () {
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

    it('should ignore self recognition', function () {
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

    it('should recognize 1 emoji for 1 recipient', function () {
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
        expect(message.text).to.equal('Your recognition has been sent.  Well done!');
        expect(message.ephemeral).to.be.true;
      });
    });

    it('should recognize 2 emojis for 1 recipient', function () {
      const sequence = [
        {
          type: 'ambient',
          user: 'ALICE',
          channel: 'random',
          messages: [
            {
              text: '<@BOB> gets :toast: :toast: because he is doing a great job tracking issues today.',
              isAssertion: true,
            },
          ],
        },
      ];

      return this.bot.usersInput(sequence).then((message) => {
        expect(message.ephemeral).to.be.true;
        expect(message.text).to.equal('Your recognition has been sent.  Well done!');
      });
    });

    it('should recognize 2 emojis for 2 recipient', function () {
      const sequence = [
        {
          type: 'ambient',
          user: 'ALICE',
          channel: 'random',
          messages: [
            {
              text: '<@BOB> <@CAROL> gets :toast: :toast: because they are doing a great job pairing today',
              isAssertion: true,
            },
          ],
        },
      ];

      return this.bot.usersInput(sequence).then((message) => {
        expect(message.ephemeral).to.be.true;
        expect(message.text).to.equal('Your recognition has been sent.  Well done!');
      });
    });
  });

  beforeEach(function () {
    this.controller = Botmock({
      debug: false,
    });
    this.bot = this.controller.spawn({ type: 'slack' });
    recognizeSkill(this.controller);
  });
  afterEach(function () {
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
