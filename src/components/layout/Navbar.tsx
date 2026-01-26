"use client";

import React from "react";
import Link from "next/link";
import StaggeredMenu from "@/components/ui/StaggeredMenu";

const menuItems = [
  { label: "Home", ariaLabel: "Go to home page", link: "/" },
  { label: "Menu", ariaLabel: "View our menu", link: "#menu" },
  {
    label: "Reservations",
    ariaLabel: "Make a reservation",
    link: "#reservations",
  },
  { label: "Admin", ariaLabel: "Admin portal", link: "/auth" },
];

const socialItems = [
  { label: "Instagram", link: "https://instagram.com" },
  { label: "Facebook", link: "https://facebook.com" },
  { label: "Twitter", link: "https://twitter.com" },
];

export const Navbar: React.FC = () => {
  return (
    <div className="fixed top-0 w-full z-50">
      <StaggeredMenu
        position="right"
        items={menuItems}
        socialItems={socialItems}
        displaySocials
        displayItemNumbering={false}
        menuButtonColor="#D4D4D4"
        openMenuButtonColor="#D4D4D4"
        changeMenuColorOnOpen={true}
        colors={["#255F38", "#1F7D53"]}
        logoUrl="/logo.svg"
        accentColor="#1F7D53"
        isFixed={true}
        onMenuOpen={() => console.log("Menu opened")}
        onMenuClose={() => console.log("Menu closed")}
      />
    </div>
  );
};
