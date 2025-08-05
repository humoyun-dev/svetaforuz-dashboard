"use client";

import type React from "react";
import { useEffect, useState } from "react";
import Modal from "@/components/modals/index";
import { closeSettingsModal, useSettingsStore } from "@/hooks/use-settings";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import {
  CircleDollarSign,
  Globe,
  Lock,
  MonitorSmartphone,
  Paintbrush,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AccountSection from "@/components/modals/settings/account.section";
import AppearanceSections from "@/components/modals/settings/appearance.sections";
import { LanguageSection } from "@/components/modals/settings/language.sections";
import DevicesSections from "@/components/modals/settings/devices.sections";

import { useTranslation } from "react-i18next";
import DollarSection from "@/components/modals/settings/dollar.section";

interface SettingsItem {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  id: string;
}

const SettingsModal = () => {
  const { t } = useTranslation();
  const { setOpen, open, activeSection, setActiveSection } = useSettingsStore();

  const settingsData: SettingsItem[] = [
    { name: t("settings.account"), icon: UserRound, id: "account" },
    { name: t("settings.appearance"), icon: Paintbrush, id: "appearance" },
    { name: t("settings.language.title"), icon: Globe, id: "language" },
    { name: t("settings.devices"), icon: MonitorSmartphone, id: "devices" },
    { name: t("settings.dollar"), icon: CircleDollarSign, id: "dollar" },
  ];

  useEffect(() => {
    const handleHashCheck = () => {
      if (window.location.hash === "#settings") {
        setOpen(true);
      }
    };

    window.addEventListener("hashchange", handleHashCheck);
    handleHashCheck();

    return () => {
      window.removeEventListener("hashchange", handleHashCheck);
    };
  }, [setOpen]);

  const closeSettings = () => {
    setOpen(false);
    closeSettingsModal();
    setActiveSection("account");
  };

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
  };

  const renderSettingsContent = () => {
    switch (activeSection) {
      case "account":
        return <AccountSection />;
      case "appearance":
        return <AppearanceSections />;
      case "language":
        return <LanguageSection />;
      case "devices":
        return <DevicesSections />;
      case "dollar":
        return <DollarSection />;
      default:
        return <></>;
    }
  };

  return (
    <Modal
      className="overflow-hidden p-0 md:max-h-[600px] md:max-w-[900px] lg:max-w-[1000px]"
      title={t("settings.title")}
      open={open}
      setOpen={closeSettings}
      header={false}
    >
      <SidebarProvider>
        <div className="flex h-[500px] md:h-full w-full">
          <div className="flex w-full h-full">
            <Sidebar collapsible="none" className="w-64 p-1 h-full border-r">
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {settingsData.map((item) => (
                        <SidebarMenuItem key={item.id}>
                          <SidebarMenuButton
                            isActive={activeSection === item.id}
                            onClick={() => handleSectionChange(item.id)}
                            className={`cursor-pointer ${activeSection === item.id && "shadow-sm"}`}
                          >
                            <item.icon className="h-4 w-4" />
                            <span>{item.name}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
            </Sidebar>

            <main className="flex flex-1 flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6">
                {renderSettingsContent()}
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </Modal>
  );
};

export default SettingsModal;
