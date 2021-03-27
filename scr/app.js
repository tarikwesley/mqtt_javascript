const express = require('express');

const app = express();
const router = express.Router();

const path = require('path'); // para options e enviar arquivo com o res.send
app.use(express.json()) // para options e enviar arquivo com o res.send
app.use(express.urlencoded({ extended: true })) // para options e enviar arquivo com o res.send

//TODO: need improvement
backEndData ={
	contFromLoraNode: 1,
	lastDataFromFrontEnd: 0 
}

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
	const options = {
		root: path.join(__dirname, './'), 
		dotfiles: 'deny',
		headers: {
		  'x-timestamp': Date.now(),
		  'x-sent': true
		}
	}
    res.sendFile('index.html',options)
	//res.status(200).send(m2); 
});

app.get('/api/dataPath', function (req, res) { //endereco da requisicao onde e retornado hello world
  console.log('New req')
  backEndData.contFromLoraNode = m2.payload_fields.contador
  res.send(backEndData)
  //res.send(m2)
})

// Route that receives a POST request to /updateInc
app.post('/updateBackEnd', function (req, res) {
	//backEndData.incValue = parseInt(req.body.newIncValue,10);
	backEndData.lastDataFromFrontEnd = req.body.newIncValue;
	console.log(req.body);
})

app.use('/', route);

module.exports = app;
