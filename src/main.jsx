import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { calcularLiquidacion } from "./liquidacion.mjs";
import { reservas } from "./reservas.mjs";
import "./styles.css";

const moneda = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });
const fecha = new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "short", timeZone: "UTC" });
const filtros = [
  ["todas", "Todas"],
  ["confirmada", "Confirmadas"],
  ["cancelada", "Canceladas"],
];

function App() {
  const [filtro, setFiltro] = useState("todas");
  const [referencia, setReferencia] = useState("");
  const resumen = calcularLiquidacion(reservas);
  const visibles = reservas.filter((reserva) => filtro === "todas" || reserva.estado === filtro);
  const seleccionada = visibles.find((reserva) => reserva.referencia === referencia);

  return (
    <>
      <header className="cabecera">
        <div><span className="producto">Operaciones</span><h1>Consola de liquidación</h1></div>
        <span className="entorno">Lote de prueba · 16–17 nov</span>
      </header>
      <main>
        <section className="resumen" aria-label="Resumen del lote">
          <div className="importe"><span>Importe a liquidar</span><strong>{moneda.format(resumen.totalCentimos / 100)}</strong></div>
          <div><span>Reservas confirmadas</span><strong>{resumen.confirmadas}</strong></div>
          <div><span>Reservas en el lote</span><strong>{reservas.length}</strong></div>
        </section>
        <section className="lista" aria-labelledby="reservas">
          <div className="barra">
            <h2 id="reservas">Reservas del lote</h2>
            <div className="filtros" role="group" aria-label="Filtrar por estado">
              {filtros.map(([clave, etiqueta]) => (
                <button key={clave} aria-pressed={clave === filtro} onClick={() => setFiltro(clave)}>{etiqueta}</button>
              ))}
            </div>
          </div>
          <div className="tabla">
            <table>
              <thead><tr><th>Referencia</th><th>Cliente</th><th>Canal</th><th>Fecha</th><th>Estado</th><th>Importe</th></tr></thead>
              <tbody>
                {visibles.map((reserva) => (
                  <tr key={reserva.referencia}>
                    <th scope="row"><button className="enlace" aria-expanded={seleccionada === reserva}
                      onClick={() => setReferencia(seleccionada === reserva ? "" : reserva.referencia)}>{reserva.referencia}</button></th>
                    <td>{reserva.cliente}</td><td>{reserva.canal}</td><td>{fecha.format(new Date(reserva.fecha))}</td>
                    <td><span className={"estado " + reserva.estado}>{reserva.estado === "confirmada" ? "Confirmada" : "Cancelada"}</span></td>
                    <td>{moneda.format(reserva.importeCentimos / 100)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {seleccionada && (
            <aside aria-label="Detalle de la reserva" className="detalle">
              <strong>{seleccionada.referencia} · {seleccionada.cliente}</strong>
              <span>{seleccionada.canal} · {fecha.format(new Date(seleccionada.fecha))}</span>
              <p>{seleccionada.estado === "cancelada" ? "La reserva se conserva para consulta y aporta cero a la liquidación." : "La reserva está confirmada y debe incluirse en la liquidación."}</p>
            </aside>
          )}
        </section>
      </main>
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
