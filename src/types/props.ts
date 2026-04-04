// interface DefaultProps {
//   children?: React.ReactNode;
//   className?: string;
// }

export interface CardTourProps {
  id: string;
  name: string;
  info: string;
  image: string;
  price: string;
  handleDeleteTour: (id: string) => void;
}
