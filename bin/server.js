const app = require('../scr/app');
const http = require('http');
const debug = require('debug')('nodesrt:server');

const port = normalizePort(process.env.PORT || '3333');
app.set('port',port);

const server = http.createServer(app);

server.listen(port);
server.on('error',onError);
server.on('listening', onListenning);
console.log('API rodando na porta ' + port);

//função para normalização da porta do server. função tirada do gerador de código do express 
//verifica se tem alguma porta disponivel no server para rodar a aplicação
function normalizePort(val) {
  const port = parseInt(val,10);

  if(isNaN(port)){
    return val;
  }

  if(port >= 0){
    return port;
  }

  return false;

}

//função para tratamento de erros de permissão e de endereço em uso
function onError(error){
  if(error.syscall !== 'listen'){
    throw error;
  }

  const bind = typeof port === 'string' ?
    'Pipe ' + port :
    'Port ' + port;

  switch (error.code){
    case 'EACESS':
      console.error(bind + 'requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + 'is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
} 

//função debug
function onListenning(){
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
