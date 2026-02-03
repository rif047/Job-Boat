const Company = require('./Company_Model');
const bcrypt = require("bcrypt");
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const FS = require('fs');
const sanitizeHtml = require('sanitize-html');
const { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendResetSuccessEmail } = require('./Mailtrap/Mailtrap.config.js')


const EndPoint = 'companies';

const storage = multer.memoryStorage();


const normalizeString = (str) => {
    if (!str) return '';
    return str.trim().toLowerCase();
};


const fileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return cb(new Error('Only JPG and PNG files are allowed!'), false);
    }
    cb(null, true);
};


const uploadImage = multer({
    storage,
    fileFilter,
    limits: { fileSize: 3 * 1024 * 1024 }
}).single('logo');


const checkDuplicates = async (field, value, id = null) => {
    if (!value) return null;

    if (field === 'email' || field === 'username') {
        value = normalizeString(value);
    }

    const query = { [field]: value };
    if (id) query._id = { $ne: id };
    return await Company.findOne(query);
};


const sanitizeDescription = (desc) => {
    if (!desc) return '';
    return sanitizeHtml(desc, {
        allowedTags: ['p', 'b', 'i', 'u', 'strong', 'em', 'a', 'ul', 'ol', 'li', 'br', 'span'],
        allowedAttributes: {
            'a': ['href', 'target', 'rel'],
            'span': ['style']
        },
        allowedStyles: {
            '*': {
                'color': [/^#[0-9a-fA-F]{3,6}$/, /^rgb\(/],
                'font-weight': [/^bold$/],
                'font-style': [/^italic$/],
                'text-decoration': [/^underline$/]
            }
        },
        allowedSchemes: ['http', 'https', 'mailto']
    });
};


const compressAndSaveLogo = async (file, companyName) => {
    const currentDateTime = new Date().toISOString().replace(/[:.-]/g, '');
    const safeName = file.originalname.replace(/\s+/g, '-').toLowerCase();
    const imageName = `${companyName.toLowerCase()}-${currentDateTime}-${safeName}`;

    const outputPath = path.join(`Assets/Images/${EndPoint}/`, imageName);

    FS.mkdirSync(path.dirname(outputPath), { recursive: true });

    await sharp(file.buffer)
        .resize(500, 500, { fit: sharp.fit.inside, withoutEnlargement: true })
        .toFormat('jpeg', { quality: 80 })
        .toFile(outputPath);

    return imageName;
};












let Companies = async (req, res) => {
    try {
        let data = await Company.find()
            .select("-password -verificationToken -resetPasswordToken -secret_code_1 -secret_code_2")
            .populate('package')
            .populate('jobs')
            .populate('savedEmployees');
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching companies');
    }
};



let View = async (req, res) => {
    try {
        let company = await Company.findById(req.params.id)
            .select("-password -verificationToken -resetPasswordToken -secret_code_1 -secret_code_2")
            .populate('package')
            .populate('jobs')
            .populate('savedEmployees');
        if (!company) return res.status(404).send('Company not found');
        res.status(200).json(company);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching company');
    }
};



let Create = async (req, res) => {
    try {
        let {
            name,
            phone,
            email,
            address = {},
            companyType,
            website,
            description,
            username,
            password,
            package,
            jobs,
            savedEmployees,
            secret_code_1,
            secret_code_2
        } = req.body;

        if (!name) return res.status(400).send('Company Name is required!');
        if (!phone) return res.status(400).send('Phone is required!');
        if (!email) return res.status(400).send('Email is required!');
        if (!username) return res.status(400).send('Username is required!');
        if (!password) return res.status(400).send('Password is required!');

        email = normalizeString(email);
        username = normalizeString(username);

        if (await checkDuplicates('email', email)) return res.status(400).send('Email already exists.');
        if (await checkDuplicates('phone', phone)) return res.status(400).send('Phone number already exists.');
        if (await checkDuplicates('username', username)) return res.status(400).send('Username already exists.');

        let imageFileName = '';
        if (req.file) imageFileName = await compressAndSaveLogo(req.file, name);

        let hashPassword = await bcrypt.hash(password, 10);

        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        let newData = new Company({
            name,
            phone,
            email,
            address: {
                state: address.state || '',
                city: address.city || '',
                postalCode: address.postalCode || ''
            },
            companyType,
            logo: imageFileName,
            website,
            description: sanitizeDescription(description),
            username,
            password: hashPassword,
            package,
            jobs,
            savedEmployees,
            verificationToken,
            verificationTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            secret_code_1,
            secret_code_2
        });

        try {
            await newData.save();
        } catch (error) {
            if (error.code === 11000) {
                return res.status(400).json({
                    success: false,
                    message: `Duplicate value for ${Object.keys(error.keyValue).join(', ')}`
                });
            }
            console.error(error);
            return res.status(500).json({ success: false, message: "Creation Error!!!" });
        }

        await sendVerificationEmail(newData.email, verificationToken);
        res.status(200).json(newData);
        console.log('Created Successfully');

    } catch (error) {
        console.error(error);
        res.status(500).send('Creation Error!!!');
    }
};



let verifyEmail = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const company = await Company.findOne({ email: email.toLowerCase() });

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Account not found",
            });
        }

        if (company.verified) {
            return res.status(400).json({
                success: false,
                message: "Email already verified",
            });
        }

        if (company.verificationAttempts >= 5) {
            return res.status(429).json({
                success: false,
                message: "Too many attempts. Please request a new otp.",
            });
        }

        if (company.verificationTokenExpiresAt < new Date()) {
            company.verificationAttempts += 1;
            await company.save();

            return res.status(400).json({
                success: false,
                message: "Verification otp expired",
            });
        }

        if (company.verificationToken !== otp) {
            company.verificationAttempts += 1;
            await company.save();

            return res.status(400).json({
                success: false,
                message: "Invalid verification otp",
            });
        }

        company.verified = true;
        company.verificationToken = undefined;
        company.verificationTokenExpiresAt = undefined;
        company.verificationAttempts = 0;
        await company.save();

        await sendWelcomeEmail(
            company.email,
            company.name,
            company.username,
            company.phone
        );

        res.status(200).json({
            success: true,
            message: "Email verified successfully",
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};



let forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        const company = await Company.findOne({ email: email.toLowerCase() });

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company account not found",
            });
        }

        if (
            company.lastResetPasswordRequestAt &&
            Date.now() - company.lastResetPasswordRequestAt.getTime() < 5 * 60 * 1000
        ) {
            return res.status(429).json({
                success: false,
                message: "Please wait before requesting another reset OTP",
            });
        }

        const resetOTP = Math.floor(100000 + Math.random() * 900000).toString();

        company.resetPasswordToken = resetOTP;
        company.resetPasswordExpiresAt = new Date(
            Date.now() + 10 * 60 * 1000
        );
        company.resetPasswordAttempts = 0;
        company.lastResetPasswordRequestAt = new Date();

        await company.save();

        await sendPasswordResetEmail(
            company.email,
            resetOTP
        );

        res.status(200).json({
            success: true,
            message: "Password reset OTP sent to your email",
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to send reset OTP",
        });
    }
};



let resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        if (!password) {
            return res.status(400).json({
                success: false,
                message: "New password is required",
            });
        }

        const company = await Company.findOne({
            resetPasswordToken: token,
        });

        if (!company) {
            return res.status(400).json({
                success: false,
                message: "Invalid reset OTP",
            });
        }

        if (company.resetPasswordExpiresAt < new Date()) {
            return res.status(400).json({
                success: false,
                message: "Reset OTP expired",
            });
        }

        if (company.resetPasswordAttempts >= 5) {
            return res.status(429).json({
                success: false,
                message: "Too many wrong attempts. Please request a new OTP",
            });
        }

        if (company.resetPasswordToken !== token) {
            company.resetPasswordAttempts += 1;
            await company.save();

            return res.status(400).json({
                success: false,
                message: "Invalid reset OTP",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        company.password = hashedPassword;
        company.resetPasswordToken = undefined;
        company.resetPasswordExpiresAt = undefined;
        company.resetPasswordAttempts = 0;
        company.lastResetPasswordRequestAt = undefined;

        await company.save();

        await sendResetSuccessEmail(company.email);

        res.status(200).json({
            success: true,
            message: "Password reset successful",
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Password reset failed",
        });
    }
};



let resendResetOTP = async (req, res) => {
    const { email } = req.body;

    try {
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        const company = await Company.findOne({ email: email.toLowerCase() });

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company account not found",
            });
        }

        if (!company.resetPasswordToken || !company.resetPasswordExpiresAt) {
            return res.status(400).json({
                success: false,
                message: "No active password reset request found",
            });
        }

        if (company.resetPasswordExpiresAt < new Date()) {
            return res.status(400).json({
                success: false,
                message: "OTP expired. Please request a new password reset",
            });
        }

        if (
            company.lastResetPasswordRequestAt &&
            Date.now() - company.lastResetPasswordRequestAt.getTime() < 5 * 60 * 1000
        ) {
            return res.status(429).json({
                success: false,
                message: "Please wait before requesting another OTP",
            });
        }

        const newOTP = Math.floor(100000 + Math.random() * 900000).toString();

        company.resetPasswordToken = newOTP;
        company.resetPasswordExpiresAt = new Date(
            Date.now() + 10 * 60 * 1000
        );
        company.resetPasswordAttempts = 0;
        company.lastResetPasswordRequestAt = new Date();

        await company.save();

        await sendPasswordResetEmail(
            company.email,
            newOTP
        );

        res.status(200).json({
            success: true,
            message: "New password reset OTP sent to your email",
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to resend reset OTP",
        });
    }
};



let Update = async (req, res) => {
    try {
        let {
            name,
            phone,
            email,
            address = {},
            companyType,
            website,
            description,
            username,
            password,
            package,
            jobs,
            savedEmployees,
            secret_code_1,
            secret_code_2
        } = req.body;

        if (!name) return res.status(400).send('Company Name is required!');
        if (!phone) return res.status(400).send('Phone is required!');
        if (!email) return res.status(400).send('Email is required!');
        if (!username) return res.status(400).send('Username is required!');

        email = normalizeString(email);
        username = normalizeString(username);

        if (await checkDuplicates('email', email, req.params.id)) return res.status(400).send('Email already exists. Use different one.');
        if (await checkDuplicates('phone', phone, req.params.id)) return res.status(400).send('Phone number already exists. Use different one.');
        if (await checkDuplicates('username', username, req.params.id)) return res.status(400).send('Username already exists. Use different one.');

        let updateData = await Company.findById(req.params.id);
        if (!updateData) return res.status(404).send('Company not found');

        if (req.file) {
            if (updateData.logo) {
                const oldLogoPath = path.join(`Assets/Images/${EndPoint}/`, updateData.logo);
                if (FS.existsSync(oldLogoPath)) FS.unlinkSync(oldLogoPath);
            }
            updateData.logo = await compressAndSaveLogo(req.file, name);
        }

        updateData.name = name;
        updateData.phone = phone;
        updateData.email = email;
        updateData.address = {
            state: address.state || '',
            city: address.city || '',
            postalCode: address.postalCode || ''
        };
        updateData.companyType = companyType;
        updateData.website = website;
        updateData.description = sanitizeDescription(description);
        updateData.username = username;
        if (password) updateData.password = await bcrypt.hash(password, 10);
        updateData.package = package;
        updateData.jobs = jobs;
        updateData.savedEmployees = savedEmployees;
        updateData.secret_code_1 = secret_code_1;
        updateData.secret_code_2 = secret_code_2;

        try {
            await updateData.save();
        } catch (error) {
            if (error.code === 11000) {
                return res.status(400).json({
                    success: false,
                    message: `Duplicate value for ${Object.keys(error.keyValue).join(', ')}`
                });
            }
            console.error(error);
            return res.status(500).json({ success: false, message: "Updating Error!!!" });
        }

        res.status(200).json(updateData);
        console.log('Updated Successfully');

    } catch (error) {
        console.error(error);
        res.status(500).send('Updating Error!!!');
    }
};



let Delete = async (req, res) => {
    try {
        let company = await Company.findById(req.params.id);
        if (!company) return res.status(404).send('Company not found');

        if (company.logo) {
            const imagePath = path.join(`Assets/Images/${EndPoint}/`, company.logo);

            try {
                if (FS.existsSync(imagePath)) {
                    FS.unlinkSync(imagePath);
                    console.log(`Logo deleted: ${imagePath}`);
                } else {
                    console.warn(`Logo file not found: ${imagePath}`);
                }
            } catch (err) {
                console.error(`Error deleting logo: ${err.message}`);
            }
        }

        await Company.findByIdAndDelete(req.params.id);

        res.status(200).send('Deleted Successfully');
        console.log('Deleted Successfully');

    } catch (error) {
        console.error('Deletion Error:', error);
        res.status(500).send('Deletion Error!!!');
    }
};






module.exports = { Companies, Create, verifyEmail, forgotPassword, resetPassword, resendResetOTP, View, Update, Delete, uploadImage };