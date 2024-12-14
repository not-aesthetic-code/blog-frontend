"use client"
import Image from 'next/image';
import { getStrapiMedia } from 'app/lib/utils';

interface StrapiImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
}

export function StrapiImage({
  src,
  alt,
  className,
  fill = false,
  width,
  height,
  sizes = "100vw",
  priority = false,
}: Readonly<StrapiImageProps>) {
  if (!src) return null;
  const imageUrl = getStrapiMedia(src);
  const imageFallback = `https://placehold.co/${width || 600}x${height || 400}`;

  if (fill) {
    return (
      <div className="relative w-full h-full">
        <Image
          src={imageUrl ?? imageFallback}
          alt={alt}
          fill
          sizes={sizes}
          className={`object-cover ${className || ''}`}
          priority={priority}
        />
      </div>
    );
  }

  return (
    <Image
      src={imageUrl ?? imageFallback}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      className={`object-cover ${className || ''}`}
      priority={priority}
    />
  );
}