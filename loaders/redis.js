const env = require('../utils/env');
const { createClient } = require('redis');

const client = createClient({
  url: `redis://:${env.REDIS_PASS}@localhost`,
  legacyMode: true
});
client.isReady=false;

client.on('connect', () => {client.isReady=false; console.log('Connecting to Redis...')});
client.on('ready', () => {client.isReady=true; console.log('Connected to Redis')});
client.on('end', () => {client.isReady=false; console.log('Disconnected from Redis')});
client.on('error', (err) => {client.isReady=false;});
client.on('reconnecting', () => {client.isReady=false; console.log('Trying to reconnect to Redis...')});

async function connect(){
  await client.connect();
}

module.exports = {connect, client};