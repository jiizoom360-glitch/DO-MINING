import React, { useState } from 'react';
import { Sidebar, SidebarSection } from './Sidebar.js';
import { Topbar } from './Topbar.js';

export interface AppShellProps {
  brandName?: string;
  brandTagline?: string;
  brand?: React.ReactNode;
  sections?: SidebarSection[];
  navigationSections?: SidebarSection[];
  topbarTitle?: React.ReactNode;
  topbarRight?: React.ReactNode;
  topbarActions?: React.ReactNode;
  sidebarFooter?: React.ReactNode;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  brandName = 'DO-Mining',
  brandTagline = 'LMS Mines & Carrières',
  brand,
  sections,
  navigationSections,
  topbarTitle,
  topbarRight,
  topbarActions,
  sidebarFooter,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const resolvedSections = sections || navigationSections || [];
  const resolvedTopbarRight = topbarRight || topbarActions;

  return (
    <div className="min-h-screen bg-dm-surface text-dm-ink flex">
      {/* Sidebar (Desktop permanent & Mobile drawer) */}
      <Sidebar
        brandName={brandName}
        brandTagline={brandTagline}
        brand={brand}
        sections={resolvedSections}
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        footer={sidebarFooter}
      />

      {/* Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Topbar
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          title={topbarTitle}
          rightContent={resolvedTopbarRight}
        />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  );
};
