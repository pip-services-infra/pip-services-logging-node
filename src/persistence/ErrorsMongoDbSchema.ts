import { Schema } from 'mongoose';
import { LogLevel, ErrorDescription } from 'pip-services-commons-node';

export let ErrorsMongoDbSchema = function(collection?: string) {
    collection = collection || 'logs';

    let ErrorDescriptionSchema = new Schema(
        {
            type: { type: String, required: true },
            category: { type: String, required: true },
            status: { type: Number, required: true },
            code: { type: String, required: true },
            message: { type: String, required: true },
            details: { type: String, required: false },
            correlation_id: { type: String, required: false },
            cause: { type: String, required: false },
            stack_trace: { type: String, required: true },
        }
    )

    ErrorDescriptionSchema.set('toJSON', {
        transform: function (doc, ret) {
            //ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    });

    let ErrorsSchema = new Schema(
        {
            _id: { type: String },
            time: { type: Date, required: true, index: true },
            source: { type: String, required: false, index: true },
            level: { type: LogLevel, required: true, index: true },
            correlation_id: { type: String, required: false },
            error: { type: ErrorDescriptionSchema, required: false },
            message: { type: String, required: true }
        },
        {
            collection: collection,
            autoIndex: true
        }
    );

    ErrorsSchema.set('toJSON', {
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    });

    ErrorsSchema.index({ source: 1, level: 1, time: -1 });

    return ErrorsSchema;
}
