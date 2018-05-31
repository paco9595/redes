var shadowState, nodesArray, nodes, edgesArray, edges, network, lamda, distancias, capacidades, delay;
var rutas = [];

function startNetwork() {
    // this list is kept to remove a random node.. we do not add node 1 here because it's used for changes
    if (localStorage.getItem("nodesArray")) {
        nodesArray = JSON.parse(localStorage.getItem("nodesArray"));
    } else {
        nodesArray = [{
                id: 1000,
                label: 'Origen'
            }, // centro
            {
                id: 1,
                label: 'Chicago'
            },
            {
                id: 2,
                label: 'Detroit'
            },
            {
                id: 3,
                label: 'charlotte'
            },
            {
                id: 4,
                label: 'Miami'
            },
            {
                id: 5,
                label: 'New Orleans'
            },
            {
                id: 6,
                label: 'New York'
            },
            {
                id: 7,
                label: 'Tallahassee'
            },
        ];
        localStorage.setItem('nodesArray', JSON.stringify(nodesArray))
    }
    nodes = new vis.DataSet(nodesArray);
    if (localStorage.getItem("edgesArray")) {
        edgesArray = JSON.parse(localStorage.getItem("edgesArray"));
    } else {
        var edgesArray = [{
                from: 2,
                to: 1,
                label: '1'
            },
            {
                from: 1000,
                to: 2,
                label: '2'
            },
            {
                from: 1000,
                to: 3,
                label: '3'
            },
            {
                from: 7,
                to: 4,
                label: '4'
            },
            {
                from: 7,
                to: 5,
                label: '5'
            },
            {
                from: 1000,
                to: 6,
                label: '6'
            },
            {
                from: 3,
                to: 7,
                label: '7'
            }
        ];
        localStorage.setItem('edgesArray', JSON.stringify(edgesArray))
    }

    // create an array with edges
    edges = new vis.DataSet(edgesArray);
    if (localStorage.getItem('lamda')) {
        lamda = JSON.parse(localStorage.getItem('lamda'));
    } else {
        lamda = [0.33, .63, .66, .2, .2, .4, .53];
        localStorage.setItem('lamda', JSON.stringify(lamda));
    }

    if (localStorage.getItem('distancias')) {
        distancias = JSON.parse(localStorage.getItem('distancias'));
    } else {
        distancias = [235, 383, 321, 381, 347, 228, 378]
        localStorage.setItem('distancias', JSON.stringify(distancias))
    }
    if (localStorage.getItem('capacidades')) {
        capacidades = JSON.parse(localStorage.getItem('capacidades'));
    } else {
        capacidades = [{
                cap: 450,
                costo: 1.4,
                id: 1
            },
            {
                cap: 900,
                costo: 1.7,
                id: 2
            },
            {
                cap: 1350,
                costo: 1.875,
                id: 3
            },
            {
                cap: 1800,
                costo: 2.0,
                id: 4
            },
        ]
        localStorage.setItem('capacidades', JSON.stringify(capacidades))
    }
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
    tablaCapacidades();
    tablaInfoEnlaces();
    tablaDeRetraso();
    generarRutas(1000, [],1000);
    console.log(rutas)
}

function addNode() {
    var lsNode = JSON.parse(localStorage.getItem("nodesArray"));
    var label = $('#nuevoNodo').val();
    var id = lsNode.length;
    var obj = {
        id,
        label
    }
    nodes.add(obj);
    lsNode.push(obj);
    localStorage.setItem('nodesArray', JSON.stringify(lsNode));
    location.reload()
}

function addEgde() {
    var numlabel = JSON.parse(localStorage.getItem("nodesArray")).length - 1;
    var from = parseInt($('#nodoInicial').val());
    var to = parseInt($('#nodoFinal').val());
    var valLamda = parseFloat($('#lamda').val());
    var valdist = parseInt($('#distancia').val());
    var obj = {
        from,
        to,
        label: numlabel.toString()
    }
    var lslamda = JSON.parse(localStorage.getItem('lamda'));
    var lsdist = JSON.parse(localStorage.getItem('distancias'));
    var lsedges = JSON.parse(localStorage.getItem("edgesArray"));
    lsedges.push(obj);
    lslamda.push(valLamda);
    lsdist.push(valdist);
    localStorage.setItem('edgesArray', JSON.stringify(lsedges));
    localStorage.setItem('lamda', JSON.stringify(lslamda));
    localStorage.setItem('distancias', JSON.stringify(lsdist));

    location.reload();
}

function addCapacidad() {
    var lsCapacidades = JSON.parse(localStorage.getItem('capacidades'));
    var cap = parseFloat($('#Capacidad').val());
    var costo = parseFloat($('#valCosto').val());
    obj = {
        cap,
        costo,
        id: lsCapacidades.length + 1
    };
    lsCapacidades.push(obj);
    localStorage.setItem('capacidades', JSON.stringify(lsCapacidades));
    location.reload();
}

function listaNodos() {
    var lsNode = JSON.parse(localStorage.getItem("nodesArray"));
    lsNode.forEach(obj => {
        if ($('#cantainerNodes').has('li#' + obj.id)) {
            $('<li/>', {
                id: obj.id,
                text: obj.label,
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
        $('#cantainerEdges li#' + (i + 1)).html(lsNode[findObjectByKey(lsNode, 'id', lsEdges[i].from)].label + '<i class="fas fa-long-arrow-alt-right arrow"></i>' + lsNode[findObjectByKey(lsNode, 'id', lsEdges[i].to)].label)
        $('<i/>', {
            class: 'fas fa-times icon'
        }).appendTo('#cantainerEdges li#' + (i + 1))
        $('#cantainerEdges li#' + (i + 1) + ' i.icon').attr('onclick', 'removeEdge(' + i + ')');
    }
}

function tablaCapacidades() {
    var lsCapacidades = JSON.parse(localStorage.getItem('capacidades'));
    lsCapacidades.forEach(obj => {
        if ($('#containerCapacidades').has('tr#' + obj.id)) {
            $('<tr/>', {
                id: "CapacidadesContainer" + obj.id
            }).appendTo('#containerCapacidades')
            $('<td/>', {
                id: "capacidad" + obj.id,
                text: obj.cap
            }).appendTo('#CapacidadesContainer' + obj.id)
            $('<td/>', {
                id: "costo" + obj.id,
                text: obj.costo
            }).appendTo('#CapacidadesContainer' + obj.id)
            $('<td/>', {
                id: "close" + obj.id
            }).appendTo('#CapacidadesContainer' + obj.id)
            $('<i/>', {
                class: 'fas fa-times icon'
            }).appendTo("#close" + obj.id)
            $('#containerCapacidades tr#CapacidadesContainer' + obj.id + ' td#close' + obj.id + ' i').attr('onclick', 'removeCapacidad(' + (obj.id - 1) + ')');
        }
    })
}

function tablaInfoEnlaces() {
    var lsEdges = JSON.parse(localStorage.getItem("edgesArray"));
    var lsNode = JSON.parse(localStorage.getItem("nodesArray"));
    var lslamda = JSON.parse(localStorage.getItem('lamda'));
    var lsdist = JSON.parse(localStorage.getItem('distancias'));
    for (var i = 0; i < lsEdges.length; i++) {
        if ($('#contentInfo').has('tr#' + (i + 1))) {
            $('<tr/>', {
                id: "infoContainer" + (i + 1)
            }).appendTo('#contentInfo')
            $('<td/>', {
                id: "capacidad" + (i + 1),
                html: lsNode[findObjectByKey(lsNode, 'id', lsEdges[i].from)].label + '<i class="fas fa-long-arrow-alt-right arrow"></i>' + lsNode[findObjectByKey(lsNode, 'id', lsEdges[i].to)].label
            }).appendTo('#infoContainer' + (i + 1))
            $('<td/>', {
                id: "lamda" + (i + 1),
                text: lslamda[i]
            }).appendTo('#infoContainer' + (i + 1))
            $('<td/>', {
                id: "distancia" + (i + 1),
                text: lsdist[i]
            }).appendTo('#infoContainer' + (i + 1))
        }
    }
}

function tablaDeRetraso() {
    var lsEdges = JSON.parse(localStorage.getItem("edgesArray"));
    var lslamda = JSON.parse(localStorage.getItem('lamda'));
    var lsdist = JSON.parse(localStorage.getItem('distancias'));
    var lsCapacidades = JSON.parse(localStorage.getItem('capacidades'));
    var long = parseInt($('#longuitudPromedio').val())
    lsCapacidades.forEach(obj => {
        $('<th/>', {
            id: "CapacidadesCtitulo" + obj.id,
            text: obj.cap
        }).appendTo('#titulostablaretraso')
    })
    for (var i = 0; i < lsEdges.length; i++) {
        $('<tr/>', {
            id: 'enlace' + (i + 1)

        }).appendTo('#contenRetraso')
        $('<td/>', {
            html: lsEdges[i].label + '<br>' + lsdist[i] + ' (millas)'
        }).appendTo("#enlace" + (i + 1))
        $('<td/>', {
            html: 'Delay (sec)<br> costo ($/mo)'
        }).appendTo("#enlace" + (i + 1))
        for (var j = 0; j < lsCapacidades.length; j++) {
            $('<td/>', {
                html: sacarTiempoRetraso(lslamda[j], lsCapacidades[j].cap, long) + '<br>' + sacarCostoMensual(lsCapacidades[j].costo, lsdist[i])
            }).appendTo("#enlace" + (i + 1))
        }
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
    lsEdges.splice(id, 1);
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
        lsEdges.splice(ids[i] - i, 1);
    }
    localStorage.setItem('edgesArray', JSON.stringify(lsEdges))
    console.log(ids);

}

function removeCapacidad(id) {
    var lsCapacidades = JSON.parse(localStorage.getItem('capacidades'));
    lsCapacidades.splice(id, 1);
    localStorage.setItem('capacidades', JSON.stringify(lsCapacidades))
    location.reload();
}

function sacarTiempoRetraso(l, cap, long) {
    return (1 / (((1 / long) * cap) - l)).toFixed(4)
}

function sacarCostoMensual(costo, dist) {
    return (costo * dist).toFixed(0)
}

function generarRutas(id, camino, Origen) {
    var ruta = []
    var lsEdges = JSON.parse(localStorage.getItem("edgesArray"));
    var lsnodes = JSON.parse(localStorage.getItem("nodesArray"));
    if (id != Origen){
        camino.push(lsnodes[findObjectByKey(lsnodes, 'id', id)]);
    }
    var b = buscarObjeto(lsEdges, id);
    if (b.length > 0) {
        var rutaIncompleta = camino;
        for (let i = 0; i < b.length; i++) {
            console.log(rutaIncompleta, camino)
            if (i != 0 && id != Origen && camino.length == 0) {
                console.log('rutas', rutaIncompleta)
                console.log('caminon', camino)
                camino = rutaIncompleta
            }
            rutaIncompleta = camino
            camino = generarRutas(b[i].to, camino,Origen);
        }
    } else {
        rutas.push(camino)
        camino = []
    }
    return camino
}

function buscarObjeto(a, id) {
    r = []
    for (var i = 0; i < a.length; i++) {
        if (a[i].from == id) {
            r.push(a[i])
        }
    }
    return r
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