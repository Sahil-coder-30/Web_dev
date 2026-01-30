// server ko start karna
// data base se connect karna

const app = require('./src/app');
const mongoose = require('mongoose');

function connectToDb() {
    mongoose.connect("mongodb+srv://sahil:BNJ17kaAmKF38tPn@cluster0.fqaei0w.mongodb.net/Day-06")
        .then(() => {
            console.log("connected to database");
        });
}

connectToDb();

app.listen(3000, () => {
    console.log("server is running on port 3000.");

})