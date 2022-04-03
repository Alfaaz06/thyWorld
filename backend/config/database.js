const mongoose = require('mongoose');

exports.connectDatabase = () => {
    mongoose.connect(process.env.DB_URI).then(con => console.log(`Database Connected : ${con.connection.host}`)).catch((error) => console.log(error));
}