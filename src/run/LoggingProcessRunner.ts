import { ProcessRunner } from 'pip-services-runtime-node';

import { LoggingMicroservice } from './LoggingMicroservice';

/**
 * Logging process runner
 * 
 * @author Volodymyr Tkachenko
 * @version 1.0
 * @since 2016-06-24
 */
export class LoggingProcessRunner extends ProcessRunner {
    /**
     * Creates instance of logging process runner
     */
    constructor() {
        super(new LoggingMicroservice());
    }
}