const express = require('express');

const app = express();
const router = express.Router();



//configurações para comunicação do cliente mqtt com o ttn
const connectOptions = {
    port: 8883,
    host: 'brazil.thethings.network',
    rejectUnauthorized: false,
    protocol: 'mqtts',
    username: '1app1',
    password: 'ttn-account-v2.Po1PPfSFy-13u3Fls_UV8VGAOud4YDTfzVjyyvPb4GM',
    clientId: "1app1"
  };
  
  //cria uma instãncia cliente mqtt e usa-se a configuração acima criada para se conectar
  let mqtt = require('mqtt');
  let client  = mqtt.connect(connectOptions);
  let m2 = '';
  //se inscreve no topico da ttn para subscribe 
  client.subscribe('+/devices/+/up');
  
  
  // //função para publish com o ttn( irar mandar mensagem)
  // client.on('connect', function () {
  // client.publish('+/devices/+/down', '{\"mesg\" : \"hello \"}');
  // });
  
  client.on('message', function (topic, message) {
  // message is Buffer
  message = JSON.parse(message);
  m2 =message
  //console.log(message);
  //message['payload_fields']
  console.log(message['payload_fields']);
  return message;
  });

//implementação da rota
const route = router.get('/',function(req,res){
    res.status(200).send(m2); 
});

app.use('/', route);

module.exports = app;
