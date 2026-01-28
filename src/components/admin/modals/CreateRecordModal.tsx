"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  DollarSign,
  Hash,
  Users,
  User,
  Phone,
  Calendar,
} from "lucide-react";
import { menuService } from "@/services/menu.service";
import { tableService } from "@/services/table.service";
import { customerService } from "@/services/customer.service";
import { reservationService } from "@/services/reservation.service";
import { toast } from "react-toastify";

type Section = "menu" | "tables" | "customers" | "reservations";

interface CreateRecordModalProps {
  section: Section;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// Form state types for each section
interface MenuFormData {
  name: string;
  price: number;
  description: string;
  isPopular: boolean;
  imageUrl: string;
}

interface TableFormData {
  tableNumber: number;
  capacity: number;
}

interface CustomerFormData {
  name: string;
  phoneNumber: string;
}

interface ReservationFormData {
  startTime: string;
  numberOfGuests: number;
  cafeTableId: number;
  customerId: number;
}

const initialMenuData: MenuFormData = {
  name: "",
  price: 0,
  description: "",
  isPopular: false,
  imageUrl: "",
};

const initialTableData: TableFormData = {
  tableNumber: 0,
  capacity: 2,
};

const initialCustomerData: CustomerFormData = {
  name: "",
  phoneNumber: "",
};

const initialReservationData: ReservationFormData = {
  startTime: "",
  numberOfGuests: 2,
  cafeTableId: 0,
  customerId: 0,
};

export const CreateRecordModal: React.FC<CreateRecordModalProps> = ({
  section,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data states
  const [menuData, setMenuData] = useState<MenuFormData>(initialMenuData);
  const [tableData, setTableData] = useState<TableFormData>(initialTableData);
  const [customerData, setCustomerData] =
    useState<CustomerFormData>(initialCustomerData);
  const [reservationData, setReservationData] = useState<ReservationFormData>(
    initialReservationData,
  );

  // For reservation dropdown
  const [availableTables, setAvailableTables] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Reset forms when opening
      setMenuData(initialMenuData);
      setTableData(initialTableData);
      setCustomerData(initialCustomerData);
      setReservationData(initialReservationData);

      // Fetch available tables if reservations section
      if (section === "reservations") {
        fetchAvailableTables();
      }

      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, section]);

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
      let response;

      switch (section) {
        case "menu":
          response = await menuService.create(menuData);
          break;
        case "tables":
          response = await tableService.create(tableData);
          break;
        case "customers":
          response = await customerService.create(customerData);
          break;
        case "reservations":
          response = await reservationService.create({
            ...reservationData,
            startTime: new Date(reservationData.startTime).toISOString(),
          });
          break;
        default:
          throw new Error("Invalid section");
      }

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success(
          `${section.charAt(0).toUpperCase() + section.slice(1, -1)} created successfully`,
        );
        onSuccess();
        onClose();
      }
    } catch (error) {
      toast.error(`Failed to create ${section.slice(0, -1)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !mounted) return null;

  const getTitle = () => {
    switch (section) {
      case "menu":
        return "Add Menu Item";
      case "tables":
        return "Add Table";
      case "customers":
        return "Add Customer";
      case "reservations":
        return "Add Reservation";
      default:
        return "Add Record";
    }
  };

  const renderForm = () => {
    switch (section) {
      case "menu":
        return (
          <>
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Item Name *
              </label>
              <input
                type="text"
                value={menuData.name}
                onChange={(e) =>
                  setMenuData({ ...menuData, name: e.target.value })
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
                  value={menuData.price}
                  onChange={(e) =>
                    setMenuData({
                      ...menuData,
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
                value={menuData.description}
                onChange={(e) =>
                  setMenuData({ ...menuData, description: e.target.value })
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
                {menuData.description.length}/500 characters
              </p>
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Image URL
              </label>
              <input
                type="url"
                value={menuData.imageUrl}
                onChange={(e) =>
                  setMenuData({ ...menuData, imageUrl: e.target.value })
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
                  setMenuData({ ...menuData, isPopular: !menuData.isPopular })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  menuData.isPopular ? "bg-emerald" : "bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    menuData.isPopular ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </>
        );

      case "tables":
        return (
          <>
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
                  value={tableData.tableNumber || ""}
                  onChange={(e) =>
                    setTableData({
                      ...tableData,
                      tableNumber: parseInt(e.target.value) || 0,
                    })
                  }
                  required
                  className="w-full pl-11 pr-4 py-3 bg-dark-forest border border-jade/50 rounded-lg
                           text-white focus:ring-2 focus:ring-emerald focus:border-transparent
                           outline-none transition"
                  placeholder="e.g., 1"
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
                  value={tableData.capacity || ""}
                  onChange={(e) =>
                    setTableData({
                      ...tableData,
                      capacity: parseInt(e.target.value) || 0,
                    })
                  }
                  required
                  className="w-full pl-11 pr-4 py-3 bg-dark-forest border border-jade/50 rounded-lg
                           text-white focus:ring-2 focus:ring-emerald focus:border-transparent
                           outline-none transition"
                  placeholder="e.g., 4"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2 italic">
                Maximum guests allowed for this table.
              </p>
            </div>
          </>
        );

      case "customers":
        return (
          <>
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
                  value={customerData.name}
                  onChange={(e) =>
                    setCustomerData({ ...customerData, name: e.target.value })
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
                  value={customerData.phoneNumber}
                  onChange={(e) =>
                    setCustomerData({
                      ...customerData,
                      phoneNumber: e.target.value,
                    })
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
          </>
        );

      case "reservations":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Customer ID */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Customer ID *
                </label>
                <div className="relative">
                  <Hash
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                  />
                  <input
                    type="number"
                    value={reservationData.customerId || ""}
                    onChange={(e) =>
                      setReservationData({
                        ...reservationData,
                        customerId: parseInt(e.target.value) || 0,
                      })
                    }
                    required
                    className="w-full pl-11 pr-4 py-3 bg-dark-forest border border-jade/50 rounded-lg
                             text-white focus:ring-2 focus:ring-emerald focus:border-transparent
                             outline-none transition"
                    placeholder="Enter customer ID"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1 italic">
                  Create a customer first if needed
                </p>
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
                    value={reservationData.startTime}
                    onChange={(e) =>
                      setReservationData({
                        ...reservationData,
                        startTime: e.target.value,
                      })
                    }
                    required
                    className="w-full pl-11 pr-4 py-3 bg-dark-forest border border-jade/50 rounded-lg
                             text-white focus:ring-2 focus:ring-emerald focus:border-transparent
                             outline-none transition"
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
                    value={reservationData.numberOfGuests || ""}
                    onChange={(e) =>
                      setReservationData({
                        ...reservationData,
                        numberOfGuests: parseInt(e.target.value) || 1,
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
                  Table *
                </label>
                <select
                  value={reservationData.cafeTableId || ""}
                  onChange={(e) =>
                    setReservationData({
                      ...reservationData,
                      cafeTableId: parseInt(e.target.value) || 0,
                    })
                  }
                  required
                  className="w-full px-4 py-3 bg-dark-forest border border-jade/50 rounded-lg
                           text-white focus:ring-2 focus:ring-emerald focus:border-transparent
                           outline-none transition appearance-none cursor-pointer"
                >
                  <option value="">Select a table</option>
                  {availableTables.map((table) => (
                    <option key={table.id} value={table.id}>
                      Table {table.tableNumber} (Cap: {table.capacity})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </>
        );

      default:
        return <p className="text-gray-400">Invalid section</p>;
    }
  };

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
          <h2 className="text-2xl font-bold text-white">{getTitle()}</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-jade/10 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {renderForm()}

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
                  Creating...
                </span>
              ) : (
                "Create"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
};
