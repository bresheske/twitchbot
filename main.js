// Big list of setup.
const apiKey = process.env.API_KEY;
if (!apiKey) {
    console.error(`Required API_KEY in .env file missing.`);
    process.exit(1);
}

const tmi = require('tmi.js');
const client = new tmi.Client({
  options: { debug: true },
  connection: {
    secure: true,
    reconnect: true
  },
  identity: {
    username: 'mr_bucket_bot',
    password: apiKey
  },
  channels: ['bucketofwetbees']
});

// Big list of handlers.
const handlers = [
    require('./handlers/hello'),
    require('./handlers/shoutout')
];

client.connect();

client.on('message', (channel, tags, message, self) => {
  // Ignore echoed messages.
  if(self)
    return;

  handlers.forEach(handler => handler(channel, tags, message, self, client));
});
