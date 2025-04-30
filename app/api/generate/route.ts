import { NextResponse } from "next/server";
import ngwords from "../../../ngwords.json";

/**
 * POST /api/generate
 * ユーザー入力 (mode, episode) を受け取り、
 * Dify ワークフローで「小説タイトル＋紹介文」を生成して返す。
 *
 * @param request - JSON ボディに { mode: string, episode: string } を含む。
 *                  episode に NG ワードを含む場合は 400 を返す。
 * @returns NextResponse
 * - 200: { title: string; description: string; }
 * - 400: { message: "不適切な内容が含まれています" }
 * - 500: 各種サーバー／パースエラー
 * - 504: タイムアウト
 */
export async function POST(request: Request): Promise<NextResponse> {
  const { mode, episode } = await request.json();

  // --- 1. NGワードチェック ---
  // episode に NG単語が含まれるかチェックし、該当時は 400 を返却
  for (const word of ngwords) {
    if (episode.includes(word)) {
      return NextResponse.json(
        { message: "不適切な内容が含まれています" },
        { status: 400 }
      );
    }
  }

  // --- 2. Dify ワークフロー API 呼び出し ---
  const DIFY_API_URL = "https://api.dify.ai/v1/workflows/run";
  const DIFY_API_KEY = process.env.DIFY_API_KEY;

  // Dify公式推奨のリクエスト形式
  const payload = {
    inputs: { mode, episode },
    response_mode: "blocking", // blockingモードでJSONレスポンスを受け取る
    user: "novelme-user" // 任意の識別子
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(DIFY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${DIFY_API_KEY}`,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    // --- 3. HTTPステータスチェック ---
    // 非 200 系ステータス時はエラーを返却
    if (!response.ok) {
      return NextResponse.json({ message: "AI生成時にエラーが発生しました" }, { status: 500 });
    }

    const result = await response.json();

    // --- 4. レスポンスパース ---
    // JSON 文字列の場合はパースして title/description を抽出
    if (
      result &&
      result.data &&
      result.data.outputs &&
      typeof result.data.outputs.text === "string"
    ) {
      try {
        const parsed = JSON.parse(result.data.outputs.text);
        if (parsed && parsed.title && parsed.description) {
          return NextResponse.json(parsed);
        }
      } catch (e) {
        return NextResponse.json({ message: "生成結果のパースに失敗しました" }, { status: 500 });
      }
    }
    // 期待通りでなければエラー
    return NextResponse.json({ message: "AI生成結果の取得に失敗しました" }, { status: 500 });
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.error('Dify API連携エラー:', error);

    // --- 5. エラー処理 ---
    // タイムアウトやその他例外に応じてステータスを返却
    if (error.name === "AbortError") {
      return NextResponse.json({ message: "AI生成に時間がかかりすぎています" }, { status: 504 });
    }
    return NextResponse.json({ message: "サーバーエラーが発生しました" }, { status: 500 });
  }
}
