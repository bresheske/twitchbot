const marioMod = require('../handlers/marioMod');
const mockClient = require('./utils/client');

/**
 * This test only works when snes9x is running.
 */

describe(`mariomod tests`, () => {
    beforeEach(() => mockClient.reset());
    afterEach(() => mockClient.reset());

    it(`should give cape`, () => {
        marioMod(null, {username: 'user'}, '!cape', null, mockClient, null);
    });

    it(`should kaizo mario`, () => {
        marioMod(null, {username: 'user'}, '!kaizo', null, mockClient, null);
    });
});
