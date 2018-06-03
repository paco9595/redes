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
            { from: 5, to: 2, label: '3.64' },
            { from: 4, to: 5, label: '9.95' },
            { from: 4, to: 3, label: '3.88' },
            { from: 5, to: 3, label: '0.82' },
            { from: 2, to: 3, label: '0.13' },
            { from: 3, to: 1, label: '3.55' },
            { from: 2, to: 1, label: '3.15' }
        ];
        localStorage.setItem('edgesArray', JSON.stringify(edgesArray))
    }
    if(localStorage.getItem('matrizEnlace')){
       var MatrizEnlace = JSON.parse(localStorage.getItem('matrizEnlace'))
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
            [4,3,1],
            [4,5,2],
            [5,2,1]
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
    console.log(edges)
    console.log(MatrizEnlace)
    generarMatriz() 
    listaNodos();
    listaEdges();
    MatrizDeEnlace(); 
    tablaRutas();
    var arraylamdas = sacarLamdas();
    var g = gama();
    var lamdasTotal = sumalamdas(arraylamdas);
    getformulas(lamdasTotal,g,arraylamdas)
}
function getformulas(lamdasTotal,g,lamdas){
    var lon = JSON.parse(localStorage.getItem('longitudMensaje'))
    var cap = JSON.parse(localStorage.getItem('capacidadRed'))
    var r = lamdasTotal/(lon*cap)
    var capi = []
    var timepor = []
    for (let i = 0; i < lamdas.length; i++) {
        var s = Math.sqrt((lamdas[i]/lon))
        var primera = (lamdas[i]/lon)
        console.log(s)
        console.log(primera)
        console.log(r)
        capi.push( (primera+((cap*(1-r)*(s))/sumatoria(lamdas) ) ) ) 
        
    }
    console.log(capi)
    for (let i = 0; i < capi.length; i++) {
        timepor.push(1/(((lon)*capi[i])-lamdas[i]))
    }
    console.log(timepor)
    llenarTabla(capi,timepor,lamdas)
    //ro
    //capacidad
    //timepo de compomiso
    // timpoe minimo



}
function llenarTabla(capi,timepor,lamdas) {

    for (var i = 0; i < lamdas.length; i++) {
        $('<tr/>', {
            id: 'final'+i
        }).appendTo('#containerFinal')
        $('<td/>', {
            text: i+1
        }).appendTo('#final'+i)
        $('<td/>', {
            text: lamdas[i].toFixed(2)
        }).appendTo('#final'+i)
        $('<td/>', {
            html: capi[i].toFixed(2)
        }).appendTo('#final'+i)
        $('<td/>', {
            html: timepor[i].toFixed(4)
        }).appendTo('#final'+i)
    }
}
function sumatoria(lamdas){
    var suma = 0
    var lon = JSON.parse(localStorage.getItem('longitudMensaje'))
    for (let i = 0; i < lamdas.length; i++) {

        suma += Math.sqrt((lamdas[i]/lon))
        
    }
    return suma
}
function Capacidad(){
    var cap = parseFloat($('#capacidad').val());
    localStorage.setItem('capacidadRed',cap);
    location.reload();
}
function longitud() {
    var lon = parseFloat($('#longitud').val());
    localStorage.setItem('longitudMensaje',lon);
    location.reload();
}
function sumalamdas(lamdas){
    console.log(lamdas)
    var suma =0
    for (let i = 0; i < lamdas.length; i++) {
        suma += lamdas[i]
    }
    return suma
}
function gama(){
    var lsMatriz = JSON.parse(localStorage.getItem('matrizEnlace'));
    console.log(lsMatriz)
    var suma = 0
    for (let i = 0; i < lsMatriz.length ; i++) {
        for (let j = 0; j < lsMatriz[i].length; j++) {
            if(j!=i){
                console.log(lsMatriz[i][j])
                suma +=  lsMatriz[i][j]
            }
            
        }
        
    }
    return suma
}
function sacarLamdas(){
    var lsEdges = JSON.parse(localStorage.getItem("edgesArray"))
    var lsRutas = JSON.parse(localStorage.getItem('rutas'))
    var lsMatriz = JSON.parse(localStorage.getItem('matrizEnlace'));
    var visitados = []
    var lamdas = []
    var suma = 0
    sumas =[]
    for (let i = 0; i < lsEdges.length; i++) {
        visitados.push(0)
    }
    for (let k = 0; k < lsEdges.length; k++){
        console.log(lsMatriz)
        console.log(lsRutas)
        console.log(lsEdges)
        suma += lsMatriz[lsEdges[k].from - 1][lsEdges[k].to - 1]
        console.log(suma)
        for (let i = 0; i < lsRutas.length; i++) {
            for (let j = 0; j < lsRutas[i].length-1; j++) {
                if(lsRutas[i][j] == lsEdges[k].from && lsRutas[i][j + 1] == lsEdges[k].to) {
                    console.log(lsRutas[i][0],lsRutas[i][2])
                    console.log(lsMatriz[lsRutas[i][0]-1][lsRutas[i][2]-1])
                    suma += lsMatriz[lsRutas[i][0] - 1][lsRutas[i][2] - 1]
                }
            }
            
        }
        sumas.push(suma)
        suma=0
    }
    return sumas

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
    console.log(lsrutas)
    for (let i = 0; i < lsrutas.length; i++) {
        $('<tr/>', {
            id: "rutas" + i,
        }).appendTo('#containerRutas')
        $('<td/>',{
            id:'rutainicio' + i,
            text: lsnodes[findObjectByKey(lsnodes,'id',lsrutas[i][0])].label
        }).appendTo('#rutas'+i)
        $('<td/>',{
            id:'rutaFin' + i,
            text: lsnodes[findObjectByKey(lsnodes,'id',lsrutas[i][1])].label
        }).appendTo('#rutas'+i)
        $('<td/>',{
            id:'rutaObli' + i,
            text: lsnodes[findObjectByKey(lsnodes,'id',lsrutas[i][2])].label
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
                        html: '<input class="celdas" type="text" value="'+ lsEnlaces[i][j] +'" name="" id="'+i+'-'+j+'">'
                    }).appendTo("#enlace" + (i + 1))
            }

        }
    }
}
// function buscarCamino(inicial,fin,obli) {
//     var lsNode = JSON.parse(localStorage.getItem("nodesArray"));
//     var lsEdges = JSON.parse(localStorage.getItem('edgesArray'));
//     var visitados = [inicial]
//     while (true) {
        
//     }


// function buscarCamino(inicial,fin,obli){
//     var lsNode = JSON.parse(localStorage.getItem("nodesArray"));
//     var lsEdges = JSON.parse(localStorage.getItem('edgesArray'));
//     var lsMatriz = JSON.parse(localStorage.getItem('matrizEnlaces'));
//     var visitados = [inicial]
//     while (inicial!= fin) {
//         const nodo = lsMatriz[inicial]
//         const posible = nodo.filter(elemento => elemento > 0);
//         for (let i = 0; i < posible.length; i++) {
//             posible[i] = lsMatriz[inicial][nodo.indexOf(posible[i])]
//         }

//         for (let i = 0; i < posible.length; i++) {
//             if ( nodo.indexOf(posible[i]) == obli && visitados.indexOf(obli) == -1){
//                 inicial = new Number(obli);
//                 visitados.push(obli)
//                 break
//             }else if (nodo.indexOf(posible[i]) == fin){
//                 inicial = new Number(fin)
//                 visitados.push(fin)
//                 return visitados
//             }
//         }
//         for (let i = 0; i < posible.length; i++) {
//            if(encontrarMenor(nodo,posible[i]) && visitados.indexOf(nodo.indexOf(posible[i]))) {
//                 inicial = new Number(nodo.indexOf(posible[i]))
//            }
            
//         }
//     }
//     return visitados

// }
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