import { STAGES } from '../../constants/stages';

const DEFAULT_THRESHOLDS = {
  awareness_to_interest: 95,
  interest_to_consideration: 50,
  consideration_to_purchase: 40,
  purchase_to_retention: 60,
  retention_to_advocacy: 50,
};

function thresholdKeyFor(fromStageId, toStageId) {
  return `${fromStageId}_to_${toStageId}`;
}

export default function FunnelChart({ funnelData, thresholds }) {
  if (!funnelData || funnelData.length === 0) return null;

  const thr = { ...DEFAULT_THRESHOLDS, ...(thresholds || {}) };
  const maxCount = funnelData[0]?.count || 1;

  return (
    <div className="flex flex-col py-2">
      {funnelData.map((item, idx) => {
        const stage = STAGES.find((s) => s.id === item.stageId);
        if (!stage) return null;

        const widthPct = maxCount > 0 ? Math.max(28, (item.count / maxCount) * 100) : 28;
        const isLast = idx === funnelData.length - 1;
        const nextItem = funnelData[idx + 1];

        let dropoffPct = 0;
        let isExceeded = false;
        let thresholdPct = 0;
        if (nextItem) {
          dropoffPct = 100 - (nextItem.conversionRate ?? 100);
          const key = thresholdKeyFor(item.stageId, nextItem.stageId);
          thresholdPct = thr[key] ?? 50;
          isExceeded = dropoffPct > thresholdPct;
        }

        return (
          <div key={item.stageId} className="flex flex-col">
            <div className="flex items-center gap-3">
              <div
                className="rounded-md min-w-[120px] transition-all duration-500"
                style={{ width: `${widthPct}%`, background: stage.color }}
              >
                <div className="flex items-center justify-between px-4 py-2.5 gap-3">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white whitespace-nowrap">{stage.label}</span>
                    {stage.sublabel && (
                      <span className="text-xs text-white/70 whitespace-nowrap">({stage.sublabel})</span>
                    )}
                  </div>
                  <span className="text-lg font-extrabold text-white/95 whitespace-nowrap">
                    {item.count.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
              {idx > 0 && (
                <div className="text-xs font-bold bg-white border border-gray-200 rounded-full px-2.5 py-0.5 whitespace-nowrap">
                  <span style={{ color: stage.color }}>{item.conversionRate}%</span>
                </div>
              )}
            </div>

            {!isLast && (
              <div className="flex items-center gap-2.5 py-1.5 pl-5">
                <div
                  className="flex-1 h-px"
                  style={{
                    background: isExceeded
                      ? 'linear-gradient(90deg, transparent, rgba(220,38,38,0.35), transparent)'
                      : 'linear-gradient(90deg, transparent, rgba(21,128,61,0.25), transparent)',
                  }}
                />
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                  <span className="text-xs text-gray-400">▼</span>
                  <span className="text-xs font-medium text-gray-500">
                    {nextItem?.dropoff ?? 0} tidak lanjut
                    {nextItem?.dropoff > 0 && (
                      <span className={`font-semibold ${isExceeded ? 'text-red-600' : 'text-green-700'}`}>
                        {' '}(−{dropoffPct.toFixed(1)}%)
                      </span>
                    )}
                  </span>
                  <span
                    className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full ml-1.5 cursor-help border ${
                      isExceeded ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'
                    }`}
                    title={`Batas wajar: ${thresholdPct}%`}
                  >
                    {isExceeded ? '⚠ Melebihi batas' : '✓ Wajar'}
                  </span>
                </div>
                <div
                  className="flex-1 h-px"
                  style={{
                    background: isExceeded
                      ? 'linear-gradient(90deg, transparent, rgba(220,38,38,0.35), transparent)'
                      : 'linear-gradient(90deg, transparent, rgba(21,128,61,0.25), transparent)',
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
