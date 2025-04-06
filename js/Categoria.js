/**
 * Clase que representa una categoría de electrodomésticos
 */
class Categoria {
    /**
     * Constructor de la clase Categoria
     * @param {string} id - Identificador único de la categoría
     * @param {string} nombre - Nombre de la categoría
     * @param {string} color - Color asociado a la categoría (para gráficos)
     * @param {string} icono - Clase del icono de Font Awesome
     */
    constructor(id, nombre, color, icono) {
        this.id = id;
        this.nombre = nombre;
        this.color = color;
        this.icono = icono;
    }

    /**
     * Obtiene todas las categorías predefinidas
     * @returns {Array} Array de objetos Categoria
     */
    static obtenerCategorias() {
        return [
            new Categoria('iluminacion', 'Iluminación', 'rgba(255, 193, 7, 0.8)', 'fa-lightbulb'),
            new Categoria('cocina', 'Cocina', 'rgba(220, 53, 69, 0.8)', 'fa-utensils'),
            new Categoria('entretenimiento', 'Entretenimiento', 'rgba(13, 110, 253, 0.8)', 'fa-tv'),
            new Categoria('climatizacion', 'Climatización', 'rgba(25, 135, 84, 0.8)', 'fa-temperature-high'),
            new Categoria('otros', 'Otros', 'rgba(108, 117, 125, 0.8)', 'fa-plug')
        ];
    }

    /**
     * Busca una categoría por su ID
     * @param {string} id - ID de la categoría a buscar
     * @returns {Categoria|null} La categoría encontrada o null si no existe
     */
    static buscarPorId(id) {
        const categorias = this.obtenerCategorias();
        return categorias.find(categoria => categoria.id === id) || null;
    }

    /**
     * Obtiene los colores de todas las categorías para usar en gráficos
     * @returns {Array} Array de colores
     */
    static obtenerColores() {
        return this.obtenerCategorias().map(categoria => categoria.color);
    }

    /**
     * Obtiene los nombres de todas las categorías
     * @returns {Array} Array de nombres
     */
    static obtenerNombres() {
        return this.obtenerCategorias().map(categoria => categoria.nombre);
    }
}