import { SearchableCitySelect } from '@/components/ui/SearchableCitySelect';

interface CityFilterProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const CityFilter = ({ value, onChange, className = '' }: CityFilterProps) => (
  <div className={`relative ${className}`}>
    <SearchableCitySelect 
      value={value} 
      onChange={onChange}
      placeholder="All Cities"
    />
  </div>
);
