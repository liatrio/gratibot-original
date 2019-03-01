const { expect } = require('chai');
const ServiceObj = require('../../service');

describe('service index', () => {
  describe('gives recognition', () => {
    const idField = '_id';
    const mongodb = {
      recognition: {
        insert: (document) => {
          const response = document;
          response[idField] = Math.random();
          return Promise.resolve(response);
        },
      },
    };
    const service = new ServiceObj(mongodb);
    it('not cause exception', () => {
      expect(() => { service.giveRecognition('userA', 'userB', 'message', 'channel', ['value1', 'value2']); }).to.not.throw();
    });
    it('returns promise', () => {
      expect(service.giveRecognition('userA', 'userB', 'message', 'channel', ['value1', 'value2'])).to.be.an.instanceof(Promise);
    });
  });

  describe('count recognitions given', () => {
    const mongodb = {
      recognition: {
        count: () => {
          const response = Math.random();
          return Promise.resolve(response);
        },
      },
    };
    const service = new ServiceObj(mongodb);
    it('not cause exception', () => {
      expect(() => { service.countRecognitionsGiven('user', 'timezone', 1); }).to.not.throw();
    });
    it('returns promise', () => {
      expect(service.countRecognitionsGiven('user', 'timezone', 1)).to.be.an.instanceof(Promise);
    });
  });

  describe('count recognitions received', () => {
    const mongodb = {
      recognition: {
        count: () => {
          const response = Math.random();
          return Promise.resolve(response);
        },
      },
    };
    const service = new ServiceObj(mongodb);
    it('not cause exception', () => {
      expect(() => { service.countRecognitionsReceived('user', 'timezone', 1); }).to.not.throw();
    });
    it('returns promise', () => {
      expect(service.countRecognitionsReceived('user', 'timezone', 1)).to.be.an.instanceof(Promise);
    });
  });
});

// will fix other tests in another ticket
/*
  describe('get leaderboard', () => {
    it('not cause exception', () => {
      expect(() => { service.getLeaderboard(30); }).to.not.throw();
    });

    it('returns promise', () => {
      expect(service.getLeaderboard(30)).to.be.an.instanceof(Promise);
    });
  });
  */
