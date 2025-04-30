// NGワードチェック用ユーティリティ関数
import ngwords from '../ngwords.json';

/**
 * 入力テキストにNGワードが含まれていればtrueを返す
 */
export function containsNgWord(text: string): boolean {
  return ngwords.some(word => text.includes(word));
}
