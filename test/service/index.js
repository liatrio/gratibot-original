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

  describe('get leaderboard', () => {
    it('returns a promise', () => {
      const mongodb = {
        recognition: {
          find: (document) => {
            const response = [document];
            return Promise.resolve(response);
          },
        },
      };
      const service = new ServiceObj(mongodb);
      it('not cause exception', () => {
        expect(() => { service.getLeaderboard('timezone', 1); }).to.not.throw();
      });
      it('returns promise', () => {
        expect(service.getLeaderboard('timezone', 1)).to.be.an.instanceof(Promise);
      });
    });

    it('aggregates data from response', () => {
      const mongodb = {
        recognition: {
          find: (document) => {
            const response = [document];
            return Promise.resolve(response);
          },
        },
      };
      const service = new ServiceObj(mongodb);

      /**
      * Situations tested:
      * - Adding a new unique user to the list of recognizees
      * - Updating a unique user with a unique recognizee
      * - Updating a unique user with a recognizee it already has
      */
      const response = [
        {
          recognizee: 'USERID1',
          recognizer: 'USERID2',
        },
        {
          recognizee: 'USERID1',
          recognizer: 'USERID3',
        },
        {
          recognizee: 'USERID1',
          recognizer: 'USERID2',
        },
      ];

      const responseReturn = [
        {
          name: 'USERID1',
          count: 3,
          recognizers: ['USERID3', 'USERID2'],
          score: 1,
        },
      ];

      it('not cause exception', () => {
        expect(() => { service.aggregateData(response); }).to.not.throw();
      });
      it('returns promise', () => {
        expect(service.aggregateData(response)).to.equal(responseReturn);
      });
    });
  });
});
