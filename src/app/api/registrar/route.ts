import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { nanoid } from "nanoid"; // Generador de ID único

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { nombre, email, telefono, direccion, codigo} = await req.json();
    
    
    const cliente = await prisma.cliente.create({
      data: {
        nombre,
        email,
        telefono,
        direccion,
        
        tarjeta: {
          create: {
            codigo,
            descuentos: ["5% de descuento", "10% de descuento", "15% de descuento"],
          },
        },
      },
    });

    // Devolver el código generado al frontend
    return NextResponse.json({ codigo }, { status: 201 });
  } catch (error) {
    console.error("Error al registrar cliente:", error);
    return NextResponse.json({ error: "Error al registrar" }, { status: 500 });
  }
}
