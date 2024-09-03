const { markInactive } = require('../models/userModel');

exports.delete = async function(req, res, model) {
    const modelName = model.modelName; 
    console.log(`DELETE: /api/${modelName.toLowerCase()}s : ${req.params.id}`);
    try {
        const person = await model.findById(req.params.id);
        if (!person) {
            return res.status(404).json({ message: `${modelName} not found` });
        }
        person.status = 'inactive';
        await person.save();
        await markInactive(person.name);
        res.status(200).json({ message: `${modelName} marked inactive!` });
    } catch (err) {
        res.status(500).json({ error: `Error deleting ${modelName.toLowerCase()}`, details: err });
    }
};