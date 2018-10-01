var path = require("path");
var express = require("express");
var client = require('opentsdb-client')();
var mQuery = require('opentsdb-mquery')();

client
    .host('35.240.2.119')
    .port(4242)
    .ms(true)
    .arrays(true)
    .tsuids(false)
    .annotations('all')

var mainRouter = express.Router();

mainRouter.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'views', 'landingPage.html'));
});

mainRouter.get("/about", function (req, res) {
    res.sendFile(path.join(__dirname, "views", "about.html"));
});

mainRouter.post("/dataQuery", function (req, res) {
    let start = req.body.start;
    let end = req.body.end;
    let frequency = req.body.frequency;
    let metric = req.body.metric;
    let result = [];

    if (!start || !end || !frequency || !metric) {
        return res.sendStatus(400);
    }

    for (let metric_index = 0; metric_index < metric.length; metric_index++) {
        mQuery
            .aggregator('avg')
            .downsample(frequency)
            .rate(false)
            .metric(metric[metric_index])
            .tags('DataLoggerName', metric[metric_index])

        client
            .start(start)
            .end(end)
            .queries(mQuery)
            .get(function onData(error, data) {
                if (error) {
                    console.error(JSON.stringify(error));
                    return;
                }
                result.push(data);
                if (result.length == metric.length) {
                    res.send(result);
                }
            });
        }
});

mainRouter.get('/metrics', function (req, res) {
    client.metrics(function onResponse(error, metrics) {
        if (error) {
            console.error(JSON.stringify(error));
            return;
        }
        res.send(metrics);
    });
});

mainRouter.get("*", function (req, res){
    res.redirect("/");
})

module.exports = mainRouter;