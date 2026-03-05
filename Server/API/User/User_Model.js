const Mongoose = require('mongoose');

const normalizeUserTypes = (value) => {
    if (Array.isArray(value)) {
        return [...new Set(value.map((item) => (typeof item === 'string' ? item.trim() : '')).filter(Boolean))];
    }

    if (typeof value === 'string') {
        const trimmed = value.trim();
        if (!trimmed) return [];

        if (trimmed.startsWith('[')) {
            try {
                const parsed = JSON.parse(trimmed);
                if (Array.isArray(parsed)) {
                    return [...new Set(parsed.map((item) => (typeof item === 'string' ? item.trim() : '')).filter(Boolean))];
                }
            } catch {
                // Fall through to non-JSON parsing.
            }
        }

        if (trimmed.includes(',')) {
            return [...new Set(trimmed.split(',').map((item) => item.trim()).filter(Boolean))];
        }

        return [trimmed];
    }

    return [];
};

const UserSchema = Mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        sparse: true
    },
    userType: {
        type: [String],
        required: true,
        set: normalizeUserTypes,
        validate: {
            validator: (value) => Array.isArray(value) && value.length > 0,
            message: 'User Type is required.',
        },
    },
    designation: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    secret_code: {
        type: String,
        required: true
    },
    remark: {
        type: String,
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
});

let User = Mongoose.model('User', UserSchema);

module.exports = User;
