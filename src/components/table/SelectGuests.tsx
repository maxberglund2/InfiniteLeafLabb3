"use client";

import React, { useState, useEffect } from "react";
import { Button } from "../shared/Button";
import { Users, Minus, Plus } from "lucide-react";

interface SelectGuestsProps {
  onNext: (numberOfGuests: number) => void;
  onBack: () => void;
}

export const SelectGuests: React.FC<SelectGuestsProps> = ({
  onNext,
  onBack,
}) => {
  const MAX_GUESTS = 8;
  const MIN_GUESTS = 1;

  const [guests, setGuests] = useState<number>(2);
  const [inputValue, setInputValue] = useState<string>("2");

  useEffect(() => {
    setInputValue(guests.toString());
  }, [guests]);

  const handleAdjust = (amt: number) => {
    const newValue = Math.min(Math.max(guests + amt, MIN_GUESTS), MAX_GUESTS);
    setGuests(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    if (val === "") {
      setInputValue("");
      return;
    }

    if (/^\d+$/.test(val)) {
      setInputValue(val);
      const num = parseInt(val);
      if (num >= 0 && num <= 99) {
        setGuests(num);
      }
    }
  };

  const handleBlur = () => {
    let num = parseInt(inputValue);
    if (isNaN(num) || num < MIN_GUESTS) num = MIN_GUESTS;
    if (num > MAX_GUESTS) num = MAX_GUESTS;

    setGuests(num);
    setInputValue(num.toString());
  };

  return (
    <div className="space-y-10 animate-fadeIn max-w-md mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
          Party Size
        </h2>
        <p className="text-gray-400">How many people are joining us?</p>
      </div>

      <div className="flex flex-col items-center gap-12">
        <div className="flex items-center gap-6 sm:gap-10">
          <button
            type="button"
            onClick={() => handleAdjust(-1)}
            disabled={guests <= MIN_GUESTS}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-moss/20 border-2 border-jade/20 flex items-center justify-center text-jade hover:bg-jade hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all active:scale-90"
          >
            <Minus size={28} strokeWidth={3} />
          </button>

          <div className="relative flex flex-col items-center">
            <div className="bg-black/40 px-8 py-6 rounded-[2.5rem] border-2 border-jade/30 shadow-[0_0_40px_rgba(0,168,107,0.15)] flex flex-col items-center min-w-[150px]">
              <input
                type="text"
                inputMode="numeric"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className="w-full bg-transparent text-7xl font-mono font-bold text-white text-center outline-none focus:text-jade transition-colors caret-jade"
                placeholder="0"
              />
              <div className="flex items-center gap-2 mt-2">
                <Users size={14} className="text-jade/60" />
                <span className="text-xs uppercase tracking-[0.3em] font-bold text-jade/60">
                  {guests === 1 ? "Guest" : "Guests"}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleAdjust(1)}
            disabled={guests >= MAX_GUESTS}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-moss/20 border-2 border-jade/20 flex items-center justify-center text-jade hover:bg-jade hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all active:scale-90"
          >
            <Plus size={28} strokeWidth={3} />
          </button>
        </div>

        <div className="w-full bg-jade/5 border border-jade/10 rounded-2xl p-4 text-center">
          <p className="text-sm text-gray-400">
            Maximum online booking:{" "}
            <span className="text-white font-bold">{MAX_GUESTS}</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Larger party?{" "}
            <a href="tel:+81312345678" className="text-jade hover:underline">
              Call us
            </a>
          </p>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Button variant="secondary" onClick={onBack} className="flex-1 py-4">
          Back
        </Button>
        <Button
          variant="primary"
          onClick={() => onNext(guests)}
          className="flex-1 py-4 shadow-lg shadow-jade/20 font-bold"
        >
          Confirm Guests
        </Button>
      </div>
    </div>
  );
};
