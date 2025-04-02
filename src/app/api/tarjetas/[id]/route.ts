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
    const { descuentos } = await req.json();

    const tarjetaActualizada = await prisma.tarjeta.update({
      where: { id: params.id },
      data: { descuentos },
    });

    return NextResponse.json(tarjetaActualizada);
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar la tarjeta" }, { status: 500 });
  }
}
