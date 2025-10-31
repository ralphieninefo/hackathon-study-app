import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const requestedCategory = searchParams.get("category")?.toLowerCase();

  // Map categories to their JSON files in Spaces
  const categoryFiles: Record<string, string> = {
    "devops": "csvjson.json", // DevOps and Disaster Recovery are in csvjson.json
    "disaster recovery": "csvjson.json",
    "monitoring": "Monitoring.json",
    "networking": "Networking.json",
    "security": "Security.json",
    "storage": "Storage.json",
    "database": "Database.json",
    "compute": "Compute.json"
  };

  try {
    // If specific category requested, fetch that file only
    if (requestedCategory && categoryFiles[requestedCategory]) {
      const fileName = categoryFiles[requestedCategory];
      const url = `https://saapracticetests.sfo3.cdn.digitaloceanspaces.com/Flashcards/${fileName}`;
      const res = await fetch(url);
      
      if (!res.ok) {
        return NextResponse.json([]);
      }

      const data = await res.json();
      
      // Filter by exact category if csvjson.json (contains DevOps and Disaster Recovery)
      if (fileName === "csvjson.json" && requestedCategory) {
        const filtered = Array.isArray(data) 
          ? data.filter((card: any) => 
              card.category?.toLowerCase() === requestedCategory
            )
          : [];
        return NextResponse.json(filtered);
      }

      return NextResponse.json(Array.isArray(data) ? data : []);
    }

    // If no category or "all", fetch all category files and merge them
    const allCards: any[] = [];
    const filesToFetch = [
      "csvjson.json", // DevOps and Disaster Recovery
      "Monitoring.json",
      "Networking.json",
      "Security.json",
      "Storage.json",
      "Database.json",
      "Compute.json"
    ];

    const fetchPromises = filesToFetch.map(async (fileName) => {
      const url = `https://saapracticetests.sfo3.cdn.digitaloceanspaces.com/Flashcards/${fileName}`;
      try {
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          return Array.isArray(data) ? data : [];
        }
      } catch (e) {
        console.warn(`Failed to fetch ${fileName}:`, e);
      }
      return [];
    });

    const results = await Promise.all(fetchPromises);
    const merged = results.flat();
    
    return NextResponse.json(merged);
  } catch (error) {
    console.error("Error fetching flashcards:", error);
    return NextResponse.json([]);
  }
}

