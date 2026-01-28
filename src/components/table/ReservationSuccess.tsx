"use client";

import React from "react";
import { Button } from "../shared/Button";
import { format } from "date-fns";
import { Check, Calendar, Users, Phone, ExternalLink } from "lucide-react";

interface ReservationSuccessProps {
  reservationData: {
    dateTime: Date;
    time: string;
    numberOfGuests: number;
    customerName: string;
  };
  onNewReservation: () => void;
}

export const ReservationSuccess: React.FC<ReservationSuccessProps> = ({
  reservationData,
  onNewReservation,
}) => {
  return (
    <div className="space-y-6 animate-fadeIn text-center max-w-2xl mx-auto px-2">
      {/* Header Section */}
      <div className="mb-6 md:mb-8">
        <div className="w-16 h-16 md:w-24 md:h-24 bg-emerald/20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 border border-emerald/30">
          <Check
            className="text-emerald w-8 h-8 md:w-12 md:h-12"
            strokeWidth={3}
          />
        </div>
        <h2 className="text-2xl md:text-4xl font-bold text-white mb-2 leading-tight">
          Reservation Confirmed!
        </h2>
        <p className="text-gray-400 text-base md:text-lg">
          We look forward to welcoming you
        </p>
      </div>

      {/* Details Card */}
      <div className="bg-moss/40 border border-jade/30 rounded-2xl p-5 md:p-8 space-y-6 shadow-2xl backdrop-blur-sm">
        <div className="space-y-1">
          <div className="text-jade font-bold text-xs uppercase tracking-widest mb-1">
            Your Appointment
          </div>
          <div className="text-white text-xl md:text-2xl font-bold leading-snug">
            {format(reservationData.dateTime, "EEEE, MMMM d, yyyy")}
          </div>
          <div className="text-emerald text-lg md:text-xl font-medium">
            at {reservationData.time}
          </div>
        </div>

        {/* Info Grid - Switches to 1 column on very small mobile if needed, but usually 2 is fine with less padding */}
        <div className="border-t border-jade/20 pt-6">
          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="flex flex-col gap-1">
              <span className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">
                Guest Name
              </span>
              <div className="flex items-center gap-2 text-white">
                <span className="text-sm md:text-base font-semibold truncate">
                  {reservationData.customerName}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">
                Party Size
              </span>
              <div className="flex items-center gap-2 text-white text-sm md:text-base font-semibold">
                {reservationData.numberOfGuests}{" "}
                {reservationData.numberOfGuests === 1 ? "Guest" : "Guests"}
              </div>
            </div>
          </div>
        </div>

        {/* Instructions Box */}
        <div className="bg-black/30 rounded-xl p-4 md:p-5 text-left border border-jade/10">
          <h3 className="text-white text-sm font-bold mb-4 flex items-center gap-2">
            <div className="w-1 h-4 bg-jade rounded-full" />
            WHAT&apos;S NEXT?
          </h3>
          <ul className="text-sm text-gray-300 space-y-4">
            <li className="flex items-start gap-3">
              <div className="bg-jade/20 p-1.5 rounded-lg">
                <Phone size={14} className="text-emerald" />
              </div>
              <span>You&apos;ll receive a confirmation SMS shortly.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="bg-jade/20 p-1.5 rounded-lg">
                <Calendar size={14} className="text-emerald" />
              </div>
              <span>Please arrive 10 minutes before your time.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="bg-jade/20 p-1.5 rounded-lg">
                <ExternalLink size={14} className="text-emerald" />
              </div>
              <span>
                View our menu online to explore our seasonal offerings.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 pt-4">
        <Button
          variant="primary"
          onClick={onNewReservation}
          className="w-full py-4 text-base font-bold order-1"
        >
          Make Another Reservation
        </Button>
        <Button
          variant="secondary"
          onClick={() => (window.location.href = "/")}
          className="w-full py-4 text-base border-jade/20 text-gray-400 order-2 sm:order-2"
        >
          Return Home
        </Button>
      </div>
    </div>
  );
};
