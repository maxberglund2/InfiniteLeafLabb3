"use client";

import React, { useState } from "react";
import { Button } from "../shared/Button";

interface SelectDateProps {
  onNext: (date: Date, time: string) => void;
  onBack?: () => void;
}

export const SelectDate: React.FC<SelectDateProps> = ({ onNext, onBack }) => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  const today = new Date().toISOString().split("T")[0];
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateStr = maxDate.toISOString().split("T")[0];

  const timeSlots = [
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
  ];

  const handleNext = () => {
    if (selectedDate && selectedTime) {
      const [hours, minutes] = selectedTime.split(":");
      const dateTime = new Date(selectedDate);
      dateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      onNext(dateTime, selectedTime);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          Select Date & Time
        </h2>
        <p className="text-gray-400">Choose your preferred reservation time</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={today}
            max={maxDateStr}
            className="w-full px-4 py-3 bg-dark-forest border border-jade/50 rounded-lg focus:ring-2 focus:ring-emerald focus:border-transparent outline-none transition text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Time
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {timeSlots.map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                  selectedTime === time
                    ? "bg-jade text-white scale-105 shadow-lg"
                    : "bg-moss border border-jade/30 text-gray-300 hover:border-jade hover:scale-105"
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-6">
        {onBack && (
          <Button variant="secondary" onClick={onBack} className="flex-1">
            Back
          </Button>
        )}
        <Button
          variant="primary"
          onClick={handleNext}
          disabled={!selectedDate || !selectedTime}
          className="flex-1"
        >
          Next
        </Button>
      </div>
    </div>
  );
};
