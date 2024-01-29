import axios from "axios";
import { DataType } from "./App.dto";

const api = axios.create();

export const getAllProducts = (limit: number) => {
  return api.get<DataType>(`https://dummyjson.com/products?limit=${limit}`);
};

export const searchProducts = (search: string) => {
  return api.get<DataType>(
    `https://dummyjson.com/products/search?q=${search
      .toLocaleLowerCase()
      .trim()}`
  );
};
