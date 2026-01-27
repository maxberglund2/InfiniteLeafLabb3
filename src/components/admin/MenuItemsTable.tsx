"use client";

import React, { useState, useEffect } from "react";
import { Pencil, Trash2, DollarSign, Star } from "lucide-react";
import { MenuItemDto } from "@/types/api.types";
import { menuService } from "@/services/menu.service";
import { SearchBar } from "./tools/SearchBar";
import { TableHeader, SortDirection } from "./tools/TableHeader";
import { EditMenuItemModal } from "./modals/EditMenuItemModal";
import { toast } from "react-toastify";

export const MenuItemsTable: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItemDto[]>([]);
  const [filteredData, setFilteredData] = useState<MenuItemDto[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: SortDirection;
  }>({ key: "name", direction: "asc" });
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItemDto | null>(
    null,
  );

  useEffect(() => {
    fetchMenuItems();
  }, []);
  useEffect(() => {
    filterAndSort();
  }, [menuItems, searchQuery, sortConfig]);

  const fetchMenuItems = async () => {
    setIsLoading(true);
    try {
      const response = await menuService.getAll();
      if (response.data) setMenuItems(response.data);
    } catch (error) {
      toast.error("Failed to load menu items");
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSort = () => {
    let filtered = [...menuItems];
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query),
      );
    }
    if (sortConfig.key && sortConfig.direction) {
      filtered.sort((a, b) => {
        const aVal = (a as any)[sortConfig.key];
        const bVal = (b as any)[sortConfig.key];
        if (typeof aVal === "string") {
          return sortConfig.direction === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }
        return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
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
    if (!confirm("Are you sure?")) return;
    try {
      await menuService.delete(id);
      toast.success("Item deleted");
      fetchMenuItems();
    } catch {
      toast.error("Delete failed");
    }
  };

  const togglePopular = async (item: MenuItemDto) => {
    try {
      await menuService.update(item.id, {
        ...item,
        isPopular: !item.isPopular,
      });
      fetchMenuItems();
    } catch {
      toast.error("Update failed");
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
      {/* Search Bar Area */}
      <div className="flex shrink-0 items-start justify-start md:items-center sm:justify-between flex-col sm:flex-row gap-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search menu items..."
        />
        <div className="text-sm text-gray-400 font-mono">
          {filteredData.length} items total
        </div>
      </div>

      {/* Table Area */}
      <div className="flex-1 min-h-0 bg-moss/20 border border-jade/20 rounded-xl flex flex-col overflow-hidden shadow-inner">
        <div className="overflow-auto relative">
          <table className="w-full border-separate border-spacing-0">
            <thead className="sticky top-0 z-10">
              <tr className="bg-dark-forest shadow-sm">
                <TableHeader
                  label="Item"
                  sortKey="name"
                  currentSort={sortConfig}
                  onSort={handleSort}
                />
                <TableHeader label="Description" />
                <TableHeader
                  label="Price"
                  sortKey="price"
                  currentSort={sortConfig}
                  onSort={handleSort}
                  align="right"
                />
                <TableHeader label="Popular" align="center" />
                <TableHeader label="Actions" align="right" />
              </tr>
            </thead>
            <tbody className="divide-y divide-jade/10">
              {filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-20 text-center text-gray-500"
                  >
                    No menu items found
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-jade/5 transition-colors group"
                  >
                    <td className="px-4 py-4 text-sm whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <span className="text-xl group-hover:scale-110 transition-transform">
                          🍃
                        </span>
                        <div>
                          <div className="text-white font-medium">
                            {item.name}
                          </div>
                          <div className="text-[10px] text-gray-500 font-mono uppercase">
                            ID: {item.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-400 max-w-xs truncate">
                      {item.description}
                    </td>
                    <td className="px-4 py-4 text-sm text-right font-semibold text-emerald">
                      ¥{item.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 text-sm text-center">
                      <button
                        onClick={() => togglePopular(item)}
                        className={`p-2 rounded-lg ${item.isPopular ? "text-yellow-400 bg-yellow-400/5" : "text-gray-600 hover:text-yellow-200"}`}
                      >
                        <Star
                          size={16}
                          fill={item.isPopular ? "currentColor" : "none"}
                        />
                      </button>
                    </td>
                    <td className="px-4 py-4 text-sm text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setEditingMenuItem(item)}
                          className="p-2 text-gray-400 hover:text-emerald hover:bg-emerald/10 rounded-lg transition-colors"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
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

      {editingMenuItem && (
        <EditMenuItemModal
          menuItem={editingMenuItem}
          isOpen={!!editingMenuItem}
          onClose={() => setEditingMenuItem(null)}
          onSuccess={fetchMenuItems}
        />
      )}
    </div>
  );
};
