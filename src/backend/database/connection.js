const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://root:root@cluster0.hl7su.mongodb.net/Carrefour?retryWrites=true&w=majority');

module.exports = mongoose;