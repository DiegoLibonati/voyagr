import React, { useEffect, useState } from "react";

import { CardTourProps } from "@/types/props";

import "@/components/CardTour/CardTour.css";

const CardTour = ({ id, name, info, image, price, handleDeleteTour }: CardTourProps) => {
  const [description, setDescription] = useState<string>("");
  const [buttonRead, setButtonRead] = useState<string>("Read More");

  const handleReadText: React.MouseEventHandler<HTMLButtonElement> = () => {
    if (description.includes("...")) {
      setDescription(info);
      setButtonRead("Read Less");
      return;
    }
    setDescription(`${info.split(".")[0]}...`);
    setButtonRead("Read More");
    return;
  };

  useEffect(() => {
    const newDescription: string[] = info.split(".");
    setDescription(`${newDescription[0]}...`);
  }, []);

  return (
    <article className="card" id={id}>
      <img src={image} alt={name} className="card__img"></img>

      <div className="card__header">
        <h3 className="card__name">{name}</h3>
        <p className="card__price">${price}</p>
      </div>

      <p className="card__description">
        {description}
        <button
          id="readmore"
          onClick={handleReadText}
          aria-label="read action"
          className="card__btn-read-more"
        >
          {buttonRead}
        </button>
      </p>

      <button
        type="button"
        id="delete-btn"
        onClick={() => handleDeleteTour(id)}
        aria-label="not interested tour"
        className="card__btn-delete"
      >
        Not Interested
      </button>
    </article>
  );
};

export default CardTour;
