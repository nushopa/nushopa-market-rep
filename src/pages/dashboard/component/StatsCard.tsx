import type { IconType } from 'react-icons';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: IconType;
  cardColor?: string;   
  iconColor?: string;  
  isLoading?: boolean;
}

const StatsCard = ({ title, value, icon: Icon, cardColor, iconColor, isLoading }: StatsCardProps) => {
  return (
    <div
      className="flex items-center justify-between p-4 rounded-lg text-white w-full max-w-xs h-24"
      style={{ backgroundColor: cardColor ?? '#D9D9D950' }}
    >
      <div className="flex flex-col">
        <p className="text-sm font-light text-gray-700 text-start">{title}</p>
        {isLoading ? (
          <div className="animate-pulse bg-gray-300 h-6 w-20 rounded" />
        ) : (
          <p className="text-2xl font-bold text-gray-700">{value}</p>
        )}
      </div>

      <div
        className="p-2 rounded-md"
        style={{ backgroundColor: isLoading ? '#D1D5DB' : `${iconColor ?? '#6B7280'}25` }}
      >
        <Icon
          className="text-2xl"
          style={{ color: isLoading ? '#374151' : (iconColor ?? '#6B7280') }}
        />
      </div>
    </div>
  );
};

export default StatsCard;