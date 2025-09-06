import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

interface RouteParams {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const id = params.id;

    if (!id) {
      return NextResponse.json({ success: false, error: "Product ID is required" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    const relatedProducts = await prisma.product.findMany({
      where: {
        category: product.category,
        NOT: { id: product.id },
      },
      take: 4,
    });

    return NextResponse.json({ success: true, product, relatedProducts });
  } catch (error: any) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}