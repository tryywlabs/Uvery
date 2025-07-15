import { Card, CardProps } from 'flowbite-react';

type CustomCardProps = CardProps & {
  title: string;
  description: string;
  image?: string;
};

export function CustomCard({
  title,
  description,
  image,
  ...props
}: CustomCardProps) {
  return (
    <Card
      className='w-full aspect-square p-4 flex flex-col items-center text-center'
      {...props}
    >
      {image && (
        <div className='h-12 w-12 flex items-center justify-center mb-4'>
          <img
            src={image}
            alt={title}
            className='h-full w-full mb-4 object-contain'
            draggable={false}
          />
        </div>
      )}
      <h5 className='text-2xl font-bold tracking-tight text-gray-900 dark:text-black'>
        {title}
      </h5>
      <p className='font-normal text-gray-700 dark:text-gray-400'>
        {description}
      </p>
    </Card>
  );
}
