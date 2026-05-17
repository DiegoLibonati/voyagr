import { http, HttpResponse } from "msw";

import { mockTours } from "@tests/__mocks__/tours.mock";

export const mockMswHandlers = [
  http.get("/react-tours-project", () => {
    return HttpResponse.json(mockTours);
  }),
];
