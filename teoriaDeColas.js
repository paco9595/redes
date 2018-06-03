
function getVariables() {
    var capacidad = parseFloat($('#capacidad').val());
    var terminales = parseFloat($('#terminales').val());
    var frecuencia = parseFloat($('#frecuencia').val());
    var promedio = parseFloat($('#promedio').val());

    var lamda = (terminales/frecuencia).toFixed(10);
    var Ro = (lamda/(promedio*capacidad)).toFixed(10);
    var OcupacionPromedioBuffer = (Ro/(1-Ro)).toFixed(10); 
    var formula = []
    formula.push([((1/(promedio*capacidad) ) + (OcupacionPromedioBuffer/(promedio*capacidad))).toFixed(10),'E(t) = (1/miu C ) + (E(n)/(miu C)) = '])
    formula.push([(1/(promedio*capacidad*(1-Ro))).toFixed(10),'E(t) = 1/((miu C )(1- ro)) = '])
    formula.push([(1/((promedio*capacidad)-lamda)).toFixed(10),'E(t) = 1/((miu C )- lamda) = '])
    $('<span/>',{
        class:'en',
        text: OcupacionPromedioBuffer + ' Paquetes'
    }).appendTo('#En')
    formula.forEach(element => {
        $('<div>',{
            class:'col-12 et',
            text: element[1]+ element[0] + ' Segundos'
        }).appendTo('#Et')
    });
}