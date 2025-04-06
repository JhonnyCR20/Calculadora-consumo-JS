/**
 * Clase que representa un electrodoméstico con sus propiedades y métodos para calcular su consumo
 */
class Electrodomestico {
    /**
     * Constructor de la clase Electrodomestico
     * @param {string} id - Identificador único del electrodoméstico
     * @param {string} nombre - Nombre del electrodoméstico
     * @param {string} categoria - Categoría a la que pertenece (iluminacion, cocina, entretenimiento, etc)
     * @param {number} potencia - Potencia en vatios (W)
     * @param {number} horasDiarias - Horas de uso al día
     * @param {number} diasMensuales - Días de uso al mes
     * @param {number} tarifa - Tarifa eléctrica en $/kWh
     */
    constructor(id, nombre, categoria, potencia, horasDiarias, diasMensuales, tarifa) {
        this.id = id;
        this.nombre = nombre;
        this.categoria = categoria;
        this.potencia = potencia;
        this.horasDiarias = horasDiarias;
        this.diasMensuales = diasMensuales;
        this.tarifa = tarifa;
    }

    /**
     * Calcula el consumo mensual en kilovatios-hora (kWh)
     * @returns {number} Consumo mensual en kWh
     */
    calcularConsumoMensual() {
        // Fórmula: (potencia * horas * días) / 1000
        return (this.potencia * this.horasDiarias * this.diasMensuales) / 1000;
    }

    /**
     * Calcula el costo mensual en base al consumo y la tarifa
     * @returns {number} Costo mensual en la moneda correspondiente
     */
    calcularCostoMensual() {
        return this.calcularConsumoMensual() * this.tarifa;
    }

    /**
     * Actualiza las propiedades del electrodoméstico
     * @param {Object} nuevosDatos - Objeto con las propiedades a actualizar
     */
    actualizar(nuevosDatos) {
        this.nombre = nuevosDatos.nombre || this.nombre;
        this.categoria = nuevosDatos.categoria || this.categoria;
        this.potencia = nuevosDatos.potencia || this.potencia;
        this.horasDiarias = nuevosDatos.horasDiarias || this.horasDiarias;
        this.diasMensuales = nuevosDatos.diasMensuales || this.diasMensuales;
        this.tarifa = nuevosDatos.tarifa || this.tarifa;
    }

    /**
     * Devuelve una representación en formato objeto del electrodoméstico
     * @returns {Object} Objeto con las propiedades del electrodoméstico
     */
    toObject() {
        return {
            id: this.id,
            nombre: this.nombre,
            categoria: this.categoria,
            potencia: this.potencia,
            horasDiarias: this.horasDiarias,
            diasMensuales: this.diasMensuales,
            tarifa: this.tarifa,
            consumoMensual: this.calcularConsumoMensual(),
            costoMensual: this.calcularCostoMensual()
        };
    }
}