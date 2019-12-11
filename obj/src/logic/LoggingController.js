"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
let async = require('async');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const pip_services3_components_node_1 = require("pip-services3-components-node");
const LoggingCommandSet_1 = require("./LoggingCommandSet");
class LoggingController {
    constructor() {
        this._expireCleanupTimeout = 60; // 60 min
        this._expireLogsTimeout = 3; // 3 days
        this._expireErrorsTimeout = 30; // 30 days
        this._interval = null;
        this._dependencyResolver = new pip_services3_commons_node_3.DependencyResolver();
        this._dependencyResolver.put('messages_persistence', new pip_services3_commons_node_2.Descriptor('pip-services-logging', 'persistence-messages', '*', '*', '*'));
        this._dependencyResolver.put('errors_persistence', new pip_services3_commons_node_2.Descriptor('pip-services-logging', 'persistence-errors', '*', '*', '*'));
    }
    getCommandSet() {
        if (this._commandSet == null)
            this._commandSet = new LoggingCommandSet_1.LoggingCommandSet(this);
        return this._commandSet;
    }
    configure(config) {
        this._dependencyResolver.configure(config);
        this._expireCleanupTimeout = config.getAsIntegerWithDefault('options.expire_cleanup_timeout', this._expireCleanupTimeout);
        this._expireLogsTimeout = config.getAsIntegerWithDefault('options.expire_logs_timeout', this._expireLogsTimeout);
        this._expireErrorsTimeout = config.getAsIntegerWithDefault('options.expire_errors_timeout', this._expireErrorsTimeout);
    }
    setReferences(references) {
        this._dependencyResolver.setReferences(references);
        this._messagesPersistence = this._dependencyResolver.getOneRequired('messages_persistence');
        this._errorsPersistence = this._dependencyResolver.getOneRequired('errors_persistence');
    }
    isOpen() {
        return this._interval != null;
    }
    open(correlationId, callback) {
        if (this._interval != null) {
            clearInterval(this._interval);
        }
        this._interval = setInterval(() => {
            this.deleteExpired(correlationId, null);
        }, 1000 * 60 * this._expireCleanupTimeout);
        if (callback != null)
            callback(null);
    }
    close(correlationId, callback) {
        if (this._interval != null) {
            clearTimeout(this._interval);
            this._interval = null;
        }
        if (callback != null)
            callback(null);
    }
    writeMessage(correlationId, message, callback) {
        message.id = pip_services3_commons_node_1.IdGenerator.nextLong();
        message.level = message.level || pip_services3_components_node_1.LogLevel.Trace;
        message.time = message.time || new Date();
        async.parallel([
            (callback) => {
                this._messagesPersistence.addOne(correlationId, message, callback);
            },
            (callback) => {
                if (message.level <= pip_services3_components_node_1.LogLevel.Error) {
                    this._errorsPersistence.addOne(correlationId, message, callback);
                }
                else {
                    callback();
                }
            }
        ], (err, results) => {
            let message = results[0];
            callback(err, message);
        });
    }
    writeMessages(correlationId, messages, callback) {
        if (messages == null || messages.length == 0) {
            if (callback)
                callback(null);
            return;
        }
        let errors = [];
        _.each(messages, (message) => {
            message.id = pip_services3_commons_node_1.IdGenerator.nextLong();
            message.level = message.level || pip_services3_components_node_1.LogLevel.Trace;
            message.time = message.time || new Date();
            if (message.level <= pip_services3_components_node_1.LogLevel.Error) {
                errors.push(message);
            }
        });
        async.parallel([
            (callback) => {
                this._messagesPersistence.addBatch(correlationId, messages, callback);
            },
            (callback) => {
                if (errors.length > 0) {
                    this._errorsPersistence.addBatch(correlationId, errors, callback);
                }
                else {
                    callback();
                }
            }
        ], (err) => {
            callback(err);
        });
    }
    readMessages(correlationId, filter, paging, callback) {
        this._messagesPersistence.getPageByFilter(correlationId, filter, paging, callback);
    }
    readErrors(correlationId, filter, paging, callback) {
        this._errorsPersistence.getPageByFilter(correlationId, filter, paging, callback);
    }
    clear(correlationId, callback) {
        this._messagesPersistence.clear(correlationId, callback);
    }
    deleteExpired(correlationId, callback) {
        let now = new Date().getTime();
        let expireLogsTime = new Date(now - this._expireLogsTimeout * 24 * 3600000);
        let expireErrorsTime = new Date(now - this._expireErrorsTimeout * 24 * 3600000);
        this._messagesPersistence.deleteExpired(correlationId, expireLogsTime, callback);
        this._errorsPersistence.deleteExpired(correlationId, expireErrorsTime, callback);
    }
}
exports.LoggingController = LoggingController;
//# sourceMappingURL=LoggingController.js.map