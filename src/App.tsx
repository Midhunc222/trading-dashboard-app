import { useState, useEffect } from 'react';
import StockPickCard from './components/StockPickCard';

export default function App() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState('Daily');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchData();
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiUrl = 'https://trading-backend-api-b523.onrender.com/api/dashboard-data';

      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('API Request Failed');
      const json = await response.json();
      setData(json);
    } catch (err) {
      console.error(err);
      setError('Could not connect to AI Engine. Cloud backend failed to respond correctly.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 flex-col h-screen w-full bg-zinc-950 items-center justify-center">
        <div className="text-white font-bold text-xl mb-2">Running AI Screener...</div>
        <div className="text-zinc-500 text-sm">Processing 500+ overnight data points</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-1 flex-col h-screen w-full bg-zinc-950 items-center justify-center p-6">
        <div className="text-rose-500 font-bold mb-2">Backend Connection Error</div>
        <div className="text-zinc-400 text-sm mb-6 text-center">{error}</div>
        <button onClick={fetchData} className="px-6 py-3 cursor-pointer bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 rounded-xl font-bold overflow-hidden transition-colors">
          Retry Connection
        </button>
      </div>
    );
  }

  const { PICKS = [], SECTORS = [], CURRENCY = [], GLOBAL_MARKETS = [], SPECULATIONS = [] } = data;
  const filteredPicks = PICKS.filter((pick: any) => pick.passingTimeframes && pick.passingTimeframes.includes(timeframe));

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const formattedDate = `${days[currentTime.getDay()]}, ${months[currentTime.getMonth()]} ${currentTime.getDate()}`;

  let hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const minutesStr = minutes < 10 ? '0' + minutes : minutes;
  const formattedTime = `${hours}:${minutesStr} ${ampm}`;

  return (
    <div className="flex flex-col h-screen w-full bg-zinc-950 font-sans antialiased text-white selection:bg-indigo-500/30">
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 max-w-2xl mx-auto w-full pb-10 custom-scrollbar style={{ scrollMode: 'smooth' }}">
        <div className="mb-6 mt-4">
          <h1 className="text-3xl font-bold text-white tracking-tight m-0">Market Dashboard</h1>
          <div className="flex flex-row items-center mt-1">
            <span className="text-zinc-400 font-medium uppercase tracking-wider text-xs">{formattedDate}</span>
            <span className="text-zinc-700 mx-2">•</span>
            <span className="text-indigo-400 font-bold uppercase text-xs tracking-wider">{formattedTime}</span>
          </div>
        </div>

        {/* Core Macro Widget */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-4">
          <h2 className="text-white font-semibold text-lg mb-3 m-0">Core Macro & News</h2>
          <div className="mb-4 pb-4 border-b border-zinc-800/50">
            <div className="flex flex-row justify-between mb-1">
              <span className="text-zinc-400 font-medium">India VIX</span>
              <span className="text-rose-400 font-bold">14.36 (+6.70%)</span>
            </div>
            <p className="text-zinc-500 text-xs leading-5 m-0">
              <span className="text-zinc-300 font-bold">VIX Context: </span>
              A spike near 15 suggests traders are paying higher premiums for Put options (insurance) ahead of weekend geopolitical news. Expect gap-up/down morning openings. Strict Stop-Losses required.
            </p>
          </div>
          <p className="text-zinc-400 text-sm leading-6 m-0">
            <span className="text-white font-medium">Daily Catalyst: </span>
            Markets tracking potential US-India tariff impact and ongoing Middle East resolutions after significant early-week volatility.
          </p>
        </div>

        {/* Global Currency Predictor */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-4">
          <h2 className="text-white font-semibold text-lg mb-3 m-0">Global Currency Predictor</h2>
          {CURRENCY.map((c: any, i: number) => (
            <div key={i} className={`flex flex-row justify-between items-center ${i !== CURRENCY.length - 1 ? 'mb-3 pb-3 border-b border-zinc-800/50' : ''}`}>
              <div>
                <div className="text-white font-bold">{c.pair}</div>
                <div className="text-zinc-500 text-xs">{c.signal}</div>
              </div>
              <div className="text-right">
                <div className="text-white font-medium">{c.value}</div>
                <div className={c.change.startsWith('+') ? 'text-rose-400 text-xs' : 'text-emerald-400 text-xs'}>{c.change}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Global Markets Predictor */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-4">
          <h2 className="text-white font-semibold text-lg mb-3 m-0">Global Indices, ADRs &amp; Commodities</h2>
          {GLOBAL_MARKETS.map((m: any, i: number) => (
            <div key={i} className={`flex flex-row justify-between items-center ${i !== GLOBAL_MARKETS.length - 1 ? 'mb-3 pb-3 border-b border-zinc-800/50' : ''}`}>
              <div>
                <div className="text-white font-bold">{m.region}</div>
                <div className="text-zinc-500 text-xs">{m.signal}</div>
              </div>
              <div className="text-right">
                <div className="text-white font-medium">{m.value}</div>
                <div className={m.change.startsWith('+') ? 'text-emerald-400 text-xs font-bold' : 'text-rose-400 text-xs font-bold'}>{m.change}</div>
              </div>
            </div>
          ))}
          <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex flex-row items-center">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex flex-col items-center justify-center mr-3 shrink-0">
              <span className="text-emerald-400 text-lg leading-none">↗</span>
            </div>
            <div className="flex-1">
              <div className="text-emerald-400 font-bold text-sm mb-0.5">PRE-MARKET PREDICTION: GAP UP</div>
              <div className="text-emerald-400/80 text-xs leading-tight">Tech/ADR strength outweighs China weakness. Expect Nifty open +50/70 pts. Buy dips near VWAP.</div>
            </div>
          </div>
        </div>

        {/* Sector Thematic Trends */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-6">
          <h2 className="text-white font-semibold text-lg mb-3 m-0">Sector Geopolitics &amp; Themes</h2>
          {SECTORS.map((s: any, i: number) => (
            <div key={i} className={`mb-3 ${i !== SECTORS.length - 1 ? 'pb-3 border-b border-zinc-800/50' : ''}`}>
              <div className="flex flex-row justify-between items-center mb-1">
                <div className="text-white font-bold">{s.name}</div>
                <div className={s.trend === 'Bullish' ? 'text-emerald-400 text-xs font-bold tracking-wide' : s.trend === 'Bearish' ? 'text-rose-400 text-xs font-bold tracking-wide' : 'text-amber-400 text-xs font-bold tracking-wide'}>
                  {s.trend.toUpperCase()}
                </div>
              </div>
              <p className="text-zinc-400 text-sm leading-5 m-0">{s.reason}</p>
            </div>
          ))}
        </div>

        {/* Global Speculations Table */}
        <div className="mb-6">
          <h2 className="text-white font-semibold text-lg mb-3 m-0">Global Speculations &amp; Regulations</h2>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden py-2 shadow-sm">
            <div className="overflow-x-auto px-4 custom-scrollbar">
              <div className="min-w-max">
                <div className="flex flex-row border-b border-zinc-800 pb-3 mb-2 pt-2">
                  <div className="text-zinc-500 font-bold w-48 text-[10px] tracking-widest shrink-0">SPECULATION / THEME</div>
                  <div className="text-zinc-500 font-bold w-64 text-[10px] tracking-widest pl-4 shrink-0">ACTUAL NEWS SUMMARY</div>
                  <div className="text-zinc-500 font-bold w-48 text-[10px] tracking-widest pl-4 shrink-0">IMPACTED STOCKS</div>
                  <div className="text-zinc-500 font-bold w-72 text-[10px] tracking-widest pl-4 shrink-0">IMPACT RATIONALE</div>
                  <div className="text-zinc-500 font-bold w-24 text-[10px] tracking-widest pl-4 shrink-0">SECTOR TREND</div>
                  <div className="text-zinc-500 font-bold w-32 text-[10px] tracking-widest pl-4 shrink-0">STOCK TREND</div>
                </div>
                {SPECULATIONS.map((spec: any, i: number) => {
                  const formatStocks = (stocks: any) => {
                    if (!stocks) return '';
                    if (Array.isArray(stocks)) return stocks.join(', ');
                    return String(stocks).split(',').map(s => s.trim()).join(', ');
                  };
                  return (
                    <div key={i} className={`flex flex-row items-center py-4 ${i !== SPECULATIONS.length - 1 ? 'border-b border-zinc-800/40' : ''}`}>
                      <div className="text-white font-semibold w-48 text-xs pr-4 leading-relaxed shrink-0 text-wrap break-words">{spec.theme}</div>
                      <div className="text-zinc-400 w-64 text-xs pr-4 leading-relaxed pl-4 shrink-0 text-wrap break-words">{spec.news}</div>
                      <div className="text-zinc-300 w-48 text-xs font-medium pl-4 shrink-0 text-wrap break-words">{formatStocks(spec.stocks)}</div>
                      <div className="text-zinc-400 w-72 text-xs pr-4 leading-relaxed pl-4 shrink-0 text-wrap break-words">{spec.reason}</div>
                      <div className={`w-24 text-xs font-bold pl-4 shrink-0 ${spec.sectorTrend === 'Bullish' ? 'text-emerald-400' : spec.sectorTrend === 'Bearish' ? 'text-rose-400' : 'text-amber-400'}`}>
                        {spec.sectorTrend.toUpperCase()}
                      </div>
                      <div className="text-zinc-300 w-32 text-xs pr-2 pl-4 truncate shrink-0">{spec.stockTrend}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Institutional Flow */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-6">
          <h2 className="text-white font-semibold text-lg mb-2 m-0">Institutional Flow (Cash)</h2>
          <div className="flex flex-row justify-between items-center mb-3">
            <span className="text-zinc-400">FII Net</span>
            <div className="flex-1 ml-4 mr-2 h-2 bg-zinc-800 rounded-full overflow-hidden flex flex-row justify-end">
              <div className="w-1/3 bg-rose-500 h-full rounded-full" />
            </div>
            <span className="text-rose-400 font-bold">-₹934 Cr</span>
          </div>
          <div className="flex flex-row justify-between items-center">
            <span className="text-zinc-400">DII Net</span>
            <div className="flex-1 mx-4 h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div className="w-3/4 bg-emerald-500 h-full rounded-full" />
            </div>
            <span className="text-emerald-400 font-bold">+₹2,637 Cr</span>
          </div>
        </div>

        {/* Actionable Picks Header */}
        <div className="mb-4">
          <div className="flex flex-row items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-white m-0">Actionable Picks</h2>
            <div className="flex flex-row bg-zinc-800/80 rounded-lg p-1 border border-zinc-700/50">
              <button
                onClick={() => setTimeframe('Daily')}
                className={`px-3 py-1 text-xs font-bold rounded-md cursor-pointer transition-colors focus:outline-none border-none ${timeframe === 'Daily' ? 'bg-indigo-500 text-white' : 'bg-transparent text-zinc-500 hover:text-zinc-300'}`}
              >
                DAILY
              </button>
              <button
                onClick={() => setTimeframe('Weekly')}
                className={`px-3 py-1 text-xs font-bold rounded-md cursor-pointer transition-colors focus:outline-none border-none ${timeframe === 'Weekly' ? 'bg-indigo-500 text-white' : 'bg-transparent text-zinc-500 hover:text-zinc-300'}`}
              >
                WEEKLY
              </button>
            </div>
          </div>

          <div className="bg-indigo-500/10 p-3 rounded-xl border border-indigo-500/20 mb-3">
            <div className="text-indigo-400 text-xs font-bold mb-1 tracking-wider">
              {timeframe.toUpperCase()} SCREENER RULES:
            </div>
            <p className="text-indigo-300/80 text-[11px] leading-relaxed m-0">
              • <span className="font-semibold text-indigo-300">EMA:</span> 20 &gt; 50 &amp; Prc &gt; 200 &nbsp;&nbsp;
              • <span className="font-semibold text-indigo-300">MoM:</span> RSI &gt; 60 &amp; ADX &gt; 25<br />
              • <span className="font-semibold text-indigo-300">Vol/Del:</span> &gt; 20d Avg + Del% ↑ 3 days &nbsp;&nbsp;
              • <span className="font-semibold text-indigo-300">Sector:</span> Bullish Trend
            </p>
          </div>
        </div>

        {/* Picks List */}
        <div className="pb-10">
          {filteredPicks.length === 0 ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center justify-center">
              <div className="text-zinc-400 font-semibold mb-1">No setups meeting strict criteria</div>
              <div className="text-zinc-500 text-xs text-center">There are no stocks actively meeting the multi-indicator {timeframe} trend criteria.</div>
            </div>
          ) : (
            filteredPicks.map((pick: any, i: number) => (
              <StockPickCard key={i} pick={pick} activeTimeframe={timeframe} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
