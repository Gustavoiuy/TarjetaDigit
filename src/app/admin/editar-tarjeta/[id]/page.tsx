'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Tarjeta {
  id: string;
  nombre: string;
  descuentos: number;
  codigoBarras: string;
}

export default function EditarTarjeta() {
  const { id } = useParams(); // Obtener el ID desde la URL
  const router = useRouter();
  const [tarjeta, setTarjeta] = useState<Tarjeta | null>(null);
  const [descuentos, setDescuentos] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTarjeta = async () => {
      try {
        const response = await fetch(`/api/tarjetas/${id}`);
        if (!response.ok) throw new Error('Tarjeta no encontrada');

        const data: Tarjeta = await response.json();
        setTarjeta(data);
        setDescuentos(data.descuentos);
      } catch (err) {
        setError("No se pudo cargar la tarjeta.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTarjeta();
    }
  }, [id]);

  const handleGuardar = async () => {
    try {
      const response = await fetch(`/api/tarjetas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descuentos }),
      });

      if (!response.ok) throw new Error('Error al guardar los cambios');

      alert("Descuentos actualizados correctamente.");
      router.push('/'); // Volver a la página principal
    } catch (err) {
      setError("No se pudo guardar los cambios.");
    }
  };

  if (loading) return <p className="text-center">Cargando...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-2xl font-bold mb-4">Editar Tarjeta</h2>
      
      <div className="bg-gray-100 p-4 rounded-md shadow-md w-80 text-center">
        <h3 className="text-lg font-semibold">{tarjeta?.nombre}</h3>
        <p className="text-gray-600">Código de Barras: {tarjeta?.codigoBarras}</p>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Descuentos</label>
          <input
            type="number"
            className="mt-1 p-2 border rounded-md w-full"
            value={descuentos}
            onChange={(e) => setDescuentos(parseInt(e.target.value))}
          />
        </div>

        <button
          onClick={handleGuardar}
          className="bg-blue-500 text-white px-4 py-2 mt-4 rounded-md hover:bg-blue-600"
        >
          Guardar Cambios
        </button>
      </div>
    </div>
  );
}
