"use client";

import React from "react";
import ModernEventTemplate, { TemplatePageData } from "./ModernEventTemplate";
import BoldMinimalistTemplate from "./BoldMinimalistTemplate";
import CardCompactTemplate from "./CardCompactTemplate";
import { FormFieldItem } from "../builder/FormFieldBuilder";

export interface TemplateRendererProps {
  templateId?: string | null;
  data: TemplatePageData;
  fields?: FormFieldItem[];
  isDraft?: boolean;
}

export const TEMPLATE_LIST = [
  {
    id: "modern-event",
    name: "Modern Clean",
    description: "Format satu lembar minimalis bergaya Notion/Linktree. Cepat, elegan, dan fokus pada informasi utama.",
    badge: "Populer",
  },
  {
    id: "bold-minimalist",
    name: "Bold Minimalist",
    description: "Format tipografi kontras gelap-terang yang tegas dan berani. Sangat cocok untuk webinar teknologi & workshop.",
    badge: "Event & Webinar",
  },
  {
    id: "card-compact",
    name: "Card Compact (Bento)",
    description: "Gaya kartu modular terpisah ala Bento grid. Sangat ideal untuk jualan produk UMKM, katalog, atau event komunitas.",
    badge: "Produk & Komunitas",
  },
];

export default function TemplateRenderer({
  templateId = "modern-event",
  data,
  fields = [],
  isDraft = true,
}: TemplateRendererProps) {
  switch (templateId) {
    case "bold-minimalist":
      return (
        <BoldMinimalistTemplate
          data={data}
          fields={fields}
          isDraft={isDraft}
        />
      );
    case "card-compact":
      return (
        <CardCompactTemplate
          data={data}
          fields={fields}
          isDraft={isDraft}
        />
      );
    case "modern-event":
    default:
      return (
        <ModernEventTemplate
          data={data}
          fields={fields}
          isDraft={isDraft}
        />
      );
  }
}

