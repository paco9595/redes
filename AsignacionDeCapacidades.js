    var shadowState, nodesArray, nodes, edgesArray, edges, network,rutas;
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
            { from: 4, to: 5, label: '9.95' },
            { from: 4, to: 3, label: '3.88' },
            { from: 5, to: 3, label: '0.82' },
            { from: 5, to: 2, label: '3.64' },
            { from: 2, to: 3, label: '0.13' },
            { from: 3, to: 1, label: '3.55' },
            { from: 2, to: 1, label: '3.15' }
        ];
        localStorage.setItem('edgesArray', JSON.stringify(edgesArray))
    }
    if(localStorage.getItem('matrizEnlace')){
        MatrizEnlace = JSON.parse(localStorage.getItem('matrizEnlace'))
    } else{
        var matrizEnlace = [
            ['',9.34,.935,2.94,.610],
            [9.34,'',.82,2.4,628],
            [.935,.82,'',.608,.131],
            [2.92,2.4,.608,'',.753],
            [.610,.628,.131,.753,'']
        ];
        localStorage.setItem('matrizEnlace',JSON.stringify(matrizEnlace));
    }
    if(localStorage.getItem('rutas')){
        rutas = JSON.parse(localStorage.getItem('rutas'))
    }else{
        var rutas = [
            [3,1,2],
            [3,0,4]
        ]
        localStorage.setItem('rutas',JSON.stringify(rutas))
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
    generarMatriz() 
    listaNodos();
    listaEdges();
    MatrizDeEnlace(); 
    tablaRutas()    
    buscarCamino(3,0,1); 

}
function addNode() {
    var lsNode = JSON.parse(localStorage.getItem("nodesArray"));
    var lsMatriz = JSON.parse(localStorage.getItem('matrizEnlace'))
    var label = $('#nuevoNodo').val();
    var id = lsNode.length + 1;
    var obj = { id, label }
    nodes.add(obj);
    lsNode.push(obj);
    aux = []
    for (let i = 0; i < lsMatriz.length; i++) {
        lsMatriz[i].push(0)
        aux.push(0)
    }
    lsMatriz.push(aux)
    localStorage.setItem('nodesArray', JSON.stringify(lsNode));
    localStorage.setItem('matrizEnlace',JSON.stringify(lsMatriz))
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
function removeRuta(id){
    var lsrutas = JSON.parse(localStorage.getItem('rutas'))
    lsrutas.splice(id, 1);
    localStorage.setItem('rutas',JSON.stringify(lsrutas));
    location.reload()
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
function tablaRutas() {
    var lsrutas = JSON.parse(localStorage.getItem('rutas'))
    var lsnodes = JSON.parse(localStorage.getItem("nodesArray"));
    for (let i = 0; i < lsrutas.length; i++) {
        console.log(i)
        $('<tr/>', {
            id: "rutas" + i,
        }).appendTo('#containerRutas')
        $('<td/>',{
            id:'rutainicio' + i,
            text: lsnodes[lsrutas[i][0]].label
        }).appendTo('#rutas'+i)
        $('<td/>',{
            id:'rutaFin' + i,
            text: lsnodes[lsrutas[i][1]].label
        }).appendTo('#rutas'+i)
        $('<td/>',{
            id:'rutaObli' + i,
            text: lsnodes[lsrutas[i][2]].label
        }).appendTo('#rutas'+i)
        $('<td/>',{
            id:'rutaclose' + i,
            html: '<i class="fas fa-times icon"></i>'
        }).appendTo('#rutas'+i)
        $('#containerRutas tr#rutas'+i+' td#rutaclose' + i + ' i').attr('onclick', 'removeRuta(' + i + ')');
    }
}
function addRuta() {
    var lsrutas = JSON.parse(localStorage.getItem('rutas'));
    var inicio = parseInt($('#rutainicio').val());
    var fin = parseInt($('#rutafin').val());
    var obli = parseInt($('#rutaobli').val());
    a = [inicio,fin,obli]
    lsrutas.push(a)
    localStorage.setItem('rutas',JSON.stringify(lsrutas))
    location.reload()
}
function ActualizarMatriz() {
    var lsMatriz = JSON.parse(localStorage.getItem('matrizEnlace'))
    for (let i = 0; i < lsMatriz.length; i++) {
        for (let j = 0; j < lsMatriz[i].length; j++) {
            if (j!=i){
                var val = parseFloat($('input#'+i+'-'+  j).val());
                lsMatriz[i][j] = val;
            }
            
        }
        
    }
    localStorage.setItem('matrizEnlace',JSON.stringify(lsMatriz));
    location.reload()
}
function MatrizDeEnlace() {
    var lsNode = JSON.parse(localStorage.getItem("nodesArray"));
    var lsEnlaces = JSON.parse(localStorage.getItem('matrizEnlace'));
    lsNode.forEach(obj => {
        $('<th/>', {
            id: "titulosCiudades" + obj.id,
            text: obj.label
        }).appendTo('#titulosCiudades')
    })
    for(var i =0;i<lsNode.length;i++){
        $('<tr/>', {
            id: 'enlace' + (i + 1)

        }).appendTo('#containerCuidades')
        $('<td/>', {
            text: (i+1) + "- " + lsNode[i].label 
        }).appendTo("#enlace" + (i + 1))
        for(var j =0;j<lsNode.length;j++){
            if (j == i){
                $('<td/>', {
                    text: '0'
                }).appendTo("#enlace" + (i + 1))
            } else{
                    $('<td/>', {
                        html: '<input type="text" value="'+ lsEnlaces[i][j] +'" name="" id="'+i+'-'+j+'">'
                    }).appendTo("#enlace" + (i + 1))
            }

        }
    }
}
function buscarCamino(inicio,fin,obli){
    var lsNode = JSON.parse(localStorage.getItem("nodesArray"));
    var lsEdges = JSON.parse(localStorage.getItem('edgesArray'));
    var lsMatriz = JSON.parse(localStorage.getItem('matrizEnlaces'));
    pos = new Number(inicio)
    var visitados= [inicio]
    while (pos!= fin) {
        const nodo = lsMatriz[pos]
        const posible = nodo.filter(elemento => elemento > 0);
        for (let i = 0; i < posible.length; i++) {
            posible[i] == lsMatriz[pos][nodo.indexOf(posible[i])]
        }
        for (let i = 0; i < posible.length; i++) {
            if (nodo.indexOf(posible[i]) != obli && visitados.indexOf(obli) == -1){
                pos = obli;
                visitados.push(obli)
            }else if (nodo.indexOf(posible[i]) == fin){
                pos = fin
                visitados.push(fin)
            }else if(encontrarMenor(nodo,posible[i]) && visitados.indexOf(posible[i]) == -1){
                pos = nodo.indexOf(posible[i])
                visitados.push(pos)
            }
        }
    }
    console.log(visitados)

}
function encontrarMenor(array,menor) {
    for (let i = 0; i < array.length; i++) {
        if(array[i] < menor) {
            return false
        }   
    }
    return true
}

function buscarObjeto(a, id) {
    r = []
    for (var i = 0; i < a.length; i++) {
        if (a[i].from == id || a[i].to == id) {
            r.push(a[i])
        }
    }
    return r
}
function removeNode(id) {
    var lsNode = JSON.parse(localStorage.getItem("nodesArray"));
    lsNode.splice(id, 1);
    localStorage.setItem('nodesArray', JSON.stringify(lsNode))
    removeEdgesforNode(id + 1);
    location.reload();
}
function removeEdge(id) {
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
function generarMatriz(){
    var lsNode = JSON.parse(localStorage.getItem("nodesArray"));
    var lsEdges = JSON.parse(localStorage.getItem('edgesArray'));
    var aux = []
    var matriz = []
    for (let i = 0; i < lsNode.length; i++) {
        for (let j = 0; j < lsNode.length; j++) {
            aux.push(0)
        }
        matriz.push(aux)
        aux = []
    }
    for (let i = 0; i < lsNode.length; i++) {
        var objs = buscarObjeto(lsEdges,lsNode[i].id)
        console.log(objs)
        for (let j = 0; j < objs.length; j++) {
            console.log(objs[j])
            matriz[objs[j].from - 1][objs[j].to - 1] = parseFloat(objs[j].label)
            matriz[objs[j].to - 1][objs[j].from - 1] = parseFloat(objs[j].label)
            matriz[0][0] = 0
        }
    }
    console.log(matriz)
    localStorage.setItem('matrizEnlaces',JSON.stringify(matriz));
}

startNetwork();