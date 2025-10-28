import { NextResponse } from "next/server";
import { parse } from "papaparse";

export async function GET() {
  const url =
    "https://saapracticetests.sfo3.cdn.digitaloceanspaces.com/SAP/SAP%20PT2%20-%20Sheet1.csv";

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch CSV from ${url}`);

    const csvText = await res.text();

    const parsed = parse(csvText, {
      header: true,
      skipEmptyLines: true,
      delimiter: ",",
    });

    return NextResponse.json(parsed.data);
  } catch (err: unknown) {
    console.error("Error fetching/parsing SAP2 CSV:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

