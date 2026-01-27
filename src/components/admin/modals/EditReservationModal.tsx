"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Calendar, Users, Hash } from "lucide-react";
import { ReservationDto } from "@/types/api.types";
import { reservationService } from "@/services/reservation.service";
import { tableService } from "@/services/table.service";
import { toast } from "react-toastify";
import { format } from "date-fns";

interface EditReservationModalProps {
  reservation: ReservationDto;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditReservationModal: React.FC<EditReservationModalProps> = ({
  reservation,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    startTime: "",
    numberOfGuests: reservation.numberOfGuests,
    cafeTableId: reservation.cafeTableId,
    customerId: reservation.customerId,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableTables, setAvailableTables] = useState<any[]>([]);

  // Prevent SSR issues
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const date = new Date(reservation.startTime);
      const formattedDate = format(date, "yyyy-MM-dd'T'HH:mm");
      setFormData({
        startTime: formattedDate,
        numberOfGuests: reservation.numberOfGuests,
        cafeTableId: reservation.cafeTableId,
        customerId: reservation.customerId,
      });
      fetchAvailableTables();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, reservation]);

  const fetchAvailableTables = async () => {
    try {
      const response = await tableService.getAll();
      if (response.data) {
        setAvailableTables(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch tables");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await reservationService.update(reservation.id, {
        startTime: new Date(formData.startTime).toISOString(),
        numberOfGuests: formData.numberOfGuests,
        cafeTableId: formData.cafeTableId,
        customerId: formData.customerId,
      });

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Reservation updated successfully");
        onSuccess();
        onClose();
      }
    } catch (error) {
      toast.error("Failed to update reservation");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-moss border border-jade/30 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-jade/20 bg-dark-forest/30">
          <div>
            <h2 className="text-2xl font-bold text-white">Edit Reservation</h2>
            <p className="text-xs text-gray-500 mt-1 font-mono">
              Ref: #{reservation.id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-jade/10 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer ID */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Customer ID
              </label>
              <div className="relative">
                <Hash
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  type="number"
                  value={formData.customerId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      customerId: parseInt(e.target.value),
                    })
                  }
                  className="w-full pl-11 pr-4 py-3 bg-dark-forest border border-jade/50 rounded-lg
                           text-white focus:ring-2 focus:ring-emerald focus:border-transparent
                           outline-none transition"
                />
              </div>
            </div>

            {/* Date & Time */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Date & Time *
              </label>
              <div className="relative">
                <Calendar
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                  required
                  className="w-full pl-11 pr-4 py-3 bg-dark-forest border border-jade/50 rounded-lg
                           text-white focus:ring-2 focus:ring-emerald focus:border-transparent
                           outline-none transition scheme:dark"
                />
              </div>
            </div>

            {/* Number of Guests */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Guests *
              </label>
              <div className="relative">
                <Users
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={formData.numberOfGuests}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      numberOfGuests: parseInt(e.target.value),
                    })
                  }
                  required
                  className="w-full pl-11 pr-4 py-3 bg-dark-forest border border-jade/50 rounded-lg
                           text-white focus:ring-2 focus:ring-emerald focus:border-transparent
                           outline-none transition"
                />
              </div>
            </div>

            {/* Table Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Table Selection *
              </label>
              <select
                value={formData.cafeTableId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    cafeTableId: parseInt(e.target.value),
                  })
                }
                required
                className="w-full px-4 py-3 bg-dark-forest border border-jade/50 rounded-lg
                         text-white focus:ring-2 focus:ring-emerald focus:border-transparent
                         outline-none transition appearance-none cursor-pointer"
              >
                {availableTables.map((table) => (
                  <option key={table.id} value={table.id}>
                    Table {table.tableNumber} (Cap: {table.capacity})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-jade/10">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-jade/30 text-white rounded-lg
                       hover:bg-jade/10 transition-colors font-medium"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-linear-to-r from-jade to-emerald
                       hover:from-emerald hover:to-jade text-white rounded-lg
                       transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald/20"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </span>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
};
