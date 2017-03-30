let _ = require('lodash');

import { LoggingMemoryPersistence } from '../../src/persistence/LoggingMemoryPersistence';
import { LoggingPersistenceFixture } from './LoggingPersistenceFixture';

suite('LoggingMemoryPersistence', ()=> {
    let persistence: LoggingMemoryPersistence;
    let fixture: LoggingPersistenceFixture;

    suiteSetup((done) => {
        persistence = new LoggingMemoryPersistence();
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