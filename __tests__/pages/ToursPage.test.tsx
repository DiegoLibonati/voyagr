import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ToursPage from "@/pages/ToursPage/ToursPage";

import { mockTours, mockTour } from "@tests/__mocks__/tours.mock";

type RenderPage = { container: HTMLElement };

const mockedFetch = fetch as jest.MockedFunction<typeof fetch>;

const renderPage = (): RenderPage => {
  const { container } = render(<ToursPage />);
  return { container };
};

describe("ToursPage", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the main element", async () => {
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockTours),
    } as unknown as Response);
    const { container } = renderPage();
    await waitFor(() => {
      expect(container.querySelector<HTMLElement>("main.tours-page")).toBeInTheDocument();
    });
  });

  it("should show loading title while fetching", async () => {
    mockedFetch.mockImplementationOnce(() => new Promise(() => {}));
    renderPage();
    expect(await screen.findByRole("heading", { name: "Searching Tours..." })).toBeInTheDocument();
  });

  it("should render tour cards after successful fetch", async () => {
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockTours),
    } as unknown as Response);
    const { container } = renderPage();
    expect(await screen.findByRole("heading", { name: "Our Tours" })).toBeInTheDocument();
    expect(container.querySelectorAll<HTMLElement>("article.card")).toHaveLength(mockTours.length);
  });

  it("should show 'No Tours Left' when fetch returns empty array", async () => {
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue([]),
    } as unknown as Response);
    renderPage();
    expect(await screen.findByRole("heading", { name: "No Tours Left" })).toBeInTheDocument();
  });

  it("should show refresh button when there are no tours", async () => {
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue([]),
    } as unknown as Response);
    renderPage();
    expect(await screen.findByRole("button", { name: "Refresh tour list" })).toBeInTheDocument();
  });

  it("should re-fetch tours when clicking Refresh", async () => {
    const user = userEvent.setup();
    mockedFetch
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue([]),
      } as unknown as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockTours),
      } as unknown as Response);
    renderPage();
    const refreshBtn = await screen.findByRole("button", { name: "Refresh tour list" });
    await user.click(refreshBtn);
    expect(await screen.findByRole("heading", { name: "Our Tours" })).toBeInTheDocument();
  });

  it("should remove a tour when clicking Not Interested", async () => {
    const user = userEvent.setup();
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockTours),
    } as unknown as Response);
    const { container } = renderPage();
    await screen.findByRole("heading", { name: "Our Tours" });
    const firstTour = mockTours[0]!;
    await user.click(
      screen.getByRole("button", { name: `Remove ${firstTour.name} from the list` })
    );
    expect(screen.queryByText(firstTour.name)).not.toBeInTheDocument();
    expect(container.querySelectorAll<HTMLElement>("article.card")).toHaveLength(
      mockTours.length - 1
    );
  });

  it("should show 'No Tours Left' after deleting the last tour", async () => {
    const user = userEvent.setup();
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue([mockTour]),
    } as unknown as Response);
    renderPage();
    await screen.findByRole("heading", { name: "Our Tours" });
    await user.click(screen.getByRole("button", { name: `Remove ${mockTour.name} from the list` }));
    expect(await screen.findByRole("heading", { name: "No Tours Left" })).toBeInTheDocument();
  });
});
