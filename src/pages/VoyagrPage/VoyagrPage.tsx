import { useEffect, useState } from "react";

import type { JSX } from "react";
import type { Tour } from "@/types/app";

import CardTour from "@/components/CardTour/CardTour";

import tourService from "@/services/tourService";

import "@/pages/VoyagrPage/VoyagrPage.css";

const VoyagrPage = (): JSX.Element => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(false);

  const handleDeleteTour = (id: string): void => {
    if (tours.length === 1) {
      setTours([]);
      return;
    }

    setTours(tours.filter((tour) => tour.id !== id));
  };

  const handleGetTours = async (): Promise<void> => {
    setLoading(true);

    const tours = await tourService.getAll();

    setTours(tours);
    setLoading(false);
  };

  useEffect(() => {
    void handleGetTours();
  }, []);

  return (
    <main className="voyagr-page">
      <section className="app-header">
        <article className="app-header__content">
          <h1 className="app-header__title">
            {loading ? "Searching Tours..." : tours.length > 0 ? "Our Tours" : "No Tours Left"}
          </h1>

          <div className="app-header__separator"></div>

          {tours.length === 0 && !loading && (
            <button
              onClick={() => {
                void handleGetTours();
              }}
              aria-label="Refresh tour list"
              className="app-header__btn-refresh"
            >
              Refresh
            </button>
          )}
        </article>
      </section>

      <section className="cards">
        {loading && <div className="spinner"></div>}

        {tours.length > 0 &&
          tours.map((tour) => (
            <CardTour
              key={tour.id}
              id={tour.id}
              image={tour.image}
              info={tour.info}
              name={tour.name}
              price={tour.price}
              handleDeleteTour={handleDeleteTour}
            ></CardTour>
          ))}
      </section>
    </main>
  );
};

export default VoyagrPage;
