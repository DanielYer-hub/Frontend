import axios from "axios";

const COUNTRY_API_ROOT = "https://countriesnow.space/api/v0.1";

type CountryListResponse = {
  error?: boolean;
  msg?: string;
  data?: Array<{ country?: string; name?: string }>;
};

type CityListResponse = {
  error?: boolean;
  msg?: string;
  data?: string[];
};

function normalizeList(values: Array<string | undefined> | undefined) {
  return (values || [])
    .map((v) => (v || "").trim())
    .filter((v) => v.length > 0)
    .sort((a, b) => a.localeCompare(b));
}

export async function listCountries(): Promise<string[]> {
  const res = await axios.get<CountryListResponse>(`${COUNTRY_API_ROOT}/countries`);
  const countries = normalizeList(res.data.data?.map((item) => item.country || item.name));
  if (!countries.length) {
    throw new Error(res.data.msg || "Country list is empty");
  }
  return countries;
}

export async function listCitiesByCountry(country: string): Promise<string[]> {
  const res = await axios.post<CityListResponse>(`${COUNTRY_API_ROOT}/countries/cities`, {
    country,
  });
  const cities = normalizeList(res.data.data);
  if (!cities.length) {
    throw new Error(res.data.msg || "City list is empty");
  }
  return cities;
}
