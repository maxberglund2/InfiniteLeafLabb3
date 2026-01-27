"use client";

import React, { useState } from "react";
import { Calendar, Users, Coffee, ChefHat } from "lucide-react";
import { SegmentedControl } from "@/components/admin/tools/SegmentedControl";
import { ReservationsTable } from "@/components/admin/ReservationsTable";
import { TablesTable } from "@/components/admin/TablesTable";
import { CustomersTable } from "@/components/admin/CustomersTable";
import { MenuItemsTable } from "@/components/admin/MenuItemsTable";
import { withAuth } from "@/contexts/AuthContext";

type Section = "reservations" | "tables" | "customers" | "menu";

const AdminPage = () => {
  const [activeSection, setActiveSection] = useState<Section>("reservations");

  const operationsSections = [
    {
      id: "reservations" as Section,
      label: "Reservations",
      icon: <Calendar size={16} />,
    },
    {
      id: "tables" as Section,
      label: "Tables",
      icon: <ChefHat size={16} />,
    },
    {
      id: "customers" as Section,
      label: "Customers",
      icon: <Users size={16} />,
    },
    {
      id: "menu" as Section,
      label: "Menu Items",
      icon: <Coffee size={16} />,
    },
  ];

  const renderTable = () => {
    switch (activeSection) {
      case "reservations":
        return <ReservationsTable />;
      case "tables":
        return <TablesTable />;
      case "customers":
        return <CustomersTable />;
      case "menu":
        return <MenuItemsTable />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Admin Dashboard
          </h1>
          <p className="text-gray-400 text-lg">
            Manage your tea house operations
          </p>
        </div>

        {/* Category Sections */}
        <div className="space-y-6">
          {/* Operations Section */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Operations
            </h2>
            {/* Mobile: native select */}
            <div className="block md:hidden">
              <select
                className="w-full px-4 py-3 bg-dark-forest border border-jade/50 rounded-lg
                       text-white focus:ring-2 focus:ring-emerald focus:border-transparent
                       outline-none transition"
                value={activeSection}
                onChange={(e) => setActiveSection(e.target.value as Section)}
              >
                {operationsSections.map((section) => (
                  <option key={section.id} value={section.id}>
                    {section.label}
                  </option>
                ))}
              </select>
            </div>
            {/* Desktop: SegmentedControl */}
            <div className="hidden md:block">
              <SegmentedControl
                options={operationsSections}
                value={activeSection}
                onChange={(value) => setActiveSection(value as Section)}
              />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-linear-to-r from-transparent via-jade/30 to-transparent" />

        {/* Active Table */}
        <div className="animate-fadeIn">{renderTable()}</div>
      </div>
    </div>
  );
};

export default withAuth(AdminPage);
