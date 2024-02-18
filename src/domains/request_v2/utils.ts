import { JSONObject, Result } from "@/types";

// export function prepare<T>(options: {
//   url: string;
//   method?: "POST" | "GET" | "DELETE" | "PUT";
//   query?: JSONObject;
//   params?: JSONObject;
//   body?: JSONObject;
// }) {
//   return Result.Ok(options) as Result<T>;
// }

export type RequestPayload<A, T> = {
  url: string;
  method?: "POST" | "GET" | "DELETE" | "PUT";
  query?: A;
  params?: A;
  body?: A;
  headers?: Record<string, string>;
  defaultResponse?: T;
  // response: T;
};

export function prepare<A, T>(arg: {
  url: string;
  method?: "POST" | "GET" | "DELETE" | "PUT";
  query?: JSONObject;
  params?: JSONObject;
  body?: JSONObject | FormData;
  defaultResponse?: T;
  config?: Partial<{ headers: Record<string, string> }>;
}) {
  const { url, query, params, body, defaultResponse, config } = arg;
  return {
    url,
    body,
    query,
    params,
    config,
    defaultResponse,
  } as RequestPayload<A, T>;
}
