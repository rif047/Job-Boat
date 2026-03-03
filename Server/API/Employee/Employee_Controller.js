let Employee = require('./Employee_Model');


const normalizePhone = (phone = "") => {
    let p = phone.toString().replace(/\D/g, "");

    if (p.startsWith("880")) return p;
    if (p.startsWith("0")) return "88" + p;
    if (p.length === 10) return "880" + p;

    return p;
};


const BulkImport = async (req, res) => {
    try {
        const employees = req.body;

        if (!Array.isArray(employees) || employees.length === 0) {
            return res.status(400).json({ message: "Invalid or empty data." });
        }

        if (employees.length > 5000) {
            return res.status(400).json({
                message: "Maximum 5000 rows allowed per import.",
            });
        }

        // Clean + normalize
        const cleanedData = employees
            .map(emp => ({
                agent: emp.agent?.trim(),
                name: emp.name?.trim(),
                phone: normalizePhone(emp.phone),
                alt_phone: normalizePhone(emp.alt_phone || ""),
                address: emp.address?.trim(),
                city: emp.city?.trim(),
                preferred_location: emp.preferred_location?.trim() || "",
                availability: emp.availability?.trim(),
                experience: emp.experience?.trim(),
                position: emp.position?.trim(),
                right_to_work: emp.right_to_work?.trim(),
                remark: emp.remark || "",
            }))
            .filter(emp =>
                emp.agent &&
                emp.name &&
                emp.phone &&
                emp.address &&
                emp.city &&
                emp.availability &&
                emp.experience &&
                emp.position &&
                emp.right_to_work
            );

        if (!cleanedData.length) {
            return res.status(400).json({ message: "No valid data to import." });
        }

        // Duplicate check (single DB hit)
        const phones = cleanedData.map(e => e.phone);
        const existing = await Employee.find({ phone: { $in: phones } }).select("phone");
        const existingPhones = new Set(existing.map(e => e.phone));

        const newEmployees = cleanedData.filter(e => !existingPhones.has(e.phone));

        if (!newEmployees.length) {
            return res.status(200).json({
                message: "All records already exist.",
                imported: 0,
                skipped: cleanedData.length,
                total: cleanedData.length,
            });
        }

        await Employee.insertMany(newEmployees);

        res.status(200).json({
            message: "Employee import completed successfully.",
            imported: newEmployees.length,
            skipped: cleanedData.length - newEmployees.length,
            total: cleanedData.length,
        });

    } catch (error) {
        console.error("Employee bulk import error:", error);
        res.status(500).json({ message: "Bulk import failed." });
    }
};



let Employees = async (req, res) => {
    let Data = await Employee.find();
    res.status(200).json(Data);
}




let Create = async (req, res) => {
    try {
        let { agent, name, phone, alt_phone, address, email, city, preferred_location, availability, experience, position, right_to_work, remark } = req.body;

        if (!agent) { return res.status(400).send('Agent is required!'); }
        if (!name) { return res.status(400).send('Employee Name is required!'); }
        if (!phone) { return res.status(400).send('Phone is required!'); }
        if (!address) { return res.status(400).send('Address is required!'); }
        if (!city) { return res.status(400).send('City is required!'); }
        if (!preferred_location) { return res.status(400).send('Preferred Location is required!'); }
        if (!availability) { return res.status(400).send('Availability is required!'); }
        if (!experience) { return res.status(400).send('Experience is required!'); }
        if (!position) { return res.status(400).send('Position is required!'); }
        if (!right_to_work) { return res.status(400).send('Right to work is required!'); }


        let checkPhone = await Employee.findOne({ phone });
        if (checkPhone) { return res.status(400).send('Phone number already exists. Use different one.'); };



        let newData = new Employee({
            agent,
            name,
            phone,
            alt_phone,
            email,
            address,
            city,
            preferred_location,
            availability,
            experience,
            position,
            right_to_work,
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
    let viewOne = await Employee.findById(req.params.id);
    res.send(viewOne)
}




let Update = async (req, res) => {
    try {
        let { agent, name, phone, alt_phone, address, email, city, preferred_location, availability, experience, position, right_to_work, remark } = req.body;

        if (!agent) { return res.status(400).send('Agent is required!'); }
        if (!name) { return res.status(400).send('Employee Name is required!'); }
        if (!phone) { return res.status(400).send('Phone is required!'); }
        if (!address) { return res.status(400).send('Address is required!'); }
        if (!city) { return res.status(400).send('City is required!'); }
        if (!preferred_location) { return res.status(400).send('Preferred Location is required!'); }
        if (!availability) { return res.status(400).send('Availability is required!'); }
        if (!experience) { return res.status(400).send('Experience is required!'); }
        if (!position) { return res.status(400).send('Position is required!'); }
        if (!right_to_work) { return res.status(400).send('Right to work is required!'); }


        let checkPhone = await Employee.findOne({ phone: phone, _id: { $ne: req.params.id } });
        if (checkPhone) { return res.status(400).send('Phone number already exists. Use different one.'); }


        let updateData = await Employee.findById(req.params.id);

        updateData.agent = agent;
        updateData.name = name;
        updateData.phone = phone;
        updateData.alt_phone = alt_phone;
        updateData.address = address;
        updateData.email = email;
        updateData.preferred_location = preferred_location;
        updateData.city = city;
        updateData.availability = availability;
        updateData.experience = experience;
        updateData.position = position;
        updateData.right_to_work = right_to_work;
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
    await Employee.findByIdAndDelete(req.params.id);
    res.status(200).send('Deleted')
}




module.exports = { Employees, Create, BulkImport, View, Update, Delete }