import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import fs from "fs/promises";
import path from "path";

// Define input interface
interface RegisterRequest {
  fullName: string;
  whatsappNumber: string;
  email: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: RegisterRequest = await req.json();
    const { fullName, whatsappNumber, email } = body;

    // 1. Validate inputs
    if (!fullName || fullName.trim().length < 2) {
      return NextResponse.json(
        { error: "Full Name must be at least 2 characters long." },
        { status: 400 }
      );
    }

    // Basic WhatsApp validation (digits, plus sign, spaces, dashes)
    const phoneRegex = /^\+?[0-9\s\-]{10,15}$/;
    if (!whatsappNumber || !phoneRegex.test(whatsappNumber.replace(/\s+/g, ""))) {
      return NextResponse.json(
        { error: "Please enter a valid WhatsApp Number (at least 10 digits)." },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid Email Address." },
        { status: 400 }
      );
    }

    // 2. Prepare timestamp data
    const now = new Date();
    // Format date in User's timezone (IST / local time: DD/MM/YYYY)
    const registrationDate = now.toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const registrationTime = now.toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    // 3. Get Google Sheets Environment Variables
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const sheetId = process.env.GOOGLE_SHEET_ID;
    const sheetRange = process.env.GOOGLE_SHEET_RANGE || "Sheet1!A:E";

    const hasSheetsCreds = clientEmail && privateKey && sheetId;

    if (hasSheetsCreds) {
      console.log("Saving registration to Google Sheets...");
      // Initialize Google Auth using JWT options object (TypeScript compatible)
      const auth = new google.auth.JWT({
        email: clientEmail,
        key: privateKey.replace(/\\n/g, "\n"),
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      });

      const sheets = google.sheets({ version: "v4", auth });

      // Append registration row
      await sheets.spreadsheets.values.append({
        spreadsheetId: sheetId,
        range: sheetRange,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [
            [
              fullName.trim(),
              whatsappNumber.trim(),
              email.trim(),
              registrationDate,
              registrationTime,
            ],
          ],
        },
      });

      return NextResponse.json({
        success: true,
        message: "Successfully registered in Google Sheets.",
        mode: "production",
      });
    } else {
      console.warn(
        "Google Sheets credentials missing. Falling back to local file Mock Storage."
      );

      // Local mock storage path
      const mockFilePath = path.join(process.cwd(), "public", "registrations-mock.json");

      let currentRegistrations = [];
      try {
        const fileContent = await fs.readFile(mockFilePath, "utf8");
        currentRegistrations = JSON.parse(fileContent);
      } catch (e) {
        // File does not exist yet or is empty
        currentRegistrations = [];
      }

      const newRegistration = {
        fullName: fullName.trim(),
        whatsappNumber: whatsappNumber.trim(),
        email: email.trim(),
        registrationDate,
        registrationTime,
      };

      currentRegistrations.push(newRegistration);

      // Save back to file
      await fs.writeFile(
        mockFilePath,
        JSON.stringify(currentRegistrations, null, 2),
        "utf8"
      );

      return NextResponse.json({
        success: true,
        message: "Mock registration saved successfully.",
        mode: "mock",
        data: newRegistration,
      });
    }
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred during registration. Please try again." },
      { status: 500 }
    );
  }
}
