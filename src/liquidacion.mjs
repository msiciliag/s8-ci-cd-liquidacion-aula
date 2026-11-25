export function calcularLiquidacion(reservas) {
  return {
    confirmadas: reservas.filter((reserva) => reserva.estado === "confirmada").length,
    totalCentimos: reservas.reduce((total, reserva) => total + reserva.importeCentimos, 0),
  };
}
