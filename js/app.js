// DOMContentLoaded se ejecuta una vez cargado todo el HTML
document.addEventListener('DOMContentLoaded', function () {
    // Seleccionar los elementos de la interfaz, en este caso los inputs
    const inputEmail = document.querySelector('#email');
    const inputAsunto = document.querySelector('#asunto');
    const inputMensaje = document.querySelector('#mensaje');
    const formulario = document.querySelector('#formulario');

    // Variable no obligaria para extraer el valor
    const inputCc = document.querySelector('#cc');
    const btnSubmit = document.querySelector(
        '#formulario button[type="submit"]'
    );
    const btnReset = document.querySelector('#formulario button[type="reset"]');
    const spinner = document.querySelector('#spinner');

    const email = {
        email: '',
        asunto: '',
        mensaje: '',
    };
    console.log(email);
    // Cuando se coloca solo validar, se manda a llamar hasta que se le de clic
    // en cambio si se pone validar() se manda a llamar de inmediato
    // input proporiona una experencia más real
    inputEmail.addEventListener('input', validar);
    inputAsunto.addEventListener('input', validar);
    inputMensaje.addEventListener('input', validar);
    inputCc.addEventListener('input', nuevoElemento);

    function nuevoElemento(e) {
        // Verifica si existe un email
        if (e.target.value !== '') {
            email.cc;
            // El email no cumple el formato
            if (!validarEmail(e.target.value)) {
                mostrarAlerta(
                    'El email no es válido para Cc',
                    e.target.parentElement
                );
                email[e.target.name] = '';
                comprobarEmail();
                return;
            }
            limpiarAlerta(e.target.parentElement);
            email[e.target.name] = inputCc.value.trim().toLowerCase();
            console.log(email);
            // // Comprobar el objeto de email
            comprobarEmail();
        } else {
            limpiarAlerta(e.target.parentElement);
            delete email.cc;
            comprobarEmail();
        }
    }
    formulario.addEventListener('submit', enviarEmail);
    btnReset.addEventListener('click', function (e) {
        // Previene la acción por default del elemento, en este caso del boton reset
        e.preventDefault();
        resetFormulario();
    });

    // Validar que los campos no estén vacios
    function validar(e) {
        // Si el campo está vacío muestra una alerta
        if (e.target.value.trim() === '') {
            // La alerta se muestra en el campo que esté vacío a traves de e.target
            mostrarAlerta(
                `El campo ${e.target.id} es obligatorio`,
                e.target.parentElement
            );

            // Esta linea controla si el botón se habilita o no
            email[e.target.name] = '';
        }
        // Esta alerta es para cuando no se cumple el formato de Email
        // e.target.id === email -> true, entonces validarEmail = false -> ! -> true
        if (e.target.id === 'email' && !validarEmail(e.target.value)) {
            mostrarAlerta('El email no es válido', e.target.parentElement);
            email[e.target.name] = '';
            comprobarEmail();
            return;
        }
        limpiarAlerta(e.target.parentElement);
        // *Esta linea funciona porque los campos anteriores fueron correctos
        // *name, es el atributo de HTML
        // *email[email], email[asunto], email[mensaje] -> Esto permite que sea dinámico
        email[e.target.name] = e.target.value.trim().toLowerCase();

        // Comprobar el objeto de email
        comprobarEmail();
    }

    function comprobarEmail() {
        // Verificar que todos los campos del formulario estén llenos
        if (Object.values(email).includes('')) {
            btnSubmit.classList.add('opacity-50');
            btnSubmit.disabled = true;
            return;
        }
        btnSubmit.classList.remove('opacity-50');
        btnSubmit.disabled = false;
    }
    function limpiarAlerta(referencia) {
        // Comprueba si ya existe una alerta
        // referencia.querySelector, puede usarse para acortar y que no revise en todo el documento
        const alerta = referencia.querySelector('.bg-red-600'); // Selecciona todo el documento y verifica si existe la clase, si es el caso quita las alertas subsecuentes
        if (alerta) {
            alerta.remove();
        }
    }
    // Muestra la alerta si no se ha escrito en el campo
    // referencia representa el traversing de DOM
    function mostrarAlerta(mensaje, referencia) {
        limpiarAlerta(referencia);

        // Generar alerta en HTML
        // Hacerlo de esta manera previene los ataques CSRF que cuando se usa
        // innerHTML
        const error = document.createElement('p');
        error.textContent = mensaje;

        error.classList.add('bg-red-600', 'text-white', 'p-2', 'text-center'); // Esta es una clase de tw css
        // Inyectar el error al formulario
        referencia.appendChild(error);
    }

    function validarEmail(email) {
        const regex = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
        const resultado = regex.test(email);
        return resultado;
    }

    function enviarEmail(e) {
        e.preventDefault();
        spinner.classList.add('flex');
        spinner.classList.remove('hidden');

        // Funciona como un temportizador
        setTimeout(() => {
            spinner.classList.remove('flex');
            spinner.classList.add('hidden');
            resetFormulario();
            // Crear una alerta
            const alertaExito = document.createElement('p');
            alertaExito.classList.add(
                'bg-green-500',
                'text-white',
                'p-2',
                'text-center',
                'rounded-lg',
                'mt-10',
                'font-bold',
                'text-sm',
                'uppercase'
            );
            alertaExito.textContent = 'Mensaje enviado correctamente';
            formulario.appendChild(alertaExito);
            setTimeout(() => {
                alertaExito.remove();
            }, 3000);
        }, 3000);
    }

    function resetFormulario() {
        // reiniciar el objeto
        email.email = '';
        email.asunto = '';
        email.mensaje = '';
        email.cc = '';

        formulario.reset();
        comprobarEmail();
    }
});
