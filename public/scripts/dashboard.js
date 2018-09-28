function graphLoad(graphType) {
    if (isGraphsRendered()) resetGraphs();
    hideBubbles();
    graphLoading();
    queryDatabase('2018/01/30 00:00', '2018/06/31 00:00', '6h-avg', ['WITS_13_Jubilee_Road_kVarh', 'WITS_WC_David_Webster_Hall_kVarh', 'WITS_WC_Barnato_Sub_TRF_1_kVarh'], graphType);
}

function resetGraph(graphID) {
    var graph = document.getElementById(graphID);
    while (graph.firstChild) {
        graph.removeChild(graph.firstChild);
    }
}

function isGraphsRendered() {
    return (document.getElementById("line-chart").hasChildNodes())
}

function resetGraphs() {
    resetGraph("line-chart");
}

$(function () {
    graphBubbles();
    renderBubbles();
})