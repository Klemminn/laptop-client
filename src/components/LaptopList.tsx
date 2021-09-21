import React from 'react';
import styled from 'styled-components';
import { AiOutlineFullscreen } from 'react-icons/ai';
import { BsDisplay } from 'react-icons/bs';
import { FiCpu } from 'react-icons/fi';
import { FaMemory } from 'react-icons/fa';
import { GiSolarPower } from 'react-icons/gi';
import { RiHardDriveLine } from 'react-icons/ri';

import { Laptop } from 'types';
import { FormatUtils } from 'utils';
import { ExternalLink, Layout } from 'components';
import { Colors } from 'styles';

import MissingImage from 'assets/missingimage.png';
import * as Images from './Images';

const ListContainer = styled.div``;

const ResultRow = styled(Layout.Row)`
  background-color: ${Colors.GreyBackground};
  margin: 1rem 0;
  overflow: hidden;
  border-radius: 0.8rem;
  box-shadow: 0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 3px 0 rgb(0 0 0 / 15%),
    0 1px 6px 0 rgb(0 0 0 / 10%);
`;

const ImageColumn = styled(Layout.Col)`
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: ${Colors.White};
`;

const ContentColumn = styled(Layout.Col)`
  padding: 0.5rem 1rem;
  display: flex;
  flex-direction: column;
`;

const PriceColumn = styled(ContentColumn)`
  justify-content: flex-start;
`;

type PriceTextProps = {
  isMain?: boolean;
};
const PriceText = styled.div<PriceTextProps>`
  font-weight: 600;
  font-size: ${({ isMain }) => `${isMain ? 2 : 1}rem`};
  padding-left: 0.5rem;
`;

const PriceContainer = styled(ExternalLink)`
  display: flex;
  text-align: right;
  justify-content: flex-end;
  align-items: baseline;
  font-size: 1rem;
`;

type PriceProps = {
  label: string;
  price: number;
  url: string;
  isMain?: boolean;
};

const Price: React.FC<PriceProps> = ({ label, price, isMain, url }) => (
  <PriceContainer href={url} noUnderline>
    {label}
    <PriceText isMain={isMain}>{FormatUtils.formatCurrency(price)}</PriceText>
  </PriceContainer>
);

type TitleProps = {
  transparent?: boolean;
};

const Title = styled.div<TitleProps>`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.3rem;
  color: ${({ transparent }) => `${transparent ? 'transparent' : 'inherit'};`};
`;

const SpecsItem = styled.div`
  display: flex;
  align-items: center;
  svg {
    margin-right: 0.5rem;
  }
`;

type LaptopProps = {
  laptop: Laptop;
};

const LaptopPanel: React.FC<LaptopProps> = ({ laptop }) => {
  return (
    <ExternalLink href={laptop.offerings[0].url} noUnderline>
      <ResultRow>
        <ImageColumn xs={2} md={1}>
          <Images.LaptopImage
            src={
              laptop.image
                ? FormatUtils.getSmallImageUrl(laptop.image)
                : MissingImage
            }
          />
        </ImageColumn>
        <ContentColumn xs={4}>
          <Title>{laptop.name}</Title>
          <SpecsItem>
            <FiCpu />
            {laptop.cpuVendor} {laptop.cpuModel}
          </SpecsItem>
          <SpecsItem>
            <FaMemory />
            {laptop.ram}GB
          </SpecsItem>
          <SpecsItem>
            <RiHardDriveLine />
            {FormatUtils.getDiskSizeLabel(laptop.hdd)}
          </SpecsItem>
        </ContentColumn>
        <ContentColumn xs={4}>
          <Title transparent>{laptop.name}</Title>
          <SpecsItem>
            <BsDisplay />
            {laptop.size}" {laptop.weight ? ` - ${laptop.weight}kg` : ''}
          </SpecsItem>
          <SpecsItem>
            <AiOutlineFullscreen />
            {laptop.resolution}
          </SpecsItem>
          <SpecsItem>
            <GiSolarPower />
            {laptop.gpuVendor} {laptop.gpuModel}
          </SpecsItem>
        </ContentColumn>
        <PriceColumn xs={2} md={3}>
          {laptop.offerings.map((offering, idx) => (
            <Price
              price={offering.price}
              isMain={idx === 0}
              url={offering.url}
              label={offering.retailerName}
            />
          ))}
        </PriceColumn>
      </ResultRow>
    </ExternalLink>
  );
};

type LaptopListProps = {
  laptops: Laptop[];
};

const LaptopList: React.FC<LaptopListProps> = ({ laptops }) => (
  <ListContainer>
    {laptops.map((laptop) => (
      <LaptopPanel key={laptop.id} laptop={laptop} />
    ))}
  </ListContainer>
);

export default LaptopList;
