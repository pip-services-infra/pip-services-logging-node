"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const pip_services3_components_node_1 = require("pip-services3-components-node");
exports.LoggingMongooseSchema = function (collection) {
    collection = collection || 'logs';
    let ErrorDescriptionSchema = new mongoose_1.Schema({
        type: { type: String, required: true },
        category: { type: String, required: true },
        status: { type: Number, required: true },
        code: { type: String, required: true },
        message: { type: String, required: true },
        details: { type: String, required: false },
        correlation_id: { type: String, required: false },
        cause: { type: String, required: false },
        stack_trace: { type: String, required: true },
    });
    ErrorDescriptionSchema.set('toJSON', {
        transform: function (doc, ret) {
            //ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    });
    let LogsSchema = new mongoose_1.Schema({
        _id: { type: String },
        time: { type: Date, required: true, index: true },
        source: { type: String, required: false, index: true },
        level: { type: pip_services3_components_node_1.LogLevel, required: true, index: true },
        correlation_id: { type: String, required: false },
        error: { type: ErrorDescriptionSchema, required: false },
        message: { type: String, required: true }
    }, {
        collection: collection,
        autoIndex: true
    });
    LogsSchema.set('toJSON', {
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    });
    LogsSchema.index({ source: 1, level: 1, time: -1 });
    return LogsSchema;
};
//# sourceMappingURL=LoggingMongooseSchema.js.map