
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function GET(
    req: NextRequest,
    { params }: { params: { productSlug: string } }
  ) {
    const { productSlug } = params;
    const products = await prisma.product.findMany();
    // Simulate fetching from DB
    const product = products.find((item) => item.slug === productSlug);
  
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
  
    return NextResponse.json(product);
  }