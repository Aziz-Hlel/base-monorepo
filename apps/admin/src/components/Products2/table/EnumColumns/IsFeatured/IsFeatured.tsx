import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Star } from 'lucide-react';

const IsFeatured = ({ isFeatured }: { isFeatured: boolean }) => {
  if (isFeatured)
    return (
      <>
        <Tooltip>
          <TooltipTrigger>
            <Star className="h-4 w-4 text-amber-500/70 fill-amber-500/70" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Offer is featured</p>
          </TooltipContent>
        </Tooltip>
      </>
    );

  if (!isFeatured)
    return (
      <>
        <Tooltip>
          <TooltipTrigger>
            <Star className="h-4 w-4 text-amber-500/70" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Offer is not featured</p>
          </TooltipContent>
        </Tooltip>
      </>
    );
};

export default IsFeatured;
