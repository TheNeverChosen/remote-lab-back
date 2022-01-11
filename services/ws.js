function arduinoOpen(){
  console.log('Arduino connected');
}

function arduinoMessage(data){
  console.log('Received from Arduino: ' + data);
  this.send(`SERVER: Message [${data}] received!`);
}

function arduinoClose(){
  console.log('Arduino graceful disconnect');
}

module.exports = {arduinoOpen, arduinoMessage, arduinoClose};