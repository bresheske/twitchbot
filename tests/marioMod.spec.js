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

    it(`should kick left`, () => {
        marioMod(null, {username: 'user'}, '!kickleft', null, mockClient, null);
    });

    fit(`should kick right`, () => {
        marioMod(null, {username: 'user'}, '!kickright', null, mockClient, null);
    });

    it(`should big`, () => {
        marioMod(null, {username: 'user'}, '!big', null, mockClient, null);
    });

    it(`should pswitch`, () => {
        marioMod(null, {username: 'user'}, '!pswitch', null, mockClient, null);
    });

    it(`should spswitch`, () => {
        marioMod(null, {username: 'user'}, '!spswitch', null, mockClient, null);
    });

    it(`should star`, () => {
        marioMod(null, {username: 'user'}, '!star', null, mockClient, null);
    });

    it(`should water`, () => {
        marioMod(null, {username: 'user'}, '!water', null, mockClient, null);
    });

    it(`should land`, () => {
        marioMod(null, {username: 'user'}, '!land', null, mockClient, null);
    });

    it(`should ice`, () => {
        marioMod(null, {username: 'user'}, '!ice', null, mockClient, null);
    });

    it(`should thaw`, () => {
        marioMod(null, {username: 'user'}, '!thaw', null, mockClient, null);
    });

});
