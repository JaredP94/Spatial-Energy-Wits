function queryDatabase(start, end, frequency, metric, graph) {
    let payload = {
        start: start,
        end: end,
        frequency: frequency,
        metric: metric
    };

    $.ajax({
        url: "/dataQuery",
        type: "POST",
        contentType: "application/json",
        processData: false,
        data: JSON.stringify(payload),
        async: true,
        success: function (resp) {
            graphLoaded();
            if (graph == "line") setTimeout(renderLineGraph.bind(null, resp), 2000);
            else if (graph == "circle") setTimeout(renderCirclePack.bind(null, resp), 2000);
            else if (graph == "aster") setTimeout(renderAsterPlot.bind(null, resp), 2000);
        }
    });
}

function queryMetrics(start, end, frequency, graph) {
    $.ajax({
        url: "/metrics",
        type: "GET",
        contentType: "application/json",
        processData: false,
        async: true,
        success: function (resp) {
            let metrics = [];
            resp.forEach(element => {
                if (element.includes('kWh')) metrics.push(element);
            });
            queryDatabase(start, end, frequency, metrics, graph)
            }
    });
}