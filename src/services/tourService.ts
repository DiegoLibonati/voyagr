import type { Tour } from "@/types/app";
import type { ResponseDirect } from "@/types/responses";

const tourService = {
  getAll: async (): Promise<ResponseDirect<Tour[]>> => {
    const response = await fetch("/react-tours-project");

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    return (await response.json()) as ResponseDirect<Tour[]>;
  },
};

export default tourService;
