import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface IconLinkProps {
  href: string;
  imageSrc: string;
  altText: string;
  size?: number;
}

const IconLink: FC<IconLinkProps> = ({
    href,
    imageSrc,
    altText,
    size = 40
    }) => {
    return (
        <Link 
        href={href}
        className='flex items-center'
        >
            <div
            className="
            relative transition-transform duration-200 ease-in-out hover:scale-110 hover:opacity-80 cursor-pointer rounded-full overflow-hidden">
                <Image
                src={imageSrc}
                alt={altText}
                width={size}
                height={size}
                className='object-cover'
                />
            </div>
        </Link>
    );
};

export default IconLink;