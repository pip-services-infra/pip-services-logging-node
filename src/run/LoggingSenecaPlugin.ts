import { SenecaPlugin } from 'pip-services-runtime-node';

import { LoggingMicroservice} from './LoggingMicroservice';

export class LoggingSenecaPlugin extends SenecaPlugin {
    constructor() {
        super('logs', new LoggingMicroservice());
    }
}