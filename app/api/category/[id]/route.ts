import { mongoClientConnect } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

// PATCH метод
export const PATCH = async (req: NextRequest, context: { params: { id: string } }) => {
  try {
    const { params } = context;
    const client = await mongoClientConnect();
    const db = client.db("mydatabase");
    const body = await req.json();

    // Проверка валидности ObjectId
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { success: false, message: "Invalid ID" },
        { status: 400 }
      );
    }

    const categoryItems = await db
      .collection("category")
      .findOneAndUpdate(
        { _id: new ObjectId(params.id) },
        { $set: body },
        { returnDocument: "after" }
      );

    if (!categoryItems.value) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: categoryItems.value });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, message: e.message },
      { status: 500 }
    );
  }
};

// DELETE метод
export const DELETE = async (req: NextRequest, context: { params: { id: string } }) => {
  try {
    const { params } = context;
    const client = await mongoClientConnect();
    const db = client.db("mydatabase");

    // Проверка валидности ObjectId
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { success: false, message: "Invalid ID" },
        { status: 400 }
      );
    }

    const categoryItems = await db
      .collection("category")
      .findOneAndDelete({ _id: new ObjectId(params.id) });

    if (!categoryItems.value) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: categoryItems.value });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, message: e.message },
      { status: 500 }
    );
  }
};
