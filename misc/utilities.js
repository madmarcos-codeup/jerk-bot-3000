// LOGGING SETUP
const winston = require('winston');
require('winston-daily-rotate-file');

const transport = new (winston.transports.DailyRotateFile)({
  filename: 'logs/jerkbot-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxFiles: '28d'
});

let logger = null;

module.exports = {
	getRequestIPAddress: (request) => {
		return request.headers['x-forwarded-for'] || request.connection.remoteAddress;
	},

	getLogger: () => {
		if(logger == null) {
			logger = winston.createLogger({
				level: 'debug',
				format: winston.format.combine(
				  winston.format.timestamp({
					format: 'YYYY-MM-DD HH:mm:ss'
				  }),
				  winston.format.errors({ stack: true }),
				  winston.format.splat(),
				  winston.format.prettyPrint()
				),
				defaultMeta: { service: 'jerkbot' },
				transports: [
				  transport
				]
			  });
		}
		return logger;
	},

	pad: (n, width, z) => {
		z = z || '0';
		n = n + '';
		return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
	},
	
    whatIsIt: (object) => {
    	// borrowed from https://stackoverflow.com/questions/11182924/how-to-check-if-javascript-object-is-json
		const stringConstructor = "test".constructor;
		const arrayConstructor = [].constructor;
		const objectConstructor = ({}).constructor;

    	if (object === null) {
        	return "null";
    	}
    	if (object === undefined) {
        	return "undefined";
    	}
    	if (object.constructor === stringConstructor) {
        	return "String";
    	}
    	if (object.constructor === arrayConstructor) {
        	return "Array";
    	}
    	if (object.constructor === objectConstructor) {
        	return "Object";
    	}
        return "don't know";
    }
};