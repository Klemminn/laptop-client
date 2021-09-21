export type Offering = {
  id: number;
  retailerName: string;
  retailerCode: string;
  price: number;
  url: string;
};

export type Laptop = {
  id: number;
  sku: string;
  name: string;
  vendor: string;
  cpuVendor: string;
  cpuModel: string;
  ram: number;
  image: null | string;
  hdd: number;
  size: number;
  resolution: string;
  gpuModel: string;
  gpuVendor: string;
  weight: number;
  offerings: Offering[];
  cpuFamily: string;
  minPrice: number;
};

export type OfferingsContainer = {
  vendor: Laptop['vendor'][];
  retailer: Offering['retailerName'][];
  cpuFamily: Laptop['cpuFamily'][];
  ram: Laptop['ram'][];
  items: Laptop[];
  hdd: Laptop['hdd'][];
  gpuVendor: string[];
  size: Laptop['size'][];
  resolution: Laptop['resolution'][];
};

export type Filter = {
  vendor: string[];
  retailer: string[];
  cpuFamily: string[];
  ram: number;
  hdd: number;
  gpuVendor: string[];
  size: number[];
  resolution: string[];
  text: string;
};

export type FilterKey = keyof Filter;
