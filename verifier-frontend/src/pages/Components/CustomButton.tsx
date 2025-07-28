import { Button as FlowbiteButton, ButtonProps } from 'flowbite-react';

type CustomButtonProps = ButtonProps & {
  children: React.ReactNode;
};

export function CustomButton({ children, ...props }: CustomButtonProps) {
  return (
    <div className='flex flex-wrap gap-2 hover:cursor-pointer hover:opacity-80 transition-opacity duration-200'>
      <FlowbiteButton {...props}>{children}</FlowbiteButton>
    </div>
  );
}
