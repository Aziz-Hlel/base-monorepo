import { cn } from '@/lib/utils';

const RowContainer: React.FC<React.ComponentProps<'div'>> = ({ children, ...props }) => {
  return (
    <div
      {...props}
      className={cn(' capitalize h-6 flex items-center justify-start ps-2 cursor-default truncate ', props.className)}
    >
      {children}
    </div>
  );
};

export default RowContainer;
