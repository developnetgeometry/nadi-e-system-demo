
export interface CountryOption {
  value: string;
  label: string;
}

// Sample data - in a real app this would come from an API
export const countries: CountryOption[] = [
  { value: "us", label: "United States" },
  { value: "ca", label: "Canada" },
  { value: "mx", label: "Mexico" },
  { value: "br", label: "Brazil" },
  { value: "ar", label: "Argentina" },
  { value: "uk", label: "United Kingdom" },
  { value: "fr", label: "France" },
  { value: "de", label: "Germany" },
  { value: "it", label: "Italy" },
  { value: "es", label: "Spain" },
  { value: "jp", label: "Japan" },
  { value: "cn", label: "China" },
  { value: "in", label: "India" },
  { value: "au", label: "Australia" },
  { value: "nz", label: "New Zealand" },
  { value: "za", label: "South Africa" },
  { value: "ng", label: "Nigeria" },
  { value: "eg", label: "Egypt" },
  { value: "ru", label: "Russia" },
  { value: "kr", label: "South Korea" },
];

export const getPaginatedItems = (
  items: CountryOption[],
  page: number,
  itemsPerPage: number
): CountryOption[] => {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return items.slice(startIndex, endIndex);
};

export const TOTAL_PAGES = 5;
export const ITEMS_PER_PAGE = 5;
