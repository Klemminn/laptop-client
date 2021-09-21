import React from 'react';
import styled from 'styled-components';
import { LazyImage } from 'react-lazy-images';

import { FormatUtils } from 'utils';

type SizedImageProps = {
  size: number;
};

export const SizedImage = styled.img<SizedImageProps>`
  height: ${({ size }) => `${size}rem`};
`;

type ImageProps = {
  src: string;
  size?: number;
};

export const Thumbnail: React.FC<ImageProps> = ({ src, size = 2 }) => (
  <LazyImage
    placeholder={({ ref }) => <div ref={ref} />}
    src={FormatUtils.getSmallImageUrl(src)}
    actual={({ imageProps }) => <SizedImage size={size} {...imageProps} />}
  />
);

export const LaptopImage: React.FC<ImageProps> = ({ src }) => (
  <LazyImage
    placeholder={({ ref }) => <div ref={ref} />}
    src={src}
    actual={({ imageProps }) => <img width="100%" alt="" {...imageProps} />}
  />
);
