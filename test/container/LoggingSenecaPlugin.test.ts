let _ = require('lodash');
let assert = require('chai').assert;

let pluginOptions = {
    'pip-services-logging': {
        logs: {
            level: 'debug'
        },
        persistence: {
            type: 'memory'
        },
        services: {
            connection: {
                type: 'none'
            }
        }
    }
};

suite('LoggingSenecaPlugin', ()=> {
    let seneca;

    suiteSetup((done) => {
        seneca = require('seneca')();

        // Load Seneca plugin
        let plugin = require('../../src/container/LoggingSenecaPlugin');
        seneca.use(plugin);

        seneca.ready(done);
    });

    suiteTeardown((done) => {
        seneca.close(done);
    });

    test.skip('Ping', (done) => {
        seneca.act(
            {
                role: 'logging',
                cmd: 'get_messages' 
            },
            (err, page) => {
                assert.isNull(err);
                assert.isObject(page);
                done();
            }
        );
    });
});