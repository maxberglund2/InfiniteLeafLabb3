"use client";

import React, { useState } from "react";
import { Button } from "../shared/Button";
import { format } from "date-fns";

interface ReservationData {
  dateTime: Date;
  time: string;
  numberOfGuests: number;
  tableId: number;
  customerName: string;
  customerPhone: string;
}

interface ConfirmReservationProps {
  reservationData: ReservationData;
  onConfirm: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export const ConfirmReservation: React.FC<ConfirmReservationProps> = ({
  reservationData,
  onConfirm,
  onBack,
  isSubmitting,
}) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          Review Your Reservation
        </h2>
        <p className="text-gray-400">Please confirm the details below</p>
      </div>

      <div className="max-w-2xl mx-auto bg-moss/50 border border-jade/30 rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-dark-forest/50 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-1">Date & Time</div>
            <div className="text-white font-semibold text-lg">
              {format(reservationData.dateTime, "MMMM d, yyyy")}
            </div>
            <div className="text-emerald font-medium">
              {reservationData.time}
            </div>
          </div>

          <div className="bg-dark-forest/50 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-1">Party Size</div>
            <div className="text-white font-semibold text-lg">
              {reservationData.numberOfGuests}{" "}
              {reservationData.numberOfGuests === 1 ? "Guest" : "Guests"}
            </div>
          </div>

          <div className="bg-dark-forest/50 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-1">Name</div>
            <div className="text-white font-semibold">
              {reservationData.customerName}
            </div>
          </div>

          <div className="bg-dark-forest/50 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-1">Phone Number</div>
            <div className="text-white font-semibold">
              {reservationData.customerPhone}
            </div>
          </div>
        </div>

        <div className="border-t border-jade/30 pt-4 mt-4">
          <div className="bg-emerald/10 border border-emerald/30 rounded-lg p-4">
            <h3 className="text-emerald font-semibold mb-2">
              🍃 Important Information
            </h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Please arrive 10 minutes before your reservation</li>
              <li>• Your table will be held for 15 minutes</li>
              <li>• Reservations are for 2 hours</li>
              <li>• We'll send a confirmation to your phone</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-6 max-w-2xl mx-auto">
        <Button
          variant="secondary"
          onClick={onBack}
          disabled={isSubmitting}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          variant="primary"
          onClick={onConfirm}
          isLoading={isSubmitting}
          className="flex-1"
        >
          Confirm Reservation
        </Button>
      </div>
    </div>
  );
};
