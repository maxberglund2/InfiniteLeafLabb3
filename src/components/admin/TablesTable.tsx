"use client";

import React, { useState, useEffect } from "react";
import { Pencil, Trash2, Users } from "lucide-react";
import { CafeTableDto } from "@/types/api.types";
import { tableService } from "@/services/table.service";
import { SearchBar } from "./tools/SearchBar";
import { TableHeader, SortDirection } from "./tools/TableHeader";
import { EditTableModal } from "./modals/EditTableModal";
import { toast } from "react-toastify";

export const TablesTable: React.FC = () => {
  const [tables, setTables] = useState<CafeTableDto[]>([]);
  const [filteredData, setFilteredData] = useState<CafeTableDto[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: SortDirection;
  }>({ key: "tableNumber", direction: "asc" });
  const [editingTable, setEditingTable] = useState<CafeTableDto | null>(null);

  useEffect(() => {
    fetchTables();
  }, []);

  useEffect(() => {
    filterAndSort();
  }, [tables, searchQuery, sortConfig]);

  const fetchTables = async () => {
    setIsLoading(true);
    try {
      const response = await tableService.getAll();
      if (response.data) {
        setTables(response.data);
      }
    } catch (error) {
      toast.error("Failed to load tables");
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSort = () => {
    let filtered = [...tables];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.tableNumber.toString().includes(query) ||
          t.capacity.toString().includes(query),
      );
    }

    if (sortConfig.key && sortConfig.direction) {
      filtered.sort((a, b) => {
        const aVal = (a as any)[sortConfig.key];
        const bVal = (b as any)[sortConfig.key];

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
    if (!confirm("Are you sure you want to delete this table?")) return;

    try {
      await tableService.delete(id);
      toast.success("Table deleted");
      fetchTables();
    } catch (error) {
      toast.error("Failed to delete table");
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
      {/* Top Bar */}
      <div className="flex shrink-0 items-start justify-start md:items-center sm:justify-between flex-col sm:flex-row gap-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by table number or capacity..."
        />
        <div className="text-sm text-gray-400 font-mono">
          {filteredData.length} active units
        </div>
      </div>

      {/* Table Area */}
      <div className="flex-1 min-h-0 bg-moss/20 border border-jade/20 rounded-xl flex flex-col overflow-hidden shadow-inner">
        <div className="overflow-auto relative h-full custom-scrollbar">
          <table className="w-full border-separate border-spacing-0">
            <thead className="sticky top-0 z-10">
              <tr className="bg-dark-forest shadow-sm">
                <TableHeader
                  label="Table Number"
                  sortKey="tableNumber"
                  currentSort={sortConfig}
                  onSort={handleSort}
                />
                <TableHeader
                  label="Capacity"
                  sortKey="capacity"
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
                    colSpan={3}
                    className="px-4 py-20 text-center text-gray-500"
                  >
                    No tables found
                  </td>
                </tr>
              ) : (
                filteredData.map((table) => (
                  <tr
                    key={table.id}
                    className="hover:bg-jade/5 transition-colors group"
                  >
                    <td className="px-4 py-4 text-sm whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-jade/10 flex items-center justify-center text-emerald font-bold border border-jade/20 group-hover:bg-jade/20 transition-all">
                          {table.tableNumber}
                        </div>
                        <span className="text-white font-medium group-hover:text-emerald transition-colors">
                          Table {table.tableNumber}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-center">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-moss border border-jade/10 rounded-full group-hover:border-emerald/30 transition-colors">
                        <Users size={14} className="text-emerald" />
                        <span className="text-white font-medium">
                          {table.capacity} Seats
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setEditingTable(table)}
                          className="p-2 text-gray-400 hover:text-emerald hover:bg-emerald/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(table.id)}
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
      {editingTable && (
        <EditTableModal
          table={editingTable}
          isOpen={!!editingTable}
          onClose={() => setEditingTable(null)}
          onSuccess={fetchTables}
        />
      )}
    </div>
  );
};
