import { mongoClientConnect } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const client = await mongoClientConnect();
    const db = client.db("mydatabase");
    const body = await req.json();

    const categoryItems = await db
      .collection("category")
      .findOneAndUpdate(
        { _id: new ObjectId(params.id) },
        { $set: body },
        { returnDocument: "after" }
      );

    if (!categoryItems.value) {
      return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: categoryItems.value });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
};

export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const client = await mongoClientConnect();
    const db = client.db("mydatabase");

    const categoryItems = await db
      .collection("category")
      .findOneAndDelete({ _id: new ObjectId(params.id) });

    if (!categoryItems.value) {
      return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: categoryItems.value });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
};
