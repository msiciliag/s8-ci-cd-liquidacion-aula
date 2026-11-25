import assert from "node:assert/strict";
import { test } from "node:test";
import { calcularLiquidacion } from "../src/liquidacion.mjs";
import { reservas } from "../src/reservas.mjs";

test("LQ-04: liquida solo las confirmadas del lote mixto", () => {
  assert.deepEqual(calcularLiquidacion(reservas), { confirmadas: 2, totalCentimos: 20995 });
});
test("LQ-03: las canceladas no suman aunque tengan importe", () => {
  const canceladas = reservas.filter((reserva) => reserva.estado === "cancelada");
  assert.deepEqual(calcularLiquidacion(canceladas), { confirmadas: 0, totalCentimos: 0 });
});
test("LQ-03: un lote vacío tiene recuento e importe cero", () => {
  assert.deepEqual(calcularLiquidacion([]), { confirmadas: 0, totalCentimos: 0 });
});
