import { mongoClientConnect } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
    try {
      const client = await mongoClientConnect();
      const db = client.db("mydatabase");
  
      const categories = await db.collection("category").find().toArray();
  
      return NextResponse.json({ success: true, data: categories });
    } catch (e: any) {
      return NextResponse.json({ success: false, message: e.message }, { status: 500 });
    }
  };

export const POST = async (req: NextRequest) => {
  try {
    const client = await mongoClientConnect();
    const db = client.db("mydatabase");
    const body = await req.json();

    if (!body || !body.titles || !body.imageUrl) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await db.collection("category").insertOne(body);

    // Возвращаем данные с добавленным документом
    return NextResponse.json({
      success: true,
      data: { ...body, _id: result.insertedId },
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
};
