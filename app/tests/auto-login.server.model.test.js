const assert = require('assert');
const mongoose = require('mongoose');
const AutoLogin = mongoose.model('AutoLogin');
const Identity = mongoose.model('Identity');


function createIdentity(phone) {
  return new Identity({
    phone: phone,
    password: 'password',
    salt: 'yum',
    provider: 'local',
  }).save();
}

describe('AutoLogin.consumeAndGetIdentity()', () => {
  it('should find Identity objects and destroy themselves', () => {
    return createIdentity('5551234567').then(() => {
      return (new AutoLogin({ key: 'blah', phone: '5551234567' })).save().then((autoLogin) => {
        const key = autoLogin.key;
        return autoLogin.consumeAndGetIdentity().then((id) => {
          assert.strictEqual(id.phone, '5551234567');
          return AutoLogin.findOne({ key: key }).then((result) => {
            assert.strictEqual(result, null);
          });
        });
      });
    });
  });

  it('should raise errors when identities do not exist', () => {
    return (new AutoLogin({ key: 'blah', phone: '5551234567' })).save()
      .then((autoLogin) => {
        return autoLogin.consumeAndGetIdentity()
          .then(() => { throw new Error("This should not happen"); })
          .catch((e) => {
            assert.equal(e.message, 'identity with phone number not found');
          });
      });
  });
});
