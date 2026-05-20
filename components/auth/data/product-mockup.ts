import type { ProductMockupImage } from "@/lib/types/synapse";

export const PRODUCT_MOCKUP_IMAGE = {
  src: "/auth-workspace-preview.jpg",
  alt: "Synapse Workspace 主面板预览",
  width: 1440,
  height: 900,
} as const satisfies ProductMockupImage;
