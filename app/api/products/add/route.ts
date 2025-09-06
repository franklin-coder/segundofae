import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || !body.price || !body.description || !body.category) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newProduct = await prisma.product.create({
      data: {
        sku: body.sku || `${body.category}-${Date.now()}`,
        name: body.name,
        description: body.description,
        longDescription: body.longDescription,
        category: body.category,
        price: body.price,
        images: body.images || [],
        featured: body.featured ?? false,
        inStock: body.inStock ?? true,
        materials: body.materials || [],
        dimensions: body.dimensions,
        care_instructions: body.care_instructions,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error: any) {
    console.error("Error adding product:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}