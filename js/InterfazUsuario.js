/**
 * Clase que maneja la interfaz de usuario y la interacción con el DOM
 */
class InterfazUsuario {
    /**
     * Constructor de la clase InterfazUsuario
     * @param {CalculadoraEnergia} calculadora - Instancia de la calculadora de energía
     */
    constructor(calculadora) {
        this.calculadora = calculadora;
        this.grafico = null;
        this.inicializarEventos();
        this.inicializarModoOscuro();
        this.actualizarInterfaz();
    }

    /**
     * Inicializa todos los eventos de la interfaz
     */
    inicializarEventos() {
        // Formulario para agregar electrodomésticos
        const formulario = document.getElementById('electrodomesticoForm');
        formulario.addEventListener('submit', this.manejarSubmitFormulario.bind(this));

        // Switch de modo oscuro
        const modoOscuroSwitch = document.getElementById('modoOscuroSwitch');
        modoOscuroSwitch.addEventListener('change', this.cambiarModoOscuro.bind(this));

        // Delegación de eventos para botones de eliminar y editar
        const listaElectrodomesticos = document.getElementById('listaElectrodomesticos');
        listaElectrodomesticos.addEventListener('click', (e) => {
            const boton = e.target.closest('.btn');
            if (!boton) return;

            const id = boton.dataset.id;
            if (boton.classList.contains('btn-danger')) {
                this.eliminarElectrodomestico(id);
            } else if (boton.classList.contains('btn-warning')) {
                this.cargarElectrodomesticoParaEditar(id);
            }
        });
    }

    /**
     * Inicializa el modo oscuro según la preferencia guardada
     */
    inicializarModoOscuro() {
        const modoOscuroGuardado = localStorage.getItem('modoOscuro') === 'true';
        const modoOscuroSwitch = document.getElementById('modoOscuroSwitch');
        
        modoOscuroSwitch.checked = modoOscuroGuardado;
        this.aplicarModoOscuro(modoOscuroGuardado);
    }

    /**
     * Cambia entre modo oscuro y claro
     * @param {Event} evento - Evento del switch
     */
    cambiarModoOscuro(evento) {
        const modoOscuro = evento.target.checked;
        this.aplicarModoOscuro(modoOscuro);
        localStorage.setItem('modoOscuro', modoOscuro);
    }

    /**
     * Aplica el modo oscuro o claro al documento
     * @param {boolean} modoOscuro - true para modo oscuro, false para modo claro
     */
    aplicarModoOscuro(modoOscuro) {
        document.body.setAttribute('data-bs-theme', modoOscuro ? 'dark' : 'light');
        
        // Cambiar el icono y texto del switch
        const label = document.querySelector('label[for="modoOscuroSwitch"]');
        if (modoOscuro) {
            label.innerHTML = '<i class="fas fa-sun"></i> Modo Claro';
        } else {
            label.innerHTML = '<i class="fas fa-moon"></i> Modo Oscuro';
        }
    }

    /**
     * Maneja el envío del formulario para agregar o actualizar un electrodoméstico
     * @param {Event} evento - Evento del formulario
     */
    manejarSubmitFormulario(evento) {
        evento.preventDefault();
        
        const formulario = evento.target;
        const datos = {
            nombre: document.getElementById('nombre').value,
            categoria: document.getElementById('categoria').value,
            potencia: parseFloat(document.getElementById('potencia').value),
            horasDiarias: parseFloat(document.getElementById('horas').value),
            diasMensuales: parseInt(document.getElementById('dias').value),
            tarifa: parseFloat(document.getElementById('tarifa').value)
        };
        
        const idEdicion = formulario.dataset.idEdicion;
        
        if (idEdicion) {
            // Actualizar electrodoméstico existente
            this.calculadora.actualizarElectrodomestico(idEdicion, datos);
            formulario.removeAttribute('data-id-edicion');
            formulario.querySelector('button[type="submit"]').textContent = 'Agregar';
        } else {
            // Agregar nuevo electrodoméstico
            this.calculadora.agregarElectrodomestico(datos);
        }
        
        formulario.reset();
        this.actualizarInterfaz();
    }

    /**
     * Carga los datos de un electrodoméstico en el formulario para editar
     * @param {string} id - ID del electrodoméstico a editar
     */
    cargarElectrodomesticoParaEditar(id) {
        const electrodomestico = this.calculadora.buscarElectrodomestico(id);
        if (!electrodomestico) return;
        
        document.getElementById('nombre').value = electrodomestico.nombre;
        document.getElementById('categoria').value = electrodomestico.categoria;
        document.getElementById('potencia').value = electrodomestico.potencia;
        document.getElementById('horas').value = electrodomestico.horasDiarias;
        document.getElementById('dias').value = electrodomestico.diasMensuales;
        document.getElementById('tarifa').value = electrodomestico.tarifa;
        
        const formulario = document.getElementById('electrodomesticoForm');
        formulario.dataset.idEdicion = id;
        formulario.querySelector('button[type="submit"]').textContent = 'Actualizar';
    }

    /**
     * Elimina un electrodoméstico
     * @param {string} id - ID del electrodoméstico a eliminar
     */
    eliminarElectrodomestico(id) {
        if (confirm('¿Estás seguro de que deseas eliminar este electrodoméstico?')) {
            this.calculadora.eliminarElectrodomestico(id);
            this.actualizarInterfaz();
        }
    }

    /**
     * Actualiza toda la interfaz con los datos actuales
     */
    actualizarInterfaz() {
        this.actualizarListaElectrodomesticos();
        this.actualizarResumenConsumo();
        this.actualizarGrafico();
    }

    /**
     * Actualiza la lista de electrodomésticos en la tabla
     */
    actualizarListaElectrodomesticos() {
        const listaEl = document.getElementById('listaElectrodomesticos');
        const mensajeVacio = document.getElementById('mensajeVacio');
        
        // Limpiar lista actual
        listaEl.innerHTML = '';
        
        if (this.calculadora.electrodomesticos.length === 0) {
            mensajeVacio.style.display = 'block';
            return;
        }
        
        mensajeVacio.style.display = 'none';
        
        // Agregar cada electrodoméstico a la tabla
        this.calculadora.electrodomesticos.forEach(e => {
            const consumo = e.calcularConsumoMensual().toFixed(2);
            const costo = e.calcularCostoMensual().toFixed(2);
            const categoria = Categoria.buscarPorId(e.categoria);
            
            const fila = document.createElement('tr');
            fila.classList.add(`categoria-${e.categoria}`);
            
            fila.innerHTML = `
                <td>${e.nombre}</td>
                <td><i class="fas ${categoria ? categoria.icono : 'fa-plug'}"></i> ${categoria ? categoria.nombre : e.categoria}</td>
                <td>${e.potencia}</td>
                <td>${e.horasDiarias}</td>
                <td>${consumo}</td>
                <td>$${costo}</td>
                <td>
                    <button class="btn btn-warning btn-sm btn-accion" data-id="${e.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm btn-accion" data-id="${e.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            
            listaEl.appendChild(fila);
        });
    }

    /**
     * Actualiza el resumen de consumo y costo
     */
    actualizarResumenConsumo() {
        const consumoTotal = this.calculadora.calcularConsumoTotal().toFixed(2);
        const costoTotal = this.calculadora.calcularCostoTotal().toFixed(2);
        
        document.getElementById('consumoTotal').textContent = `${consumoTotal} kWh`;
        document.getElementById('costoTotal').textContent = `$${costoTotal}`;
    }

    /**
     * Actualiza o crea el gráfico de consumo por categoría
     */
    actualizarGrafico() {
        const datosGrafico = this.calculadora.obtenerDatosGrafico();
        const ctx = document.getElementById('graficoCategoria').getContext('2d');
        
        // Destruir gráfico anterior si existe
        if (this.grafico) {
            this.grafico.destroy();
        }
        
        // Si no hay datos, no crear gráfico
        if (datosGrafico.datos.length === 0) {
            return;
        }
        
        // Crear nuevo gráfico
        this.grafico = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: datosGrafico.etiquetas,
                datasets: [{
                    data: datosGrafico.datos,
                    backgroundColor: datosGrafico.colores,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw.toFixed(2) || 0;
                                const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${value} kWh (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
}