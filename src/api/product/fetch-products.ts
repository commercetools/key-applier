import { createResourceFetcher } from "../create-resource-fetcher.js";
import {
  ProductKeyableSubtype,
  keyableTypeToQuery,
} from "./keyable-type/index.js";

export const fetchWithMissingKey = (keyableType: ProductKeyableSubtype) => {
  const query = keyableTypeToQuery[keyableType];
  return createResourceFetcher(query);
};
