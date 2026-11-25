import assert from "node:assert/strict";
import { test } from "node:test";
import { calcularLiquidacion } from "../src/liquidacion.mjs";
import { reservas } from "../src/reservas.mjs";

test("el resumen ofrece un importe y un recuento", () => {
  const resumen = calcularLiquidacion(reservas);
  assert.equal(typeof resumen.totalCentimos, "number");
  assert.equal(typeof resumen.confirmadas, "number");
});
