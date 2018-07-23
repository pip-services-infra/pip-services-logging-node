let _ = require('lodash');

import { LoggingMessagesMemoryPersistence } from '../../src/persistence/LoggingMessagesMemoryPersistence';
import { LoggingPersistenceFixture } from './LoggingPersistenceFixture';

suite('LoggingMessagesMemoryPersistence', ()=> {
    let persistence: LoggingMessagesMemoryPersistence;
    let fixture: LoggingPersistenceFixture;

    suiteSetup((done) => {
        persistence = new LoggingMessagesMemoryPersistence();
        fixture = new LoggingPersistenceFixture(persistence);
        done();
    });
    
    setup((done) => {
        persistence.clear(null, done);
    });

    test('Read and Write', (done) => {
        fixture.testReadWrite(done);
    });

    test('Search', (done) => {
        fixture.testSearch(done);
    });
});