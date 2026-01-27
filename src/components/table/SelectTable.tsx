"use client";

import React, { useState, useEffect } from "react";
import { Button } from "../shared/Button";
import { Loading } from "../shared/Loading";
import { tableService } from "@/services/table.service";
import { AvailableTableDto } from "@/types/api.types";
import { Armchair, Users, Info } from "lucide-react";

interface SelectTableProps {
  dateTime: Date;
  numberOfGuests: number;
  initialTableId?: number;
  onNext: (tableId: number) => void;
  onBack: () => void;
}

export const SelectTable: React.FC<SelectTableProps> = ({
  dateTime,
  numberOfGuests,
  initialTableId,
  onNext,
  onBack,
}) => {
  const [tables, setTables] = useState<AvailableTableDto[]>([]);
  const [selectedTable, setSelectedTable] = useState<number | null>(
    initialTableId || null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchAvailableTables();
  }, [dateTime, numberOfGuests]);

  const fetchAvailableTables = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await tableService.getAvailable(
        dateTime.toISOString(),
        numberOfGuests,
      );
      if (response.data) {
        setTables(response.data);
        if (
          initialTableId &&
          !response.data.find((t) => t.id === initialTableId)
        ) {
          setSelectedTable(null);
        }
        if (response.data.length === 0) {
          setError("No tables available for the selected criteria.");
        }
      } else {
        setError(response.error || "Failed to load tables");
      }
    } catch (err) {
      setError("An error occurred while loading tables");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loading message="Checking floor availability..." />;

  return (
    <div className="space-y-8 animate-fadeIn max-w-2xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white tracking-tight">
          Choose a Table
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          {tables.length} {tables.length === 1 ? "option" : "options"} found for
          your party
        </p>
      </div>

      {error ? (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl text-center">
          <Info className="mx-auto mb-2 opacity-80" size={20} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tables.map((table) => {
            const isSelected = selectedTable === table.id;
            return (
              <button
                key={table.id}
                onClick={() => setSelectedTable(table.id)}
                className={`group relative flex items-center p-5 rounded-2xl border transition-all duration-300 ${
                  isSelected
                    ? "bg-jade/10 border-jade shadow-[0_0_20px_rgba(0,168,107,0.15)]"
                    : "bg-moss/5 border-white/5 hover:border-jade/40 hover:bg-jade/5"
                }`}
              >
                {/* Visual Indicator */}
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-xl mr-4 transition-colors ${
                    isSelected ? "bg-jade text-white" : "bg-moss/20 text-jade"
                  }`}
                >
                  <Armchair size={24} />
                </div>

                <div className="text-left flex-1">
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-bold text-lg ${isSelected ? "text-white" : "text-gray-300"}`}
                    >
                      Table {table.tableNumber}
                    </span>
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-jade animate-pulse" />
                    )}
                  </div>
                  <div className="flex items-center text-xs text-gray-500 mt-0.5">
                    <Users size={12} className="mr-1" />
                    Capacity: {table.capacity} guests
                  </div>
                </div>

                {/* Selection Ring Overlay */}
                <div
                  className={`absolute inset-0 rounded-2xl border-2 transition-opacity duration-300 ${
                    isSelected ? "opacity-100 border-jade/50" : "opacity-0"
                  }`}
                />
              </button>
            );
          })}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button
          variant="secondary"
          onClick={onBack}
          className="flex-1 order-2 sm:order-1"
        >
          Change Details
        </Button>
        <Button
          variant="primary"
          onClick={() => selectedTable && onNext(selectedTable)}
          disabled={!selectedTable || tables.length === 0}
          className="flex-1 order-1 sm:order-2 py-4"
        >
          Confirm Selection
        </Button>
      </div>
    </div>
  );
};
