function arduinoOpen(){
  console.log('Arduino connected');
}

function arduinoMessage(data){
  console.log('Received from Arduino: ' + data);
  this.send(`SERVER: Message [${data}] received!`);
}

module.exports = {arduinoOpen, arduinoMessage};