const { expect } = require('chai');
const service = require('../../service');

describe('service index', () => {
  describe('gives recognition', () => {
    it('not cause exception', () => {
      expect(service.giveRecognition).to.not.throw();
    });
  });
  describe('count recognitions given', () => {
    it('not cause exception', () => {
      expect(service.countRecognitionsGiven).to.not.throw();
    });
  });
  describe('count recognitions received', () => {
    it('not cause exception', () => {
      expect(service.countRecognitionsReceived).to.not.throw();
    });
  });
  describe('get leaderboard', () => {
    it('not cause exception', () => {
      expect(service.getLeaderboard).to.not.throw();
    });
  });
});
