let Task = require('./Task_Model');



let Tasks = async (req, res) => {
    let Data = await Task.find();
    res.status(200).json(Data);
}




let Create = async (req, res) => {
    try {
        let { agent, post, vacancy, query, duplicate_post, call, potential_lead, confirm_lead, payment, no_employee, lost_lead } = req.body;

        if (!agent) { return res.status(400).send('Agent is required!'); }
        if (!post) { return res.status(400).send('Post is required!'); }
        if (!vacancy) { return res.status(400).send('Vacancy is required!'); }
        if (!query) { return res.status(400).send('Query is required!'); }
        if (!duplicate_post) { return res.status(400).send('Duplicate post is required!'); }
        if (!call) { return res.status(400).send('Call is required!'); }
        if (!potential_lead) { return res.status(400).send('Potential lead is required!'); }
        if (!confirm_lead) { return res.status(400).send('Confirm lead is required!'); }
        if (!payment) { return res.status(400).send('Payment is required!'); }
        if (!no_employee) { return res.status(400).send('No employee is required!'); }
        if (!lost_lead) { return res.status(400).send('Lost lead is required!'); }

        let newData = new Task({
            agent,
            post,
            vacancy,
            query,
            duplicate_post,
            call,
            potential_lead,
            confirm_lead,
            payment,
            no_employee,
            lost_lead
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
    let viewOne = await Task.findById(req.params.id);
    res.send(viewOne)
}




let Update = async (req, res) => {
    try {
        let { agent, post, vacancy, query, duplicate_post, call, potential_lead, confirm_lead, payment, no_employee, lost_lead } = req.body;

        if (!agent) { return res.status(400).send('Agent is required!'); }
        if (!post) { return res.status(400).send('Post is required!'); }
        if (!vacancy) { return res.status(400).send('Vacancy is required!'); }
        if (!query) { return res.status(400).send('Query is required!'); }
        if (!duplicate_post) { return res.status(400).send('Duplicate post is required!'); }
        if (!call) { return res.status(400).send('Call is required!'); }
        if (!potential_lead) { return res.status(400).send('Potential lead is required!'); }
        if (!confirm_lead) { return res.status(400).send('Confirm lead is required!'); }
        if (!payment) { return res.status(400).send('Payment is required!'); }
        if (!no_employee) { return res.status(400).send('No employee is required!'); }
        if (!lost_lead) { return res.status(400).send('Lost lead is required!'); }

        let updateData = await Task.findById(req.params.id);

        updateData.agent = agent;
        updateData.post = post;
        updateData.vacancy = vacancy;
        updateData.query = query;
        updateData.duplicate_post = duplicate_post;
        updateData.call = call;
        updateData.potential_lead = potential_lead;
        updateData.confirm_lead = confirm_lead;
        updateData.payment = payment;
        updateData.no_employee = no_employee;
        updateData.lost_lead = lost_lead;

        await updateData.save();
        res.status(200).json(updateData);
        console.log('Updated Successfully');

    } catch (error) {
        console.error(error);
        res.status(500).send('Updating Error!!!');
    }
}





let Delete = async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.status(200).send('Deleted')
}




module.exports = { Tasks, Create, View, Update, Delete }