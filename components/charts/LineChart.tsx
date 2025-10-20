import React, { useState, useMemo } from 'react';

interface DataPoint {
  date: string;
  value: number;
}

interface LineChartProps {
  data: DataPoint[];
}

export const LineChart: React.FC<LineChartProps> = ({ data }) => {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; date: string; value: number } | null>(null);
  
  const width = 500;
  const height = 280;
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };

  const { xScale, yScale, pathData, circles } = useMemo(() => {
    if (!data || data.length === 0) return { xScale: () => 0, yScale: () => 0, pathData: '', circles: [] };

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const dates = data.map(d => new Date(d.date));
    const maxValue = Math.max(...data.map(d => d.value), 0) * 1.1;

    const xScale = (date: Date) => 
      margin.left + ((date.getTime() - dates[0].getTime()) / (dates[dates.length - 1].getTime() - dates[0].getTime())) * innerWidth;

    const yScale = (value: number) => 
      height - margin.bottom - (value / maxValue) * innerHeight;

    const pathData = data.map((d, i) => {
        const x = xScale(new Date(d.date));
        const y = yScale(d.value);
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
      }).join(' ');
    
    // Detect if data is monthly for label formatting
    const isYearlyView = data.length === 12 && data.every(d => new Date(d.date).getDate() === 1);

    const circles = data.map(d => ({
        cx: xScale(new Date(d.date)),
        cy: yScale(d.value),
        date: isYearlyView
          ? new Date(d.date).toLocaleDateString('id-ID', { month: 'short' })
          : new Date(d.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
        value: d.value,
    }));
    
    return { xScale, yScale, pathData, circles };

  }, [data, width, height, margin]);

  const yAxisLabels = useMemo(() => {
    if (!data || data.length === 0) return [];
    const maxValue = Math.max(...data.map(d => d.value), 0) * 1.1;
    const ticks = 5;
    return Array.from({ length: ticks + 1 }).map((_, i) => {
      const value = (maxValue / ticks) * i;
      return {
        y: yScale(value),
        label: Math.round(value),
      };
    });
  }, [data, yScale]);
  
  const handleMouseOver = (e: React.MouseEvent<SVGRectElement>, circle: typeof circles[0]) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      date: circle.date,
      value: circle.value
    });
  };

  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-full text-gray-500">Data tidak tersedia untuk rentang ini.</div>;
  }

  return (
    <div className="relative w-full h-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
        {/* Y-axis labels and grid lines */}
        {yAxisLabels.map(tick => (
          <g key={tick.label} className="text-gray-400">
            <line
              x1={margin.left}
              x2={width - margin.right}
              y1={tick.y}
              y2={tick.y}
              stroke="currentColor"
              strokeWidth="0.5"
              strokeDasharray="2,2"
            />
            <text x={margin.left - 8} y={tick.y} dy="0.32em" textAnchor="end" fontSize="10">
              {tick.label}
            </text>
          </g>
        ))}
        {/* X-axis labels (simplified) */}
        <text x={margin.left} y={height - 5} fontSize="10" textAnchor="start" fill="currentColor" className="text-gray-500">
          {circles[0]?.date}
        </text>
        <text x={width-margin.right} y={height-5} fontSize="10" textAnchor="end" fill="currentColor" className="text-gray-500">
          {circles[circles.length - 1]?.date}
        </text>


        {/* Gradient under the line */}
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <path d={`${pathData} V ${height - margin.bottom} H ${margin.left} Z`} fill="url(#areaGradient)" />

        {/* The line */}
        <path d={pathData} fill="none" stroke="#3B82F6" strokeWidth="2" />
        
        {/* Circles and hover targets */}
        {circles.map((circle, i) => (
          <g key={i}>
            <circle cx={circle.cx} cy={circle.cy} r="4" fill="#3B82F6" stroke="white" strokeWidth="2" />
             <rect
                x={circle.cx - 10}
                y={0}
                width={20}
                height={height}
                fill="transparent"
                onMouseOver={(e) => handleMouseOver(e, circle)}
                onMouseOut={() => setTooltip(null)}
            />
          </g>
        ))}
      </svg>
      {tooltip && (
        <div 
          className="absolute bg-gray-800 text-white text-xs rounded-md py-1 px-2 pointer-events-none transition-transform"
          style={{ transform: `translate(${tooltip.x + 10}px, ${tooltip.y - 10}px)` }}
        >
          <div>{tooltip.date}</div>
          <div className="font-bold">{tooltip.value} sesi</div>
        </div>
      )}
    </div>
  );
};