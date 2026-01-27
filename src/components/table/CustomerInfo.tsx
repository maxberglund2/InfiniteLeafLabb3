"use client";

import React, { useState } from "react";
import { Button } from "../shared/Button";

interface CustomerData {
  name: string;
  phoneNumber: string;
}

interface CustomerInfoProps {
  onNext: (customerData: CustomerData) => void;
  onBack: () => void;
}

export const CustomerInfo: React.FC<CustomerInfoProps> = ({
  onNext,
  onBack,
}) => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && phoneNumber.trim()) {
      onNext({ name: name.trim(), phoneNumber: phoneNumber.trim() });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Your Information</h2>
        <p className="text-gray-400">
          We'll use this to confirm your reservation
        </p>
      </div>

      <div className="space-y-4 max-w-md mx-auto">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={100}
            className="w-full px-4 py-3 bg-dark-forest border border-jade/50 rounded-lg focus:ring-2 focus:ring-emerald focus:border-transparent outline-none transition text-white placeholder-gray-500"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            maxLength={20}
            className="w-full px-4 py-3 bg-dark-forest border border-jade/50 rounded-lg focus:ring-2 focus:ring-emerald focus:border-transparent outline-none transition text-white placeholder-gray-500"
            placeholder="Enter your phone number"
          />
        </div>

        <div className="bg-moss/50 border border-jade/30 rounded-lg p-4 text-sm text-gray-400">
          <p className="mb-2">
            <strong className="text-white">Note:</strong> We'll send a
            confirmation to this number.
          </p>
          <p>Please arrive 10 minutes before your reservation time.</p>
        </div>
      </div>

      <div className="flex gap-4 pt-6 max-w-md mx-auto">
        <Button variant="secondary" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={!name.trim() || !phoneNumber.trim()}
          className="flex-1"
        >
          Review Reservation
        </Button>
      </div>
    </form>
  );
};
