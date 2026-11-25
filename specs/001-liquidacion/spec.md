# Especificación · Liquidar un lote de reservas

## Motivo

El equipo de Operaciones recibe un lote diario de reservas. Usa una aplicación de escritorio para revisar el estado de cada reserva y calcular el importe que toca liquidar. Las cancelaciones se conservan en la lista para poder explicar las diferencias con la fuente.

## Comportamiento

- **LQ-01.** La app debe mostrar el lote, sus estados y sus importes. La lista se puede limitar por estado. Ese filtro solo afecta a las filas visibles.
- **LQ-02.** El total del lote debe incluir el importe en céntimos de todas las confirmadas. Una cancelación aporta cero. El recuento de confirmadas se calcula sobre el lote completo.
- **LQ-03.** Un lote sin confirmadas debe mostrar 0 confirmadas y 0,00 € a liquidar.
- **LQ-04.** Para el lote de ensayo, dos confirmadas de 129,95 € y 80,00 € y una cancelada de 80,00 € producen 209,95 € y 2 confirmadas.

## Alcance de la siguiente revisión

La función `calcularLiquidacion(reservas)` recibe importes en céntimos. El ejemplo trabaja en euros y ya entrega los estados normalizados. El trabajo no cambia la fuente, la lista, el filtro, las dependencias ni la interfaz de la función. Usa la prueba de regresión para preservar el comportamiento.

## Evidencia

Los tests de humo confirman que el programa construye un resumen. Los casos LQ-02 a LQ-04 necesitan pruebas con valores esperados. Comprueba después la cifra en la interfaz con todo el lote en pantalla y repite al filtrar por canceladas.
