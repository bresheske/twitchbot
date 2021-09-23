const marioMod = require('../handlers/marioMod');
const mockClient = require('./utils/client');

/**
 * This test only works when snes9x is running.
 */

describe(`mariomod tests`, () => {
    beforeEach(() => mockClient.reset());
    afterEach(() => mockClient.reset());

    it(`should time mario`, () => {
        marioMod(null, {username: 'user'}, '!time 100', null, mockClient, null);
    });
});
