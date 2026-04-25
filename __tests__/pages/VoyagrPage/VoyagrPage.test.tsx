import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { RenderResult } from "@testing-library/react";

import VoyagrPage from "@/pages/VoyagrPage/VoyagrPage";

import { mockTour, mockTours } from "@tests/__mocks__/tours.mock";

const mockFetchSuccess = (data: unknown): void => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => await data,
  } as Response);
};

const renderPage = (): RenderResult => render(<VoyagrPage />);

describe("VoyagrPage", () => {
  beforeEach(() => {
    mockFetchSuccess(mockTours);
  });

  describe("rendering", () => {
    it("should show Our Tours heading after loading completes", async () => {
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

    it("should show No Tours Left when tours list is empty", async () => {
      mockFetchSuccess([]);
      renderPage();
      expect(await screen.findByRole("heading", { name: "No Tours Left" })).toBeInTheDocument();
    });

    it("should show the Refresh button when tours list is empty", async () => {
      mockFetchSuccess([]);
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

    it("should show empty state when the last tour is deleted", async () => {
      const user = userEvent.setup();
      mockFetchSuccess([mockTour]);
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
      mockFetchSuccess([]);
      renderPage();
      await screen.findByRole("heading", { name: "No Tours Left" });
      mockFetchSuccess(mockTours);
      await user.click(screen.getByRole("button", { name: "Refresh tour list" }));
      await screen.findByRole("heading", { name: "Our Tours" });
      expect(screen.getAllByRole("button", { name: /Remove .+ from the list/ })).toHaveLength(
        mockTours.length
      );
    });
  });
});
