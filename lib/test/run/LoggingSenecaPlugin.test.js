var _ = require('lodash');
var LoggingSenecaPlugin_1 = require('../../src/run/LoggingSenecaPlugin');
var testFw = require('pip-services-test-node');
var assert = testFw.assert;
var buildConfig = {
    logs: {
        descriptor: {
            type: 'console'
        }
    },
    persistence: {
        descriptor: {
            type: 'mongodb'
        },
        connection: {
            uri: "mongodb://localhost/mmstest"
        }
    },
    controllers: {
        descriptor: {
            type: '*'
        }
    },
    services: {
        descriptor: {
            type: 'seneca'
        }
    }
};
suite('LoggingSenecaPlugin', function () {
    var seneca;
    var plugin = new LoggingSenecaPlugin_1.LoggingSenecaPlugin();
    suiteSetup(function (done) {
        seneca = require('seneca')();
        seneca.use(plugin.entry(buildConfig));
        done();
    });
    suiteTeardown(function (done) {
        seneca.close(done);
    });
    test('Ping', function (done) {
        seneca.act({
            role: 'logs',
            cmd: 'read_logs'
        }, function (err, entries) {
            assert.result(err, entries);
            done();
        });
    });
});
