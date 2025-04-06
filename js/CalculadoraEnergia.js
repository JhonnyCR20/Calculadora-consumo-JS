/**
 * Clase principal que gestiona la calculadora de energía
 */
class CalculadoraEnergia {
    /**
     * Constructor de la clase CalculadoraEnergia
     */
    constructor() {
        this.electrodomesticos = [];
        this.cargarDatos();
    }

    /**
     * Genera un ID único para un nuevo electrodoméstico
     * @returns {string} ID único
     */
    generarId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }

    /**
     * Agrega un nuevo electrodoméstico a la calculadora
     * @param {Object} datos - Datos del electrodoméstico
     * @returns {Electrodomestico} El electrodoméstico creado
     */
    agregarElectrodomestico(datos) {
        const id = this.generarId();
        const electrodomestico = new Electrodomestico(
            id,
            datos.nombre,
            datos.categoria,
            datos.potencia,
            datos.horasDiarias,
            datos.diasMensuales,
            datos.tarifa
        );
        
        this.electrodomesticos.push(electrodomestico);
        this.guardarDatos();
        return electrodomestico;
    }

    /**
     * Elimina un electrodoméstico de la calculadora
     * @param {string} id - ID del electrodoméstico a eliminar
     * @returns {boolean} true si se eliminó correctamente, false en caso contrario
     */
    eliminarElectrodomestico(id) {
        const indice = this.electrodomesticos.findIndex(e => e.id === id);
        if (indice !== -1) {
            this.electrodomesticos.splice(indice, 1);
            this.guardarDatos();
            return true;
        }
        return false;
    }

    /**
     * Actualiza un electrodoméstico existente
     * @param {string} id - ID del electrodoméstico a actualizar
     * @param {Object} nuevosDatos - Nuevos datos del electrodoméstico
     * @returns {Electrodomestico|null} El electrodoméstico actualizado o null si no existe
     */
    actualizarElectrodomestico(id, nuevosDatos) {
        const electrodomestico = this.buscarElectrodomestico(id);
        if (electrodomestico) {
            electrodomestico.actualizar(nuevosDatos);
            this.guardarDatos();
            return electrodomestico;
        }
        return null;
    }

    /**
     * Busca un electrodoméstico por su ID
     * @param {string} id - ID del electrodoméstico a buscar
     * @returns {Electrodomestico|null} El electrodoméstico encontrado o null si no existe
     */
    buscarElectrodomestico(id) {
        return this.electrodomesticos.find(e => e.id === id) || null;
    }

    /**
     * Calcula el consumo total de todos los electrodomésticos
     * @returns {number} Consumo total en kWh
     */
    calcularConsumoTotal() {
        return this.electrodomesticos.reduce((total, e) => total + e.calcularConsumoMensual(), 0);
    }

    /**
     * Calcula el costo total de todos los electrodomésticos
     * @returns {number} Costo total
     */
    calcularCostoTotal() {
        return this.electrodomesticos.reduce((total, e) => total + e.calcularCostoMensual(), 0);
    }

    /**
     * Calcula el consumo por categoría
     * @returns {Object} Objeto con el consumo por categoría
     */
    calcularConsumoPorCategoria() {
        const consumoPorCategoria = {};
        
        // Inicializar todas las categorías con valor 0
        Categoria.obtenerCategorias().forEach(categoria => {
            consumoPorCategoria[categoria.id] = 0;
        });
        
        // Sumar el consumo de cada electrodoméstico a su categoría
        this.electrodomesticos.forEach(e => {
            consumoPorCategoria[e.categoria] += e.calcularConsumoMensual();
        });
        
        return consumoPorCategoria;
    }

    /**
     * Obtiene los datos para el gráfico de consumo por categoría
     * @returns {Object} Datos para el gráfico
     */
    obtenerDatosGrafico() {
        const consumoPorCategoria = this.calcularConsumoPorCategoria();
        const categorias = Categoria.obtenerCategorias();
        
        const datos = [];
        const etiquetas = [];
        const colores = [];
        
        categorias.forEach(categoria => {
            const consumo = consumoPorCategoria[categoria.id];
            if (consumo > 0) {
                datos.push(consumo);
                etiquetas.push(categoria.nombre);
                colores.push(categoria.color);
            }
        });
        
        return {
            datos,
            etiquetas,
            colores
        };
    }

    /**
     * Guarda los datos de los electrodomésticos en el almacenamiento local
     */
    guardarDatos() {
        const datos = this.electrodomesticos.map(e => e.toObject());
        localStorage.setItem('electrodomesticos', JSON.stringify(datos));
    }

    /**
     * Carga los datos de los electrodomésticos desde el almacenamiento local
     */
    cargarDatos() {
        try {
            const datosGuardados = localStorage.getItem('electrodomesticos');
            if (datosGuardados) {
                const datos = JSON.parse(datosGuardados);
                this.electrodomesticos = datos.map(d => {
                    return new Electrodomestico(
                        d.id,
                        d.nombre,
                        d.categoria,
                        d.potencia,
                        d.horasDiarias,
                        d.diasMensuales,
                        d.tarifa
                    );
                });
            }
        } catch (error) {
            console.error('Error al cargar datos:', error);
            this.electrodomesticos = [];
        }
    }
}