const autocannon = require('autocannon');

const instanciaPrueba = autocannon({
    url: 'http://localhost:8080/salud',
    connections: 50, // 50 usuarios concurrentes
    duration: 10     // Durante 10 segundos
}, (err, resultado) => {
    if (err) {
        console.error('Error durante la prueba de carga:', err);
    } else {
        console.log('--- RESULTADOS DE LA PRUEBA DE CARGA ---');
        console.log(`Peticiones Totales: ${resultado.requests.total}`);
        console.log(`Peticiones / Seg: ${resultado.requests.average}`);
        console.log(`Latencia Promedio: ${resultado.latency.average} ms`);
    }
});

autocannon.track(instanciaPrueba, { renderProgressBar: true });