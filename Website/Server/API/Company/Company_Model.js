const Mongoose = require("mongoose");

const CompanySchema = new Mongoose.Schema(
    {
        package: {
            type: Mongoose.Schema.Types.ObjectId,
            ref: "Package",
        },

        jobs: [
            {
                type: Mongoose.Schema.Types.ObjectId,
                ref: "Job",
            },
        ],

        savedEmployees: [
            {
                type: Mongoose.Schema.Types.ObjectId,
                ref: "Employee",
            },
        ],

        name: {
            type: String,
            required: true,
            trim: true,
        },

        phone: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        address: {
            state: {
                type: String,
            },
            city: {
                type: String,
            },
            postalCode: {
                type: String,
            },
        },

        companyType: {
            type: String,
        },

        logo: {
            type: String,
        },

        website: {
            type: String,
            trim: true,
            lowercase: true
        },

        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true,
        },

        secret_code_1: {
            type: String,
            lowercase: true,
            trim: true
        },

        secret_code_2: {
            type: String,
            lowercase: true,
            trim: true
        },

        description: {
            type: String,
        },





        verified: {
            type: Boolean,
            default: false,
        },

        verificationToken: {
            type: String,
        },

        verificationTokenExpiresAt: {
            type: Date,
        },

        verificationAttempts: {
            type: Number,
            default: 0
        },

        resetPasswordToken: {
            type: String,
        },

        resetPasswordExpiresAt: {
            type: Date,
        },

        resetPasswordAttempts: {
            type: Number,
            default: 0
        },
        lastResetPasswordRequestAt: {
            type: Date
        }

    },
    { timestamps: true }
);

module.exports = Mongoose.model("Company", CompanySchema);
