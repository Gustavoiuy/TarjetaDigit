"use client";
import { useState, useEffect } from "react";
import JsBarcode from "jsbarcode";

export default function Tarjeta({ params }: { params: { codigo: string } }) {
  const [tarjeta, setTarjeta] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/tarjeta/${params.codigo}`)
      .then((res) => res.json())
      .then(setTarjeta);
  }, []);

  useEffect(() => {
    if (tarjeta) {
      JsBarcode("#barcode", tarjeta.codigo, { format: "CODE128" });
    }
  }, [tarjeta]);

  return tarjeta ? (
    <div className="p-4">
      <h1 className="text-xl font-bold">{tarjeta.cliente.nombre}</h1>
      <svg id="barcode"></svg>
      <ul>
        {tarjeta.descuentos.map((d: string, i: number) => (
          <li key={i}>{d}</li>
        ))}
      </ul>
    </div>
  ) : (
    <p>Cargando...</p>
  );
}
