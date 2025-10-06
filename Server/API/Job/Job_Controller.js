let Job = require('./Job_Model');



let Jobs = async (req, res) => {
    let Data = await Job.find();
    res.status(200).json(Data);
};



let Create = async (req, res) => {
    try {
        const { position, city, business_name, owner, wages, accommodation, required_experience, remark, agent, right_to_work, source, source_link } = req.body;

        for (let [key, label] of Object.entries({
            position: 'Job Position',
            city: 'City',
            owner: 'Owner',
            agent: 'Agent',
            source: 'Source',
        })) { if (!req.body[key]) return res.status(400).send(`${label} is required!`); }

        let checkSourceLink = await Job.findOne({ source_link });
        if (checkSourceLink) { return res.status(400).send('Source link already exists. Use different one.'); };



        const generateJobCode = () => {
            const timePart = Date.now().toString().slice(-3);
            const randomPart = Math.floor(10 + Math.random() * 90);
            return `JBL-${timePart}${randomPart}`;
        };


        let code;
        let isUnique = false;
        while (!isUnique) {
            code = generateJobCode();
            const exists = await Job.findOne({ code });
            if (!exists) isUnique = true;
        }

        let newData = new Job({
            position,
            code,
            city,
            business_name,
            owner,
            wages,
            accommodation,
            agent,
            source,
            source_link,
            remark,
            required_experience,
            right_to_work,
            status: 'Pending'
        });

        await newData.save();
        res.status(200).json(newData);
        console.log('Created Successfully');

    } catch (error) {
        console.error(error);
        res.status(500).send('Creation Error!!!');
    }
};







let View = async (req, res) => {
    let viewOne = await Job.findById(req.params.id);
    res.send(viewOne);
};








let Update = async (req, res) => {
    try {
        const { position, city, business_name, owner, wages, accommodation, required_experience, agent, remark, right_to_work, source, source_link } = req.body;

        const requiredFields = {
            position: 'Job Position',
            city: 'City',
            owner: 'Owner',
            agent: 'Agent',
            source: 'Source',
        };

        for (let [key, label] of Object.entries(requiredFields)) {
            if (!req.body[key]) {
                return res.status(400).send(`${label} is required!`);
            }
        }


        let checkSourceLink = await Job.findOne({ source_link: source_link, _id: { $ne: req.params.id } });
        if (checkSourceLink) { return res.status(400).send('Source link already exists. Use different one.'); }


        let updateData = await Job.findById(req.params.id);

        updateData.position = position;
        updateData.city = city;
        updateData.business_name = business_name;
        updateData.owner = owner;
        updateData.wages = wages;
        updateData.accommodation = accommodation;
        updateData.required_experience = required_experience;
        updateData.agent = agent;
        updateData.source = source;
        updateData.source_link = source_link;
        updateData.right_to_work = right_to_work;
        updateData.remark = remark;

        await updateData.save();
        res.status(200).json(updateData);
        console.log('Updated Successfully');

    } catch (error) {
        console.error(error);
        res.status(500).send('Updating Error!!!');
    }
};






let PendingPayment = async (req, res) => {
    try {
        const { agent, date, fee, wages, employee, advance_fee, status, remark } = req.body;

        const requiredFields = {
            agent: 'Agent',
            fee: 'Fees',
            wages: 'Wage',
            employee: 'Employee',
            advance_fee: 'Advance Fee',
        };

        for (let [key, label] of Object.entries(requiredFields)) {
            if (!req.body[key]) {
                return res.status(400).send(`${label} is required!`);
            }
        }

        let updateData = await Job.findById(req.params.id);

        updateData.agent = agent;
        updateData.advance_fee = advance_fee || 0;
        updateData.fee = fee;
        updateData.wages = wages;
        updateData.employee = employee;
        updateData.remark = remark;
        updateData.status = 'PendingPayment';
        updateData.date = new Date().toISOString().split('T')[0];

        await updateData.save();
        res.status(200).json(updateData);
        console.log('Updated Successfully');

    } catch (error) {
        console.error(error);
        res.status(500).send('Updating Error!!!');
    }
}









let Closed = async (req, res) => {
    try {
        const { agent, date, fee, wages, employee, status, remark } = req.body;

        const requiredFields = {
            agent: 'Agent',
            fee: 'Fees',
            wages: 'Wage',
            employee: 'Employee',
        };

        for (let [key, label] of Object.entries(requiredFields)) {
            if (!req.body[key]) {
                return res.status(400).send(`${label} is required!`);
            }
        }

        let updateData = await Job.findById(req.params.id);

        updateData.agent = agent;
        updateData.fee = fee;
        updateData.wages = wages;
        updateData.employee = employee;
        updateData.remark = remark;
        updateData.status = 'Closed';
        updateData.date = new Date().toISOString().split('T')[0];

        await updateData.save();
        res.status(200).json(updateData);
        console.log('Updated Successfully');

    } catch (error) {
        console.error(error);
        res.status(500).send('Updating Error!!!');
    }
}



let LeadLost = async (req, res) => {
    try {

        let updateData = await Job.findById(req.params.id);

        if (!updateData) {
            return res.status(404).send('Job not found');
        }

        updateData.date = new Date().toISOString().split('T')[0];
        updateData.status = 'LeadLost';

        await updateData.save();
        console.log('Canceled Successfully');
        res.status(200).json(updateData);

    } catch (error) {
        console.error('Error canceling:', error);
        res.status(500).send('Error canceling');
    }
}



let DealCancelled = async (req, res) => {
    try {

        let updateData = await Job.findById(req.params.id);

        if (!updateData) {
            return res.status(404).send('Job not found');
        }
        updateData.date = '';
        updateData.status = 'Pending';

        await updateData.save();
        console.log('Canceled Successfully');
        res.status(200).json(updateData);

    } catch (error) {
        console.error('Error canceling:', error);
        res.status(500).send('Error canceling');
    }
}




let Delete = async (req, res) => {
    await Job.findByIdAndDelete(req.params.id);
    res.send('Deleted')
}


module.exports = { Jobs, Create, View, Update, PendingPayment, Closed, LeadLost, DealCancelled, Delete };
