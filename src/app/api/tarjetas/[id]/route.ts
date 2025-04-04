import { NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";
// Asegúrate de tener Prisma configurado
const prisma = new PrismaClient();
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const tarjeta = await prisma.tarjeta.findUnique({
      where: { codigo: params.id },
    });

    if (!tarjeta) {
      return NextResponse.json({ error: "Tarjeta no encontrada" }, { status: 404 });
    }

    return NextResponse.json(tarjeta);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener la tarjeta" }, { status: 500 });
  }
}


export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { descuento } = await req.json(); // Obtener el descuento del cuerpo de la solicitud

    // Asegúrate de que el descuento no sea vacío
    if (!descuento) {
      console.log(descuento);
      console.error("Descuento vacío");
      return NextResponse.json({ error: "El descuento no puede estar vacío." }, { status: 400 });
    }

    // Actualizar la tarjeta con el descuento proporcionado
    const tarjetaActualizada = await prisma.tarjeta.update({
      where: { codigo: params.id }, // Asegúrate de que el 'id' es el correcto
      data: { descuento }, // Actualizar el descuento
      
    });

    return NextResponse.json(tarjetaActualizada); // Devolver la tarjeta actualizada
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al actualizar la tarjeta" }, { status: 500 });
  }
}
