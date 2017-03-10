/**
 * @file Logging process runner
 * @copyright Digital Living Software Corp. 2014-2016
 */

var LoggingProcessRunner = require('../lib/src/run/LoggingProcessRunner').LoggingProcessRunner;

var runner = new LoggingProcessRunner();
runner.startWithDefaultConfig('./config/config.json');