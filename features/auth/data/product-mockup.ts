import type { ProductMockupImage } from "@/lib/types/synapse";

export const PRODUCT_MOCKUP_IMAGE = {
  src: "/auth-workspace-preview.png",
  alt: "Synapse Explore 页面预览",
  width: 2832,
  height: 1868,
} as const satisfies ProductMockupImage;
