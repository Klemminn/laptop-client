import React, { useEffect, useMemo, useState } from 'react';
import ReactSidebar from 'react-sidebar';
import styled from 'styled-components';
import { useMediaQuery } from 'react-responsive';
import { useHistory, useParams } from 'react-router-dom';

import { Laptop, OfferingsContainer, Filter, FilterKey } from 'types';
import { FilterService, OfferingsService } from 'services';

import { Inputs, Header } from 'components';
import { FormatUtils } from 'utils';
import { Colors } from 'styles';

const defaultFilter = {
  vendor: [],
  retailer: [],
  cpuFamily: [],
  ram: 0,
  hdd: 0,
  gpuVendor: [],
  size: [],
  resolution: [],
  text: '',
};

const FilterContainer = styled.div`
  padding: 1rem;
`;

type RouteParams = {
  filterCode: string;
};

type SidebarProps = {
  open: boolean;
  toggleSidebar(): void;
  onFilterChange(laptops: Laptop[]): void;
};

const Sidebar: React.FC<SidebarProps> = ({
  children,
  open,
  toggleSidebar,
  onFilterChange,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>(defaultFilter);
  const [laptopData, setLaptopData] = useState<null | OfferingsContainer>(null);
  const history = useHistory();

  const { filterCode }: RouteParams = useParams();

  useEffect(() => {
    const init = async () => {
      const { items } = await getLaptopData();
      if (!filterCode) {
        onFilterChange(getFilteredLaptops(items));
      } else {
        setFilter(await FilterService.getFilter(filterCode));
      }
      setIsLoading(false);
    };
    init();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!filterCode) {
      setFilter(defaultFilter);
    }
    // eslint-disable-next-line
  }, [filterCode]);

  useEffect(() => {
    onFilterChange(getFilteredLaptops());
    // eslint-disable-next-line
  }, [filter]);

  const isMobile = useMediaQuery({ query: '(max-width: 1000px)' });

  const {
    vendor: vendors = [],
    retailer: retailers = [],
    cpuFamily: cpuFamilies = [],
    ram: ramSizes = [],
    items = [],
    hdd: diskSizes = [],
    resolution: resolutions = [],
    size: sizes = [],
    gpuVendor: gpuVendors = [],
  } = laptopData ?? {};

  const approxScreenSize = (size: number) => {
    const floored = Math.floor(size);
    return floored === 11 ? 12 : floored;
  };

  const displaySizes = useMemo(
    () =>
      sizes?.reduce((accumulated: number[], size) => {
        const approxSize = approxScreenSize(size);
        !accumulated.includes(approxSize) && accumulated.push(approxSize);
        return accumulated;
      }, []),
    // eslint-disable-next-line
    [JSON.stringify(sizes)],
  );

  const getLaptopData = async () => {
    const response = await OfferingsService.getOfferings();
    setLaptopData(response);
    return response;
  };

  const getFilteredLaptops = (laptops: Laptop[] = items) => {
    const filterKeys = Object.keys(filter);
    const filteredLaptops = filterKeys.reduce((filtered, key) => {
      if (key === 'vendor' || key === 'cpuFamily' || key === 'gpuVendor') {
        const selected = filter[key];
        return !selected.length
          ? filtered
          : filtered.filter((laptop) => selected.includes(laptop[key]));
      } else if (key === 'retailer') {
        const selected = filter.retailer;
        return !selected.length
          ? filtered
          : filtered.filter((laptop) => {
              const retailers = laptop.offerings.map(
                (offering) => offering.retailerName,
              );
              return (
                retailers.findIndex((retailer) => selected.includes(retailer)) >
                -1
              );
            });
      } else if (key === 'size') {
        const selected = filter.size;
        return !selected.length
          ? filtered
          : filtered.filter((laptop) =>
              selected.includes(approxScreenSize(laptop[key])),
            );
      } else if (key === 'resolution') {
        const [lower, higher] = filter.resolution;
        const lowerIndex = resolutions.indexOf(lower);
        const higherIndex = resolutions.indexOf(higher);
        return lowerIndex < 0 || higherIndex < 0
          ? filtered
          : filtered.filter((laptop) => {
              const laptopIndex = resolutions.indexOf(laptop[key]);
              return laptopIndex >= lowerIndex && laptopIndex <= higherIndex;
            });
      } else if (key === 'ram' || key === 'hdd') {
        const selected = filter[key];
        return filtered.filter((laptop) => laptop[key] >= selected);
      } else if (key === 'text') {
        const lowercaseText = filter.text.toLowerCase();
        const lowercaseWords = lowercaseText.split(' ');
        return filtered.filter((laptop) => {
          const laptopString = JSON.stringify(laptop).toLowerCase();
          return lowercaseWords.every((word) => laptopString.includes(word));
        });
      }
      return filtered;
    }, laptops);
    return filteredLaptops;
  };

  const handleFilterChange = async (
    property: FilterKey,
    value: number | string | number[] | string[],
  ) => {
    const updated = {
      ...filter,
      [property]: value,
    };
    const code = await FilterService.createFilter(updated);
    history.push(`/${code}`);
    setFilter(updated);
  };

  return (
    <ReactSidebar
      sidebar={
        <>
          <Header showLogo={!isMobile} />
          {isLoading ? null : (
            <FilterContainer>
              <Inputs.Select
                label="Verslun"
                options={retailers.map((value) => ({
                  label: value,
                  value: value,
                }))}
                onChange={(value) => handleFilterChange('retailer', value)}
                defaultValue={filter.retailer}
                placeholder="Sía eftir verslun"
              />
              <Inputs.Select
                label="Framleiðandi"
                options={vendors.map((value) => ({
                  label: value,
                  value: value,
                }))}
                onChange={(value) => handleFilterChange('vendor', value)}
                defaultValue={filter.vendor}
                placeholder="Sía eftir framleiðanda"
              />
              <Inputs.Select
                label="Örgjörvi"
                options={cpuFamilies.map((value) => ({
                  label: value,
                  value: value.split(' - ')[1],
                }))}
                onChange={(value) => handleFilterChange('cpuFamily', value)}
                defaultValue={filter.cpuFamily}
                placeholder="Sía eftir örgjörvatýpu"
              />
              <Inputs.Select
                label="Skjákort"
                options={gpuVendors.map((value) => ({
                  label: value,
                  value: value,
                }))}
                onChange={(value) => handleFilterChange('gpuVendor', value)}
                defaultValue={filter.gpuVendor}
                placeholder="Sía eftir skjákorti"
              />
              <Inputs.Select
                label="Skjástærð"
                options={displaySizes.map((value) => ({
                  label: `${value}"`,
                  value: value,
                }))}
                onChange={(value) => handleFilterChange('size', value)}
                defaultValue={filter.size}
                placeholder="Sía eftir skjástærð"
              />

              <Inputs.Slider
                label="Upplausn"
                options={resolutions.map((value) => ({
                  label: value,
                  value: value,
                }))}
                onChange={(value: string[]) =>
                  handleFilterChange('resolution', value)
                }
                defaultValue={[filter.resolution[0], filter.resolution[1]]}
              />

              <Inputs.Slider
                label="Vinnsluminni"
                options={ramSizes.map((value) => ({
                  label: `${value}GB`,
                  value: value,
                }))}
                defaultValue={filter.ram}
                onChange={(value: number) => handleFilterChange('ram', value)}
              />
              <Inputs.Slider
                label="Harður diskur"
                options={diskSizes.map((value) => ({
                  label: FormatUtils.getDiskSizeLabel(value),
                  value: value,
                }))}
                defaultValue={filter.hdd}
                onChange={(value: number) => handleFilterChange('hdd', value)}
              />
              <Inputs.TextInput
                label="Frjáls textaleit"
                defaultValue={filter.text}
                onChange={(value) => handleFilterChange('text', value)}
              />
            </FilterContainer>
          )}
        </>
      }
      open={open}
      onSetOpen={toggleSidebar}
      docked={!isMobile}
      sidebarClassName="sidebar"
      styles={{
        sidebar: {
          backgroundColor: Colors.GreySidebar,
          width: '500px',
          maxWidth: '80%',
        },
      }}
    >
      {children}
    </ReactSidebar>
  );
};

export default Sidebar;
