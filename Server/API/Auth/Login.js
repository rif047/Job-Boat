const Route = require('express').Router();
const User = require('../User/User_Model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

Route.post('/', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username: username.toLowerCase() });
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const userTypes = normalizeUserTypes(user.userType);
        const primaryUserType = userTypes[0] || '';

        const token = jwt.sign(
            {
                userId: user._id,
                username: user.username,
                userType: primaryUserType,
                userTypes,
                name: user.name,
                phone: user.phone,
                email: user.email,
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                userType: primaryUserType,
                userTypes,
                name: user.name,
                phone: user.phone,
                email: user.email,
            },
            message: 'Login successful!'
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Authentication failed!' });
    }
});

module.exports = Route;
