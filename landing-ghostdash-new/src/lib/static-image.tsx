// Static replacement for BaseHubImage
import Image, { ImageProps } from "next/image";

interface BaseHubImageProps extends Omit<ImageProps, "src"> {
  src: string;
  alt: string;
}

/**
 * Static replacement for BaseHub's BaseHubImage component
 * Uses Next.js Image component directly
 */
export function BaseHubImage({ src, alt, ...props }: BaseHubImageProps) {
  return <Image src={src} alt={alt} {...props} />;
}
