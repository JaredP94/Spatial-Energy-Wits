function queryDatabase(start, end, metric) {
    var payload = {
        start: start,
        end: end,
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
            console.log(resp);
        }
    });
}

queryDatabase('2018/08/30 00:00', '2018/08/31 00:00', 'WITS_13_Jubilee_Road_kVarh');