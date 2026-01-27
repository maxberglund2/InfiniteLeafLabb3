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

    // Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.tableNumber.toString().includes(query) ||
          t.capacity.toString().includes(query),
      );
    }

    // Sort
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
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-jade border-t-emerald rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-start md:items-center sm:justify-between flex-col sm:flex-row">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by table number or capacity..."
        />
        <div className="text-sm text-gray-400">
          {filteredData.length} table{filteredData.length !== 1 ? "s" : ""}
        </div>
      </div>

      <div className="bg-moss/30 border border-jade/20 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-forest/50 border-b border-jade/20">
              <tr>
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
                    colSpan={4}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No tables found
                  </td>
                </tr>
              ) : (
                filteredData.map((table) => (
                  <tr
                    key={table.id}
                    className="hover:bg-moss/20 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-jade/20 flex items-center justify-center text-emerald font-bold">
                          {table.tableNumber}
                        </div>
                        <span className="text-white font-medium">
                          Table {table.tableNumber}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-moss rounded-full">
                        <Users size={14} className="text-emerald" />
                        <span className="text-white font-medium">
                          {table.capacity}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingTable(table)}
                          className="p-2 text-gray-400 hover:text-emerald hover:bg-jade/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(table.id)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/10 rounded-lg transition-colors"
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
