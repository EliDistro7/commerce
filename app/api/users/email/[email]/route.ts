// app/api/users/email/[email]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/utils/db"; // Adjust the path based on your project

export const GET = async (
  _req: Request,
  { params }: { params: { email: string } }
) => {
  const { email } = params;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    return NextResponse.json(user);
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong", error }),
      { status: 500 }
    );
  }
};
