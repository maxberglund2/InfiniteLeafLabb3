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
      if (response.data) {
        setMenuItems(response.data);
      }
    } catch (error) {
      toast.error("Failed to load menu items");
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSort = () => {
    let filtered = [...menuItems];

    // Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query),
      );
    }

    // Sort
    if (sortConfig.key && sortConfig.direction) {
      filtered.sort((a, b) => {
        const aVal = (a as any)[sortConfig.key];
        const bVal = (b as any)[sortConfig.key];

        if (typeof aVal === "string") {
          return sortConfig.direction === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
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
    if (!confirm("Are you sure you want to delete this menu item?")) return;

    try {
      await menuService.delete(id);
      toast.success("Menu item deleted");
      fetchMenuItems();
    } catch (error) {
      toast.error("Failed to delete menu item");
    }
  };

  const togglePopular = async (item: MenuItemDto) => {
    try {
      await menuService.update(item.id, {
        ...item,
        isPopular: !item.isPopular,
      });
      toast.success(
        item.isPopular
          ? "Removed from popular items"
          : "Added to popular items",
      );
      fetchMenuItems();
    } catch (error) {
      toast.error("Failed to update menu item");
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
      <div className="flex items-center justify-between">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search menu items..."
        />
        <div className="text-sm text-gray-400">
          {filteredData.length} item{filteredData.length !== 1 ? "s" : ""}
        </div>
      </div>

      <div className="bg-moss/30 border border-jade/20 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-forest/50 border-b border-jade/20">
              <tr>
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
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No menu items found
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-moss/20 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">🍃</div>
                        <div>
                          <div className="text-white font-medium">
                            {item.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {item.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400 max-w-xs truncate">
                      {item.description}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <div className="flex items-center justify-end gap-1 text-emerald font-semibold">
                        <DollarSign size={14} />
                        {item.price.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      <button
                        onClick={() => togglePopular(item)}
                        className={`p-2 rounded-lg transition-colors ${
                          item.isPopular
                            ? "text-yellow-400 bg-yellow-400/10 hover:bg-yellow-400/20"
                            : "text-gray-500 hover:text-yellow-400 hover:bg-yellow-400/10"
                        }`}
                        title={
                          item.isPopular
                            ? "Remove from popular"
                            : "Mark as popular"
                        }
                      >
                        <Star
                          size={16}
                          fill={item.isPopular ? "currentColor" : "none"}
                        />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingMenuItem(item)}
                          className="p-2 text-gray-400 hover:text-emerald hover:bg-jade/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
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
