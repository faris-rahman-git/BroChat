import { Button } from '@client/components/ui/button';
import { cn } from '@client/lib/utils'; // make sure this exists
import React from 'react';
import { ComponentProps } from 'react';

type ButtonIconProps = {
  Icon: React.ElementType;
  label: string;
  iconClassName?: string;
  children?: React.ReactNode;
} & ComponentProps<typeof Button>;

function ButtonIcon({
  Icon,
  label,
  iconClassName,
  children,
  className,
  ...props
}: ButtonIconProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={label}
      className={cn(
        'min-w-[35px] h-[35px]  hover:cursor-pointer rounded-[6px] ',
        className
      )}
      {...props}
    >
      <Icon className={cn('size-[18px]', iconClassName)} />
      {children}
    </Button>
  );
}

export default ButtonIcon;
