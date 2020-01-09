#!/usr/bin/env node

//config:
const fconfig = require('./config.json')
const defaultConfig = fconfig.default;
const environment = process.env.NODE_ENV || 'development';
const environmentConfig = fconfig[environment];
global.config = Object.assign(defaultConfig, environmentConfig);

console.log(config);

//port:
const port = process.env.NODE_PORT || config.port || 3001;

//logger:
const logger = require('./logger.js').getLogger('main', 'server.js', config.loglevel, 'orawebadmin', config.logdir, 'application.log');

//tools
const tools = require('./tools.js')

//express, express-ws
const express = require('express')
const app = express()
const bodyParser = require('body-parser');

var expressWs = require('express-ws')(app);
var child_proc;

const basicAuth = require('express-basic-auth')
app.use(basicAuth({
    users: config.users,
    challenge: true,
    realm: 'OraWebAdmin',
}));

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

app.use(function (req, res, next) {
  logger.debug('middleware');
  req.testing = 'testing';
  return next();
});


app.get('/', function (req, res) {
    //res.send('Hello World!')
    logger.debug('get route', req.testing);
    res.render(
        'index', 
        {
            appname: 'OraWebAdmin',
            version: 'v.1.0',
            links: [
                {name: 'TMD.tv', url: 'http://tmd.tv/'}
            ],
            actions: [
                {name: 'Action1', url: 'action1'},
                {name: 'Action2', url: 'action2'},
                {name: 'Action3', url: 'action3'}
            ],
            scripts: tools.listScripts(),
            databases: config.databases
        }
    );
})

app.post('/', function (req, res) {
  res.render('index');
  logger.debug(req.body.city);
})

app.ws('/run', function(ws, req) {
  ws.on('message', function(txtMsg) {
    logger.info('Incoming message: ' + txtMsg);
    var msg = JSON.parse(txtMsg);
      
    var cmd = msg.cmd;
    var db = msg.dbName;
      
    if (cmd==='kill'  && child_proc!==null){
      child_proc.kill();
      child_proc=null
    }else{
      logger.debug('Executing command ' + cmd + '...');
      child_proc=tools.runCommand(ws, cmd, 
        [],
        {
                //PATH: process.env.PATH,
                DBNAME:     config.databases[db].dbname,
                ORACLE_SID:    config.databases[db].oracle_sid,
                LOGIN:      config.databases[db].login,
                ORACLE_HOME:   config.databases[db].oracle_home,
        }
        );
    }
  });
  //console.log('socket', req.testing);
});

app.listen(port, function () {
  logger.info((new Date()) + ' Server is listening on port ' + port);
})

