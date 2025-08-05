import Image from "next/image";
import React, { useState } from "react";
import { twMerge } from "tailwind-merge";

interface Props {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  onClick?: () => void;
}

const Img: React.FC<Props> = ({
  alt,
  src,
  className,
  onClick,
  height = 900,
  width = 900,
}) => {
  const [loading, setLoading] = useState(true);
  return (
    <Image
      priority
      src={src}
      width={width}
      height={height}
      alt={alt}
      onClick={onClick}
      className={twMerge(
        `duration-300 ease-in-out w-full h-full object-cover ${
          loading ? "blur grayscale" : "blur-0 grayscale-0"
        }}`,
        className,
      )}
      onLoad={() => setLoading(false)}
    />
  );
};

export default Img;
