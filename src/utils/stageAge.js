const MS_PER_DAY = 1000 * 60 * 60 * 24;

function diffDays(start, end) {
  if (!start || !end) return null;
  const s = new Date(start);
  const e = new Date(end);
  if (isNaN(s) || isNaN(e)) return null;
  return Math.max(0, Math.round((e - s) / MS_PER_DAY));
}

export function isClosed(inq) {
  return inq.currentStage === 'purchase' || inq.isDropped;
}

function getStartDate(inq) {
  return inq.tanggalMasuk || inq.createdAt || null;
}

function getEndDate(inq) {
  if (isClosed(inq)) {
    return inq.updatedAt || null;
  }
  return new Date().toISOString();
}

export function computeAgeDays(inq) {
  return diffDays(getStartDate(inq), getEndDate(inq));
}

export function computeDaysInCurrentStage(inq) {
  const stageStart = inq.tanggalMasuk || inq.createdAt;
  if (!stageStart) return null;
  if (isClosed(inq)) {
    return diffDays(stageStart, inq.updatedAt || new Date().toISOString());
  }
  return diffDays(stageStart, new Date().toISOString());
}

export function computeAvgTimeToPurchase(inquiries) {
  const days = (inquiries || [])
    .filter((inq) => inq.currentStage === 'purchase' && !inq.isDropped)
    .map((inq) => diffDays(getStartDate(inq), inq.updatedAt))
    .filter((d) => d != null);
  if (days.length === 0) return { avg: null, count: 0, min: null, max: null };
  const sum = days.reduce((a, b) => a + b, 0);
  return {
    avg: Math.round(sum / days.length),
    count: days.length,
    min: Math.min(...days),
    max: Math.max(...days),
  };
}

export function ageBucket(days, inq) {
  if (days == null) return 'unknown';
  if (isClosed(inq)) return 'closed';
  if (days <= 14) return 'fresh';
  if (days <= 45) return 'warm';
  if (days <= 90) return 'cool';
  return 'cold';
}
