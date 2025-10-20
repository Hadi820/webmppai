import React, { useState } from 'react';

interface DataSlice {
  name: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DataSlice[];
}

const DonutSegment: React.FC<{
  startAngle: number;
  endAngle: number;
  innerRadius: number;
  outerRadius: number;
  color: string;
  isHovered: boolean;
}> = ({ startAngle, endAngle, innerRadius, outerRadius, color, isHovered }) => {
  const r = isHovered ? outerRadius + 5 : outerRadius;

  const start = {
    x: r * Math.cos(startAngle),
    y: r * Math.sin(startAngle),
  };
  const end = {
    x: r * Math.cos(endAngle),
    y: r * Math.sin(endAngle),
  };
  const largeArcFlag = endAngle - startAngle <= Math.PI ? '0' : '1';

  const d = [
    `M ${start.x} ${start.y}`,
    `A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
    `L ${innerRadius * Math.cos(endAngle)} ${innerRadius * Math.sin(endAngle)}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerRadius * Math.cos(startAngle)} ${innerRadius * Math.sin(startAngle)}`,
    'Z',
  ].join(' ');

  return <path d={d} fill={color} style={{ transition: 'all 0.2s ease-in-out' }} />;
};

export const DonutChart: React.FC<DonutChartProps> = ({ data }) => {
  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);

  const total = data.reduce((sum, slice) => sum + slice.value, 0);
  
  if (total === 0) {
    return <div className="flex items-center justify-center h-full text-gray-500">Data tidak tersedia.</div>;
  }
  
  let currentAngle = -Math.PI / 2;
  const segments = data.map(slice => {
    const angle = (slice.value / total) * 2 * Math.PI;
    const segment = {
      ...slice,
      startAngle: currentAngle,
      endAngle: currentAngle + angle,
    };
    currentAngle += angle;
    return segment;
  });

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center h-full gap-6 lg:gap-12 overflow-hidden px-4">
      {/* Donut Chart */}
      <div className="relative flex-shrink-0">
        <svg viewBox="-120 -120 240 240" width="240" height="240" className="max-w-full">
          {segments.map(segment => (
            <g 
                key={segment.name}
                onMouseOver={() => setHoveredSlice(segment.name)}
                onMouseOut={() => setHoveredSlice(null)}
                className="cursor-pointer"
            >
              <DonutSegment
                {...segment}
                innerRadius={70}
                outerRadius={100}
                isHovered={hoveredSlice === segment.name}
              />
            </g>
          ))}
          <text x="0" y="-5" textAnchor="middle" fontSize="32" fontWeight="bold" fill="#1F2937">
            {total}
          </text>
          <text x="0" y="20" textAnchor="middle" fontSize="14" fill="#6B7280">
            Total Sesi
          </text>
        </svg>
      </div>
      
      {/* Legend */}
      <div className="flex-1 min-w-0 max-w-full w-full lg:max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {data.map(slice => (
            <div 
              key={slice.name} 
              className="flex items-center min-w-0 bg-white/50 p-3 sm:p-4 rounded-xl border border-blue-50 hover:shadow-md transition-all"
              onMouseOver={() => setHoveredSlice(slice.name)}
              onMouseOut={() => setHoveredSlice(null)}
            >
              <span 
                className="w-4 h-4 sm:w-5 sm:h-5 rounded-full mr-3 flex-shrink-0 shadow-sm" 
                style={{ backgroundColor: slice.color }}
              ></span>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-gray-600 truncate font-medium" title={slice.name}>
                  {slice.name}
                </p>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-lg sm:text-xl font-bold text-gray-800">
                    {slice.value}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500">
                    ({((slice.value / total) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
