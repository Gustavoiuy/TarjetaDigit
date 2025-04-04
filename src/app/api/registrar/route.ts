import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { nanoid } from "nanoid"; // Generador de ID único
import { string } from "zod";

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
            descuento: "10%"// Ajustado para cumplir con el tipo esperado
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
