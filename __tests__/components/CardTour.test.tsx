import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { CardTourProps } from "@/types/props";

import CardTour from "@/components/CardTour/CardTour";

import { mockTour } from "@tests/__mocks__/tours.mock";

interface RenderComponent {
  container: HTMLElement;
  props: CardTourProps;
}

const mockHandleDeleteTour = jest.fn();

const renderComponent = (overrides?: Partial<CardTourProps>): RenderComponent => {
  const props: CardTourProps = {
    id: mockTour.id,
    name: mockTour.name,
    info: mockTour.info,
    image: mockTour.image,
    price: mockTour.price,
    handleDeleteTour: mockHandleDeleteTour,
    ...overrides,
  };
  const { container } = render(<CardTour {...props} />);
  return { container, props };
};

describe("CardTour", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the card article with the tour id", () => {
    const { container, props } = renderComponent();
    expect(container.querySelector<HTMLElement>(`article.card#${props.id}`)).toBeInTheDocument();
  });

  it("should render the tour image with correct src and alt", () => {
    const { props } = renderComponent();
    const img = screen.getByRole("img", { name: props.name });
    expect(img).toHaveAttribute("src", props.image);
  });

  it("should render the tour name and price", () => {
    const { props } = renderComponent();
    expect(screen.getByRole("heading", { name: props.name })).toBeInTheDocument();
    expect(screen.getByText(`$${props.price}`)).toBeInTheDocument();
  });

  it("should show a truncated description on mount", () => {
    const { container, props } = renderComponent();
    const paragraph = container.querySelector<HTMLElement>(".card__description");
    const expectedText = `${props.info.split(".")[0]}...`;
    expect(paragraph?.textContent).toContain(expectedText);
  });

  it("should render the Read More button with correct aria-label", () => {
    const { props } = renderComponent();
    expect(
      screen.getByRole("button", { name: `Read more about ${props.name}` })
    ).toBeInTheDocument();
  });

  it("should switch button to Read Less after clicking Read More", async () => {
    const user = userEvent.setup();
    const { props } = renderComponent();
    await user.click(screen.getByRole("button", { name: `Read more about ${props.name}` }));
    expect(
      screen.getByRole("button", { name: `Read less about ${props.name}` })
    ).toBeInTheDocument();
  });

  it("should show full description after clicking Read More", async () => {
    const user = userEvent.setup();
    const { container, props } = renderComponent();
    await user.click(screen.getByRole("button", { name: `Read more about ${props.name}` }));
    const paragraph = container.querySelector<HTMLElement>(".card__description");
    expect(paragraph?.textContent).toContain(props.info);
  });

  it("should collapse description and restore Read More after clicking Read Less", async () => {
    const user = userEvent.setup();
    const { container, props } = renderComponent();
    await user.click(screen.getByRole("button", { name: `Read more about ${props.name}` }));
    await user.click(screen.getByRole("button", { name: `Read less about ${props.name}` }));
    const paragraph = container.querySelector<HTMLElement>(".card__description");
    const expectedText = `${props.info.split(".")[0]}...`;
    expect(paragraph?.textContent).toContain(expectedText);
    expect(
      screen.getByRole("button", { name: `Read more about ${props.name}` })
    ).toBeInTheDocument();
  });

  it("should render the Not Interested button with correct aria-label", () => {
    const { props } = renderComponent();
    expect(
      screen.getByRole("button", { name: `Remove ${props.name} from the list` })
    ).toBeInTheDocument();
  });

  it("should call handleDeleteTour with the tour id when clicking Not Interested", async () => {
    const user = userEvent.setup();
    const { props } = renderComponent();
    await user.click(screen.getByRole("button", { name: `Remove ${props.name} from the list` }));
    expect(mockHandleDeleteTour).toHaveBeenCalledWith(props.id);
    expect(mockHandleDeleteTour).toHaveBeenCalledTimes(1);
  });
});
