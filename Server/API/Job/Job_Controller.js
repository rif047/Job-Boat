let Job = require('./Job_Model');



let Jobs = async (req, res) => {
    let Data = await Job.find();
    res.status(200).json(Data);
};



let Create = async (req, res) => {
    try {
        const { position, city, business_name, owner, wages, accommodation, required_experience, remark, agent, right_to_work } = req.body;

        for (let [key, label] of Object.entries({
            position: 'Job Position',
            city: 'City',
            owner: 'Owner',
            agent: 'Agent'
        })) { if (!req.body[key]) return res.status(400).send(`${label} is required!`); }

        const now = new Date();
        const pad = n => String(n).padStart(2, "0");
        const code = `JBL-${pad(now.getDate())}${pad(now.getMonth() + 1)}${String(now.getFullYear()).slice(-2)}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;

        let newData = new Job({
            position,
            code,
            city,
            business_name,
            owner,
            wages,
            accommodation,
            agent,
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
        const { position, city, business_name, owner, wages, accommodation, required_experience, agent, remark, right_to_work } = req.body;

        const requiredFields = {
            position: 'Job Position',
            city: 'City',
            owner: 'Owner',
            agent: 'Agent',
        };

        for (let [key, label] of Object.entries(requiredFields)) {
            if (!req.body[key]) {
                return res.status(400).send(`${label} is required!`);
            }
        }


        let updateData = await Job.findById(req.params.id);

        updateData.position = position;
        updateData.city = city;
        updateData.business_name = business_name;
        updateData.owner = owner;
        updateData.wages = wages;
        updateData.accommodation = accommodation;
        updateData.required_experience = required_experience;
        updateData.agent = agent;
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





let InProgress = async (req, res) => {
    try {
        const { agent, date, charge, wages, employee, status } = req.body;

        const requiredFields = {
            agent: 'Agent',
            date: 'Date',
            charge: 'Charge',
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
        updateData.charge = charge;
        updateData.wages = wages;
        updateData.status = 'InProgress';
        updateData.date = date ? new Date(date).toISOString().split('T')[0] : undefined;

        await updateData.save();
        res.status(200).json(updateData);
        console.log('Updated Successfully');

    } catch (error) {
        console.error(error);
        res.status(500).send('Updating Error!!!');
    }
}









let PendingPayment = async (req, res) => {
    try {
        const { agent, date, charge, wages, employee, status } = req.body;

        const requiredFields = {
            agent: 'Agent',
            date: 'Date',
            charge: 'Charge',
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
        updateData.charge = charge;
        updateData.wages = wages;
        updateData.status = 'PendingPayment';
        updateData.date = date ? new Date(date).toISOString().split('T')[0] : undefined;

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
        const { agent, date, charge, wages, employee, status } = req.body;

        const requiredFields = {
            agent: 'Agent',
            date: 'Date',
            charge: 'Charge',
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
        updateData.charge = charge;
        updateData.wages = wages;
        updateData.status = 'Closed';
        updateData.date = date ? new Date(date).toISOString().split('T')[0] : undefined;

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
        updateData.employee = null;
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
        updateData.employee = null;
        updateData.status = 'DealCancelled';

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


module.exports = { Jobs, Create, View, Update, InProgress, PendingPayment, Closed, LeadLost, DealCancelled, Delete };
