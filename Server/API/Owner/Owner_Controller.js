let Owner = require('./Owner_Model');



let Owners = async (req, res) => {
    let Data = await Owner.find();
    res.status(200).json(Data);
}




let Create = async (req, res) => {
    try {
        let { agent, name, phone, alt_phone, business_name, business_address, remark } = req.body;

        if (!agent) { return res.status(400).send('Agent is required!'); }
        if (!name) { return res.status(400).send('Owner Name is required!'); }
        if (!phone) { return res.status(400).send('Phone is required!'); }

        let checkPhone = await Owner.findOne({ phone });
        if (checkPhone) { return res.status(400).send('Phone number already exists. Use different one.'); };


        let newData = new Owner({
            agent,
            name,
            phone,
            alt_phone,
            business_name,
            business_address,
            remark,
        });

        await newData.save();
        res.status(200).json(newData);
        console.log('Created Successfully');

    } catch (error) {
        console.error(error);
        res.status(500).send('Creation Error!!!');
    }
}



let BulkImport = async (req, res) => {
    try {
        let owners = req.body;

        if (!Array.isArray(owners) || owners.length === 0) {
            return res.status(400).send('Invalid or empty data array.');
        }

        let validOwners = [];
        for (let emp of owners) {
            const { agent, name, phone, alt_phone, business_name, business_address, remark } = emp;

            if (!agent || !name || !phone || !business_name || !business_address) {
                console.log(`Skipped invalid entry: ${name || 'Unnamed'}`);
                continue;
            }

            const exists = await Owner.findOne({ phone });
            if (exists) {
                console.log(`⚠️ Skipped duplicate phone: ${phone}`);
                continue;
            }

            validOwners.push({ agent, name, phone, alt_phone, business_name, business_address, remark });
        }

        if (validOwners.length === 0) {
            return res.status(400).send('No valid data to import.');
        }

        await Owner.insertMany(validOwners, { ordered: false });
        res.status(200).send(`${validOwners.length} owners imported successfully.`);

        console.log(`✅ Imported ${validOwners.length} owners.`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Bulk import failed.');
    }
};







let View = async (req, res) => {
    let viewOne = await Owner.findById(req.params.id);
    res.send(viewOne)
}




let Update = async (req, res) => {
    try {
        let { agent, name, phone, alt_phone, business_name, business_address, remark } = req.body;

        if (!agent) { return res.status(400).send('Agent is required!'); }
        if (!name) { return res.status(400).send('Owner Name is required!'); }
        if (!phone) { return res.status(400).send('Phone is required!'); }

        let checkPhone = await Owner.findOne({ phone: phone, _id: { $ne: req.params.id } });
        if (checkPhone) { return res.status(400).send('Phone number already exists. Use different one.'); }


        let updateData = await Owner.findById(req.params.id);

        updateData.agent = agent;
        updateData.name = name;
        updateData.phone = phone;
        updateData.alt_phone = alt_phone;
        updateData.business_name = business_name;
        updateData.business_address = business_address;
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
    await Owner.findByIdAndDelete(req.params.id);
    res.status(200).send('Deleted')
}




module.exports = { Owners, Create, BulkImport, View, Update, Delete }