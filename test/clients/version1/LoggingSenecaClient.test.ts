let _ = require('lodash');

import { ComponentSet } from 'pip-services-runtime-node';
import { DynamicMap } from 'pip-services-runtime-node';
import { ComponentConfig } from 'pip-services-runtime-node';
import { LifeCycleManager } from 'pip-services-runtime-node';
import { SenecaAddon } from 'pip-services-runtime-node';

import { LoggingMongoDbPersistence } from '../../../src/persistence/LoggingMongoDbPersistence';
import { LoggingController } from '../../../src/logic/LoggingController';
import { LoggingSenecaService } from '../../../src/services/version1/LoggingSenecaService';
import { LoggingSenecaClient } from '../../../src/clients/version1/LoggingSenecaClient';
import { LoggingClientFixture } from './LoggingClientFixture';

let options = new DynamicMap(require('../../../../config/config'));
let dbOptions = new ComponentConfig(null, options.getMap('persistence'));

suite('LoggingSenecaClient', ()=> {        
    let db = new LoggingMongoDbPersistence();
    db.configure(dbOptions);

    let ctrl = new LoggingController();
    ctrl.configure(new ComponentConfig());

    let service = new LoggingSenecaService();
    service.configure(new ComponentConfig());

    let client = new LoggingSenecaClient();
    client.configure(new ComponentConfig());

    let seneca = new SenecaAddon();
    seneca.configure(new ComponentConfig());

    let components = ComponentSet.fromComponents(db, ctrl, client, service, seneca);
    let fixture = new LoggingClientFixture(client);

    suiteSetup((done) => {
        LifeCycleManager.linkAndOpen(components, done);
    });
    
    suiteTeardown((done) => {
        seneca.getSeneca().close(() => {
            LifeCycleManager.close(components, done);
        });
    });
    
    setup((done) => {
        db.clearTestData(done);
    });
    
    test('CRUD Operations', (done) => {
        fixture.testCrudOperations(done);
    });
});