"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Hash, Users } from "lucide-react";
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
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    tableNumber: table.tableNumber,
    capacity: table.capacity,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Next.js hydration guard
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        tableNumber: table.tableNumber,
        capacity: table.capacity,
      });
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
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

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-moss border border-jade/30 rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-jade/20">
          <div>
            <h2 className="text-2xl font-bold text-white">Edit Table</h2>
            <p className="text-xs text-emerald font-mono mt-1">
              System ID: #{table.id}
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
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Table Number */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Table Number *
            </label>
            <div className="relative">
              <Hash
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type="number"
                min="1"
                value={formData.tableNumber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tableNumber: parseInt(e.target.value) || 0,
                  })
                }
                required
                className="w-full pl-11 pr-4 py-3 bg-dark-forest border border-jade/50 rounded-lg
                         text-white focus:ring-2 focus:ring-emerald focus:border-transparent
                         outline-none transition"
              />
            </div>
          </div>

          {/* Capacity */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Capacity *
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
                value={formData.capacity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    capacity: parseInt(e.target.value) || 0,
                  })
                }
                required
                className="w-full pl-11 pr-4 py-3 bg-dark-forest border border-jade/50 rounded-lg
                         text-white focus:ring-2 focus:ring-emerald focus:border-transparent
                         outline-none transition"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2 italic">
              Maximum guests allowed for this table.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
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
                       transition-all font-medium shadow-lg shadow-emerald/20
                       disabled:opacity-50 disabled:cursor-not-allowed"
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
