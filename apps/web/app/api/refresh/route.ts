import { NextRequest, NextResponse } from "next/server";
import { getRefreshToken, updateTokens } from "@/lib/calTokenStore";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const match = authHeader?.match(/Bearer\s+(.*)/i);
  const accessToken = match?.[1];

  if (!accessToken) {
    return NextResponse.json(
      { error: "Missing access token" },
      { status: 401 },
    );
  }

  const refreshToken = getRefreshToken(accessToken);
  if (!refreshToken) {
    return NextResponse.json(
      { error: "Refresh token not found" },
      { status: 401 },
    );
  }

  const clientId = process.env.CAL_CLIENT_ID;
  const clientSecret = process.env.CAL_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 },
    );
  }

  try {
    const response = await fetch("https://api.cal.com/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to refresh token" },
        { status: response.status },
      );
    }

    const data = await response.json();
    const newAccessToken = data.access_token as string | undefined;
    const newRefreshToken = data.refresh_token as string | undefined;

    if (!newAccessToken || !newRefreshToken) {
      return NextResponse.json(
        { error: "Invalid response from Cal.com" },
        { status: 500 },
      );
    }

    updateTokens(accessToken, newAccessToken, newRefreshToken);

    return NextResponse.json({ accessToken: newAccessToken });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
