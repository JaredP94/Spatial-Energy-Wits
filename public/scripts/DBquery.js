function queryDatabase(start, end, frequency, metric, graph) {
    let payload = {
        start: start,
        end: end,
        frequency: frequency,
        metric: metric,
    };

    $.ajax({
        url: "/dataQuery",
        type: "POST",
        contentType: "application/json",
        processData: false,
        data: JSON.stringify(payload),
        async: true,
        success: function (resp) {
            //console.log(resp);
            graphLoaded();
            if (graph == "line") setTimeout(renderLineGraph.bind(null, resp), 2000);
            else if (graph == "circle") setTimeout(renderCirclePack.bind(null, resp), 2000);
        }
    });
}