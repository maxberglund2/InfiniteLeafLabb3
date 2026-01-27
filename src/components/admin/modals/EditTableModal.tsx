"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { CafeTableDto } from "@/types/api.types";
import { tableService } from "@/services/table.service";
import { toast } from "react-toastify";


interface EditTableModalProps {
  table: CafeTableDto;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditTableModal: React.FC<EditTableModalProps> = ({
  table,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    tableNumber: table.tableNumber,
    capacity: table.capacity,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        tableNumber: table.tableNumber,
        capacity: table.capacity,
      });
    }
  }, [isOpen, table]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await tableService.update(table.id, formData);

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Table updated successfully");
        onSuccess();
        onClose();
      }
    } catch (error) {
      toast.error("Failed to update table");
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
          <h2 className="text-2xl font-bold text-white">Edit Table</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-jade/10 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Table Number */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Table Number *
            </label>
            <input
              type="number"
              min="1"
              value={formData.tableNumber}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tableNumber: parseInt(e.target.value),
                })
              }
              required
              className="w-full px-4 py-3 bg-dark-forest border border-jade/50 rounded-lg
                       text-white focus:ring-2 focus:ring-emerald focus:border-transparent
                       outline-none transition"
            />
          </div>

          {/* Capacity */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Capacity *
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={formData.capacity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  capacity: parseInt(e.target.value),
                })
              }
              required
              className="w-full px-4 py-3 bg-dark-forest border border-jade/50 rounded-lg
                       text-white focus:ring-2 focus:ring-emerald focus:border-transparent
                       outline-none transition"
            />
            <p className="text-xs text-gray-500 mt-2">
              Maximum number of guests this table can accommodate
            </p>
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
              className="flex-1 px-4 py-3 bg-gradient-to-r from-jade to-emerald
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
