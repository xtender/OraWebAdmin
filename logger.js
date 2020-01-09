module.exports = {
    
    //================================================================================================
    // function fileList(dir)
    getLogger: function(pName, pLabel, pService, pLevel, pLogdir, pLogname) {

        var winston = require('winston');
        var { createLogger, format, transports } = require('winston');
        var { combine, timestamp, label, printf } = format;
        var myFormat = printf(({ level, message, label, timestamp }) => {
          return `${timestamp} ${pName}: [${label}] ${level}: ${message}`;
        });

        return createLogger({
          level: pLevel,
          format: combine(
                    label({ label: pLabel }),
                    timestamp(),
                    myFormat
                  ),
                    //winston.format.simple(),
                    //winston.format.json(),
          defaultMeta: { service: pService },
          transports: [
            //
            // - Write all logs with level `error` and below to `error.log`
            // - Write all logs with level `info` and below to `combined.log`
            //
            new winston.transports.Console({silent: false, stderrLevels:['error'], consoleWarnLevels: ['warn','debug'] }),
            new winston.transports.File({ filename: pLogdir + pLogname, level: 'debug' })
            //,new winston.transports.File({ filename: 'combined.log' })
          ]
        });
    }
    //================================================================================================
}