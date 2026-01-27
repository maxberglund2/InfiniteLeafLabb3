"use client";

import React, { useState, useEffect } from "react";
import { Pencil, Trash2, Phone, User } from "lucide-react";
import { CustomerDto } from "@/types/api.types";
import { customerService } from "@/services/customer.service";
import { SearchBar } from "./tools/SearchBar";
import { TableHeader, SortDirection } from "./tools/TableHeader";
import { EditCustomerModal } from "./modals/EditCustomerModal";
import { toast } from "react-toastify";

export const CustomersTable: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerDto[]>([]);
  const [filteredData, setFilteredData] = useState<CustomerDto[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: SortDirection;
  }>({ key: "name", direction: "asc" });
  const [editingCustomer, setEditingCustomer] = useState<CustomerDto | null>(
    null,
  );

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    filterAndSort();
  }, [customers, searchQuery, sortConfig]);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const response = await customerService.getAll();
      if (response.data) {
        setCustomers(response.data);
      }
    } catch (error) {
      toast.error("Failed to load customers");
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSort = () => {
    let filtered = [...customers];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(query) || c.phoneNumber.includes(query),
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
    if (!confirm("Are you sure you want to delete this customer?")) return;

    try {
      await customerService.delete(id);
      toast.success("Customer deleted");
      fetchCustomers();
    } catch (error) {
      toast.error("Failed to delete customer");
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
      {/* Header Controls */}
      <div className="flex shrink-0 items-start justify-start md:items-center sm:justify-between flex-col sm:flex-row gap-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by name or phone..."
        />
        <div className="text-sm text-gray-400 font-mono">
          {filteredData.length} total users
        </div>
      </div>

      {/* Scrollable Table Area */}
      <div className="flex-1 min-h-0 bg-moss/20 border border-jade/20 rounded-xl flex flex-col overflow-hidden shadow-inner">
        <div className="overflow-auto relative h-full custom-scrollbar">
          <table className="w-full border-separate border-spacing-0">
            <thead className="sticky top-0 z-10">
              <tr className="bg-dark-forest shadow-sm">
                <TableHeader
                  label="Customer"
                  sortKey="name"
                  currentSort={sortConfig}
                  onSort={handleSort}
                />
                <TableHeader
                  label="Phone Number"
                  sortKey="phoneNumber"
                  currentSort={sortConfig}
                  onSort={handleSort}
                />
                <TableHeader label="ID" align="center" />
                <TableHeader label="Actions" align="right" />
              </tr>
            </thead>
            <tbody className="divide-y divide-jade/10">
              {filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-20 text-center text-gray-500"
                  >
                    No customers found
                  </td>
                </tr>
              ) : (
                filteredData.map((customer) => (
                  <tr
                    key={customer.id}
                    className="hover:bg-jade/5 transition-colors group"
                  >
                    <td className="px-4 py-4 text-sm whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-jade/10 flex items-center justify-center border border-jade/20 group-hover:border-emerald/40 transition-colors">
                          <User size={18} className="text-emerald" />
                        </div>
                        <span className="text-white font-medium group-hover:text-emerald transition-colors">
                          {customer.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm whitespace-nowrap">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Phone size={14} className="text-emerald/70" />
                        {customer.phoneNumber}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-center text-gray-500 font-mono">
                      #{customer.id}
                    </td>
                    <td className="px-4 py-4 text-sm text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setEditingCustomer(customer)}
                          className="p-2 text-gray-400 hover:text-emerald hover:bg-emerald/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(customer.id)}
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
      {editingCustomer && (
        <EditCustomerModal
          customer={editingCustomer}
          isOpen={!!editingCustomer}
          onClose={() => setEditingCustomer(null)}
          onSuccess={fetchCustomers}
        />
      )}
    </div>
  );
};
