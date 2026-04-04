import type { Tour } from "@/types/app";

const tourService = {
  getAll: async (): Promise<Tour[]> => {
    const response = await fetch("/react-tours-project");

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const tours: Tour[] = (await response.json()) as Tour[];

    return tours;
  },
};

export default tourService;
