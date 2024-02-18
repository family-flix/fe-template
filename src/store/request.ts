import { HttpClientCore } from "@/domains/http_client";

import { user } from "./user";

export const client = new HttpClientCore({
  user,
});
