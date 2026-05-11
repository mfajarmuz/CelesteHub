import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  try {
    const documents = await prisma.prdDocument.findMany({
      where: {
        user: { email: session.user.email },
        ...(status ? { status } : {}),
        ...(search
          ? {
              OR: [
                { title: { contains: search } },
                { content: { contains: search } },
              ],
            }
          : {}),
      },
      include: {
        template: {
          select: { name: true, category: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    let filtered = documents;
    if (category && category !== "all") {
      filtered = documents.filter(
        (doc) => doc.template?.category === category
      );
    }

    return NextResponse.json({ prds: filtered });
  } catch (error) {
    console.error("Error fetching PRDs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, templateId, language = "id" } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const prd = await prisma.prdDocument.create({
      data: {
        title,
        content: "{}",
        templateId: templateId || null,
        language,
        status: "draft",
        userId: user.id,
      },
    });

    return NextResponse.json({ prd }, { status: 201 });
  } catch (error) {
    console.error("Error creating PRD:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
