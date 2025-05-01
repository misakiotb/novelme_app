// コスト判定ロジックをここにまとめる
export function judgeUsageStatus(cost: number) {
  return {
    active: cost <= 1.0,
    cost,
  };
}
