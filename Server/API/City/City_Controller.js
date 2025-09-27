let City = require('./City_Model')



let Cities = async (req, res) => {
    let Data = await City.find();
    res.json(Data);
}




const Create = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) { return res.status(400).send('City Name is required!'); }

        const checkName = await City.findOne({ name: name.toLowerCase() });

        if (checkName) { return res.status(400).send('City already exists'); }

        const newData = new City({ name: name.toLowerCase() });
        await newData.save();
        res.json(newData);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}






let View = async (req, res) => {
    let viewOne = await City.findById(req.params.id);
    res.send(viewOne)
}




let Update = async (req, res) => {
    try {
        let { name } = req.body;

        if (!name) { return res.status(400).send('City Name is required!'); }

        const checkName = await City.findOne({ name: name.toLowerCase(), _id: { $ne: req.params.id } });

        if (checkName) { return res.status(400).send('City already exists'); }

        let Data = await City.findById(req.params.id);
        Data.name = name.toLowerCase();
        await Data.save();
        res.json(Data)

    } catch (error) {
        res.status(501).send(error);
    }
}





let Delete = async (req, res) => {
    await City.findByIdAndDelete(req.params.id);
    res.send('Deleted')
}




module.exports = { Cities, Create, View, Update, Delete }