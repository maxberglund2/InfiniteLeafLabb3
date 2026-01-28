"use client";

import React, { useState, useMemo } from "react";
import { Button } from "../shared/Button";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import {
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
  startOfDay,
  addMinutes,
  isAfter,
  setHours,
  setMinutes,
} from "date-fns";

interface SelectDateProps {
  initialDate?: Date;
  initialTime?: string;
  onNext: (date: Date, time: string) => void;
  onBack?: () => void;
}

export const SelectDate: React.FC<SelectDateProps> = ({
  initialDate,
  initialTime,
  onNext,
  onBack,
}) => {
  const now = new Date();
  const minSelectableTime = addMinutes(now, 10);

  const [currentMonth, setCurrentMonth] = useState(initialDate || now);
  const [selectedDate, setSelectedDate] = useState<Date>(
    initialDate || startOfDay(now),
  );

  const [hourInput, setHourInput] = useState<string>(
    initialTime?.split(":")[0] || "12",
  );
  const [minInput, setMinInput] = useState<string>(
    initialTime?.split(":")[1] || "00",
  );

  const MIN_HOUR = 10;
  const MAX_HOUR = 20;

  const isTimeValid = useMemo(() => {
    const h = parseInt(hourInput);
    const m = parseInt(minInput);
    if (isNaN(h) || isNaN(m)) return false;

    const selectedDateTime = setMinutes(
      setHours(startOfDay(selectedDate), h),
      m,
    );
    const withinBusinessHours = h >= MIN_HOUR && h < MAX_HOUR;
    const isAfterNowWithMargin = isAfter(selectedDateTime, minSelectableTime);

    return withinBusinessHours && isAfterNowWithMargin;
  }, [selectedDate, hourInput, minInput, minSelectableTime]);

  const adjustTime = (mins: number) => {
    const h = parseInt(hourInput) || 0;
    const m = parseInt(minInput) || 0;
    let total = h * 60 + m + mins;
    total = Math.max(MIN_HOUR * 60, Math.min(MAX_HOUR * 60, total));

    setHourInput(
      Math.floor(total / 60)
        .toString()
        .padStart(2, "0"),
    );
    setMinInput((total % 60).toString().padStart(2, "0"));
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, "d");
        const cloneDay = day;

        // 1. Is it in the month we are currently looking at?
        const isCurrentMonth = isSameMonth(day, monthStart);
        // 2. Is it physically before today?
        const isPastDay = isBefore(day, startOfDay(now));
        // 3. User can only click if it's the current month AND not in the past
        const selectable = isCurrentMonth && !isPastDay;

        const isSelected = isSameDay(day, selectedDate);

        days.push(
          <button
            key={day.toString()}
            disabled={!selectable}
            onClick={() => setSelectedDate(cloneDay)}
            className={`h-10 w-full flex items-center justify-center rounded-lg text-sm transition-all
              ${!isCurrentMonth && "text-white/30 pointer-events-none"}
              ${isPastDay && isCurrentMonth && "text-white/40 cursor-not-allowed"}
              ${isSelected && "bg-jade text-white font-bold shadow-[0_0_10px_rgba(0,168,107,0.3)]"}
            `}
          >
            {formattedDate}
          </button>,
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 gap-1" key={day.toString()}>
          {days}
        </div>,
      );
      days = [];
    }
    return <div className="space-y-1">{rows}</div>;
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-md mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white">Reservation</h2>
        <p className="text-gray-400 text-sm">Pick your moment</p>
      </div>

      <div className="bg-moss/10 border border-jade/20 rounded-3xl p-4 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 px-2">
          <h3 className="text-xl font-bold text-white">
            {format(currentMonth, "MMMM yyyy")}
          </h3>
          <div className="flex gap-1 items-center bg-moss/20 p-1 rounded-full border border-jade/10">
            <button
              onClick={() => {
                setCurrentMonth(now);
                setSelectedDate(startOfDay(now));
              }}
              className="p-2 hover:bg-jade/20 rounded-full text-jade/60 transition-colors"
            >
              <RotateCcw size={16} />
            </button>
            <div className="w-px h-4 bg-jade/10 mx-1" />
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

        {/* Day Labels */}
        <div className="grid grid-cols-7 mb-2 text-center text-[10px] uppercase tracking-widest text-jade font-bold">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        {renderCells()}
      </div>

      <div className="flex flex-col items-center space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-2">
            <button
              onClick={() => adjustTime(-60)}
              className="px-3 py-1 bg-moss/40 border border-jade/10 rounded-md text-[10px] font-bold text-gray-400 hover:text-white"
            >
              -1H
            </button>
            <button
              onClick={() => adjustTime(-30)}
              className="px-3 py-1 bg-moss/40 border border-jade/10 rounded-md text-[10px] font-bold text-gray-400 hover:text-white"
            >
              -30M
            </button>
          </div>

          <div
            className={`flex items-center bg-black/40 px-5 py-3 rounded-2xl border transition-colors ${!isTimeValid ? "border-red-500/50" : "border-jade/30 shadow-inner"}`}
          >
            <input
              type="text"
              value={hourInput}
              onChange={(e) => setHourInput(e.target.value)}
              onBlur={() => adjustTime(0)}
              className="w-12 bg-transparent text-4xl font-mono font-bold text-white text-center outline-none"
            />
            <span className="text-3xl font-bold text-jade mx-1">:</span>
            <input
              type="text"
              value={minInput}
              onChange={(e) => setMinInput(e.target.value)}
              onBlur={() => adjustTime(0)}
              className="w-12 bg-transparent text-4xl font-mono font-bold text-white text-center outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => adjustTime(60)}
              className="px-3 py-1 bg-moss/40 border border-jade/10 rounded-md text-[10px] font-bold text-gray-400 hover:text-white"
            >
              +1H
            </button>
            <button
              onClick={() => adjustTime(30)}
              className="px-3 py-1 bg-moss/40 border border-jade/10 rounded-md text-[10px] font-bold text-gray-400 hover:text-white"
            >
              +30M
            </button>
          </div>
        </div>

        {!isTimeValid && (
          <p className="text-red-400 text-[10px] font-bold uppercase tracking-wider animate-pulse">
            Select a time after {format(minSelectableTime, "HH:mm")}
          </p>
        )}

        <div className="text-center space-y-1">
          <p className="text-[10px] uppercase tracking-widest text-jade font-bold opacity-60">
            Business Hours
          </p>
          <p className="text-xs text-gray-400 bg-jade/5 border border-jade/10 px-4 py-1 rounded-full inline-block">
            {MIN_HOUR}:00 — {MAX_HOUR}:00
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        {onBack && (
          <Button variant="secondary" onClick={onBack} className="flex-1">
            Back
          </Button>
        )}
        <Button
          variant="primary"
          onClick={() => onNext(selectedDate, `${hourInput}:${minInput}`)}
          className="flex-1"
          disabled={!isTimeValid}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};
