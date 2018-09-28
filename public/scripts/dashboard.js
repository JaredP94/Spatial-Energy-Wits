function graph1() {
    if (isGraphsRendered()) resetGraphs();
    hideBubbles();
    graphLoading();
    queryDatabase('2018/01/30 00:00', '2018/06/31 00:00', '6h-avg', ['WITS_13_Jubilee_Road_kVarh', 'WITS_WC_David_Webster_Hall_kVarh', 'WITS_WC_Barnato_Sub_TRF_1_kVarh'], 'line');
}

function resetGraph1() {
    var lineChart = document.getElementById("line-chart");
    while (lineChart.firstChild) {
        lineChart.removeChild(lineChart.firstChild);
    }
}

function isGraphsRendered() {
    return (document.getElementById("line-chart").hasChildNodes())
}

function resetGraphs() {
    resetGraph1();
}

$(document).ready(function () {
    graphBubbles();
    renderBubbles();
    //queryDatabase('2018/08/30 00:00', '2018/08/31 00:00', 'WITS_13_Jubilee_Road_kVarh');
})