"use client";

import React, { useState } from "react";
import { Button } from "../shared/Button";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  isBefore, 
  startOfDay 
} from "date-fns";

interface SelectDateProps {
  onNext: (date: Date, time: string) => void;
  onBack?: () => void;
}

export const SelectDate: React.FC<SelectDateProps> = ({ onNext, onBack }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()));
  const [hourInput, setHourInput] = useState<string>("12");
  const [minInput, setMinInput] = useState<string>("00");

  const MIN_HOUR = 10;
  const MAX_HOUR = 20;

  // --- Calendar Logic ---
const renderHeader = () => (
  <div className="flex items-center justify-between mb-4 px-2">
    <h3 className="text-xl font-bold text-white">
      {format(currentMonth, "MMMM yyyy")}
    </h3>
    <div className="flex gap-1 items-center bg-moss/20 p-1 rounded-full border border-jade/10">
      <button
        onClick={() => {
          setCurrentMonth(new Date());
          setSelectedDate(startOfDay(new Date()));
        }}
        title="Reset to today"
        className="p-2 hover:bg-jade/20 rounded-full text-jade/60 hover:text-jade transition-colors"
      >
        <RotateCcw size={16} />
      </button>

      {/* Divider */}
      <div className="w-[1px] h-4 bg-jade/10 mx-1" />

      <button
        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        className="p-2 hover:bg-jade/20 rounded-full text-jade transition-colors"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        className="p-2 hover:bg-jade/20 rounded-full text-jade transition-colors"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  </div>
);

  const renderDays = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
      <div className="grid grid-cols-7 mb-2">
        {days.map((day) => (
          <div key={day} className="text-center text-[10px] uppercase tracking-widest text-jade font-bold">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarRows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, "d");
        const cloneDay = day;
        const isDisabled = !isSameMonth(day, monthStart) || isBefore(day, startOfDay(new Date()));
        const isSelected = isSameDay(day, selectedDate);

        days.push(
          <button
            key={day.toString()}
            disabled={isDisabled}
            onClick={() => setSelectedDate(cloneDay)}
            className={`h-10 w-full flex items-center justify-center rounded-lg text-sm transition-all
              ${isDisabled ? "text-gray-700 cursor-not-allowed" : "text-gray-200 hover:bg-jade/10"}
              ${isSelected ? "bg-jade text-white font-bold shadow-[0_0_10px_rgba(0,168,107,0.3)]" : ""}
            `}
          >
            {formattedDate}
          </button>
        );
        day = addDays(day, 1);
      }
      calendarRows.push(
        <div className="grid grid-cols-7 gap-1" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="space-y-1">{calendarRows}</div>;
  };

  // --- Time Logic ---
  const adjustTime = (mins: number) => {
    let total = (parseInt(hourInput) || 0) * 60 + (parseInt(minInput) || 0) + mins;
    total = Math.max(MIN_HOUR * 60, Math.min(MAX_HOUR * 60, total));
    setHourInput(Math.floor(total / 60).toString().padStart(2, "0"));
    setMinInput((total % 60).toString().padStart(2, "0"));
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-md mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white">Reservation</h2>
        <p className="text-gray-400 text-sm">Pick your moment</p>
      </div>

      {/* Full Month Calendar */}
      <div className="bg-moss/10 border border-jade/20 rounded-3xl p-4 shadow-xl">
        {renderHeader()}
        {renderDays()}
        {renderCells()}
      </div>

      {/* Time Picker */}
      <div className="flex flex-col items-center space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-2">
            <button onClick={() => adjustTime(-60)} className="px-3 py-1 bg-moss/40 border border-jade/10 rounded-md text-[10px] font-bold text-gray-400 hover:text-white">-1H</button>
            <button onClick={() => adjustTime(-30)} className="px-3 py-1 bg-moss/40 border border-jade/10 rounded-md text-[10px] font-bold text-gray-400 hover:text-white">-30M</button>
          </div>

          <div className="flex items-center bg-black/40 px-5 py-3 rounded-2xl border border-jade/30 shadow-inner">
            <input 
              type="text" value={hourInput} 
              onChange={(e) => setHourInput(e.target.value)}
              onBlur={() => adjustTime(0)}
              className="w-12 bg-transparent text-4xl font-mono font-bold text-white text-center outline-none"
            />
            <span className="text-3xl font-bold text-jade mx-1">:</span>
            <input 
              type="text" value={minInput} 
              onChange={(e) => setMinInput(e.target.value)}
              onBlur={() => adjustTime(0)}
              className="w-12 bg-transparent text-4xl font-mono font-bold text-white text-center outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <button onClick={() => adjustTime(60)} className="px-3 py-1 bg-moss/40 border border-jade/10 rounded-md text-[10px] font-bold text-gray-400 hover:text-white">+1H</button>
            <button onClick={() => adjustTime(30)} className="px-3 py-1 bg-moss/40 border border-jade/10 rounded-md text-[10px] font-bold text-gray-400 hover:text-white">+30M</button>
          </div>
        </div>
        
        <div className="text-center space-y-1">
          <p className="text-[10px] uppercase tracking-widest text-jade font-bold opacity-60">Time Span</p>
          <p className="text-xs text-gray-400 bg-jade/5 border border-jade/10 px-4 py-1 rounded-full inline-block">
            {MIN_HOUR}:00 — {MAX_HOUR}:00
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        {onBack && <Button variant="secondary" onClick={onBack} className="flex-1">Back</Button>}
        <Button
          variant="primary"
          onClick={() => onNext(selectedDate, `${hourInput}:${minInput}`)}
          className="flex-1"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};