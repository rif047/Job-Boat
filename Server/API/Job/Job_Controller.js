let Property = require('./Job_Model');
let multer = require('multer');
let sharp = require('sharp');
let path = require('path');
let FS = require('fs');


const EndPoint = 'properties'

let storage = multer.memoryStorage();

let fileFilter = function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return cb('Only JPG and PNG files are allowed!', false);
    }
    cb(null, true);
};

let uploadImages = multer({
    storage: storage,
    // limits: {
    //     fileSize: 3 * 1024 * 1024,
    //     files: 5
    // },
    fileFilter: fileFilter
}).array('images');


async function compressAndSaveImages(files, dataName) {
    const imageFilenames = [];
    for (const file of files) {
        const currentDateTime = new Date().toISOString().replace(/[:.-]/g, '');
        const imageName = `${dataName}-${currentDateTime}-${file.originalname}`;
        const outputPath = path.join(`Assets/Images/${EndPoint}/`, imageName);


        await sharp(file.buffer)
            .resize(800, 800, {
                fit: sharp.fit.inside,
                withoutEnlargement: true
            })
            .jpeg({ quality: 80 })
            .toFile(outputPath);

        imageFilenames.push(imageName);
    }
    return imageFilenames;
}









let Properties = async (req, res) => {
    let Data = await Property.find().populate(['owner', 'employee']);
    res.status(200).json(Data);
};








let Create = async (req, res) => {
    try {
        const { name, code, city, property_type, property_for, decimal, sqft, agree_price, sell_price, drive, map, source, comments, owner, employee, date, status } = req.body;

        const requiredFields = {
            name: 'Property Name',
            code: 'Property Code',
            property_type: 'Property Type',
            property_for: 'Property For Sell/Let',
            decimal: 'Decimal',
            agree_price: 'Agreed Price',
            owner: 'Owner'
        };

        for (let [key, label] of Object.entries(requiredFields)) {
            if (!req.body[key]) {
                return res.status(400).send(`${label} is required!`);
            }
        }

        let checkName = await Property.findOne({ name: name.toLowerCase() });
        if (checkName) { return res.status(400).send('Name already exists'); }

        let checkCode = await Property.findOne({ code: code.toLowerCase() });
        if (checkCode) { return res.status(400).send('Code already exists'); }


        let images = [];
        if (req.files?.length) {
            images = await compressAndSaveImages(req.files, name.toLowerCase());
        }

        let newData = new Property({
            name: name.toLowerCase(),
            code: code.toLowerCase(),
            city: city,
            property_type: property_type,
            property_for: property_for,
            decimal,
            sqft,
            agree_price,
            sell_price,
            drive,
            map,
            date: date ? new Date(date).toISOString().split('T')[0] : undefined,
            source: source,
            comments,
            owner,
            employee,
            status: 'Pending',
            images
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
    let viewOne = await Property.findById(req.params.id).populate('owner').populate('employee');
    res.send(viewOne);
};








let Update = async (req, res) => {
    try {
        const { name, code, city, property_type, property_for, decimal, sqft, agree_price, sell_price, drive, map, source, comments, owner } = req.body;

        const requiredFields = {
            name: 'Property Name',
            code: 'Property Code',
            property_type: 'Property Type',
            property_for: 'Property For Sell/Let',
            decimal: 'Decimal',
            agree_price: 'Agreed Price',
            owner: 'Owner'
        };

        for (let [key, label] of Object.entries(requiredFields)) {
            if (!req.body[key]) {
                return res.status(400).send(`${label} is required!`);
            }
        }


        let checkName = await Property.findOne({ name: name.toLowerCase(), _id: { $ne: req.params.id } });
        if (checkName) { return res.status(400).send('This name already exists'); }

        let checkCode = await Property.findOne({ code: code.toLowerCase(), _id: { $ne: req.params.id } });
        if (checkCode) { return res.status(400).send('This code already exists'); }


        let updateData = await Property.findById(req.params.id);

        let images = [];
        if (req.files?.length) {
            images = await compressAndSaveImages(req.files, name.toLowerCase());
        }

        updateData.name = name.toLowerCase();
        updateData.code = code.toLowerCase();
        updateData.city = city;
        updateData.property_type = property_type;
        updateData.property_for = property_for;
        updateData.decimal = decimal;
        updateData.sqft = sqft;
        updateData.agree_price = agree_price;
        updateData.sell_price = sell_price;
        updateData.drive = drive;
        updateData.map = map;
        updateData.source = source;
        updateData.comments = comments;
        updateData.owner = owner;
        updateData.images = images.length > 0 ? images : updateData.images;

        await updateData.save();
        res.status(200).json(updateData);
        console.log('Updated Successfully');

    } catch (error) {
        console.error(error);
        res.status(500).send('Updating Error!!!');
    }
};





let UpdateOffering = async (req, res) => {
    try {
        const { employee, sell_price, date, status } = req.body;

        const requiredFields = {
            employee: 'Employee',
            date: 'Date',
            status: 'Status',
            sell_price: 'Final Price',
        };

        for (let [key, label] of Object.entries(requiredFields)) {
            if (!req.body[key]) {
                return res.status(400).send(`${label} is required!`);
            }
        }

        let updateData = await Property.findById(req.params.id);

        updateData.sell_price = sell_price;
        updateData.employee = employee;
        updateData.status = 'Offering';
        updateData.date = date ? new Date(date).toISOString().split('T')[0] : undefined;

        await updateData.save();
        res.status(200).json(updateData);
        console.log('Updated Successfully');

    } catch (error) {
        console.error(error);
        res.status(500).send('Updating Error!!!');
    }
}









let CancelOffering = async (req, res) => {
    try {

        let updateData = await Property.findById(req.params.id);

        if (!updateData) {
            return res.status(404).send('Property not found');
        }
        updateData.employee = null;
        updateData.status = 'Pending';
        updateData.date = null;

        await updateData.save();
        console.log('Canceled Successfully');
        res.status(200).json(updateData);

    } catch (error) {
        console.error('Error canceling offering:', error);
        res.status(500).send('Error canceling offering');
    }
}









let UpdateStatus = async (req, res) => {
    try {
        const { employee, sell_price, date, status } = req.body;

        const requiredFields = {
            employee: 'Employee',
            date: 'Date',
            status: 'Status',
            sell_price: 'Final Price',
        };

        for (let [key, label] of Object.entries(requiredFields)) {
            if (!req.body[key]) {
                return res.status(400).send(`${label} is required!`);
            }
        }

        let updateData = await Property.findById(req.params.id);

        updateData.sell_price = sell_price;
        updateData.employee = employee;
        updateData.status = status;
        updateData.date = date ? new Date(date).toISOString().split('T')[0] : undefined;

        await updateData.save();
        res.status(200).json(updateData);
        console.log('Updated Successfully');

    } catch (error) {
        console.error(error);
        res.status(500).send('Updating Error!!!');
    }
}






let Delete = async (req, res) => {
    try {
        const DeleteOne = await Property.findById(req.params.id);

        if (!DeleteOne) {
            return res.status(404).send('Property not found');
        }

        if (DeleteOne.images?.length) {
            DeleteOne.images.forEach((image) => {
                const imagePath = path.join(`Assets/Images/${EndPoint}/`, image);
                if (FS.existsSync(imagePath)) {
                    FS.unlinkSync(imagePath);
                }
            });
        }

        await Property.findByIdAndDelete(req.params.id);

        res.status(200).send('Deleted Successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error Deleting Property');
    }
};


module.exports = { Properties, Create, View, Update, UpdateOffering, CancelOffering, UpdateStatus, Delete, uploadImages };
