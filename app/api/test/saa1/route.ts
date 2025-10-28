import { NextResponse } from "next/server";
import { parse } from "papaparse";

export async function GET() {
  const url =
    "https://saapracticetests.sfo3.cdn.digitaloceanspaces.com/SAA/SAA%20PT1%20-%20PT%201.csv";

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
    console.error("Error fetching/parsing SAA1 CSV:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

