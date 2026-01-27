"use client";

import React, { useState } from "react";
import { Button } from "../shared/Button";

interface SelectGuestsProps {
  onNext: (numberOfGuests: number) => void;
  onBack: () => void;
}

export const SelectGuests: React.FC<SelectGuestsProps> = ({
  onNext,
  onBack,
}) => {
  const [guests, setGuests] = useState<number>(2);

  const guestOptions = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Number of Guests</h2>
        <p className="text-gray-400">How many people will be joining?</p>
      </div>

      <div className="flex flex-col items-center space-y-8">
        <div className="text-center">
          <div className="text-6xl font-bold text-emerald mb-2">{guests}</div>
          <div className="text-gray-400">
            {guests === 1 ? "Guest" : "Guests"}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 w-full max-w-md">
          {guestOptions.map((num) => (
            <button
              key={num}
              onClick={() => setGuests(num)}
              className={`aspect-square rounded-xl font-bold text-2xl transition-all duration-300 ${
                guests === num
                  ? "bg-jade text-white scale-110 shadow-lg shadow-jade/50"
                  : "bg-moss border-2 border-jade/30 text-gray-300 hover:border-jade hover:scale-105"
              }`}
            >
              {num}
            </button>
          ))}
        </div>

        <div className="text-center text-sm text-gray-400">
          For parties larger than 8, please call us at{" "}
          <a href="tel:+81312345678" className="text-emerald hover:underline">
            (03) 1234-5678
          </a>
        </div>
      </div>

      <div className="flex gap-4 pt-6">
        <Button variant="secondary" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button
          variant="primary"
          onClick={() => onNext(guests)}
          className="flex-1"
        >
          Next
        </Button>
      </div>
    </div>
  );
};
