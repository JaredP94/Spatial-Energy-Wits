function graphLoad(graphType) {
    if (isGraphsRendered()) resetGraphs();
    hideBubbles();
    graphLoading();
    let buildings = [
        'WITS_3_Jubilee_Road_kVarh', 
        'WITS_13_Jubilee_Road_kVarh', 
        'WITS_WC_David_Webster_Hall_kVarh', 
        'WITS_WC_Barnato_Sub_TRF_1_kVarh',
        'WITS_The_Junction_ePitstop_kVarh',
        'WITS_WC_Barnato_Sub_Residence_A___D_kVarh',
        'WITS_WC_Barnato_Sub_TRF_2_kVarh',
        'WITS_The_Junction_HT_kVarh'
    ]
    if (graphType == 'line'){
        queryMetrics('2018/01/30 00:00', '2018/06/31 00:00', '6h-avg', graphType);
    }
    else if (graphType == 'circle') {
        queryMetrics('2018/01/01 00:00', '2019/01/01 00:00', '30d-sum', graphType);
    }
    else if (graphType == 'aster') {
        queryMetrics('2018/01/01 00:00', '2019/01/01 00:00', '30d-sum', graphType);
    }
}

function resetGraph(graphID) {
    var graph = document.getElementById(graphID);
    while (graph.firstChild) {
        graph.removeChild(graph.firstChild);
    }
}

function isGraphsRendered() {
    return (document.getElementById("line-chart").hasChildNodes() || document.getElementById("circle-pack").hasChildNodes() || document.getElementById("aster-chart").hasChildNodes())
}

function resetGraphs() {
    resetGraph("line-chart");
    resetGraph("circle-pack");
    resetGraph("aster-chart");
}

$(function () {
    graphBubbles();
    renderBubbles();
})