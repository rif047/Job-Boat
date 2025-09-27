let Employee = require('./Employee_Model');



let Employees = async (req, res) => {
    let Data = await Employee.find();
    res.status(200).json(Data);
}




let Create = async (req, res) => {
    try {
        let { agent, name, phone, alt_phone, address, city, availability, experience, position, right_to_work, note } = req.body;

        if (!agent) { return res.status(400).send('Agent is required!'); }
        if (!name) { return res.status(400).send('Employee Name is required!'); }
        if (!phone) { return res.status(400).send('Phone is required!'); }
        if (!address) { return res.status(400).send('Address is required!'); }
        if (!city) { return res.status(400).send('Job Preferred City is required!'); }
        if (!availability) { return res.status(400).send('Availability is required!'); }
        if (!experience) { return res.status(400).send('Experience is required!'); }
        if (!position) { return res.status(400).send('Skills is required!'); }
        if (!right_to_work) { return res.status(400).send('Right to work is required!'); }


        let checkPhone = await Employee.findOne({ phone });
        if (checkPhone) { return res.status(400).send('Phone number already exists. Use different one.'); };



        let newData = new Employee({
            agent,
            name,
            phone,
            alt_phone,
            address,
            city,
            availability,
            experience,
            position,
            right_to_work,
            note,
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
    let viewOne = await Employee.findById(req.params.id);
    res.send(viewOne)
}




let Update = async (req, res) => {
    try {
        let { agent, name, phone, alt_phone, address, city, availability, experience, position, right_to_work, note } = req.body;

        if (!agent) { return res.status(400).send('Agent is required!'); }
        if (!name) { return res.status(400).send('Employee Name is required!'); }
        if (!phone) { return res.status(400).send('Phone is required!'); }
        if (!address) { return res.status(400).send('Address is required!'); }
        if (!city) { return res.status(400).send('Job Preferred City is required!'); }
        if (!availability) { return res.status(400).send('Availability is required!'); }
        if (!experience) { return res.status(400).send('Experience is required!'); }
        if (!position) { return res.status(400).send('Skills is required!'); }
        if (!right_to_work) { return res.status(400).send('Right to work is required!'); }


        let checkPhone = await Employee.findOne({ phone: phone, _id: { $ne: req.params.id } });
        if (checkPhone) { return res.status(400).send('Phone number already exists. Use different one.'); }


        let updateData = await Employee.findById(req.params.id);

        updateData.agent = agent;
        updateData.name = name;
        updateData.phone = phone;
        updateData.alt_phone = alt_phone;
        updateData.address = address;
        updateData.city = city;
        updateData.availability = availability;
        updateData.experience = experience;
        updateData.position = position;
        updateData.right_to_work = right_to_work;
        updateData.note = note;

        await updateData.save();
        res.status(200).json(updateData);
        console.log('Updated Successfully');

    } catch (error) {
        console.error(error);
        res.status(500).send('Updating Error!!!');
    }
}





let Delete = async (req, res) => {
    await Employee.findByIdAndDelete(req.params.id);
    res.status(200).send('Deleted')
}




module.exports = { Employees, Create, View, Update, Delete }