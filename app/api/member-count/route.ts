import { NextResponse } from "next/server";
import { google } from "googleapis";
import fs from "fs/promises";
import path from "path";

const LIMIT = 500;

export async function GET() {
  try {
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const sheetId = process.env.GOOGLE_SHEET_ID;
    const sheetRange = process.env.GOOGLE_SHEET_RANGE || "Sheet1!A:E";

    const hasSheetsCreds = clientEmail && privateKey && sheetId;

    let count = 0;

    if (hasSheetsCreds) {
      const auth = new google.auth.JWT({
        email: clientEmail,
        key: privateKey.replace(/\\n/g, "\n"),
        scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
      });

      const sheets = google.sheets({ version: "v4", auth });
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: sheetRange,
      });

      const rows = response.data.values;
      // Assuming row 1 is the header, count rows - 1. If 0 rows, count is 0.
      if (rows && rows.length > 1) {
        count = rows.length - 1;
      } else {
        count = 0;
      }
    } else {
      // Local mock storage
      const mockFilePath = path.join(process.cwd(), "public", "registrations-mock.json");
      try {
        const fileContent = await fs.readFile(mockFilePath, "utf8");
        const registrations = JSON.parse(fileContent);
        count = Array.isArray(registrations) ? registrations.length : 0;
      } catch (e) {
        count = 0; // File doesn't exist or is invalid
      }
    }

    const remaining = Math.max(0, LIMIT - count);

    return NextResponse.json(
      { count, remaining, limit: LIMIT },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error: any) {
    console.error("Member count error:", error);
    return NextResponse.json(
      { error: "Failed to fetch member count" },
      { status: 500 }
    );
  }
}
