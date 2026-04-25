import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { RenderResult } from "@testing-library/react";
import type { CardTourProps } from "@/types/props";

import CardTour from "@/components/CardTour/CardTour";

import { mockTour } from "@tests/__mocks__/tours.mock";

const mockHandleDeleteTour = jest.fn();

const renderComponent = (props: Partial<CardTourProps> = {}): RenderResult => {
  const defaultProps: CardTourProps = {
    id: mockTour.id,
    name: mockTour.name,
    info: mockTour.info,
    image: mockTour.image,
    price: mockTour.price,
    handleDeleteTour: mockHandleDeleteTour,
    ...props,
  };
  return render(<CardTour {...defaultProps} />);
};

describe("CardTour", () => {
  describe("rendering", () => {
    it("should render the tour name as a heading", () => {
      renderComponent();
      expect(screen.getByRole("heading", { name: mockTour.name })).toBeInTheDocument();
    });

    it("should render the tour image with the name as alt text", () => {
      renderComponent();
      expect(screen.getByRole("img", { name: mockTour.name })).toBeInTheDocument();
    });

    it("should render the tour price", () => {
      renderComponent();
      expect(screen.getByText(`$${mockTour.price}`)).toBeInTheDocument();
    });

    it("should render the truncated description initially", () => {
      renderComponent({ info: "First sentence. Second sentence." });
      expect(screen.getByRole("article")).toHaveTextContent("First sentence...");
      expect(screen.getByRole("article")).not.toHaveTextContent("Second sentence");
    });

    it("should render the Read More button initially", () => {
      renderComponent();
      expect(
        screen.getByRole("button", { name: `Read more about ${mockTour.name}` })
      ).toBeInTheDocument();
    });

    it("should render the Not Interested button", () => {
      renderComponent();
      expect(
        screen.getByRole("button", { name: `Remove ${mockTour.name} from the list` })
      ).toBeInTheDocument();
    });
  });

  describe("behavior", () => {
    it("should expand the description and show Read Less when Read More is clicked", async () => {
      const user = userEvent.setup();
      renderComponent({ info: "First sentence. Second sentence." });
      await user.click(screen.getByRole("button", { name: /Read more about/ }));
      expect(screen.getByRole("article")).toHaveTextContent("First sentence. Second sentence.");
      expect(screen.getByRole("button", { name: /Read less about/ })).toBeInTheDocument();
    });

    it("should collapse the description and show Read More when Read Less is clicked", async () => {
      const user = userEvent.setup();
      renderComponent({ info: "First sentence. Second sentence." });
      await user.click(screen.getByRole("button", { name: /Read more about/ }));
      await user.click(screen.getByRole("button", { name: /Read less about/ }));
      expect(screen.getByRole("article")).toHaveTextContent("First sentence...");
      expect(screen.getByRole("article")).not.toHaveTextContent("Second sentence");
      expect(screen.getByRole("button", { name: /Read more about/ })).toBeInTheDocument();
    });

    it("should call handleDeleteTour with the tour id when Not Interested is clicked", async () => {
      const user = userEvent.setup();
      renderComponent();
      await user.click(
        screen.getByRole("button", { name: `Remove ${mockTour.name} from the list` })
      );
      expect(mockHandleDeleteTour).toHaveBeenCalledTimes(1);
      expect(mockHandleDeleteTour).toHaveBeenCalledWith(mockTour.id);
    });
  });
});
