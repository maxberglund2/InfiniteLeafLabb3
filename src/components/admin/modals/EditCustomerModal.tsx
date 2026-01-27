"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
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
  const [formData, setFormData] = useState({
    name: customer.name,
    phoneNumber: customer.phoneNumber,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: customer.name,
        phoneNumber: customer.phoneNumber,
      });
    }
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
          <h2 className="text-2xl font-bold text-white">Edit Customer</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-jade/10 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              maxLength={100}
              className="w-full px-4 py-3 bg-dark-forest border border-jade/50 rounded-lg
                       text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald
                       focus:border-transparent outline-none transition"
              placeholder="Enter customer name"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
              required
              maxLength={20}
              className="w-full px-4 py-3 bg-dark-forest border border-jade/50 rounded-lg
                       text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald
                       focus:border-transparent outline-none transition"
              placeholder="Enter phone number"
            />
          </div>

          {/* Customer ID (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Customer ID
            </label>
            <div className="px-4 py-3 bg-dark-forest/50 border border-jade/30 rounded-lg text-gray-400 font-mono">
              #{customer.id}
            </div>
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
