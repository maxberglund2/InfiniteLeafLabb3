"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Pencil, Trash2, Calendar, Users, Hash } from "lucide-react";
import { ReservationDto } from "@/types/api.types";
import { reservationService } from "@/services/reservation.service";
import { SearchBar } from "./tools/SearchBar";
import { TableHeader, SortDirection } from "./tools/TableHeader";
import { EditReservationModal } from "./modals/EditReservationModal";
import { toast } from "react-toastify";

export const ReservationsTable: React.FC = () => {
  const [reservations, setReservations] = useState<ReservationDto[]>([]);
  const [filteredData, setFilteredData] = useState<ReservationDto[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: SortDirection;
  }>({ key: "startTime", direction: "desc" });
  const [editingReservation, setEditingReservation] =
    useState<ReservationDto | null>(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  useEffect(() => {
    filterAndSort();
  }, [reservations, searchQuery, sortConfig]);

  const fetchReservations = async () => {
    setIsLoading(true);
    try {
      const response = await reservationService.getAll();
      if (response.data) {
        setReservations(response.data);
      }
    } catch (error) {
      toast.error("Failed to load reservations");
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSort = () => {
    let filtered = [...reservations];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.customer.name.toLowerCase().includes(query) ||
          r.customer.phoneNumber.includes(query) ||
          r.cafeTable.tableNumber.toString().includes(query),
      );
    }

    if (sortConfig.key && sortConfig.direction) {
      filtered.sort((a, b) => {
        let aVal: any;
        let bVal: any;

        if (sortConfig.key === "customerName") {
          aVal = a.customer.name;
          bVal = b.customer.name;
        } else if (sortConfig.key === "tableNumber") {
          aVal = a.cafeTable.tableNumber;
          bVal = b.cafeTable.tableNumber;
        } else if (sortConfig.key === "startTime") {
          aVal = new Date(a.startTime).getTime();
          bVal = new Date(b.startTime).getTime();
        } else {
          aVal = (a as any)[sortConfig.key];
          bVal = (b as any)[sortConfig.key];
        }

        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    setFilteredData(filtered);
  };

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key
          ? prev.direction === "asc"
            ? "desc"
            : prev.direction === "desc"
              ? null
              : "asc"
          : "asc",
    }));
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this reservation?")) return;

    try {
      await reservationService.delete(id);
      toast.success("Reservation deleted");
      fetchReservations();
    } catch (error) {
      toast.error("Failed to delete reservation");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-jade border-t-emerald rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Search and Count Wrapper */}
      <div className="flex shrink-0 items-start justify-start md:items-center sm:justify-between flex-col sm:flex-row gap-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by customer, phone, or table..."
        />
        <div className="text-sm text-gray-400 font-mono">
          {filteredData.length} total bookings
        </div>
      </div>

      {/* Independent Scrollable Table Area */}
      <div className="flex-1 min-h-0 bg-moss/20 border border-jade/20 rounded-xl flex flex-col overflow-hidden shadow-inner">
        <div className="overflow-auto relative h-full custom-scrollbar">
          <table className="w-full border-separate border-spacing-0">
            <thead className="sticky top-0 z-10">
              <tr className="bg-dark-forest shadow-sm">
                <TableHeader
                  label="Date & Time"
                  sortKey="startTime"
                  currentSort={sortConfig}
                  onSort={handleSort}
                />
                <TableHeader
                  label="Customer"
                  sortKey="customerName"
                  currentSort={sortConfig}
                  onSort={handleSort}
                />
                <TableHeader label="Phone" />
                <TableHeader
                  label="Guests"
                  sortKey="numberOfGuests"
                  currentSort={sortConfig}
                  onSort={handleSort}
                  align="center"
                />
                <TableHeader
                  label="Table"
                  sortKey="tableNumber"
                  currentSort={sortConfig}
                  onSort={handleSort}
                  align="center"
                />
                <TableHeader label="Actions" align="right" />
              </tr>
            </thead>
            <tbody className="divide-y divide-jade/10">
              {filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-20 text-center text-gray-500"
                  >
                    No reservations found
                  </td>
                </tr>
              ) : (
                filteredData.map((reservation) => (
                  <tr
                    key={reservation.id}
                    className="hover:bg-jade/5 transition-colors group"
                  >
                    <td className="px-4 py-4 text-sm whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <Calendar size={16} className="text-emerald" />
                        <div>
                          <div className="text-white font-medium">
                            {format(
                              new Date(reservation.startTime),
                              "MMM d, yyyy",
                            )}
                          </div>
                          <div className="text-xs text-gray-500">
                            {format(new Date(reservation.startTime), "h:mm a")}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-white font-medium whitespace-nowrap">
                      {reservation.customer.name}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-400 font-mono whitespace-nowrap">
                      {reservation.customer.phoneNumber}
                    </td>
                    <td className="px-4 py-4 text-sm text-center">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-jade/10 text-emerald border border-jade/20">
                        <Users size={14} />
                        <span className="font-bold">
                          {reservation.numberOfGuests}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-center">
                      <div className="inline-flex items-center gap-1 text-white font-mono">
                        <Hash size={14} className="text-gray-500" />
                        {reservation.cafeTable.tableNumber}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setEditingReservation(reservation)}
                          className="p-2 text-gray-400 hover:text-emerald hover:bg-emerald/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(reservation.id)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingReservation && (
        <EditReservationModal
          reservation={editingReservation}
          isOpen={!!editingReservation}
          onClose={() => setEditingReservation(null)}
          onSuccess={fetchReservations}
        />
      )}
    </div>
  );
};
