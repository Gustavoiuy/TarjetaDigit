'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditarTarjeta() {
  const { id } = useParams(); // Obtener el ID desde la URL
  const router = useRouter();
  
  const [tarjeta, setTarjeta] = useState({
    descuento: '', // Asegúrate de que sea un string aquí
    codigo: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Obtener datos de la tarjeta
  useEffect(() => {
    const fetchTarjeta = async () => {
      try {
        const response = await fetch(`/api/tarjetas/${id}`);
        if (!response.ok) throw new Error('No se encontró la tarjeta');

        const data = await response.json();
        setTarjeta(data);
        console.log("datos de bd",data);
      } catch (err) {
        setError("Error al cargar la tarjeta.");
      } finally {
        setLoading(false);
      }
    };

    fetchTarjeta();
  }, [id]);

  // Manejo del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Verifica que el campo 'name' sea igual a las propiedades en el estado
    setTarjeta({ ...tarjeta, [e.target.name]: e.target.value });
  
  };

  // Guardar cambios
  const handleSubmit = async (e: React.FormEvent) => {
    console.log("put",tarjeta);
    e.preventDefault();

    try {
      const response = await fetch(`/api/tarjetas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descuento:tarjeta.descuento }), // Asegúrate de que el cuerpo sea correcto
      });

      if (!response.ok) throw new Error('Error al actualizar la tarjeta');

      alert('Tarjeta actualizada correctamente');
      // Redirigir al administrador
    } catch (err) {
      setError("Error al guardar los cambios.");
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Editar Tarjeta</h2>

      <form onSubmit={handleSubmit}>
        <label className="block mb-2">Código:</label>
        <input
          type="text"
          name="codigo" // Aquí también debes asegurarte de que coincida con la propiedad en el estado
          value={tarjeta.codigo}
          onChange={handleChange}
          className="w-full p-2 border rounded-md mb-4"
          disabled // Esto podría deshabilitar el campo si no quieres que se edite
        />

        <label className="block mb-2">Descuento:</label>
        <input
          type="text"
          name="descuento" // Aquí debe coincidir con 'descuentos' en el estado
          value={tarjeta.descuento}
          onChange={handleChange}
          className="w-full p-2 border rounded-md mb-4"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
        >
          Guardar Cambios
        </button>
      </form>
    </div>
  );
}
