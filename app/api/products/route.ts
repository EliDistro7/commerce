import { NextResponse } from "next/server";
import prisma from "@/utils/db";

export const GET = async () => {
  try {
    const products = await prisma.product.findMany();
    return NextResponse.json(products);
  } catch (err) {
    return new NextResponse("Failed to fetch products", { status: 500 });
  }
};
