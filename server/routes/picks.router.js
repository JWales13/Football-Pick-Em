var express = require('express');
var router = express.Router();
var request = require('request');
var pool = require('../modules/pool');


router.get('/', function (req, res) {
    
    console.log(req.body);
    pool.connect(function (errorConnectingToDatabase, client, done) {
        if (errorConnectingToDatabase) {
            console.log('error', errorConnectingToDatabase);
            res.sendStatus(500);
        } else {
            console.log(req.body)
            client.query( 'SELECT * FROM matchup WHERE matchup.week = 1', 
            function (errorMakingDatabaseQuery, result) {
                done();
                if (errorMakingDatabaseQuery) {
                    console.log('error', errorMakingDatabaseQuery);
                    res.sendStatus(500);
                } else {
                    console.log(result.rows);
                    res.send(result.rows);
                }
            });
        }
    });
});





module.exports = router;