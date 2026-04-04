import { toursService } from "@/services/toursSerivce";

import { mockTours } from "@tests/__mocks__/tours.mock";

const mockedFetch = fetch as jest.MockedFunction<typeof fetch>;

describe("toursService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAll", () => {
    it("should return tours on successful fetch", async () => {
      mockedFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockTours),
      } as unknown as Response);
      const result = await toursService.getAll();
      expect(result).toEqual(mockTours);
      expect(mockedFetch).toHaveBeenCalledWith("/react-tours-project");
    });

    it("should throw an error on 404 response", async () => {
      mockedFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as unknown as Response);
      await expect(toursService.getAll()).rejects.toThrow("HTTP error! status: 404");
    });

    it("should throw an error on 500 response", async () => {
      mockedFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as unknown as Response);
      await expect(toursService.getAll()).rejects.toThrow("HTTP error! status: 500");
    });
  });
});
