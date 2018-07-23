let _ = require('lodash');

import { LoggingErrorsMemoryPersistence } from '../../src/persistence/LoggingErrorsMemoryPersistence';
import { LoggingPersistenceFixture } from './LoggingPersistenceFixture';

suite('LoggingErrorsMemoryPersistence', ()=> {
    let persistence: LoggingErrorsMemoryPersistence;
    let fixture: LoggingPersistenceFixture;

    suiteSetup((done) => {
        persistence = new LoggingErrorsMemoryPersistence();
        fixture = new LoggingPersistenceFixture(persistence);
        done();
    });
    
    setup((done) => {
        persistence.clear(null, done);
    });

    // test('Read and Write', (done) => {
    //     fixture.testReadWrite(done);
    // });

    // test('Search', (done) => {
    //     fixture.testSearch(done);
    // });
});