import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import './PriceChart.scss';

const TIMEFRAMES = [
  { value: '1h', label: '1 Giờ' },
  { value: '1d', label: 'Ngày' },
  { value: '1w', label: 'Tuần' },
  { value: '1M', label: 'Tháng' },
  { value: '1Y', label: 'Năm' },
];

export default function PriceChart({ data, symbol, timeframe, onTimeframeChange, isLoading = false }) {
  const isPositive = data.length >= 2
    ? data[data.length - 1]?.price >= data[0]?.price
    : true;
  const chartColor = isPositive ? '#0ECB81' : '#F6465D';

  const minPrice = data.length > 0 ? Math.min(...data.map(d => d.price)) : 0;
  const maxPrice = data.length > 0 ? Math.max(...data.map(d => d.price)) : 0;
  const range = maxPrice - minPrice;
  const yDomain = data.length > 0
    ? [Number((minPrice - range * 0.05).toFixed(2)), Number((maxPrice + range * 0.05).toFixed(2))]
    : ['auto', 'auto'];

  return (
    <div className="price-chart-container">
      {/* Chart Header */}
      <div className="chart-header">
        <div className="chart-header-left">
          <h3 className="chart-title">Biểu đồ giá {symbol}</h3>
          <span className="chart-subtitle">
            {isLoading ? 'Đang tải...' : 'Cập nhật tự động · Real-time'}
          </span>
        </div>
        <div className="timeframe-buttons">
          {TIMEFRAMES.map(tf => (
            <button
              key={tf.value}
              className={`timeframe-btn ${timeframe === tf.value ? 'active' : ''}`}
              onClick={() => onTimeframeChange(tf.value)}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Body */}
      {isLoading || data.length === 0 ? (
        <div className="chart-loading">
          <div className="spinner" />
          <span>Đang tải dữ liệu biểu đồ...</span>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={380}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2B3139" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="#848E9C"
              tick={{ fill: '#848E9C', fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: '#2B3139' }}
              interval="preserveStartEnd"
            />
            <YAxis
              stroke="#848E9C"
              tick={{ fill: '#848E9C', fontSize: 11 }}
              domain={yDomain}
              tickFormatter={v => `$${v.toLocaleString()}`}
              tickLine={false}
              axisLine={false}
              orientation="right"
              width={80}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1E2329',
                border: '1px solid #2B3139',
                borderRadius: '6px',
                color: '#EAECEF',
                fontSize: 13,
              }}
              formatter={v => [`$${Number(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 'Giá']}
              labelFormatter={label => `Thời gian: ${label}`}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={chartColor}
              strokeWidth={2}
              fill="url(#areaGradient)"
              isAnimationActive={false}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0, fill: chartColor }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
