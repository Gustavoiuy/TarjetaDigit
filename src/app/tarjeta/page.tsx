'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { QRCodeCanvas } from "qrcode.react"; // Generar código QR

const Tarjeta = () => {
  const [cliente, setCliente] = useState<any | null>(null);
  const router = useRouter();

  // Recuperar los datos del cliente desde el localStorage
  useEffect(() => {
    const storedCliente = sessionStorage.getItem("cliente");
    if (storedCliente) {
      setCliente(JSON.parse(storedCliente));
    } else {
      router.push("/"); // Redirigir al formulario si no hay datos de cliente
    }
  }, [router]);

  // Si no hay cliente, mostrar una carga o mensaje
  if (!cliente) return <div>Cargando...</div>;

  return (
    <div
      className="max-w-sm mx-auto p-4 rounded-lg shadow-xl w-full bg-gradient-to-r from-red-500 via-blue-600 to-indigo-900"
      style={{ width: "550px", height: "600px", borderRadius: "12px", boxShadow: "0px 4px 12px rgba(0,0,0,0.1)" }}
    >
      {/* Logo del negocio */}
      <div className="text-center mb-4">
        <img
          src="../logo-restaurante.jpeg"
          alt="Logo Restaurante"
          className="w-20 h-20 mx-auto rounded-full border-4 border-white shadow-lg"
        />
      </div>

      {/* Título de la tarjeta */}
      <h2 className="text-2xl font-bold mb-2 text-center text-white drop-shadow-lg">
        Tarjeta Digital de Lealtad
      </h2>

      {/* Información del cliente */}
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-white">{cliente.nombre}</h3>
      </div>

      {/* Descuentos disponibles */}
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-white drop-shadow-lg">
          Descuentos Disponibles
        </h3>
        <ul className="list-none space-y-2 text-white">
          <li>5% en tu próxima visita</li>
          <li>10% en tu próxima visita</li>
          <li>15% en tu próxima visita</li>
        </ul>
      </div>

      {/* Código QR */}
      <div className="flex justify-center mb-4 bg-white p-2 rounded-lg">
        <QRCodeCanvas value={cliente.codigo} size={120} />
      </div>
    </div>
  );
};

export default Tarjeta;
