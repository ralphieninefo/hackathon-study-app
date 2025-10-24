import { NextResponse } from "next/server";
import { parse } from "papaparse";

// This endpoint serves:  /api/test/sap
// It fetches and parses your SAP PT 3 CSV from DigitalOcean Spaces

export async function GET() {
  const url =
    "https://saapracticetests.sfo3.digitaloceanspaces.com/SAP/SAP%20PT%203%20-%20Sheet1.csv";

  try {
    // Fetch the CSV file from Spaces
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch CSV from ${url}`);

    // Read CSV text
    const csvText = await res.text();

    // Parse CSV text into JSON using the named parse export
    const parsed = parse(csvText, {
      header: true,          // Use the first line as keys
      skipEmptyLines: true,  // Ignore empty rows
      delimiter: ",",        // Your CSV uses commas (not tabs)
    });

    // Return parsed data as JSON
    return NextResponse.json(parsed.data);
  } catch (err: unknown) {
    console.error("Error fetching/parsing SAP CSV:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
