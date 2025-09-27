let User = require('./User_Model');
let bcrypt = require("bcrypt");



let Users = async (req, res) => {
    let Data = await User.find();
    res.status(200).json(Data);
}




let Create = async (req, res) => {
    try {
        let { name, phone, username, userType, email, password, answer } = req.body;

        if (!name) { return res.status(400).send('Name is required!'); }
        if (!phone) { return res.status(400).send('Phone is required!'); }
        if (!username) { return res.status(400).send('Username is required!'); }
        if (!email) { return res.status(400).send('Email is required!'); }
        if (!password) { return res.status(400).send('Password is required!'); }
        if (!answer) { return res.status(400).send('Answer is required!'); }


        let checkUserName = await User.findOne({ username });
        if (checkUserName) { return res.status(400).send('Username already exists. Use different one.'); };

        let checkPhone = await User.findOne({ phone });
        if (checkPhone) { return res.status(400).send('Phone already exists. Use different one.'); };

        let checkEmail = await User.findOne({ email });
        if (checkEmail) { return res.status(400).send('Email already exists. Use different one.'); };


        let hashPassword = await bcrypt.hash(password, 10);

        let newData = new User({
            name,
            phone,
            userType,
            username: username.toLowerCase(),
            email: email.toLowerCase(),
            password: hashPassword,
            answer: answer.toLowerCase()
        });

        await newData.save();
        res.status(200).json(newData);
        console.log('Created Successfully');

    } catch (error) {
        console.error(error);
        res.status(500).send('Creation Error!!!');
    }
}






let View = async (req, res) => {
    let viewOne = await User.findById(req.params.id);
    res.send(viewOne)
}




let Update = async (req, res) => {
    try {
        let { name, phone, username, userType, email, password, answer } = req.body;

        if (!name) { return res.status(400).send('Name is required!'); }
        if (!phone) { return res.status(400).send('Phone is required!'); }
        if (!username) { return res.status(400).send('Username is required!'); }
        if (!email) { return res.status(400).send('Email is required!'); }
        if (!answer) { return res.status(400).send('Answer is required!'); }

        let checkUserName = await User.findOne({ username: username, _id: { $ne: req.params.id } });
        if (checkUserName) { return res.status(400).send('Username already exists. Use different one.'); }

        let checkPhone = await User.findOne({ phone: phone, _id: { $ne: req.params.id } });
        if (checkPhone) { return res.status(400).send('Phone already exists. Use different one.'); }

        let checkEmail = await User.findOne({ email: email.toLowerCase(), _id: { $ne: req.params.id } });
        if (checkEmail) { return res.status(400).send('Email already exists. Use different one.'); }

        let updateData = await User.findById(req.params.id);

        updateData.name = name;
        updateData.phone = phone;
        updateData.userType = userType;
        updateData.username = username.toLowerCase();
        updateData.email = email.toLowerCase();
        updateData.answer = answer.toLowerCase();

        if (password) {
            let hashPassword = await bcrypt.hash(password, 10);
            updateData.password = hashPassword;
        }

        await updateData.save();
        res.status(200).json(updateData);
        console.log('Updated Successfully');

    } catch (error) {
        console.error(error);
        res.status(500).send('Updating Error!!!');
    }
}





let Delete = async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).send('Deleted')
}




module.exports = { Users, Create, View, Update, Delete }