const Route = require("express").Router();
const Company = require("../Company/Company_Model");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

Route.post("/", async (req, res) => {
    try {
        const { username, password } = req.body;

        const company = await Company.findOne({ username: username.toLowerCase() });
        if (!company) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, company.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const token = jwt.sign(
            {
                userId: company._id,
                username: company.username,
                email: company.email,
                verified: company.verified
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            token,
            company: {
                id: company._id,
                username: company.username,
                email: company.email,
                verified: company.verified
            },
            message: "Login successful!"
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: 'Authentication failed!' });
    }
});

module.exports = Route;
