import { INQUIRY_STAGE_IDS, getStageIndex } from '../constants/stages';

function reachedStage(inquiry, stageId) {
  const targetIdx = getStageIndex(stageId);
  if (inquiry.isDropped && inquiry.droppedAtStage) {
    return getStageIndex(inquiry.droppedAtStage) >= targetIdx;
  }
  return getStageIndex(inquiry.currentStage) >= targetIdx;
}

export function computeFunnelData(inquiries, awarenessCount) {
  const inquiryStageData = INQUIRY_STAGE_IDS.map((stageId) => ({
    stageId,
    count: inquiries.filter((inq) => reachedStage(inq, stageId)).length,
  }));

  const allData = [{ stageId: 'awareness', count: awarenessCount }, ...inquiryStageData];

  return allData.map((item, idx) => {
    const prev = allData[idx - 1];
    const dropoff = prev ? Math.max(0, prev.count - item.count) : 0;
    const conversionRate =
      prev && prev.count > 0 ? parseFloat(((item.count / prev.count) * 100).toFixed(1)) : 100;
    return { ...item, dropoff, conversionRate };
  });
}

export function computeChannelBreakdown(inquiries, options = {}) {
  const { onlyDigitalMarketing = false } = options;
  const breakdown = {};
  inquiries.forEach((inq) => {
    if (onlyDigitalMarketing && inq.sumber && inq.sumber !== 'digital_marketing') return;
    const channelKey = inq.channel || 'other';
    if (!breakdown[channelKey]) {
      breakdown[channelKey] = { total: 0, proposals: 0, deals: 0 };
    }
    breakdown[channelKey].total++;
    if (reachedStage(inq, 'consideration')) breakdown[channelKey].proposals++;
    if (reachedStage(inq, 'purchase')) breakdown[channelKey].deals++;
  });
  return breakdown;
}

export function computeSourceBreakdown(inquiries) {
  const breakdown = {};
  inquiries.forEach((inq) => {
    let key;
    if (inq.sumber === 'internal' || inq.sumber === 'agen') {
      key = `sumber:${inq.sumber}`;
    } else {
      const raw = (inq.channel || '').toString().trim();
      key = `channel:${raw || 'other'}`;
    }
    if (!breakdown[key]) {
      breakdown[key] = { key, total: 0, proposals: 0, deals: 0 };
    }
    breakdown[key].total++;
    if (reachedStage(inq, 'consideration')) breakdown[key].proposals++;
    if (reachedStage(inq, 'purchase')) breakdown[key].deals++;
  });
  return breakdown;
}

export function getActiveInquiries(inquiries) {
  return inquiries.filter((inq) => !inq.isDropped);
}

export function getDroppedInquiries(inquiries) {
  return inquiries.filter((inq) => inq.isDropped);
}
