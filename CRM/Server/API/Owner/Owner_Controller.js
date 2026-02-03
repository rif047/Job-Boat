let Owner = require('./Owner_Model');


const normalizePhone = (phone = "") => {
    let p = phone.toString().replace(/\D/g, "");

    if (p.startsWith("880")) return p;
    if (p.startsWith("0")) return "88" + p;
    if (p.length === 10) return "880" + p;

    return p;
};


const BulkImport = async (req, res) => {
    try {
        const owners = req.body;

        if (!Array.isArray(owners) || owners.length === 0) {
            return res.status(400).json({ message: "Invalid or empty data." });
        }

        if (owners.length > 5000) {
            return res.status(400).json({
                message: "Maximum 5000 rows allowed per import.",
            });
        }

        // Clean & normalize
        const cleanedData = owners
            .map(o => ({
                agent: o.agent?.trim(),
                name: o.name?.trim(),
                phone: normalizePhone(o.phone),
                alt_phone: normalizePhone(o.alt_phone || ""),
                business_name: o.business_name?.trim(),
                business_address: o.business_address?.trim(),
                remark: o.remark || "",
            }))
            .filter(o =>
                o.agent &&
                o.name &&
                o.phone &&
                o.business_name &&
                o.business_address
            );

        if (!cleanedData.length) {
            return res.status(400).json({ message: "No valid data to import." });
        }

        // Duplicate check (single DB hit)
        const phones = cleanedData.map(o => o.phone);
        const existing = await Owner.find({ phone: { $in: phones } }).select("phone");
        const existingPhones = new Set(existing.map(e => e.phone));

        const newOwners = cleanedData.filter(o => !existingPhones.has(o.phone));

        if (!newOwners.length) {
            return res.status(200).json({
                message: "All records already exist.",
                imported: 0,
                skipped: cleanedData.length,
            });
        }

        await Owner.insertMany(newOwners);

        res.status(200).json({
            message: "Import completed successfully.",
            imported: newOwners.length,
            skipped: cleanedData.length - newOwners.length,
            total: cleanedData.length,
        });

    } catch (error) {
        console.error("Bulk import error:", error);
        res.status(500).json({ message: "Bulk import failed." });
    }
};






let Owners = async (req, res) => {
    let Data = await Owner.find();
    res.status(200).json(Data);
}




let Create = async (req, res) => {
    try {
        let { agent, name, phone, alt_phone, email, business_name, business_address, remark } = req.body;

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
            email,
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







let View = async (req, res) => {
    let viewOne = await Owner.findById(req.params.id);
    res.send(viewOne)
}




let Update = async (req, res) => {
    try {
        let { agent, name, phone, alt_phone, email, business_name, business_address, remark } = req.body;

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
        updateData.email = email;
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