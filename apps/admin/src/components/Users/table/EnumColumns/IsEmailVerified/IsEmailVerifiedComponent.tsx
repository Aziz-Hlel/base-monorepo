import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { MailCheck, MailX } from 'lucide-react';

const IsEmailVerifiedComponent = ({ isEmailVerified }: { isEmailVerified: boolean }) => {
  if (isEmailVerified)
    return (
      <>
        <Tooltip>
          <TooltipTrigger>
            <MailCheck className="h-4 w-4 text-green-500" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Email is verified</p>
          </TooltipContent>
        </Tooltip>
      </>
    );

  if (!isEmailVerified)
    return (
      <>
        <Tooltip>
          <TooltipTrigger>
            <MailX className="h-4 w-4 text-gray-500" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Email is not verified</p>
          </TooltipContent>
        </Tooltip>
      </>
    );
};

export default IsEmailVerifiedComponent;
