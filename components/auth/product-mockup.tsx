import Image from "next/image";
import { PRODUCT_MOCKUP_IMAGE } from "./data/product-mockup";

export function ProductMockup() {
  return (
    <div className="relative w-full max-w-[1040px] translate-x-2 -translate-y-1 overflow-hidden border border-white/10 bg-base shadow-[0_24px_70px_rgba(0,0,0,0.46)]">
      <Image
        alt={PRODUCT_MOCKUP_IMAGE.alt}
        className="block h-auto w-full"
        height={PRODUCT_MOCKUP_IMAGE.height}
        priority
        src={PRODUCT_MOCKUP_IMAGE.src}
        width={PRODUCT_MOCKUP_IMAGE.width}
      />
    </div>
  );
}
