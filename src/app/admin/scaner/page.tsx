'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Para redirigir
import Webcam from 'react-webcam';
import jsQR from 'jsqr';

export default function EscanearTarjeta() {
  const [isScanning, setIsScanning] = useState(false);
  const [codigoEscaneado, setCodigoEscaneado] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));
  const router = useRouter(); // Para redirigir a la vista de edición

  useEffect(() => {
    if (isScanning) {
      const scanInterval = setInterval(scanQRCode, 500);
      return () => clearInterval(scanInterval);
    }
  }, [isScanning]);

  const handleScan = () => {
    setIsScanning(true);
    setCodigoEscaneado(null);
    setError(null);
  };

  const scanQRCode = () => {
    if (!webcamRef.current || !webcamRef.current.video) return;

    const video = webcamRef.current.video;
    if (video.videoWidth === 0 || video.videoHeight === 0) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) {
      setError("Error al acceder al contexto del canvas.");
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, canvas.width, canvas.height);

    if (code) {
      setCodigoEscaneado(code.data);
      setIsScanning(false);

      // Simulación de una búsqueda en la base de datos
      buscarTarjetaAsociada(code.data);
    }
  };

  const buscarTarjetaAsociada = async (codigo: string) => {
    try {
      // Simulación de una API donde se obtiene la tarjeta con el código QR
      const response = await fetch(`/api/tarjetas/${codigo}`);
      if (!response.ok) {
        throw new Error('Tarjeta no encontrada');
      }

      const tarjeta = await response.json();
      
      // Redirigir a la vista de edición con los datos de la tarjeta
      router.push(`/editar-tarjeta/${tarjeta.id}`);
    } catch (err) {
      setError("No se encontró la tarjeta asociada.");
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      {!isScanning ? (
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Escanear Tarjeta</h2>
          <button
            onClick={handleScan}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
          >
            Iniciar Escaneo
          </button>
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Escaneando...</h2>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width="100%"
            videoConstraints={{ facingMode: 'environment' }}
          />
        </div>
      )}

      {codigoEscaneado && (
        <div className="mt-4 text-green-500 text-center">
          <h3 className="text-lg font-semibold">Código Escaneado:</h3>
          <p className="text-lg font-bold">{codigoEscaneado}</p>
        </div>
      )}

      {error && (
        <div className="mt-4 text-red-500">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
