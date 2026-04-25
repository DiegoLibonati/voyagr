import tourService from "@/services/tourService";

import { mockTours } from "@tests/__mocks__/tours.mock";

const mockFetchSuccess = (data: unknown): void => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => await data,
  } as Response);
};

const mockFetchError = (status: number): void => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: false,
    status,
  } as Response);
};

const mockFetchNetworkError = (message = "Network error"): void => {
  global.fetch = jest.fn().mockRejectedValue(new Error(message));
};

describe("tourService", () => {
  describe("getAll", () => {
    describe("when fetch succeeds", () => {
      it("should return an array of tours", async () => {
        mockFetchSuccess(mockTours);
        const result = await tourService.getAll();
        expect(result).toEqual(mockTours);
      });

      it("should call fetch with the correct endpoint", async () => {
        mockFetchSuccess(mockTours);
        await tourService.getAll();
        expect(global.fetch).toHaveBeenCalledWith("/react-tours-project");
      });
    });

    describe("when the server returns an error", () => {
      it("should throw an error with the HTTP status", async () => {
        mockFetchError(500);
        await expect(tourService.getAll()).rejects.toThrow("HTTP error! status: 500");
      });

      it("should throw an error with 404 status", async () => {
        mockFetchError(404);
        await expect(tourService.getAll()).rejects.toThrow("HTTP error! status: 404");
      });
    });

    describe("when there is a network error", () => {
      it("should propagate the network error", async () => {
        mockFetchNetworkError("Failed to fetch");
        await expect(tourService.getAll()).rejects.toThrow("Failed to fetch");
      });
    });
  });
});
