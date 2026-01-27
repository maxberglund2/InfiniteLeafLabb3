"use client";

import React, { useState } from "react";
import { ProgressSteps } from "@/components/shared/ProgressSteps";
import { SelectDate } from "@/components/table/SelectDate";
import { SelectGuests } from "@/components/table/SelectGuests";
import { SelectTable } from "@/components/table/SelectTable";
import { CustomerInfo } from "@/components/table/CustomerInfo";
import { ConfirmReservation } from "@/components/table/ConfirmReservation";
import { ReservationSuccess } from "@/components/table/ReservationSuccess";
import { reservationService } from "@/services/reservation.service";
import { customerService } from "@/services/customer.service";

const STEPS = [
  { number: 1, title: "Date & Time" },
  { number: 2, title: "Guests" },
  { number: 3, title: "Table" },
  { number: 4, title: "Info" },
  { number: 5, title: "Confirm" },
];

export default function ReservationsPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [reservationData, setReservationData] = useState<{
    dateTime?: Date;
    time?: string;
    numberOfGuests?: number;
    tableId?: number;
    customerName?: string;
    customerPhone?: string;
  }>({});

  const handleDateSelect = (date: Date, time: string) => {
    setReservationData({ ...reservationData, dateTime: date, time });
    setCurrentStep(2);
  };

  const handleGuestsSelect = (numberOfGuests: number) => {
    setReservationData({ ...reservationData, numberOfGuests });
    setCurrentStep(3);
  };

  const handleTableSelect = (tableId: number) => {
    setReservationData({ ...reservationData, tableId });
    setCurrentStep(4);
  };

  const handleCustomerInfo = (customerData: {
    name: string;
    phoneNumber: string;
  }) => {
    setReservationData({
      ...reservationData,
      customerName: customerData.name,
      customerPhone: customerData.phoneNumber,
    });
    setCurrentStep(5);
  };

  const handleConfirmReservation = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      // First, create or find the customer
      const customerResponse = await customerService.create({
        name: reservationData.customerName!,
        phoneNumber: reservationData.customerPhone!,
      });

      if (customerResponse.error || !customerResponse.data) {
        throw new Error(customerResponse.error || "Failed to create customer");
      }

      // Then create the reservation
      const reservationResponse = await reservationService.create({
        startTime: reservationData.dateTime!.toISOString(),
        numberOfGuests: reservationData.numberOfGuests!,
        cafeTableId: reservationData.tableId!,
        customerId: customerResponse.data.id,
      });

      if (reservationResponse.error || !reservationResponse.data) {
        throw new Error(
          reservationResponse.error || "Failed to create reservation",
        );
      }

      // Success! Move to success step
      setCurrentStep(6);
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
      console.error("Reservation error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewReservation = () => {
    setReservationData({});
    setCurrentStep(1);
    setError("");
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        {currentStep < 6 && (
          <ProgressSteps currentStep={currentStep} steps={STEPS} />
        )}

        {error && (
          <div className="bg-red-900/30 border border-red-700/50 text-red-300 px-6 py-4 rounded-lg mb-6 max-w-2xl mx-auto">
            <p className="font-medium">{error}</p>
          </div>
        )}

        <div className="bg-moss/40 border border-jade/30 rounded-2xl p-8 backdrop-blur-md">
          {currentStep === 1 && <SelectDate onNext={handleDateSelect} />}

          {currentStep === 2 && (
            <SelectGuests
              onNext={handleGuestsSelect}
              onBack={() => setCurrentStep(1)}
            />
          )}

          {currentStep === 3 &&
            reservationData.dateTime &&
            reservationData.numberOfGuests && (
              <SelectTable
                dateTime={reservationData.dateTime}
                numberOfGuests={reservationData.numberOfGuests}
                onNext={handleTableSelect}
                onBack={() => setCurrentStep(2)}
              />
            )}

          {currentStep === 4 && (
            <CustomerInfo
              onNext={handleCustomerInfo}
              onBack={() => setCurrentStep(3)}
            />
          )}

          {currentStep === 5 &&
            reservationData.dateTime &&
            reservationData.time &&
            reservationData.numberOfGuests &&
            reservationData.tableId &&
            reservationData.customerName &&
            reservationData.customerPhone && (
              <ConfirmReservation
                reservationData={{
                  dateTime: reservationData.dateTime,
                  time: reservationData.time,
                  numberOfGuests: reservationData.numberOfGuests,
                  tableId: reservationData.tableId,
                  customerName: reservationData.customerName,
                  customerPhone: reservationData.customerPhone,
                }}
                onConfirm={handleConfirmReservation}
                onBack={() => setCurrentStep(4)}
                isSubmitting={isSubmitting}
              />
            )}

          {currentStep === 6 &&
            reservationData.dateTime &&
            reservationData.time &&
            reservationData.numberOfGuests &&
            reservationData.customerName && (
              <ReservationSuccess
                reservationData={{
                  dateTime: reservationData.dateTime,
                  time: reservationData.time,
                  numberOfGuests: reservationData.numberOfGuests,
                  customerName: reservationData.customerName,
                }}
                onNewReservation={handleNewReservation}
              />
            )}
        </div>
      </div>
    </div>
  );
}
