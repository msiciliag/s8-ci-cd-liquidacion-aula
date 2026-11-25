export function calcularLiquidacion(reservas) {
  const liquidadas = reservas.filter((reserva) => reserva.estado === "confirmada");
  return {
    confirmadas: liquidadas.length,
    totalCentimos: liquidadas.reduce((total, reserva) => total + reserva.importeCentimos, 0),
  };
}
