import { NextResponse } from "next/server";
import prisma from "@/utils/db";

export const GET = async (request: Request) => {
  try {
    // Get the search query from URL parameters
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";

    // Search for products that contain the query string in their title or description
    // Using Prisma's contains filter for case-insensitive search
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { title: { contains: query } },
          { description: { contains: query } },
        ],
      },
    });

    return NextResponse.json(products);
  } catch (err) {
    console.error("Search API error:", err);
    return new NextResponse("Failed to search products", { status: 500 });
  }
};