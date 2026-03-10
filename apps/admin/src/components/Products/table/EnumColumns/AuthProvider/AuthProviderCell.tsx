import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import RowContainer from '../../ContainerComp/RowContainer';
import { AUTH_PROVIDER_VARIANTS } from './provider-variants';
import { Button } from '@/components/ui/button';

const AuthProviderCell = ({ value }: { value: string }) => {
  if (!value) {
    return null;
  }
  if (!(value in AUTH_PROVIDER_VARIANTS)) {
    return (
      <RowContainer className="w-fit">
        <div>N/A</div>
      </RowContainer>
    );
  }
  const Svg = AUTH_PROVIDER_VARIANTS[value as keyof typeof AUTH_PROVIDER_VARIANTS].Svg;
  const displayLabel = AUTH_PROVIDER_VARIANTS[value as keyof typeof AUTH_PROVIDER_VARIANTS].label;
  return (
    <RowContainer className="w-fit">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant={'ghost'}>{Svg}</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{displayLabel}</p>
        </TooltipContent>
      </Tooltip>
    </RowContainer>
  );
};

export default AuthProviderCell;
