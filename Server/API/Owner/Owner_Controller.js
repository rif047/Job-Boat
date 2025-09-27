let Owner = require('./Owner_Model');



let Owners = async (req, res) => {
    let Data = await Owner.find();
    res.status(200).json(Data);
}




let Create = async (req, res) => {
    try {
        let { name, phone, alt_phone, business_name, business_type, business_address, note } = req.body;

        if (!name) { return res.status(400).send('Owner Name is required!'); }
        if (!phone) { return res.status(400).send('Phone is required!'); }


        let checkPhone = await Owner.findOne({ phone });
        if (checkPhone) { return res.status(400).send('Phone number already exists. Use different one.'); };



        let newData = new Owner({
            name,
            phone,
            alt_phone,
            business_name,
            business_type,
            business_address,
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
    let viewOne = await Owner.findById(req.params.id);
    res.send(viewOne)
}




let Update = async (req, res) => {
    try {
        let { name, phone, alt_phone, business_name, business_type, business_address, note } = req.body;

        if (!name) { return res.status(400).send('Owner Name is required!'); }
        if (!phone) { return res.status(400).send('Phone is required!'); }


        let checkPhone = await Owner.findOne({ phone: phone, _id: { $ne: req.params.id } });
        if (checkPhone) { return res.status(400).send('Phone number already exists. Use different one.'); }


        let updateData = await Owner.findById(req.params.id);

        updateData.name = name;
        updateData.phone = phone;
        updateData.alt_phone = alt_phone;
        updateData.business_name = business_name;
        updateData.business_type = business_type;
        updateData.business_address = business_address;
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
    await Owner.findByIdAndDelete(req.params.id);
    res.status(200).send('Deleted')
}




module.exports = { Owners, Create, View, Update, Delete }