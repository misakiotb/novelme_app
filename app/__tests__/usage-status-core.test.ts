import { judgeUsageStatus } from '../api/usage-status/usage-status-core';

describe('judgeUsageStatus', () => {
  it('returns active=true if cost <= 1.0', () => {
    expect(judgeUsageStatus(0.5)).toEqual({ active: true, cost: 0.5 });
    expect(judgeUsageStatus(1.0)).toEqual({ active: true, cost: 1.0 });
  });
  it('returns active=false if cost > 1.0', () => {
    expect(judgeUsageStatus(1.5)).toEqual({ active: false, cost: 1.5 });
  });
});
