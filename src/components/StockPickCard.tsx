import { useState } from 'react';
import { ChevronDown, ChevronUp, Flame } from 'lucide-react';

export default function StockPickCard({ pick, activeTimeframe = 'Daily' }: { pick: any, activeTimeframe?: string }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl mb-4 overflow-hidden">
            <button
                className="w-full text-left p-4 cursor-pointer focus:outline-none block"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex flex-row justify-between items-center mb-3">
                    <div className="flex flex-row items-center">
                        <span className="text-white font-bold text-xl mr-3">{pick.ticker}</span>
                        <div className={`px-2 py-1 rounded mr-2 ${pick.type === 'Intraday' ? 'bg-amber-500/20' : 'bg-indigo-500/20'}`}>
                            <span className={`text-xs font-bold ${pick.type === 'Intraday' ? 'text-amber-400' : 'text-indigo-400'}`}>
                                {pick.type.toUpperCase()}
                            </span>
                        </div>
                        {pick.sectorTrend && (
                            <div className={`px-2 py-1 rounded ${pick.sectorTrend === 'Bullish' ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}>
                                <span className={`text-[10px] font-bold ${pick.sectorTrend === 'Bullish' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    SECTOR: {pick.sectorTrend.toUpperCase()}
                                </span>
                            </div>
                        )}
                    </div>
                    {expanded ? <ChevronUp size={24} color="#a1a1aa" /> : <ChevronDown size={24} color="#a1a1aa" />}
                </div>

                {pick.speculationTheme && (
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-2 mb-2 flex flex-row items-center">
                        <Flame size={14} color="#fbbf24" style={{ marginRight: 6 }} />
                        <span className="text-amber-300/80 text-[10px] font-bold flex-1 tracking-wider uppercase">
                            Global Theme: <span className="text-amber-400">{pick.speculationTheme}</span>
                        </span>
                    </div>
                )}

                <div className="flex flex-row justify-between pt-2 border-t border-zinc-800/30">
                    <div>
                        <div className="text-zinc-500 text-xs font-semibold mb-1 tracking-wider">ENTRY</div>
                        <div className="text-white font-semibold text-base">{pick.entry}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-zinc-500 text-xs font-semibold mb-1 tracking-wider">STOP LOSS</div>
                        <div className="text-rose-400 font-semibold text-base">{pick.stopLoss}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-zinc-500 text-xs font-semibold mb-1 tracking-wider">TARGET</div>
                        <div className="text-emerald-400 font-semibold text-base">{pick.target}</div>
                    </div>
                </div>
            </button>

            {/* Expandable Details */}
            {expanded && (
                <div className="px-4 pb-4 pt-2 border-t border-zinc-800/50 bg-zinc-900/50 block">
                    <div className="mb-3">
                        <div className="text-zinc-400 text-xs mb-1 font-semibold tracking-wider">STRATEGY FLAG</div>
                        <div className="text-zinc-200">{pick.strategy}</div>
                    </div>

                    {/* Dual Timeframe Technicals */}
                    {pick.timeframes && (
                        <div className="mb-4">
                            <div className="text-zinc-400 text-xs mb-2 font-semibold tracking-wider">TECHNICAL CONFIRMATION</div>
                            <div className="flex flex-row justify-between">
                                <div className={`flex-1 mr-2 p-2 rounded-xl border ${activeTimeframe === 'Daily' ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-zinc-800/20 border-zinc-800/50'}`}>
                                    <div className={`text-[10px] font-bold mb-2 tracking-widest text-center border-b pb-1 ${activeTimeframe === 'Daily' ? 'text-indigo-400 border-indigo-500/20' : 'text-zinc-500 border-zinc-800/50'}`}>DAILY (1D)</div>
                                    <div className="text-zinc-400 text-[11px] mb-1">RSI: <span className="text-white font-semibold">{pick.timeframes.daily.rsi}</span></div>
                                    <div className="text-zinc-400 text-[11px] mb-1">ADX: <span className="text-white font-semibold">{pick.timeframes.daily.adx}</span></div>
                                    <div className="text-zinc-400 text-[11px] mb-1">Vol: <span className="text-white font-semibold">{pick.timeframes.daily.volume}</span></div>
                                    <div className="text-zinc-400 text-[11px]">Del: <span className="text-emerald-400 font-semibold">{pick.timeframes.daily.delivery}</span></div>
                                </div>
                                <div className={`flex-1 ml-2 p-2 rounded-xl border ${activeTimeframe === 'Weekly' ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-zinc-800/20 border-zinc-800/50'}`}>
                                    <div className={`text-[10px] font-bold mb-2 tracking-widest text-center border-b pb-1 ${activeTimeframe === 'Weekly' ? 'text-indigo-400 border-indigo-500/20' : 'text-zinc-500 border-zinc-800/50'}`}>WEEKLY (1W)</div>
                                    <div className="text-zinc-400 text-[11px] mb-1">RSI: <span className="text-white font-semibold">{pick.timeframes.weekly.rsi}</span></div>
                                    <div className="text-zinc-400 text-[11px] mb-1">ADX: <span className="text-white font-semibold">{pick.timeframes.weekly.adx}</span></div>
                                    <div className="text-zinc-400 text-[11px] mb-1">Vol: <span className="text-white font-semibold">{pick.timeframes.weekly.volume}</span></div>
                                    <div className="text-zinc-400 text-[11px]">Del: <span className="text-emerald-400 font-semibold">{pick.timeframes.weekly.delivery}</span></div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mb-3">
                        <div className="text-zinc-400 text-xs mb-1 font-semibold tracking-wider">HOLDING TIME</div>
                        <div className="text-zinc-200">{pick.holdingTime}</div>
                    </div>
                    <div>
                        <div className="text-zinc-400 text-xs mb-1 font-semibold tracking-wider">REASON</div>
                        <div className="text-zinc-300 text-sm leading-5">
                            {pick.reason}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
