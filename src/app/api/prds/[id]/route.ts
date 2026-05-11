import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const doc = await prisma.prdDocument.findFirst({
      where: {
        id,
        user: { email: session.user.email },
      },
      include: { template: true },
    });

    if (!doc) {
      return NextResponse.json({ error: "PRD not found" }, { status: 404 });
    }

    return NextResponse.json({ prd: doc });
  } catch (error) {
    console.error("Error fetching PRD:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const { title, content, status, language, templateId } = body;

    const existing = await prisma.prdDocument.findFirst({
      where: {
        id,
        user: { email: session.user.email },
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "PRD not found" }, { status: 404 });
    }

    const updated = await prisma.prdDocument.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(status !== undefined && { status }),
        ...(language !== undefined && { language }),
        ...(templateId !== undefined && { templateId }),
      },
    });

    return NextResponse.json({ prd: updated });
  } catch (error) {
    console.error("Error updating PRD:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const existing = await prisma.prdDocument.findFirst({
      where: {
        id,
        user: { email: session.user.email },
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "PRD not found" }, { status: 404 });
    }

    // Soft delete: mark status as deleted
    await prisma.prdDocument.update({
      where: { id },
      data: { status: "deleted" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting PRD:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
