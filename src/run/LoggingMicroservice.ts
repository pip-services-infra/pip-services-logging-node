import { Microservice } from 'pip-services-runtime-node';

import { LoggingFactory } from '../build/LoggingFactory';

/**
 * Dummy microservice class.
 * 
 * @author Volodymyr Tkachenko
 * @version 1.0
 * @since 2016-06-24
 */
export class LoggingMicroservice extends Microservice {
	/**
	 * Creates instance of dummy microservice.
	 */
	constructor() {
		super("pip-services-logging", LoggingFactory.Instance);
	}
}
