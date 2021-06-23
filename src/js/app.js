let pagina = 1;

let cita = {
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

document.addEventListener('DOMContentLoaded', function() {
    iniciandoApp();
})

function iniciandoApp() {
    mostrarServicios();
    // Resalta el div de los tab que se selecciona
    mostrarSeccion()
    // Oculta o muestra una seccion segun el tab seleccionado
    cambiarSeccion();
    // Paginacion
    paginaAnterior();
    paginaSiguiente();
    // Mostrar u Ocultar botones de paginacion
    botonesPaginador();
    // Muestra el resumen de la cita o mensaje de error
    mostrarResumen();
    // Almacena el nombre de la cita en el objeto
    nombreCita();
    // Almacena y valida la fecha de la cita en el objeto
    fechaCita();
    // Deshabilita fechas anteriores al dia de hoy
    deshabilitarFechaAnterior();
    // Almacena la hora de la cita
    horaCita();
}

function mostrarSeccion() {

    // Elimino la clase mostrar-seccion de la seccion anterior si existe
    const seccionAnterior = document.querySelector('.mostrar-seccion');
    if(seccionAnterior) {
        seccionAnterior.classList.remove('mostrar-seccion');
    }
    
    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

    // Elimino la clase tab anterior si existe
    const tabAnterior = document.querySelector('.tabs .actual');
    if(tabAnterior) {
        tabAnterior.classList.remove('actual');
    }
    
    // Resalta el Tab actual
    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('actual');
}

function cambiarSeccion() {
    const enlaces = document.querySelectorAll('.tabs button');
    
    enlaces.forEach(enlace => {
        enlace.addEventListener('click', e => {
            e.preventDefault();
            pagina = parseInt(e.target.dataset.paso);

            // llamar la funcion de mostrar seccion
            mostrarSeccion();

            botonesPaginador();
        })
    })
}

async function mostrarServicios() {
    try {
        const resultado = await fetch('./servicios.json');
        //const db = await resultado.json();
        //const {servicios} = db;
        
        const {servicios} = await resultado.json(); //Utilizo destroying para crear el arreglo de servicios
        
        //Generar html
        servicios.forEach(servicio => { //ServicioS es el arreglo y servicio es la variable individual donde esta el resultado de cada iteracion
            const {id, nombre, precio} = servicio; //nuevamente utilizo destroying para crear directamente en las variables 
            
            //DOM scripting
            //Genero en el html el nombre del servicio
            const nombreServicio = document.createElement('P') // Creo un elemento (en este caso un parrafo) que en JS siempre es mayusculas
            nombreServicio.textContent = nombre; // Le asigno un contenido a ese elemento
            nombreServicio.classList.add('nombre-servicio'); //creo una clase en el elemento 

            //Genero en el html el precio del servicio
            const precioServicio = document.createElement('P') 
            precioServicio.textContent = `$ ${precio}`; 
            precioServicio.classList.add('precio-servicio');

            //Genero en el html el precio del servicio
            const servicioDiv = document.createElement('DIV') // Creo un elemento DIV
            servicioDiv.classList.add('servicio'); // Le creo un clase servicio al div

            //Seleccionar servicio
            servicioDiv.onclick = seleccionarServicio;
            
            //Inyecto al div los elementos creados 
            servicioDiv.appendChild(nombreServicio); // Le agrego como HIJO del div el parrafo del nombre del servicio
            servicioDiv.appendChild(precioServicio); // Le agrego como HIJO del div el parrafo del precio del servicio

            //Inyecto en el HTML el div de servicios (que como ya tiene los hijos agrega todo)
            document.querySelector('#servicios').appendChild(servicioDiv); // QuerySelector solo devuelve un elemento (en este caso el id servicios)
                                                                            // Agrego en el mismo momento con el appendClild el div al html
        });

    } catch (error) {
        console.log(error);
    }
}

function seleccionarServicio(e) {
    let elemento;

    //Fuerzo que al hacer click siempre tome el div que es el padre de ambos parrafos
    if(e.target.tagName === 'P') { // aca pregunto si el nombre del elemnto es un P (Parrafo)
        elemento = e.target.parentElement; // Si entro me quedo con el padre que es el DIV
    } else {
        elemento = e.target; // Si llego aca me quedo con el DIV
    }

    // Agrego o quito una clase para el elemento al que hicieron click
    if(elemento.classList.contains('seleccionado')) {
        elemento.classList.remove('seleccionado');

        const id = parseInt(elemento.dataset.idServicio);
        eliminarServicio(id);
    } else {
        elemento.classList.add('seleccionado');

        const servicioObj = {
            id: parseInt(elemento.dataset.idServicio),
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextElementSibling.textContent
        }
        //console.log(servicioObj);
        agregarServicio(servicioObj);
    }
}

function agregarServicio(servicioObj) {
    const {servicios} = cita;
    cita.servicios = [...servicios, servicioObj];

}

function eliminarServicio(id) {
    const {servicios} = cita;
    cita.servicios = servicios.filter (servicio => servicios.id !== id);
}

// Paginacion
function paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', () => {
        pagina--;
        botonesPaginador();
    })
};
function paginaSiguiente() {
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', () => {
        pagina++;
        botonesPaginador();
    })
};

function botonesPaginador() {
    const paginacionSiguiente = document.querySelector('#siguiente');
    const paginacionAnterior = document.querySelector('#anterior');

    if(pagina === 1) {
        paginacionAnterior.classList.add('ocultar');
        paginacionSiguiente.classList.remove('ocultar');
    } else if(pagina === 3) {
        paginacionSiguiente.classList.add('ocultar');
        paginacionAnterior.classList.remove('ocultar');

        mostrarResumen();
    }
     else {
        paginacionAnterior.classList.remove('ocultar');
        paginacionSiguiente.classList.remove('ocultar');
    }

    mostrarSeccion();
};

function mostrarResumen() {
    // Destructuring
    const {nombre, fecha, hora, servicios} = cita;

    // Seleccionar el resumen
    const resumenDiv = document.querySelector('.contenido-resumen');

    // Limpiar el HTML previo
    while(resumenDiv.firstChild) {
        resumenDiv.removeChild(resumenDiv.firstChild);
    }

    //validacion del objeto
    if(Object.values(cita).includes('')) { //Con el Object.values puedo validar todo un objeto completo. en este caso el objeto cita
        // No es valido porque incluye valores vacios
        const noServicios = document.createElement('P');
        noServicios.textContent = 'Faltan datos de servicios, hora, fecha o nombre';
        noServicios.classList.add('invalidar-cita');

        //Agregar a resumen DIV
        resumenDiv.appendChild(noServicios);
        return;
    }

    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de Cita';

    // Mostrar resumen
    const nombreCita = document.createElement('P');
    nombreCita.innerHTML = `<span>Nombre:</span> ${nombre}`;

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fecha}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora}`;

    const servicioCita = document.createElement('DIV');
    servicioCita.classList.add('resumen-servicio');

    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de Servicios';
    servicioCita.appendChild(headingServicios);

    let totalServicioCita = 0;

    // Iterar sobre el arreglo de servicio
    servicios.forEach(servicio => {
        const {nombre, precio} = servicio;
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.textContent = precio;
        precioServicio.classList.add('precio');

        // Para calculo del total del servicio
        const totalServicio = precio.split('$');
        totalServicioCita+= parseInt(totalServicio[1].trim());

        //Agregar texto y precio 
        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        servicioCita.appendChild(contenedorServicio);
    })

    resumenDiv.appendChild(headingCita);
    resumenDiv.appendChild(nombreCita);
    resumenDiv.appendChild(fechaCita);
    resumenDiv.appendChild(horaCita);
    resumenDiv.appendChild(servicioCita);

    const cantidadPagar = document.createElement('P');
    cantidadPagar.classList.add('total');
    cantidadPagar.innerHTML = `<span>Total a Pagar:</span> $ ${totalServicioCita}`;
    resumenDiv.appendChild(cantidadPagar);
}

function nombreCita() {
    const nombreInput = document.querySelector('#nombre');

    nombreInput.addEventListener('input', e => {
        const nombreTexto = e.target.value.trim();

        //Validacion del nombre
        if(nombreTexto === '' || nombreTexto < 2) {
            mostrarAlerta('Nombre no valido','error')
        } else {
            const alerta = document.querySelector('.alerta');
            if(alerta) {
                alerta.remove();
            }
            cita.nombre = nombreTexto;
        }
    })
}

function mostrarAlerta(mensaje, tipo) {
    // Valido que no exista un alerta y si existe no la vuelvo a generar
    const alertaPrevia = document.querySelector('.alerta');
    if(alertaPrevia) {
        return;
    }

    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');

    if(tipo === 'error'){
        alerta.classList.add('error');
    }
    //Insertar en el formulario
    const formulario = document.querySelector('.formulario');
    formulario.appendChild(alerta);

    // Eliminar alerta despues de un periodo de tiempo
    setTimeout(() => {
        alerta.remove();
    }, 3000);
}

function fechaCita() {
    const fechaInput = document.querySelector('#fecha');
    fechaInput.addEventListener('input', e => {
        const dia = new Date(e.target.value).getUTCDay();
        if([0,6].includes(dia)) {
            e.preventDefault();
            fechaInput.value = '';
            mostrarAlerta('Fines de semana no son permitidos', 'error');
        } else {
            cita.fecha = fechaInput.value;
        }
    })
}

function deshabilitarFechaAnterior() {
    const inputFecha = document.querySelector('#fecha');

    const fechaAhora = new Date();
    const year = fechaAhora.getFullYear();
    const mes = fechaAhora.getMonth() + 1;
    const dia = fechaAhora.getDate() + 1;
    // Con las variables creadas armo el formato deseado
    const fechaDeshabilitar = `${year}-${mes}-${dia}`;

    inputFecha.min = fechaDeshabilitar;
}

function horaCita() {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', e => {
        const horaCita = e.target.value;
        const hora = horaCita.split(':'); //Crea un arreglo con el resultado de dividir el arreglo original por cada caracter que se busque

        if(hora[0] < 10 || hora[0] > 18) {
            mostrarAlerta('Hora no valida', 'error');
            setTimeout(() => {
                inputHora.value = '';
            }, 2000);
        } else {
            cita.hora = horaCita;
        }
    });
};