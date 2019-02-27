const { expect } = require('chai');
const service = require('../../service');

describe('service index', () => {
  describe('gives recognition', () => {
    it('not cause exception', () => {
      expect(() => { service.giveRecognition('userA', 'userB', 'message', 'channel', ['value1', 'value2']); }).to.not.throw();
    });

    it('returns promise', () => {
      expect(service.giveRecognition('userA', 'userB', 'message', 'channel', ['value1', 'value2'])).to.be.an.instanceof(Promise);
    });
  });

  describe('count recognitions given', () => {
    it('not cause exception', () => {
      expect(() => { service.countRecognitionsGiven('user', 1); }).to.not.throw();
    });

    it('returns promise', () => {
      expect(service.countRecognitionsGiven('user', 1)).to.be.an.instanceof(Promise);
    });
  });

  describe('count recognitions received', () => {
    it('not cause exception', () => {
      expect(() => { service.countRecognitionsReceived('user', 1); }).to.not.throw();
    });

    it('returns promise', () => {
      expect(service.countRecognitionsReceived('user', 1)).to.be.an.instanceof(Promise);
    });
  });

  describe('get leaderboard', () => {
    it('not cause exception', () => {
      expect(() => { service.getLeaderboard(30); }).to.not.throw();
    });

    it('returns promise', () => {
      expect(service.getLeaderboard(30)).to.be.an.instanceof(Promise);
    });
  });
});
