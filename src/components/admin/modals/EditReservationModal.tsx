"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { ReservationDto } from "@/types/api.types";
import { reservationService } from "@/services/reservation.service";
import { customerService } from "@/services/customer.service";
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
  const [formData, setFormData] = useState({
    startTime: "",
    numberOfGuests: reservation.numberOfGuests,
    cafeTableId: reservation.cafeTableId,
    customerId: reservation.customerId,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableTables, setAvailableTables] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      // Format the date for the datetime-local input
      const date = new Date(reservation.startTime);
      const formattedDate = format(date, "yyyy-MM-dd'T'HH:mm");
      setFormData({
        startTime: formattedDate,
        numberOfGuests: reservation.numberOfGuests,
        cafeTableId: reservation.cafeTableId,
        customerId: reservation.customerId,
      });
      fetchAvailableTables();
    }
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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-moss border border-jade/30 rounded-2xl shadow-2xl w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-jade/20">
          <h2 className="text-2xl font-bold text-white">Edit Reservation</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-jade/10 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Customer ID */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Customer ID
            </label>
            <input
              type="number"
              value={formData.customerId}
              onChange={(e) =>
                setFormData({ ...formData, customerId: parseInt(e.target.value) })
              }
              className="w-full px-4 py-3 bg-dark-forest border border-jade/50 rounded-lg
                       text-white focus:ring-2 focus:ring-emerald focus:border-transparent
                       outline-none transition"
            />
          </div>

          {/* Date & Time */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Date & Time *
            </label>
            <input
              type="datetime-local"
              value={formData.startTime}
              onChange={(e) =>
                setFormData({ ...formData, startTime: e.target.value })
              }
              required
              className="w-full px-4 py-3 bg-dark-forest border border-jade/50 rounded-lg
                       text-white focus:ring-2 focus:ring-emerald focus:border-transparent
                       outline-none transition"
            />
          </div>

          {/* Number of Guests */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Number of Guests *
            </label>
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
              className="w-full px-4 py-3 bg-dark-forest border border-jade/50 rounded-lg
                       text-white focus:ring-2 focus:ring-emerald focus:border-transparent
                       outline-none transition"
            />
          </div>

          {/* Table Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Table *
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
                       outline-none transition"
            >
              {availableTables.map((table) => (
                <option key={table.id} value={table.id}>
                  Table {table.tableNumber} (Capacity: {table.capacity})
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
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
                       transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
    </div>
  );
};
