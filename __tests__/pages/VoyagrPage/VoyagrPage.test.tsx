import { render, screen, waitForElementToBeRemoved } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { RenderResult } from "@testing-library/react";

import VoyagrPage from "@/pages/VoyagrPage/VoyagrPage";

import tourService from "@/services/tourService";

import { mockTour, mockTours } from "@tests/__mocks__/tours.mock";

const mockGetAll = tourService.getAll as jest.MockedFunction<typeof tourService.getAll>;

jest.mock("@/services/tourService", () => ({
  __esModule: true,
  default: {
    getAll: jest.fn(),
  },
}));

const renderPage = (): RenderResult => render(<VoyagrPage />);

describe("VoyagrPage", () => {
  beforeEach(() => {
    mockGetAll.mockResolvedValue(mockTours);
  });

  describe("rendering", () => {
    it("should show the loading heading while fetching tours", () => {
      mockGetAll.mockReturnValue(
        new Promise(() => {
          // Empty fn
        })
      );
      renderPage();

      expect(screen.getByRole("heading", { name: "Searching Tours..." })).toBeInTheDocument();
    });

    it("should show the Our Tours heading after the request resolves", async () => {
      renderPage();

      expect(await screen.findByRole("heading", { name: "Our Tours" })).toBeInTheDocument();
    });

    it("should render a card for each tour", async () => {
      renderPage();

      await screen.findByRole("heading", { name: "Our Tours" });

      expect(screen.getAllByRole("button", { name: /Remove .+ from the list/ })).toHaveLength(
        mockTours.length
      );
    });

    it("should render a heading for each tour name", async () => {
      renderPage();

      await screen.findByRole("heading", { name: "Our Tours" });

      for (const tour of mockTours) {
        expect(screen.getByRole("heading", { name: tour.name })).toBeInTheDocument();
      }
    });

    it("should show the No Tours Left heading when the response is empty", async () => {
      mockGetAll.mockResolvedValue([]);
      renderPage();

      expect(await screen.findByRole("heading", { name: "No Tours Left" })).toBeInTheDocument();
    });

    it("should show the Refresh button when there are no tours", async () => {
      mockGetAll.mockResolvedValue([]);
      renderPage();

      await screen.findByRole("heading", { name: "No Tours Left" });

      expect(screen.getByRole("button", { name: "Refresh tour list" })).toBeInTheDocument();
    });

    it("should not show the Refresh button when tours are loaded", async () => {
      renderPage();

      await screen.findByRole("heading", { name: "Our Tours" });

      expect(screen.queryByRole("button", { name: "Refresh tour list" })).not.toBeInTheDocument();
    });
  });

  describe("behavior", () => {
    it("should remove a tour from the list when Not Interested is clicked", async () => {
      const user = userEvent.setup();
      renderPage();

      await screen.findByRole("heading", { name: "Our Tours" });
      const tourToDelete = mockTours[0]!;

      await user.click(
        screen.getByRole("button", { name: `Remove ${tourToDelete.name} from the list` })
      );

      expect(screen.queryByRole("heading", { name: tourToDelete.name })).not.toBeInTheDocument();
      expect(screen.getAllByRole("button", { name: /Remove .+ from the list/ })).toHaveLength(
        mockTours.length - 1
      );
    });

    it("should show the empty state when the last tour is deleted", async () => {
      const user = userEvent.setup();
      mockGetAll.mockResolvedValue([mockTour]);
      renderPage();

      await screen.findByRole("heading", { name: "Our Tours" });

      await user.click(
        screen.getByRole("button", { name: `Remove ${mockTour.name} from the list` })
      );

      expect(await screen.findByRole("heading", { name: "No Tours Left" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Refresh tour list" })).toBeInTheDocument();
    });

    it("should re-fetch tours when Refresh is clicked", async () => {
      const user = userEvent.setup();
      mockGetAll.mockResolvedValueOnce([]);
      renderPage();

      await screen.findByRole("heading", { name: "No Tours Left" });

      mockGetAll.mockResolvedValueOnce(mockTours);

      await user.click(screen.getByRole("button", { name: "Refresh tour list" }));

      await screen.findByRole("heading", { name: "Our Tours" });

      expect(screen.getAllByRole("button", { name: /Remove .+ from the list/ })).toHaveLength(
        mockTours.length
      );
      expect(mockGetAll).toHaveBeenCalledTimes(2);
    });

    it("should call tourService.getAll on mount", async () => {
      renderPage();

      await screen.findByRole("heading", { name: "Our Tours" });

      expect(mockGetAll).toHaveBeenCalledTimes(1);
    });
  });

  describe("loading state", () => {
    it("should remove the loading heading once the request resolves", async () => {
      renderPage();

      await waitForElementToBeRemoved(() =>
        screen.queryByRole("heading", { name: "Searching Tours..." })
      );

      expect(screen.getByRole("heading", { name: "Our Tours" })).toBeInTheDocument();
    });
  });
});
