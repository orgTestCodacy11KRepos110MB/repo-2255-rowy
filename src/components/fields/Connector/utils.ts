import { TableRow } from "@src/types/table";
import { get } from "lodash-es";
export const sanitiseValue = (value: any) => {
  if (value === undefined || value === null || value === "") return [];
  else return value as string[];
};

export const replacer = (data: any) => (m: string, key: string) => {
  const objKey = key.split(":")[0];
  const defaultValue = key.split(":")[1] || "";
  return get(data, objKey, defaultValue);
};

export const baseFunction = `const connectorFn: Connector = async ({query, row, user}) => {
  // TODO: Implement your service function here
  return [];
};`;

export const getLabel = (config: any, row: TableRow) => {
  if (!config.labelFormatter) {
    return `⚠️ needs configuration`;
  } else if (config.labelFormatter.includes("{{")) {
    return config.labelFormatter.replace(/\{\{(.*?)\}\}/g, replacer(row));
  } else {
    return get(row, config.labelFormatter);
  }
};
