const criptomonedasSelect = document.getElementById('criptomonedas');
const formulario = document.getElementById('formulario');
const resultado = document.getElementById('resultado');

let moneda;
let criptomonedas;



document.addEventListener('DOMContentLoaded', () => {
    consultarCriptomonedas();
})

formulario.addEventListener('submit', submitFormulario);

function consultarCriptomonedas() {
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    fetch(url)
        .then(respuesta => respuesta.json() )
        .then(resultado => obtenerCriptomonedas(resultado.Data))
}


function obtenerCriptomonedas(criptomonedas) {
    criptomonedas.forEach(cripto => {
        const {FullName, Name} = cripto.CoinInfo

        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        criptomonedasSelect.appendChild(option);
    });
}

function submitFormulario(e) {
    e.preventDefault();
    moneda = document.getElementById('moneda').value;
    criptomonedas = document.getElementById('criptomonedas').value;
    
    if(moneda === '' || criptomonedas === '') {
        alerta('Todos los campos son obligatorios');
        return;
    }
    //Consultar la API
    consultaApi(moneda, criptomonedas);
}

function consultaApi(moneda, criptomonedas) {
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomonedas}&tsyms=${moneda}`;

    spinner();

    fetch (url)
        .then(respuesta => respuesta.json())
        .then(datos => mostrarCotizacionHTML(datos.DISPLAY[criptomonedas][moneda]));
}

function mostrarCotizacionHTML(cotizacion) {
    limpiarHTML();
    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;
    
    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `
        El precio es: <span> ${PRICE} </span>
    `
    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `
        El precio más alto del día: <span> ${HIGHDAY} </span>
    `

    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `
        El precio más bajo del día: <span> ${LOWDAY} </span>
    `

    const cambio = document.createElement('p');
    cambio.innerHTML = `
        Variación últimas 24 HRS: <span> ${CHANGEPCT24HOUR}% </span>
    `
    const ultimaActualizacion = document.createElement('p');
    ultimaActualizacion.innerHTML = `
        Ultima Actualización: <span> ${LASTUPDATE} </span>
    `


    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(cambio);
    resultado.appendChild(ultimaActualizacion);

}

function limpiarHTML() {
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

function spinner() {
    limpiarHTML();
    const divSpinner = document.createElement('div');
    divSpinner.classList.add('spinner');
    divSpinner.innerHTML = `
        <div class="cube1"></div>
        <div class="cube2"></div>
    `
    resultado.appendChild(divSpinner);
}




function alerta(mensaje) {
    Swal.fire({
        icon: 'warning',
        title: mensaje,
        showConfirmButton: false,
        timer: 1500
      })
}