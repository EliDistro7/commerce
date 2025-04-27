import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  const { productId } = params;

  // Convert to number if your DB uses numeric IDs
 
 

  try {
    const images = await prisma.image.findMany({
      where: {
        productID: productId,
      },
    });

    return NextResponse.json(images);
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
