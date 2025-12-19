
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { Review } from '../types';
import StarRating from './StarRating';

interface ReviewStatsProps {
  reviews: Review[];
}

const ReviewStats: React.FC<ReviewStatsProps> = ({ reviews }) => {
  const distribution = [5, 4, 3, 2, 1].map(star => {
    const count = reviews.filter(r => r.rating === star).length;
    return {
      name: `${star} Star`,
      count,
      star
    };
  });

  const average = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm mb-8">
      <div className="flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-gray-100 pb-8 lg:pb-0">
        <span className="text-6xl font-black text-gray-900 mb-2">{average}</span>
        <div className="mb-2">
          <StarRating rating={Number(average)} size={24} />
        </div>
        <p className="text-gray-500 text-sm">Based on {reviews.length} reviews</p>
      </div>

      <div className="lg:col-span-2 h-[180px]">
        <h4 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider">Rating Distribution</h4>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={distribution} layout="vertical" margin={{ left: -30 }}>
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={80} 
              axisLine={false} 
              tickLine={false}
              tick={{ fontSize: 12, fontWeight: 500, fill: '#6b7280' }}
            />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={12}>
              {distribution.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.star >= 4 ? '#fbbf24' : entry.star === 3 ? '#fbbf24' : '#d1d5db'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ReviewStats;
