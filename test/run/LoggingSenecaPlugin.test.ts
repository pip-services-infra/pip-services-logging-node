let _ = require('lodash');

import { LoggingSenecaPlugin } from '../../src/run/LoggingSenecaPlugin';

let testFw = require('pip-services-test-node');
let assert = testFw.assert;

let buildConfig = {
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

suite('LoggingSenecaPlugin', ()=> {    
    let seneca;
    let plugin = new LoggingSenecaPlugin();

    suiteSetup((done) => {
        seneca = require('seneca')();
        seneca.use(plugin.entry(buildConfig));
        done();
    });
    
    suiteTeardown((done) => {
        seneca.close(done);
    });
                
    test('Ping', (done) => {
        seneca.act(
            {
                role: 'logs',
                cmd: 'read_logs' 
            },
            (err, entries) => {
                assert.result(err, entries);                
                done();
            }
        );
    });
});