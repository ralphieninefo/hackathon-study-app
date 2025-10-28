import { NextResponse } from "next/server";
import { parse } from "papaparse";

export async function GET() {
  const urls = [
    "https://saapracticetests.sfo3.cdn.digitaloceanspaces.com/SAA/SAA%20PT1%20-%20PT%201.csv",
    "https://saapracticetests.sfo3.cdn.digitaloceanspaces.com/SAA/SAA%20PT%203%20-%20PT3%20(1).csv"
  ];

  try {
    const responses = await Promise.all(urls.map((u) => fetch(u).then((r) => r.text())));
    const all = responses.flatMap((csv) => parse(csv, { header: true, skipEmptyLines: true }).data);

    const shuffled = all.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 10);

    return NextResponse.json(selected);
  } catch (err: unknown) {
    console.error("Error fetching/parsing SAA mini quiz:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

