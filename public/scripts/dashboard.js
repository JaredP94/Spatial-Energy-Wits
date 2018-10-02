function graphLoad(graphType) {
    if (isGraphsRendered()) resetGraphs();
    hideBubbles();
    renderFilters();
    graphLoading();
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

function whichGraphRendered() {
    if (document.getElementById("line-chart").hasChildNodes()) return 'line';
    else if (document.getElementById("circle-pack").hasChildNodes()) return 'circle';
    else if (document.getElementById("aster-chart").hasChildNodes()) return 'aster';
}

function updateYear(year) {
    let graph = whichGraphRendered();
    graphLoad(graph);
}

function resetGraphs() {
    resetGraph("line-chart");
    resetGraph("circle-pack");
    resetGraph("aster-chart");
}

function renderFilters() {
    document.getElementById('filter-sidebar').style.display = 'block';
}

$(function () {
    graphBubbles();
    renderBubbles();
})