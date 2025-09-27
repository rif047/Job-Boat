let Position = require('./Position_Model')



let Positions = async (req, res) => {
    let Data = await Position.find();
    res.json(Data);
}




const Create = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) { return res.status(400).send('Position Name is required!'); }

        const checkName = await Position.findOne({ name: name.toLowerCase() });

        if (checkName) { return res.status(400).send('Position already exists'); }

        const newData = new Position({ name: name.toLowerCase() });
        await newData.save();
        res.json(newData);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}






let View = async (req, res) => {
    let viewOne = await Position.findById(req.params.id);
    res.send(viewOne)
}




let Update = async (req, res) => {
    try {
        let { name } = req.body;

        if (!name) { return res.status(400).send('Position Name is required!'); }

        const checkName = await Position.findOne({ name: name.toLowerCase(), _id: { $ne: req.params.id } });

        if (checkName) { return res.status(400).send('Position already exists'); }

        let Data = await Position.findById(req.params.id);
        Data.name = name.toLowerCase();
        await Data.save();
        res.json(Data)

    } catch (error) {
        res.status(501).send(error);
    }
}





let Delete = async (req, res) => {
    await Position.findByIdAndDelete(req.params.id);
    res.send('Deleted')
}




module.exports = { Positions, Create, View, Update, Delete }