// tools.js
// ========
const config = global.config;
const logger = require('./logger.js').getLogger('tools', 'tools.js', config.loglevel, 'orawebadmin', config.logdir, 'application.log');

const os = require('os');

const FileExtOS = os.platform()==='win32'?'bat':'sh';
const FileExtAllowed = [FileExtOS, 'sql', 'rman', 'dgmgrl'];

function getFileExtension(filename) {
    return filename.substring(0,1) === '.' ? '' : filename.split('.').slice(1).pop() || '';
}

function trimFileExtension(filename) {
    return filename.substring(0, filename.indexOf('.'));
}

module.exports = {
    //getFileExtension(filename)
    
    //================================================================================================
    //================================================================================================
    // function fileList(dir)
    fileList: function(dir) {
        var path = require('path');
        var fs = require('fs');
        
        //logger.debug('fileList dir = ' + dir);
        return fs.readdirSync(dir).reduce(function(list, file) {
          var name = path.join(dir, file);
          
          //logger.debug('../' + name);
          var isDir = fs.statSync(name).isDirectory();
          return list.concat(isDir ? fileList(name) : [name]);
        }, []);
    },
    //================================================================================================
    // function listScripts()
    listScripts: function () {
      var path = require('path');
      const directoryPath = path.join(__dirname, 'scripts');
      //passsing directoryPath and callback function
      return this.fileList(directoryPath)
                    .map((file) => file.split(path.sep).slice(-1)[0])
                    .filter(function (fname) {
                        // os.platform(): 'darwin', 'freebsd', 'linux', 'sunos' or 'win32'
                        return FileExtAllowed.includes(getFileExtension(fname));
                    })
                    .sort()
                    .map(function(value, index){return {key: index, name: value, prettyName: trimFileExtension(value)}});
        ;
    },
    //================================================================================================
    // function listScripts()
    listExtensions: function () {
      var path = require('path');
      const directoryPath = path.join(__dirname, 'extensions');
      //passsing directoryPath and callback function
      return this.fileList(directoryPath)
                    .map((file) => file.split(path.sep).slice(-1)[0])
                    .filter(function (fname) {
                        // os.platform(): 'darwin', 'freebsd', 'linux', 'sunos' or 'win32'
                        return getFileExtension(fname) === FileExtOS;
                    })
                    .sort()
                    .map(function(value, index){return {key: index, name: value}});
        ;
    },
    //================================================================================================
    // function listScripts()
    getScriptByExtension: function (fExt) {
      var path = require('path');
      const directoryPath = path.join(__dirname, 'extensions');
      //passing directoryPath and callback function
      return this.fileList(directoryPath)
                    .map((file) => file.split(path.sep).slice(-1)[0])
                    .filter(function (fname) {
                        // os.platform(): 'darwin', 'freebsd', 'linux', 'sunos' or 'win32'
                        return fname === fExt + '.' + FileExtOS;
                    })[0];
        ;
    },
    //================================================================================================
    // function runCommand(ws, cmd)
    runCommand: function (ws,cmdN, params, env) {
        var winston = require('winston');
        var cmd = this.listScripts()[cmdN].name;
        ws.send('Executing command ' + cmd + '...');
        
        const { createLogger, format, transports } = require('winston');
        const { combine, timestamp, label, printf } = format;
        const myFormat = printf(({ level, message, label, timestamp }) => {
          return `${timestamp} runCommand: [${label}] ${level}: ${message}`;
        });
        
        var cmdLog = cmd+'-'+ (new Date()).toISOString() + '.log';
        
        var cmdLogger = require('./logger.js').getLogger('runCommand', cmd, 'debug', 'orawebadmin', config.logdir, cmdLog);
        
        const { spawn } = require('child_process');
        var fullpath;
        var fullcmd;
        var cmdExtension = getFileExtension(cmd);
        env["SCRIPT"] = cmd;
        
        if(cmdExtension === FileExtOS){
            fullpath = __dirname + '/scripts';
            fullcmd = __dirname + '/scripts/'+cmd;
        }else{
            fullpath = __dirname + '/scripts';
            fullcmd = __dirname + '/extensions/' + cmdExtension +'.'+ FileExtOS;
            env["SCRIPT"] = __dirname + '/scripts/' + cmd;
        }
        
        var child = null;
        //ws.send('Starting '+fullcmd + ' in ' + fullpath);
        cmdLogger.info('Starting '+fullcmd);
        logger.debug('Starting '+fullcmd);
        try {
            //ws.send('Spawn '+fullcmd + ' in ' + fullpath);
            child = spawn(
                fullcmd,
                params, 
                {
                    cwd: fullpath,
                    env: env
                }
            );
            //ws.send('Started '+fullcmd + ' in ' + fullpath);
        }catch(err){
            logger.error('spawn error: ' + err);
            cmdLogger.error(err);
            cmdLogger.close();
            ws.send(err.toString());
            ws.send('Stack: ' + err.stack);
            ws.close();
            return null;
        }
        // use child.stdout.setEncoding('utf8'); if you want text chunks
        child.stdout.setEncoding('utf8');
        child.stdout.on('data', (chunk) => {
          // data from standard output is here as buffers
          //ws.send(chunk,function(err) { console.log('Err: ' + err); });
          try{
            //ws.send(chunk);
              ws.send(chunk.replace(/(\r)/gm,""));
            cmdLogger.log('debug',chunk);
          }catch(err){
            logger.error('ws.send chunk error: ' + err);
            cmdLogger.error(err);
          }
        });
        // STDERR
        child.stderr.on('data', (chunk) => {
          // data from standard output is here as buffers
          //ws.send(chunk,function(err) { console.log('Err: ' + err); });
          try{
            ws.send('STDERR: ' + chunk);
            cmdLogger.error(chunk);
          }catch(err){
            logger('ws.send chunk error: ' + err);
            cmdLogger.error(err);
          }
        });

        // since these are streams, you can pipe them elsewhere
        //  child.stderr.pipe(dest);

        child.on('close', (code) => {
          var res = code===0 ? `${cmd} successfully completed. Exit code=${code}` : `child process exited with code ${code}`;
          logger.debug(res);
          cmdLogger.info(res);
          cmdLogger.close();
          ws.send    (res);
          ws.close();
        });
        return child;
    }
  
  
};

