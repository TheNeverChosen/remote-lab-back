const {createApp, startServer} = require('./loaders/server');

async function start(){
  try{
    const app = await createApp();
    startServer(app);
  } catch(err){
    console.log('Error while initializing server!');
    console.dir(err);
  }
}

start();