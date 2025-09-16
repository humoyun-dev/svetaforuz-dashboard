"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";
import { useShare } from "@/hooks/use-share";
import Modal from "@/components/modals/index";

const ShareModal = () => {
  const { share, setShare } = useShare();
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(
        process.env.NEXT_PUBLIC_URL + share.link,
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <Modal
      open={share.open}
      title={t("shareModal.title")}
      setOpen={() => setShare({ link: "", open: false })}
    >
      <Tabs defaultValue="link" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="link">{t("shareModal.tabs.link")}</TabsTrigger>
          <TabsTrigger disabled value="social">
            {t("shareModal.tabs.social")}
          </TabsTrigger>
          <TabsTrigger disabled value="email">
            {t("shareModal.tabs.email")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="link" className="mt-4">
          <div className="flex items-center space-x-2">
            <Input
              value={process.env.NEXT_PUBLIC_URL + share.link}
              readOnly
              className="flex-1"
            />
            <Button size="sm" onClick={copyToClipboard}>
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  {t("shareModal.copied")}
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  {t("shareModal.copy")}
                </>
              )}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </Modal>
  );
};

export default ShareModal;
