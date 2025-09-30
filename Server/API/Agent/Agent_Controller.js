let Agent = require('./Agent_Model');



let Agents = async (req, res) => {
    let Data = await Agent.find();
    res.status(200).json(Data);
}




let Create = async (req, res) => {
    try {
        let { name, phone, designation, remark } = req.body;

        if (!name) { return res.status(400).send('Agent Name is required!'); }
        if (!phone) { return res.status(400).send('Phone is required!'); }
        if (!designation) { return res.status(400).send('Designation is required!'); }


        let checkPhone = await Agent.findOne({ phone });
        if (checkPhone) { return res.status(400).send('Phone number already exists. Use different one.'); };



        let newData = new Agent({
            name,
            phone,
            designation,
            remark
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
    let viewOne = await Agent.findById(req.params.id);
    res.send(viewOne)
}




let Update = async (req, res) => {
    try {
        let { name, phone, designation, remark } = req.body;

        if (!name) { return res.status(400).send('Agent Name is required!'); }
        if (!phone) { return res.status(400).send('Phone is required!'); }
        if (!designation) { return res.status(400).send('Designation is required!'); }


        let checkPhone = await Agent.findOne({ phone: phone, _id: { $ne: req.params.id } });
        if (checkPhone) { return res.status(400).send('Phone number already exists. Use different one.'); }


        let updateData = await Agent.findById(req.params.id);

        updateData.name = name;
        updateData.phone = phone;
        updateData.designation = designation;
        updateData.remark = remark;

        await updateData.save();
        res.status(200).json(updateData);
        console.log('Updated Successfully');

    } catch (error) {
        console.error(error);
        res.status(500).send('Updating Error!!!');
    }
}





let Delete = async (req, res) => {
    await Agent.findByIdAndDelete(req.params.id);
    res.status(200).send('Deleted')
}




module.exports = { Agents, Create, View, Update, Delete }