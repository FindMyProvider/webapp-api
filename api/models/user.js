const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    id : { type: String, required: true },
    identifiant: { type: String, required: true },
    password: { type: String, required: true },
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    level : { type: String, required: true },
    contact : {type: String, required: true},
    client : {type: Boolean, required: true},
    entreprise : { type: Array, required: false}       
});

module.exports = mongoose.model('users', userSchema);