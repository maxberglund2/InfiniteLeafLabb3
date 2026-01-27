"use client";

import React, { useState, useEffect } from "react";
import { Button } from "../shared/Button";
import { Loading } from "../shared/Loading";
import { tableService } from "@/services/table.service";
import { AvailableTableDto } from "@/types/api.types";

interface SelectTableProps {
  dateTime: Date;
  numberOfGuests: number;
  initialTableId?: number; // Add this
  onNext: (tableId: number) => void;
  onBack: () => void;
}

export const SelectTable: React.FC<SelectTableProps> = ({
  dateTime,
  numberOfGuests,
  initialTableId, // Destructure it
  onNext,
  onBack,
}) => {
  const [tables, setTables] = useState<AvailableTableDto[]>([]);
  // Initialize state with the value from the parent
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

        // Logic: If we have an initialTableId, ensure it's actually in the
        // new list of available tables. If not, we might want to reset it.
        if (
          initialTableId &&
          !response.data.find((t) => t.id === initialTableId)
        ) {
          setSelectedTable(null);
        }

        if (response.data.length === 0) {
          setError("No tables available for the selected time and party size.");
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

  if (isLoading) {
    return <Loading message="Finding available tables..." />;
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Select a Table</h2>
        <p className="text-gray-400">
          {tables.length > 0
            ? `${tables.length} table${tables.length !== 1 ? "s" : ""} available for ${numberOfGuests} ${numberOfGuests === 1 ? "guest" : "guests"}`
            : "No tables available"}
        </p>
      </div>

      {error ? (
        <div className="bg-red-900/30 border border-red-700/50 text-red-300 px-6 py-4 rounded-lg text-center">
          <p className="font-medium mb-2">{error}</p>
          <p className="text-sm">Please try a different date or time.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {tables.map((table) => (
            <button
              key={table.id}
              onClick={() => setSelectedTable(table.id)}
              className={`p-6 rounded-xl border-2 transition-all duration-300 text-center ${
                selectedTable === table.id
                  ? "bg-jade border-jade text-white scale-105 shadow-lg shadow-jade/50"
                  : "bg-moss border-jade/30 text-gray-300 hover:border-jade hover:scale-105"
              }`}
            >
              <div className="text-4xl mb-2">🪑</div>
              <div className="font-bold text-xl mb-1">
                Table {table.tableNumber}
              </div>
              <div className="text-sm opacity-80">
                Seats up to {table.capacity}
              </div>
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-4 pt-6">
        <Button variant="secondary" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button
          variant="primary"
          onClick={() => selectedTable && onNext(selectedTable)}
          disabled={!selectedTable || tables.length === 0}
          className="flex-1"
        >
          Next
        </Button>
      </div>
    </div>
  );
};
