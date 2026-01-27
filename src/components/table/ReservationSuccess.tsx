"use client";

import React from "react";
import { Button } from "../shared/Button";
import { format } from "date-fns";

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
    <div className="space-y-6 animate-fadeIn text-center max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="w-24 h-24 bg-emerald/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <div className="text-6xl">✓</div>
        </div>
        <h2 className="text-4xl font-bold text-white mb-2">
          Reservation Confirmed!
        </h2>
        <p className="text-gray-400 text-lg">
          We look forward to welcoming you
        </p>
      </div>

      <div className="bg-moss/50 border border-jade/30 rounded-xl p-8 space-y-6">
        <div>
          <div className="text-gray-400 text-sm mb-2">Your Reservation</div>
          <div className="text-white text-2xl font-bold">
            {format(reservationData.dateTime, "EEEE, MMMM d, yyyy")}
          </div>
          <div className="text-emerald text-xl font-medium mt-1">
            {reservationData.time}
          </div>
        </div>

        <div className="border-t border-jade/30 pt-4">
          <div className="grid grid-cols-2 gap-4 text-left">
            <div>
              <div className="text-gray-400 text-sm">Name</div>
              <div className="text-white font-semibold">
                {reservationData.customerName}
              </div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">Party Size</div>
              <div className="text-white font-semibold">
                {reservationData.numberOfGuests}{" "}
                {reservationData.numberOfGuests === 1 ? "Guest" : "Guests"}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-dark-forest/50 rounded-lg p-4 text-left">
          <h3 className="text-white font-semibold mb-3">What's Next?</h3>
          <ul className="text-sm text-gray-300 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-emerald">📱</span>
              <span>You'll receive a confirmation SMS shortly</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald">🕐</span>
              <span>Please arrive 10 minutes before your reservation</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald">🍃</span>
              <span>
                Check out our menu online to know what you'd like to order
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button variant="primary" onClick={onNewReservation} className="flex-1">
          Make Another Reservation
        </Button>
        <Button
          variant="secondary"
          onClick={() => (window.location.href = "/")}
          className="flex-1"
        >
          Return Home
        </Button>
      </div>
    </div>
  );
};
