import { cn } from '@/lib/utils';

const RowContainer: React.FC<React.ComponentProps<'div'>> = ({ children, ...props }) => {
  return (
    <div {...props} className={cn(' capitalize h-6 flex items-center w-fit ps-2 cursor-default', props.className)}>
      {children}
    </div>
  );
};

export default RowContainer;
