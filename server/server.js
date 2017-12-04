var express = require('express');
var bodyParser = require('body-parser');

var nfl = require('./routes/nfl-data');
var users = require('./routes/user-data')

var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('server/public'));
var port = process.env.PORT || 5000;

app.use('/nfl',nfl);
app.use('/users', users)


app.listen(port, function(){
    console.log('listening on port 5000');
});