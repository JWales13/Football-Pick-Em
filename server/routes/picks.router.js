var express = require('express');
var router = express.Router();
var request = require('request');
var pool = require('../modules/pool');


router.post('/', function (req, res) {
    selectedWeek = req.body;
    console.log('selectedWeek.week:',selectedWeek.week);
    pool.connect(function (errorConnectingToDatabase, client, done) {
        if (errorConnectingToDatabase) {
            console.log('error', errorConnectingToDatabase);
            res.sendStatus(500);
        } else {
            console.log('selectedWeek:',selectedWeek)
            client.query( `SELECT t1.name as team1, t2.name as team2 FROM matchup t
            INNER JOIN team t1 on t.home = t1.id
            INNER JOIN team t2 on t.away = t2.id
            WHERE t.week = $1;`, [selectedWeek.week],
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