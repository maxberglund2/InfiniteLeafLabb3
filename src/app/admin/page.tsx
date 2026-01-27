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
    { id: "tables" as Section, label: "Tables", icon: <ChefHat size={16} /> },
    {
      id: "customers" as Section,
      label: "Customers",
      icon: <Users size={16} />,
    },
    { id: "menu" as Section, label: "Menu Items", icon: <Coffee size={16} /> },
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
    /* h-screen + flex-col + overflow-hidden prevents the body from scrolling */
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
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Operations
          </h2>
          <div className="block md:hidden">
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
          </div>
          <div className="hidden md:block">
            <SegmentedControl
              options={operationsSections}
              value={activeSection}
              onChange={(value) => setActiveSection(value as Section)}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-linear-to-r from-transparent via-jade/30 to-transparent shrink-0" />

        {/* Table Container */}
        <div className="flex-1 min-h-0 animate-fadeIn">{renderTable()}</div>
      </div>
    </div>
  );
};

export default withAuth(AdminPage);
