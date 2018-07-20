"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
let async = require('async');
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_commons_node_2 = require("pip-services-commons-node");
const pip_services_commons_node_3 = require("pip-services-commons-node");
const pip_services_commons_node_4 = require("pip-services-commons-node");
const LoggingCommandSet_1 = require("./LoggingCommandSet");
class LoggingController {
    constructor() {
        this._expireCleanupTimeout = 60; // 60 min
        this._expireLogsTimeout = 3; // 3 days
        this._expireErrorsTimeout = 30; // 30 days
        this._interval = null;
        this._dependencyResolver = new pip_services_commons_node_2.DependencyResolver();
        this._dependencyResolver.put('read_persistence', new pip_services_commons_node_1.Descriptor('pip-services-logging', 'persistence', '*', '*', '*'));
        this._dependencyResolver.put('write_persistence', new pip_services_commons_node_1.Descriptor('pip-services-logging', 'persistence', '*', '*', '*'));
    }
    getCommandSet() {
        if (this._commandSet == null)
            this._commandSet = new LoggingCommandSet_1.LoggingCommandSet(this);
        return this._commandSet;
    }
    configure(config) {
        this._dependencyResolver.configure(config);
        this._expireCleanupTimeout = config.getAsIntegerWithDefault('options.expire_cleanup_timeout', this._expireCleanupTimeout);
        this._expireLogsTimeout = config.getAsIntegerWithDefault('options._expire_logs_timeout', this._expireLogsTimeout);
        this._expireErrorsTimeout = config.getAsIntegerWithDefault('options._expire_errors_timeout', this._expireErrorsTimeout);
    }
    setReferences(references) {
        this._dependencyResolver.setReferences(references);
        this._readPersistence = this._dependencyResolver.getOneRequired('read_persistence');
        this._writePersistence = this._dependencyResolver.getOptional('write_persistence');
        let contextInfo = references.getOneOptional(new pip_services_commons_node_1.Descriptor("pip-services", "context-info", "default", "*", "1.0"));
        if (contextInfo != null && this._source == "")
            this._source = contextInfo.name;
    }
    isOpened() {
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
        message.source = message.source || this._source;
        message.level = message.level || pip_services_commons_node_4.LogLevel.Trace;
        message.time = message.time || new Date();
        async.each(this._writePersistence, (p, callback) => {
            p.addOne(correlationId, message, callback);
        }, (err) => {
            if (callback)
                callback(err, message);
        });
    }
    writeMessages(correlationId, messages, callback) {
        if (messages == null || messages.length == 0) {
            if (callback)
                callback(null);
            return;
        }
        _.each(messages, (message) => {
            message.level = message.level || pip_services_commons_node_4.LogLevel.Trace;
            message.time = message.time || new Date();
        });
        async.each(this._writePersistence, (p, callback) => {
            p.addBatch(correlationId, messages, callback);
        }, (err) => {
            if (callback)
                callback(err);
        });
    }
    readMessages(correlationId, filter, paging, callback) {
        this._readPersistence.getPageByFilter(correlationId, filter, paging, callback);
    }
    readErrors(correlationId, filter, paging, callback) {
        filter = filter || new pip_services_commons_node_3.FilterParams();
        filter.setAsObject('errors_only', true);
        this._readPersistence.getPageByFilter(correlationId, filter, paging, callback);
    }
    clear(correlationId, callback) {
        async.each(this._writePersistence, (p, callback) => {
            p.clear(correlationId, callback);
        }, (err) => {
            if (callback)
                callback(err);
        });
    }
    deleteExpired(correlationId, callback) {
        let now = new Date().getTime();
        let expireLogsTime = new Date(now - this._expireLogsTimeout * 24 * 3600000);
        let expireErrorsTime = new Date(now - this._expireErrorsTimeout * 24 * 3600000);
        async.each(this._writePersistence, (p, callback) => {
            p.deleteExpired(correlationId, expireLogsTime, expireErrorsTime, callback);
        }, (err) => {
            if (callback)
                callback(err);
        });
        console.log('Expired logs and errors cleared');
    }
}
exports.LoggingController = LoggingController;
//# sourceMappingURL=LoggingController.js.map