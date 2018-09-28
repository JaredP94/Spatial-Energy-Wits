function graphLoad(graphType) {
    if (isGraphsRendered()) resetGraphs();
    hideBubbles();
    graphLoading();
    if (graphType == 'line'){
        queryDatabase('2018/01/30 00:00', '2018/06/31 00:00', '6h-avg', ['WITS_13_Jubilee_Road_kVarh', 'WITS_WC_David_Webster_Hall_kVarh', 'WITS_WC_Barnato_Sub_TRF_1_kVarh'], graphType);
    }
    else if (graphType == 'circle') {
        queryDatabase('2018/01/01 00:00', '2019/01/01 00:00', '30d-sum', ['WITS_3_Jubilee_Road_kVarh', 'WITS_13_Jubilee_Road_kVarh', 'WITS_The_Junction_HT_kVarh', 'WITS_WC_David_Webster_Hall_kVarh', 'WITS_WC_Barnato_Sub_TRF_1_kVarh'], graphType);
    }
}

function resetGraph(graphID) {
    var graph = document.getElementById(graphID);
    while (graph.firstChild) {
        graph.removeChild(graph.firstChild);
    }
}

function isGraphsRendered() {
    return (document.getElementById("line-chart").hasChildNodes() || document.getElementById("circle-pack").hasChildNodes())
}

function resetGraphs() {
    resetGraph("line-chart");
    resetGraph("circle-pack");
}

$(function () {
    graphBubbles();
    renderBubbles();
})