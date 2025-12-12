import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SelectRowSizeProps {
  onPageSizeChange: (value: string) => void;
  pageSize: number;
}
const SelectRowSize = ({ onPageSizeChange, pageSize }: SelectRowSizeProps) => {
  return (
    <Select onValueChange={onPageSizeChange} value={String(pageSize)}>
      <SelectTrigger className="w-fit">
        <SelectValue placeholder="Select Rows" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Showing</SelectLabel>
          <SelectItem value="5"> 5</SelectItem>
          <SelectItem value="10"> 10</SelectItem>
          <SelectItem value="15"> 15</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectRowSize;
