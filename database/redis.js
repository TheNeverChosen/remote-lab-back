const env = require('../utils/env');
const { createClient } = require('redis');

const client = createClient({
  url: `redis://:${env.REDIS_PASS}@localhost`
});
client.isReady=false;

client.on('connect', () => {client.isReady=false; console.log('Connecting to redis...')});
client.on('ready', () => {client.isReady=true; console.log('Connected to redis')});
client.on('end', () => {client.isReady=false; console.log('Disconnected from redis')});
client.on('error', (err) => {client.isReady=false;});
client.on('reconnecting', () => {client.isReady=false; console.log('Trying to reconnect to redis...')});

async function connect(){
  await client.connect();
}
connect();

module.exports = client;