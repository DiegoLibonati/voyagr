import { http, HttpResponse } from "msw";

import tourService from "@/services/tourService";

import { mockMswServer } from "@tests/__mocks__/mswServer.mock";
import { mockTours } from "@tests/__mocks__/tours.mock";

describe("tourService", () => {
  describe("getAll", () => {
    describe("when the request succeeds", () => {
      it("should return an array of tours", async () => {
        const result = await tourService.getAll();

        expect(result).toEqual(mockTours);
      });

      it("should call the /react-tours-project endpoint", async () => {
        const requestSpy = jest.fn();
        mockMswServer.use(
          http.get("/react-tours-project", ({ request }) => {
            requestSpy(request.url);
            return HttpResponse.json(mockTours);
          })
        );

        await tourService.getAll();

        expect(requestSpy).toHaveBeenCalledTimes(1);
        expect(requestSpy.mock.calls[0]?.[0]).toContain("/react-tours-project");
      });
    });

    describe("when the server returns an error", () => {
      it("should throw an error with the HTTP status when the response is 500", async () => {
        mockMswServer.use(
          http.get("/react-tours-project", () => {
            return new HttpResponse(null, { status: 500 });
          })
        );

        await expect(tourService.getAll()).rejects.toThrow("HTTP error! status: 500");
      });

      it("should throw an error with the HTTP status when the response is 404", async () => {
        mockMswServer.use(
          http.get("/react-tours-project", () => {
            return new HttpResponse(null, { status: 404 });
          })
        );

        await expect(tourService.getAll()).rejects.toThrow("HTTP error! status: 404");
      });
    });

    describe("when there is a network error", () => {
      it("should propagate the network error", async () => {
        mockMswServer.use(
          http.get("/react-tours-project", () => {
            return HttpResponse.error();
          })
        );

        await expect(tourService.getAll()).rejects.toThrow();
      });
    });
  });
});
