import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const requestedCategory = searchParams.get("category")?.toLowerCase();

  try {
    const url = "https://saapracticetests.sfo3.cdn.digitaloceanspaces.com/Flashcards/csvjson.json";
    
    const res = await fetch(url);
    
    if (!res.ok) {
      return NextResponse.json([]);
    }

    const data = await res.json();
    
    // Filter by category if requested
    if (requestedCategory && Array.isArray(data)) {
      const filtered = data.filter((card: any) => 
        card.category?.toLowerCase() === requestedCategory
      );
      return NextResponse.json(filtered);
    }

    return NextResponse.json(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error("Error fetching flashcards:", error);
    return NextResponse.json([]);
  }
}

