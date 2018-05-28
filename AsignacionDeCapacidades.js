var shadowState, nodesArray, nodes, edgesArray, edges, network;
function startNetwork() {
    // this list is kept to remove a random node.. we do not add node 1 here because it's used for changes
    if (localStorage.getItem("nodesArray")) {
        nodesArray = JSON.parse(localStorage.getItem("nodesArray"));
    } else {
        nodesArray = [
            { id: 1, label: 'Nueva York' },
            { id: 2, label: 'Chicago' },
            { id: 3, label: 'Houston' },
            { id: 4, label: 'los Angeles' },
            { id: 5, label: 'Denver' },
        ];
        localStorage.setItem('nodesArray', JSON.stringify(nodesArray))
    }
    nodes = new vis.DataSet(nodesArray);
    if (localStorage.getItem("edgesArray")) {
        edgesArray = JSON.parse(localStorage.getItem("edgesArray"));
    } else {
        var edgesArray = [
            { from: 1, to: 2, label: '9.95' },
            { from: 1, to: 3, label: '3.88' },
            { from: 2, to: 3, label: '0.82' },
            { from: 2, to: 5, label: '3.64' },
            { from: 3, to: 5, label: '0.13' },
            { from: 3, to: 4, label: '3.55' },
            { from: 4, to: 5, label: '3.15' }
        ];
        localStorage.setItem('edgesArray', JSON.stringify(edgesArray))
    }

    // create an array with edges
    edges = new vis.DataSet(edgesArray);

    // create a network
    var container = document.getElementById('mynetwork');
    var data = {
        nodes: nodes,
        edges: edges
    };
    var options = {};
    network = new vis.Network(container, data, options);
    listaNodos();
    listaEdges();
}
function addNode() {
    var lsNode = JSON.parse(localStorage.getItem("nodesArray"));
    var label = $('#nuevoNodo').val();
    var id = lsNode.length + 1;
    var obj = { id, label }
    nodes.add(obj);
    lsNode.push(obj);
    localStorage.setItem('nodesArray', JSON.stringify(lsNode));
    location.reload()
}
function addEgde() {
    var from = parseInt($('#nodoInicial').val());
    var to = parseInt($('#nodoFinal').val());
    var label = $('#peso').val();
    var obj = { from, to, label }
    var lsedges = JSON.parse(localStorage.getItem("edgesArray"));
    lsedges.push(obj);
    localStorage.setItem('edgesArray', JSON.stringify(lsedges));
    location.reload();
}
function listaNodos() {
    var lsNode = JSON.parse(localStorage.getItem("nodesArray"));
    lsNode.forEach(obj => {
        if ($('#cantainerNodes').has('li#' + obj.id)) {
            $('<li/>', {
                id: obj.id,
                text: obj.id + '-. ' + obj.label,
                class: 'list-group-item'
            }).appendTo('#cantainerNodes');
            $('<i/>', {
                class: 'fas fa-times icon'
            }).appendTo('#' + obj.id)
            $('#cantainerNodes li#' + obj.id + ' i').attr('onclick', 'removeNode(' + (obj.id - 1) + ')');
        }
    });
}
function listaEdges() {
    var lsEdges = JSON.parse(localStorage.getItem("edgesArray"));
    var lsNode = JSON.parse(localStorage.getItem("nodesArray"));
    for (var i = 0; i < lsEdges.length; i++) {
        $('<li/>', {
            id: i + 1,
            class: 'list-group-item'
        }).appendTo('#cantainerEdges');
        $('#cantainerEdges li#' + (i + 1)).html(lsNode[findObjectByKey(lsNode,'id',lsEdges[i].from)].label + '<i class="fas fa-long-arrow-alt-right arrow"></i>' + lsNode[findObjectByKey(lsNode,'id',lsEdges[i].to)].label)
        $('<i/>', {
            class: 'fas fa-times icon'
        }).appendTo('#cantainerEdges li#' + (i + 1))
        $('#cantainerEdges li#' + (i + 1) + ' i.icon').attr('onclick', 'removeEdge(' + i + ')');
    }
}
function removeNode(id) {
    var lsNode = JSON.parse(localStorage.getItem("nodesArray"));
    lsNode.splice(id, 1);
    localStorage.setItem('nodesArray', JSON.stringify(lsNode))
    removeEdgesforNode(id + 1);
    location.reload();
}
function removeEdge(id) {
    console.log('hola')
    var lsEdges = JSON.parse(localStorage.getItem("edgesArray"));
    lsEdges.splice(id,1);
    localStorage.setItem('edgesArray', JSON.stringify(lsEdges))
    location.reload();
}
function removeEdgesforNode(id) {
    var lsEdges = JSON.parse(localStorage.getItem("edgesArray"));
    var ids = []
    for (var i = 0; i < lsEdges.length; i++) {
        if (lsEdges[i].from == id || lsEdges[i].to == id) {
            ids.push(i)
        }
    }
    for (var i = 0; i < ids.length; i++) {
        lsEdges.splice(ids[i]-i, 1);
    }
    localStorage.setItem('edgesArray', JSON.stringify(lsEdges))
    console.log(ids);

}
function findObjectByKey(array, key, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
            return i;
        }
    }
    return null;
}
startNetwork();