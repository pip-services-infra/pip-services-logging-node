let 
    mongoose = require('mongoose'),

    Schema = mongoose.Schema,
    Mixed = Schema.Types.Mixed,

    LogEntrySchema = new Schema(
        {
            _id: { type: String, unique: true },
            time: { type: Date, required: true, index: true, 'default': Date.now },
            server: { type: String, required: false, index: true },
            level: { type: Number, required: true },
            component: { type: String, required: false },
            correlation_id: { type: String, required: false },
            message: { type: String, required: false }
        },
        {
            collection: 'logs',
            autoIndex: true,
            strict: true
        }
    );

    LogEntrySchema.set('toJSON', {
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    });

module.exports = function(connection) {
    return connection.model('LogEntry', LogEntrySchema);
};
