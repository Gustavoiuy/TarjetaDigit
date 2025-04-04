'use client';
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toPng } from "html-to-image";  
import { QRCodeCanvas } from "qrcode.react"; 

const schema = z.object({
  nombre: z.string().min(3, "El nombre es obligatorio"),
  email: z.string().email("Correo inválido"),
  telefono: z.string().min(10, "Número inválido"),
  direccion: z.string().min(5, "Dirección inválida"),
});

export default function Formulario() {
  const [cliente, setCliente] = useState<any | null>(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (cliente) {
      // Ocultar la tarjeta después de 1 minuto
      const timer = setTimeout(() => {
        setCliente(null);
      }, 900000); 

      return () => clearTimeout(timer);
    }
  }, [cliente]);

  const onSubmit = async (data: any) => {
    const codigo = `${Math.floor(Math.random() * 1000000000)}`;
    const newCliente = { ...data, codigo };
    setCliente(newCliente);
    reset();
    postDatos(newCliente);
  };

  const postDatos = async (data: any) => {
    const res = await fetch("/api/registrar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const { cliente } = await res.json();
      setCliente(cliente);
    } else {
      console.error("Error al registrar al cliente");
    }
  };

  const downloadImage = () => {
    const node = document.getElementById("tarjeta");
    if (node) {
      toPng(node).then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "tarjeta-lealtad.png";
        link.href = dataUrl;
        link.click();
      }).catch((error) => {
        console.error("Error al generar la imagen:", error);
      });
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      {!cliente ? (
        <div>
          <h1 className="text-xl font-bold mb-4">Registro de Cliente</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <input {...register("nombre")} placeholder="Nombre" className="border p-2 w-full" />
            {errors.nombre && <p className="text-red-500">{errors.nombre.message}</p>}

            <input {...register("email")} placeholder="Correo" className="border p-2 w-full" />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}

            <input {...register("telefono")} placeholder="Teléfono" className="border p-2 w-full" />
            {errors.telefono && <p className="text-red-500">{errors.telefono.message}</p>}

            <input {...register("direccion")} placeholder="Dirección" className="border p-2 w-full" />
            {errors.direccion && <p className="text-red-500">{errors.direccion.message}</p>}

            <button type="submit" className="bg-blue-500 text-white px-4 py-2 w-full">Generar Tarjeta</button>
          </form>
        </div>
      ) : (
        <div
          id="tarjeta"
          className="max-w-sm mx-auto p-4 rounded-lg shadow-xl w-full bg-gradient-to-r from-red-500 via-blue-600 to-indigo-900"
          style={{ width: "550px", height: "600px", borderRadius: "12px", boxShadow: "0px 4px 12px rgba(0,0,0,0.1)" }}
        >
          <div className="text-center mb-4">
            <img
              src="../logo-restaurante.jpeg"
              alt="Logo Restaurante"
              className="w-20 h-20 mx-auto rounded-full border-4 border-white shadow-lg"
            />
          </div>

          <h2 className="text-2xl font-bold mb-2 text-center text-white drop-shadow-lg">
            Tarjeta Digital de Lealtad
          </h2>

          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-white">{cliente?.nombre}</h3>
          </div>

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

          <div className="flex justify-center mb-4 bg-white p-2 rounded-lg">
            <QRCodeCanvas value={cliente?.codigo} size={120} />
          </div>

          <div className="text-center mt-4">
            <button
              onClick={downloadImage}
              className="bg-green-500 text-white px-6 py-2 rounded-md shadow-lg hover:bg-green-600"
            >
              Descargar Tarjeta
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
