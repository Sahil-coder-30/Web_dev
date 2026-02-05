const app = require('./src/app');
const ConnectToDb = require('./src/config/db')


app.listen(3000,()=>{
    ConnectToDb();
    console.log("The server is running on the port 3000 ...");
    
})

