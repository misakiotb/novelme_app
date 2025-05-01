import { NextResponse } from "next/server";

/**
 * GET /api/usage-status
 * OpenAI Usage APIを利用して「本日（UTC）のAPI利用合計コスト」を取得し、
 * 1ドルを超えていればサービスを休止状態（active: false）として返すAPIエンドポイント。
 *
 * @returns {object} { active: boolean, cost: number }  active=true:稼働中, false:休止中, cost:今日の合計コスト(ドル)
 *
 * - サーバー側のみで実行され、APIキーは環境変数から取得
 * - エラー時は active: false, cost: 0 で返却
 */
export async function GET() {
  // OpenAI Usage APIのエンドポイント（本日分）
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ active: false, cost: 0, message: "APIキー未設定" }, { status: 500 });
  }

  // 本日の日付（UTC）をUnix secondsで取得
  const now = new Date();
  // UTCの0時
  const startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0));
  // UTCの翌日0時（00:00:00）
  const endOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0));
  const startTime = Math.floor(startOfDay.getTime() / 1000);
  const endTime = Math.floor(endOfDay.getTime() / 1000);

  const url = `https://api.openai.com/v1/organization/costs?start_time=${startTime}&end_time=${endTime}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      return NextResponse.json({ active: false, cost: 0, message: "OpenAI Usage APIエラー" }, { status: 500 });
    }
    const data = await response.json();
    const cost = data?.data?.[0]?.results?.[0]?.amount?.value ?? 0;
    console.log(cost)
    const result = judgeUsageStatus(cost);
    return NextResponse.json(result);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Usage APIエラー:", error);
    }
    return NextResponse.json({ active: false, cost: 0, message: "サーバーエラー" }, { status: 500 });
  }
}
