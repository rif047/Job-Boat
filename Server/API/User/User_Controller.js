let User = require('./User_Model');
let bcrypt = require('bcrypt');

const ALLOWED_USER_TYPES = new Set([
    'Admin',
    'Agent',
    'Indian Lead Agent',
    'Care Agent',
    'Other',
]);

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

const normalizeUserForResponse = (user) => {
    if (!user) return user;
    return { ...user, userType: normalizeUserTypes(user.userType) };
};

const validateUserTypes = (userTypeValue) => {
    const normalizedUserTypes = normalizeUserTypes(userTypeValue);

    if (!normalizedUserTypes.length) {
        return { error: 'User Type is required!' };
    }

    const invalidTypes = normalizedUserTypes.filter((type) => !ALLOWED_USER_TYPES.has(type));
    if (invalidTypes.length) {
        return { error: `Invalid User Type: ${invalidTypes.join(', ')}` };
    }

    if (normalizedUserTypes.includes('Admin')) {
        return { userTypes: ['Admin'] };
    }
    if (normalizedUserTypes.includes('Agent')) {
        return { userTypes: ['Agent'] };
    }

    return { userTypes: normalizedUserTypes };
};

let Users = async (req, res) => {
    let Data = await User.find().lean();
    res.status(200).json(Data.map(normalizeUserForResponse));
};

let Create = async (req, res) => {
    try {
        let { name, phone, username, userType, email, password, secret_code, designation, remark } = req.body;

        if (!name) { return res.status(400).send('Name is required!'); }
        if (!phone) { return res.status(400).send('Phone is required!'); }
        if (!username) { return res.status(400).send('Username is required!'); }
        if (!email) { return res.status(400).send('Email is required!'); }
        if (!password) { return res.status(400).send('Password is required!'); }
        if (!secret_code) { return res.status(400).send('Secret Code is required!'); }
        if (!designation) { return res.status(400).send('Designation is required!'); }

        const { userTypes, error: userTypeError } = validateUserTypes(userType);
        if (userTypeError) { return res.status(400).send(userTypeError); }

        const normalizedUsername = username.toLowerCase();
        const normalizedEmail = email.toLowerCase();

        let checkUserName = await User.findOne({ username: normalizedUsername });
        if (checkUserName) { return res.status(400).send('Username already exists. Use different one.'); }

        let checkPhone = await User.findOne({ phone });
        if (checkPhone) { return res.status(400).send('Phone already exists. Use different one.'); }

        let checkEmail = await User.findOne({ email: normalizedEmail });
        if (checkEmail) { return res.status(400).send('Email already exists. Use different one.'); }

        let hashPassword = await bcrypt.hash(password, 10);

        let newData = new User({
            name,
            phone,
            userType: userTypes,
            designation,
            remark,
            username: normalizedUsername,
            email: normalizedEmail,
            password: hashPassword,
            secret_code: secret_code.toLowerCase()
        });

        await newData.save();
        res.status(200).json(normalizeUserForResponse(newData.toObject()));
        console.log('Created Successfully');

    } catch (error) {
        console.error(error);
        res.status(500).send('Creation Error!!!');
    }
};

let View = async (req, res) => {
    let viewOne = await User.findById(req.params.id).lean();
    res.send(normalizeUserForResponse(viewOne));
};

let Update = async (req, res) => {
    try {
        let { name, phone, username, userType, email, password, secret_code, designation, remark } = req.body;

        if (!name) { return res.status(400).send('Name is required!'); }
        if (!phone) { return res.status(400).send('Phone is required!'); }
        if (!username) { return res.status(400).send('Username is required!'); }
        if (!email) { return res.status(400).send('Email is required!'); }
        if (!secret_code) { return res.status(400).send('Secret Code is required!'); }
        if (!designation) { return res.status(400).send('Designation is required!'); }

        const { userTypes, error: userTypeError } = validateUserTypes(userType);
        if (userTypeError) { return res.status(400).send(userTypeError); }

        const normalizedUsername = username.toLowerCase();
        const normalizedEmail = email.toLowerCase();

        let checkUserName = await User.findOne({ username: normalizedUsername, _id: { $ne: req.params.id } });
        if (checkUserName) { return res.status(400).send('Username already exists. Use different one.'); }

        let checkPhone = await User.findOne({ phone, _id: { $ne: req.params.id } });
        if (checkPhone) { return res.status(400).send('Phone already exists. Use different one.'); }

        let checkEmail = await User.findOne({ email: normalizedEmail, _id: { $ne: req.params.id } });
        if (checkEmail) { return res.status(400).send('Email already exists. Use different one.'); }

        let updateData = await User.findById(req.params.id);
        if (!updateData) {
            return res.status(404).send('User not found!');
        }

        updateData.name = name;
        updateData.phone = phone;
        updateData.userType = userTypes;
        updateData.designation = designation;
        updateData.remark = remark;
        updateData.username = normalizedUsername;
        updateData.email = normalizedEmail;
        updateData.secret_code = secret_code.toLowerCase();

        if (password) {
            let hashPassword = await bcrypt.hash(password, 10);
            updateData.password = hashPassword;
        }

        await updateData.save();
        res.status(200).json(normalizeUserForResponse(updateData.toObject()));
        console.log('Updated Successfully');

    } catch (error) {
        console.error(error);
        res.status(500).send('Updating Error!!!');
    }
};

let Delete = async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).send('Deleted');
};

module.exports = { Users, Create, View, Update, Delete };
