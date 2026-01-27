"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, DollarSign } from "lucide-react";
import { MenuItemDto } from "@/types/api.types";
import { menuService } from "@/services/menu.service";
import { toast } from "react-toastify";

interface EditMenuItemModalProps {
  menuItem: MenuItemDto;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditMenuItemModal: React.FC<EditMenuItemModalProps> = ({
  menuItem,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: menuItem.name,
    price: menuItem.price,
    description: menuItem.description,
    isPopular: menuItem.isPopular,
    imageUrl: menuItem.imageUrl || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle mounting for Portals in Next.js
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Update form data when modal opens or menuItem changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: menuItem.name,
        price: menuItem.price,
        description: menuItem.description,
        isPopular: menuItem.isPopular,
        imageUrl: menuItem.imageUrl || "",
      });
      // Prevent scrolling on the body when modal is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, menuItem]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await menuService.update(menuItem.id, formData);

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Menu item updated successfully");
        onSuccess();
        onClose();
      }
    } catch (error) {
      toast.error("Failed to update menu item");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't render if not open or not mounted on client
  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-moss border border-jade/30 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-moss flex items-center justify-between p-6 border-b border-jade/20 z-10">
          <h2 className="text-2xl font-bold text-white">Edit Menu Item</h2>
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
              Item Name *
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
              placeholder="e.g., Jasmine Green Tea"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Price *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald">
                ¥
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: parseFloat(e.target.value) || 0,
                  })
                }
                required
                className="w-full pl-8 pr-4 py-3 bg-dark-forest border border-jade/50 rounded-lg
                         text-white focus:ring-2 focus:ring-emerald focus:border-transparent
                         outline-none transition"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              rows={3}
              maxLength={500}
              className="w-full px-4 py-3 bg-dark-forest border border-jade/50 rounded-lg
                       text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald
                       focus:border-transparent outline-none transition resize-none"
              placeholder="Describe this tea..."
            />
            <p className="text-xs text-gray-500 mt-1 text-right">
              {formData.description.length}/500 characters
            </p>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Image URL
            </label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.value })
              }
              className="w-full px-4 py-3 bg-dark-forest border border-jade/50 rounded-lg
                       text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald
                       focus:border-transparent outline-none transition"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Popular Toggle */}
          <div className="flex items-center justify-between p-4 bg-dark-forest/50 border border-jade/30 rounded-lg">
            <div>
              <div className="text-sm font-medium text-white">
                Mark as Popular
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Show this item in the popular section
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                setFormData({ ...formData, isPopular: !formData.isPopular })
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                formData.isPopular ? "bg-emerald" : "bg-gray-600"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.isPopular ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 sticky bottom-0 bg-moss py-2">
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
