const app = require('./src/app');
const PORT = process.env.PORT || 3000;
const ConnectToDb = require('./src/config/db')

ConnectToDb();

app.listen(PORT ,()=>{
    console.log("The server is running on the port 3000 ...");
    
})

// module.exports = app;