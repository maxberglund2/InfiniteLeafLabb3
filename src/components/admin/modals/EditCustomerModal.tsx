"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, User, Phone } from "lucide-react";
import { CustomerDto } from "@/types/api.types";
import { customerService } from "@/services/customer.service";
import { toast } from "react-toastify";

interface EditCustomerModalProps {
  customer: CustomerDto;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditCustomerModal: React.FC<EditCustomerModalProps> = ({
  customer,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: customer.name,
    phoneNumber: customer.phoneNumber,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prevent SSR issues with Portal
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: customer.name,
        phoneNumber: customer.phoneNumber,
      });
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, customer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await customerService.update(customer.id, formData);

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Customer updated successfully");
        onSuccess();
        onClose();
      }
    } catch (error) {
      toast.error("Failed to update customer");
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
          <h2 className="text-2xl font-bold text-white">Edit Customer</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-jade/10 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name *
            </label>
            <div className="relative">
              <User
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                maxLength={100}
                className="w-full pl-11 pr-4 py-3 bg-dark-forest border border-jade/50 rounded-lg
                         text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald
                         focus:border-transparent outline-none transition"
                placeholder="Enter customer name"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Phone Number *
            </label>
            <div className="relative">
              <Phone
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                required
                maxLength={20}
                className="w-full pl-11 pr-4 py-3 bg-dark-forest border border-jade/50 rounded-lg
                         text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald
                         focus:border-transparent outline-none transition"
                placeholder="Enter phone number"
              />
            </div>
          </div>

          {/* Info Section (Read-only) */}
          <div className="p-4 bg-dark-forest/50 border border-jade/20 rounded-xl">
            <div className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">
              Internal Reference
            </div>
            <div className="text-sm text-emerald font-mono">
              ID: {customer.id}
            </div>
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
