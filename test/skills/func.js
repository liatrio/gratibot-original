const { expect } = require('chai');
const rewire = require('rewire');

describe('Library Functions', () => {
  const testFunctions = rewire('../../libs/funcs.js');
  describe('Trim Length', () => {
    const trimString = testFunctions.__get__('trimLength');
    it('should trim nothing', () => {
      expect(trimString('Hello how is it going', ':toast:')).to.equal('Hello how is it going');
    });
    it('should trim user', () => {
      expect(trimString('Hello <@ABCJD> how is it going', ':toast:')).to.equal('Hello how is it going');
    });
    it('should trim multiple users', () => {
      expect(trimString('Hello <@FOO> and <@BAR> how is it going', ':toast:')).to.equal('Hello and how is it going');
    });
    it('should trim emoji', () => {
      expect(trimString('Hello do you like :toast:', ':toast:')).to.equal('Hello do you like ');
    });
    it('should trim emoji + user', () => {
      expect(trimString('Hello <@FOO> have some :toast:', ':toast:')).to.equal('Hello have some ');
    });
    it('should not trim any other emoji', () => {
      expect(trimString('Hello do you like :liatrio:', ':toast:')).to.equal('Hello do you like :liatrio:');
    });
  });
  describe('Get Users', () => {
    const getUsers = testFunctions.__get__('getUsers');
    it('should get no user', () => {
      expect(getUsers('Hello user how is it going')).to.have.members([]);
    });
    it('should get a user', () => {
      expect(getUsers('Hello <@FOO> how is it going')).to.have.members(['<@FOO>']);
    });
    it('should get multiple users', () => {
      expect(getUsers('Hello <@FOO> and <@BAR> how is it going')).to.have.members(['<@FOO>', '<@BAR>']);
    });
  });
});
