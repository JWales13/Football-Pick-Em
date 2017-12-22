var express = require('express');
var router = express.Router();
var request = require('request');
var pool = require('../modules/pool');

router.get('/', function(req, res) {
    var fullRequestUrl = 'http://api.sportradar.us/nfl-ot2/games/2017/REG/schedule.json?api_key=qc6kyztktpmnnfu9dgkedssf'
    var headers = 'X-Originating-Ip : 174.53.198.56';
    request(fullRequestUrl,headers, function (error, response, body) {
        if(error) {
            console.log('Error making Request', error);
            res.sendStatus(500);
        } else {
            res.send(body);
        }
    });
});

router.post('/', function (req, res) {
    pool.connect(function (errorConnectingToDatabase, client, done) {
        if (errorConnectingToDatabase) {
            console.log('error connecting to DB', errorConnectingToDatabase);
            res.sendStatus(500);
        }
        else {

            client.query(`INSERT INTO matchup (id, home, away, date, week, home_points, away_points)
            VALUES ($1, (SELECT "id" FROM "team" WHERE name = $2), (SELECT "id" FROM "team" WHERE name = $3), $4, $5, $6, $7);`, [req.body.id, req.body.home, req.body.away, req.body.date, req.body.week, req.body.home_points, req.body.away_points], function (errorMakingQuery, result) {
                    done();
                    if (errorMakingQuery) {
                        console.log('error making query', errorMakingQuery);
                        res.sendStatus(500);
                    }
                    else {
                        res.sendStatus(201);
                    }//end  query else
                });//end client query
        }//end connect else
    });//end pool connect
})//end router post



module.exports = router;