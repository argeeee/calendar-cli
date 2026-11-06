import type { calendar_v3 } from "googleapis";
import type { GoogleEventListResponse } from "./GoogleEventListResponse";

export type GoogleEventListMethod = (
  params: calendar_v3.Params$Resource$Events$List,
) => Promise<GoogleEventListResponse>;
