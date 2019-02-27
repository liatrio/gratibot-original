const { expect } = require('chai');
const Botmock = require('botkit-mock');
const rewire = require('rewire');
const recognizeSkill = require('../../skills/recognize.js');

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
              text: '<@ALICE> gets :toast:',
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
              text: '<@BOB> gets :toast:',
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

    it('should recognize 2 emojis for 1 recipient', function () {
      const sequence = [
        {
          type: 'ambient',
          user: 'ALICE',
          channel: 'random',
          messages: [
            {
              text: '<@BOB> gets :toast: :toast:',
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
              text: '<@BOB> <@CAROL> gets :toast: :toast:',
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
      expect(extractUsers('foo bar')).to.be.empty;
    });

    it('should handle 1 match', () => {
      expect(extractUsers('foo <@UAU5J2XEU> bar')).to.have.members(['UAU5J2XEU']);
    });

    it('should handle 2 match', () => {
      expect(extractUsers('<@UAUXXXX> foo <@UAU5J2XEU> bar')).to.have.members(['UAUXXXX', 'UAU5J2XEU']);
    });
  });

  describe('extractTags', () => {
    const extractTags = recognize.__get__('extractTags');

    it('should handle no matches', () => {
      expect(extractTags('foo bar')).to.be.empty;
    });

    it('should handle 1 match', () => {
      expect(extractTags('foo #test bar')).to.have.members(['test']);
    });

    it('should handle 2 match', () => {
      expect(extractTags('#test2 foo #test3 bar')).to.have.members(['test2', 'test3']);
    });
  });

  describe('countEmojis', () => {
    const countEmojis = recognize.__get__('countEmojis');

    it('should handle no matches', () => {
      expect(countEmojis('foo bar')).to.equal(0);
    });

    it('should handle 1 match', () => {
      expect(countEmojis('foo :toast: bar')).to.equal(1);
    });

    it('should handle 2 match', () => {
      expect(countEmojis(':toast: :toast: foo bar')).to.equal(2);
    });
  });
});
