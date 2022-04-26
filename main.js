const tmi = require('tmi.js');

// function to connect to twitch IRC.
const connect = (username, apikey, channels) => {
  const client = new tmi.Client({
    options: { debug: true },
    connection: {
      secure: true,
      reconnect: true
    },
    identity: {
      username: username,
      password: apikey
    },
    channels: channels
  });
  return client;
};

// two connections - one for mod and one for admin.
const modClient = connect(`mr_bucket_bot`, process.env.MOD_API_KEY, [`bucketofwetbees`]);
const adminClient = connect(`bucketofwetbees`, process.env.ADMIN_API_KEY, [`bucketofwetbees`]);

// mod code here
const modHandlers = [
  // require('./handlers/shoutout'),
  // require('./handlers/yo'),
  // require('./handlers/welcome'),
  // require('./handlers/goodBot'),
  // require('./handlers/followBan'),
  // require('./handlers/timeOutMe'),
  require('./handlers/marioMod'),
  require('./handlers/switches')
];

modClient.connect();
modClient.on('message', (channel, tags, message, self) => {
  // Ignore echoed messages.
  if(self)
    return;

  modHandlers.forEach(handler => {
    try {
      handler(channel, tags, message, self, modClient);
    }
    catch(ex) {
      console.error(ex);
    }
  });
});

// admin code down here.
const adminHandlers = [
  require('./handlers/timeouthops'),
];

adminClient.connect();
adminClient.on('message', (channel, tags, message, self) => {
  // Ignore echoed messages.
  if(self)
    return;

  adminHandlers.forEach(handler => {
    try {
      handler(channel, tags, message, self, adminClient);
    }
    catch(ex) {
      console.error(ex);
    }
  });
});
