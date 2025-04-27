import { NextResponse } from "next/server";
import prisma from "@/utils/db"; // Adjust the path based on your project

export const GET = async (
  _req: Request,
  { params }: { params: { id: string } }
) => {
  const { id } = params;

  try {
    // Fetch wishlist for the specific user ID
    const wishlist = await prisma.wishlist.findMany({
      where: {
        userId: id, // Assuming 'userId' is the field in the wishlist table that associates the wishlist with a user
      },
      include: {
        product: true, // Assuming you want to include related product data
      },
    });

    console.log('wishlist', wishlist);

    // If the user is not found (null)
    if (!wishlist) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    // If the user has an empty wishlist (empty array)
    if (wishlist.length === 0) {
      return new NextResponse(JSON.stringify([]), {
        status: 200,
      });
    }

    // If wishlist items exist
    return NextResponse.json(wishlist);
  } catch (error) {
    console.log(error);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong", error }),
      { status: 500 }
    );
  }
};
