const mongoose = require('mongoose');
const app = require('./app');
const port = 8080;
const dbUri = 'mongodb+srv://bank:fgmXGuaxNp4TMhYg@cluster0-ehgmk.mongodb.net/ng-bank'

mongoose.Promise = global.Promise;

mongoose.connect(dbUri, { 
    useCreateIndex: true, 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
.then(() => {
    console.log("connected to ", dbUri);

    app.listen(port, () => {
        console.log('server start on http://localhost:'+port);
    })
})
.catch(err => console.log(err));


