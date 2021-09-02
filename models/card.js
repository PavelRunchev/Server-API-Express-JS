const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
	id: { type: mongoose.Schema.Types.String, unique: true },
    make: String ,
    model: String ,
    imageUrl: String ,
    color: String ,
    price: Number ,
	like: { type: Number, default: 0 },
	isRent: { type: Boolean, dafault: false }
});


const Card = mongoose.model('Card', cardSchema);
module.exports = Card;
