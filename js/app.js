/**
 * Archivo principal que inicializa la aplicación
 */
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar la calculadora
    const calculadora = new CalculadoraEnergia();
    
    // Inicializar la interfaz de usuario
    const interfaz = new InterfazUsuario(calculadora);
    
    // Mostrar mensaje de bienvenida
    console.log('Calculadora de Consumo de Energía inicializada correctamente');
    
    // Agregar algunos electrodomésticos de ejemplo si no hay ninguno
    if (calculadora.electrodomesticos.length === 0) {
        // Ejemplos comunes para que el usuario tenga una referencia
        const ejemplos = [
            {
                nombre: 'Refrigerador',
                categoria: 'cocina',
                potencia: 150,
                horasDiarias: 24,
                diasMensuales: 30,
                tarifa: 0.12
            },
            {
                nombre: 'Televisor LED 40"',
                categoria: 'entretenimiento',
                potencia: 100,
                horasDiarias: 4,
                diasMensuales: 30,
                tarifa: 0.12
            },
            {
                nombre: 'Bombilla LED',
                categoria: 'iluminacion',
                potencia: 9,
                horasDiarias: 5,
                diasMensuales: 30,
                tarifa: 0.12
            }
        ];
        
        // Agregar ejemplos
        ejemplos.forEach(ejemplo => calculadora.agregarElectrodomestico(ejemplo));
        
        // Actualizar la interfaz
        interfaz.actualizarInterfaz();
    }
});