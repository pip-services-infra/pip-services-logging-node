let LoggingProcess = require('../obj/src/container/LoggingProcess').LoggingProcess;

try {
    new LoggingProcess().runWithArguments(process.argv);
} catch (ex) {
    console.error(ex);
}
