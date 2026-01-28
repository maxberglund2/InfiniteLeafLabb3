"use client";

import React, { useState } from "react";
import { Calendar, Users, Coffee, ChefHat, Plus } from "lucide-react";
import { SegmentedControl } from "@/components/admin/tools/SegmentedControl";
import { ReservationsTable } from "@/components/admin/ReservationsTable";
import { TablesTable } from "@/components/admin/TablesTable";
import { CustomersTable } from "@/components/admin/CustomersTable";
import { MenuItemsTable } from "@/components/admin/MenuItemsTable";
import { CreateRecordModal } from "@/components/admin/modals/CreateRecordModal";
import { withAuth } from "@/contexts/AuthContext";

type Section = "reservations" | "tables" | "customers" | "menu";

const AdminPage = () => {
  const [activeSection, setActiveSection] = useState<Section>("reservations");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const operationsSections = [
    {
      id: "reservations" as Section,
      label: "Reservations",
      icon: <Calendar size={16} />,
    },
    { id: "tables" as Section, label: "Tables", icon: <ChefHat size={16} /> },
    {
      id: "customers" as Section,
      label: "Customers",
      icon: <Users size={16} />,
    },
    { id: "menu" as Section, label: "Menu Items", icon: <Coffee size={16} /> },
  ];

  const handleCreateSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const getSectionLabel = () => {
    switch (activeSection) {
      case "reservations":
        return "Reservation";
      case "tables":
        return "Table";
      case "customers":
        return "Customer";
      case "menu":
        return "Menu Item";
      default:
        return "Record";
    }
  };

  const renderTable = () => {
    switch (activeSection) {
      case "reservations":
        return <ReservationsTable key={refreshKey} />;
      case "tables":
        return <TablesTable key={refreshKey} />;
      case "customers":
        return <CustomersTable key={refreshKey} />;
      case "menu":
        return <MenuItemsTable key={refreshKey} />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex flex-col pt-24 pb-8 px-4 overflow-hidden bg-dark-forest">
      <div className="max-w-7xl mx-auto w-full flex flex-col flex-1 min-h-0 space-y-6">
        {/* Header */}
        <div className="space-y-2 shrink-0">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-gray-400 text-lg">
            Manage your tea house operations
          </p>
        </div>

        {/* Navigation */}
        <div className="shrink-0 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Operations
            </h2>
          </div>

          {/* Mobile Dropdown */}
          <div className="flex flex-col gap-2 md:hidden">
            <select
              className="w-full px-4 py-3 bg-moss/50 border border-jade/50 rounded-lg text-white outline-none"
              value={activeSection}
              onChange={(e) => setActiveSection(e.target.value as Section)}
            >
              {operationsSections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-jade to-emerald 
                       hover:from-emerald hover:to-jade text-white rounded-lg transition-all 
                       duration-300 font-medium shadow-lg shadow-emerald/20 transform hover:scale-105"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Add {getSectionLabel()}</span>
              <span className="sm:hidden">Add New</span>
            </button>
          </div>

          {/* Desktop Segmented Control */}
          <div className="hidden md:flex flex-row justify-between items-center">
            <SegmentedControl
              options={operationsSections}
              value={activeSection}
              onChange={(value) => setActiveSection(value as Section)}
            />
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-jade to-emerald 
                       hover:from-emerald hover:to-jade text-white rounded-lg transition-all 
                       duration-300 font-medium shadow-lg shadow-emerald/20 transform hover:scale-105"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Add {getSectionLabel()}</span>
              <span className="sm:hidden">Add New</span>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-linear-to-r from-transparent via-jade/30 to-transparent shrink-0" />

        {/* Table Container */}
        <div className="flex-1 min-h-0 animate-fadeIn">{renderTable()}</div>
      </div>

      {/* Create Modal */}
      <CreateRecordModal
        section={activeSection}
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
};

export default withAuth(AdminPage);
