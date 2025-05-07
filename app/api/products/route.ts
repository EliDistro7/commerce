import { NextResponse } from "next/server";
import prisma from "@/utils/db";

export const GET = async () => {
  try {
    const products = await prisma.product.findMany();
    console.log('prods', products);
    return NextResponse.json(products);
  } catch (err) {
    console.log('error', err);
    return new NextResponse("Failed to fetch products", { status: 500 });
  }
};
