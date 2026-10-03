"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type SushiItem = {
  id: string;
  title: string;
  subtitle: string;
  image?: string;
  hasAddon: boolean;
  addons: string[];
};

type HologramAnchor = {
  x: number;
  y: number;
};

/*
  16 เมนูแรก = ไม่มี Add-on
*/
const REGULAR_SUSHI: SushiItem[] = [
  {
    id: "sushi-salmon",
    title: "ซูชิแซลมอน",
    subtitle: "SUSHI",
    hasAddon: false,
    addons: [],
  },
  {
    id: "sushi-salmon-burn",
    title: "ซูชิปลาแซลมอนเบิร์น",
    subtitle: "SUSHI",
    hasAddon: false,
    addons: [],
  },
  {
    id: "sushi-salmon-belly",
    title: "ซูชิท้องปลาแซลมอน",
    subtitle: "SUSHI",
    hasAddon: false,
    addons: [],
  },
  {
    id: "sushi-foie-gras",
    title: "ซูชิตับห่าน",
    subtitle: "SUSHI",
    hasAddon: false,
    addons: [],
  },
  {
    id: "sushi-tuna",
    title: "ซูชิทูน่า",
    subtitle: "SUSHI",
    hasAddon: false,
    addons: [],
  },
  {
    id: "sushi-unagi",
    title: "ซูชิปลาไหลญี่ปุ่น",
    subtitle: "SUSHI",
    hasAddon: false,
    addons: [],
  },
  {
    id: "sushi-argentina-shrimp",
    title: "ซูชิกุ้งแดงอาร์เจนตินา",
    subtitle: "SUSHI",
    hasAddon: false,
    addons: [],
  },
  {
    id: "sushi-hokkigai",
    title: "ซูชิหอยปีกนก",
    subtitle: "SUSHI",
    hasAddon: false,
    addons: [],
  },
  {
    id: "sushi-wasabi-squid",
    title: "ซูชิปลาหมึกวาซาบิ",
    subtitle: "SUSHI",
    hasAddon: false,
    addons: [],
  },
  {
    id: "sushi-giant-squid",
    title: "ซูชิหมึกยักษ์",
    subtitle: "SUSHI",
    hasAddon: false,
    addons: [],
  },
  {
    id: "sushi-squid",
    title: "ซูชิหมึกกล้วย",
    subtitle: "SUSHI",
    hasAddon: false,
    addons: [],
  },
  {
    id: "sushi-saba",
    title: "ซูชิซาบะ",
    subtitle: "SUSHI",
    hasAddon: false,
    addons: [],
  },
  {
    id: "sushi-shrimp",
    title: "ซูชิกุ้ง",
    subtitle: "SUSHI",
    hasAddon: false,
    addons: [],
  },
  {
    id: "sushi-ebiko-orange",
    title: "ซูชิไข่กุ้งส้ม",
    subtitle: "SUSHI",
    hasAddon: false,
    addons: [],
  },
  {
    id: "sushi-tamago",
    title: "ซูชิไข่หวาน",
    subtitle: "SUSHI",
    hasAddon: false,
    addons: [],
  },
  {
    id: "sushi-seaweed-salad",
    title: "ซูชิยำสาหร่าย",
    subtitle: "SUSHI",
    hasAddon: false,
    addons: [],
  },
];

/*
  ผู้ใช้ระบุชุดที่ "มี Add-on" มา 5 รายการ
  แต่ยังไม่ได้ระบุว่า Add-on ของแต่ละชุดคืออะไร
  จึงไม่เดาราคา/ตัวเลือกให้เอง

  เวลาได้รายการ Add-on จริง:
  เปลี่ยน addons: ["ยังไม่ได้ระบุรายการ Add-on"]
  เป็นเช่น:
  addons: ["เพิ่มแซลมอน +20 บาท", "เพิ่มทูน่า +20 บาท"]
*/
const ADDON_SUSHI: SushiItem[] = [
  {
    id: "addon-salmon-5",
    title: "ซูชิปลาแซลมอน 5 คำ",
    subtitle: "ADD-ON SET",
    image: "/sushisalmon.jpg",
    hasAddon: true,
    addons: ["ยังไม่ได้ระบุรายการ Add-on"],
  },
  {
    id: "addon-salmon-burn-5",
    title: "ซูชิปลาแซลมอนเบิร์น 5 คำ",
    subtitle: "ADD-ON SET",
    image: "/sushisalmon.jpg",
    hasAddon: true,
    addons: ["ยังไม่ได้ระบุรายการ Add-on"],
  },
  {
    id: "addon-salmon3-tuna3",
    title: "ซูชิแซลมอน 3 คำ + ซูชิทูน่า 3 คำ",
    subtitle: "ADD-ON SET",
    image: "/sushisalmon.jpg",
    hasAddon: true,
    addons: ["ยังไม่ได้ระบุรายการ Add-on"],
  },
  {
    id: "addon-salmon6-temaki8",
    title: "ซูชิปลาแซลมอน 6 คำ + เตมากิแซลมอน 8 คำ",
    subtitle: "ADD-ON SET",
    image: "/sushisalmon.jpg",
    hasAddon: true,
    addons: ["ยังไม่ได้ระบุรายการ Add-on"],
  },
  {
    id: "addon-mixed-set",
    title:
      "ซูชิปลาแซลมอน 3 คำ + ซูชิทูน่า 3 คำ + มากิทูน่า 4 คำ + มากิปลาแซลมอน 4 คำ",
    subtitle: "ADD-ON SET",
    image: "/sushisalmon.jpg",
    hasAddon: true,
    addons: ["ยังไม่ได้ระบุรายการ Add-on"],
  },
];

export default function SushiPage({
  part = 1,
}: {
  part?: 1 | 2 | 3;
}) {
  const [selected, setSelected] = useState<SushiItem | null>(null);
  const [isPreparingHologram, setIsPreparingHologram] = useState(false);
  const [hologramAnchor, setHologramAnchor] =
    useState<HologramAnchor | null>(null);

  const pageRef = useRef<HTMLDivElement | null>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const regularItems =
    part === 1
      ? REGULAR_SUSHI.slice(0, 8)
      : part === 2
        ? REGULAR_SUSHI.slice(8, 16)
        : [];

  const startNumber = part === 1 ? 1 : part === 2 ? 9 : 17;

  function openAddon(item: SushiItem) {
    if (!item.hasAddon) return;

    if (openTimer.current) {
      clearTimeout(openTimer.current);
    }

    setIsPreparingHologram(true);
    window.dispatchEvent(new Event("menu:hologram-open"));

    openTimer.current = setTimeout(() => {
      const rect = pageRef.current?.getBoundingClientRect();

      if (rect) {
        setHologramAnchor({
          x: rect.left + rect.width * 0.5,
          y: rect.top + rect.height * 0.72,
        });
      }

      setSelected(item);
      setIsPreparingHologram(false);
      openTimer.current = null;
    }, 720);
  }

  function closeAddon() {
    if (openTimer.current) {
      clearTimeout(openTimer.current);
      openTimer.current = null;
    }

    setSelected(null);
    setHologramAnchor(null);
    setIsPreparingHologram(false);
    window.dispatchEvent(new Event("menu:hologram-close"));
  }

  useEffect(() => {
    return () => {
      if (openTimer.current) {
        clearTimeout(openTimer.current);
      }

      window.dispatchEvent(new Event("menu:hologram-close"));
    };
  }, []);

  return (
    <div
      ref={pageRef}
      className="
        relative
        z-10
        h-full
        w-full
        overflow-hidden
        [transform-style:preserve-3d]

        px-8
        py-8

        text-[#f4f4f4]

        sm:px-10
        sm:py-9
      "
    >
      {/* HEADER */}
      <div className="relative z-10">
        <p
          className="
            text-[11px]
            font-semibold
            tracking-[0.42em]
            text-[#ff646a]
          "
        >
          SUSHI
        </p>

        <div
          className="
            mt-3
            h-[3px]
            w-[42px]
            rounded-full
            bg-[#b01920]
          "
        />

        <p
          className="
            mt-3
            text-[9px]
            font-medium
            tracking-[0.25em]
            text-white/30
          "
        >
          {part === 1 && "CLASSIC · 1/3"}
          {part === 2 && "CLASSIC · 2/3"}
          {part === 3 && "ADD-ON SETS · 3/3"}
        </p>
      </div>

      {/* PAGE 1 / PAGE 2 : ไม่มี Add-on */}
      {part !== 3 && (
        <>
          <div
            className="
              absolute
              left-[32px]
              right-[32px]
              top-[145px]

              sm:left-[40px]
              sm:right-[40px]
              sm:top-[155px]
            "
          >
            <div className="grid grid-cols-2 gap-x-7 sm:gap-x-9">
              <div className="space-y-[16px] sm:space-y-[18px]">
                {regularItems.slice(0, 4).map((item, index) => (
                  <SushiRow
                    key={item.id}
                    number={String(startNumber + index)}
                    label={item.title}
                    hasAddon={false}
                  />
                ))}
              </div>

              <div className="space-y-[16px] sm:space-y-[18px]">
                {regularItems.slice(4).map((item, index) => (
                  <SushiRow
                    key={item.id}
                    number={String(startNumber + 4 + index)}
                    label={item.title}
                    hasAddon={false}
                  />
                ))}
              </div>
            </div>
          </div>

          <div
            className="
              absolute
              bottom-[52px]
              left-[48px]
              right-[48px]

              rounded-[16px]
              border
              border-white/[0.045]

              bg-white/[0.018]

              px-4
              py-3
            "
          >
            <p className="text-[11px] leading-relaxed text-white/38">
              เมนูในหน้านี้ไม่มี Add-on
            </p>
          </div>
        </>
      )}

      {/* PAGE 3 : ชุดที่มี Add-on */}
      {part === 3 && (
        <>
          <div
            className="
              absolute
              left-[32px]
              right-[32px]
              top-[125px]

              sm:left-[40px]
              sm:right-[40px]
              sm:top-[140px]
            "
          >
            <div
              className="
                mb-5
                flex
                items-center
                gap-4

                rounded-[18px]

                border
                border-white/[0.05]

                bg-white/[0.025]

                p-3
              "
            >
              <div
                className="
                  relative
                  h-[78px]
                  w-[92px]
                  shrink-0
                  overflow-hidden
                  rounded-[14px]

                  border
                  border-white/10
                "
              >
                <Image
                  src="/sushisalmon.jpg"
                  alt="Sushi Add-on Sets"
                  fill
                  sizes="92px"
                  className="object-cover"
                />
              </div>

              <div>
                <p className="text-[14px] font-bold text-white/90">
                  Sushi Set
                </p>

                <p className="mt-1 text-[10px] leading-relaxed text-white/40">
                  แตะรายการที่มีเครื่องหมาย + เพื่อเปิด Hologram Add-on
                </p>
              </div>
            </div>

            <div className="space-y-[9px]">
              {ADDON_SUSHI.map((item, index) => (
                <SushiRow
                  key={item.id}
                  number={String(17 + index)}
                  label={item.title}
                  hasAddon
                  onClick={() => openAddon(item)}
                />
              ))}
            </div>
          </div>

          <div
            className="
              absolute
              bottom-[45px]
              left-0
              right-0
              text-center
            "
          >
            <div
              className="
                mx-auto
                mb-3
                h-[1px]
                w-[45px]
                bg-[#b01920]/45
              "
            />

            <p className="text-[11px] text-white/42 sm:text-[12px]">
              (เฉพาะหน้านี้มี Add-on)
            </p>
          </div>
        </>
      )}

      {/* PAGE NUMBER */}
      <span
        className="
          absolute
          bottom-[15px]
          right-[24px]

          text-[10px]
          tracking-[0.2em]
          text-white/20
        "
      >
        {part === 1 ? "06" : part === 2 ? "07" : "08"}
      </span>

      {/* CHARGE EFFECT */}
      {isPreparingHologram && (
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            z-[90]
          "
        >
          <div
            className="
              absolute
              bottom-[64px]
              left-1/2

              h-[34px]
              w-[150px]

              -translate-x-1/2

              rounded-[50%]

              border
              border-cyan-200/60

              bg-cyan-200/15

              shadow-[0_0_20px_rgba(103,232,249,0.75),0_0_55px_rgba(103,232,249,0.28)]

              animate-pulse
            "
          />

          <div
            className="
              absolute
              bottom-[58px]
              left-1/2

              h-[48px]
              w-[190px]

              -translate-x-1/2

              rounded-[50%]

              border
              border-cyan-100/30

              animate-ping
            "
          />
        </div>
      )}

      <HologramAddon
        item={selected}
        anchor={hologramAnchor}
        onClose={closeAddon}
      />

      <style>{`
        @keyframes sushi-holo-rise {
          0% {
            opacity: 0;
            transform: translate(-50%, 90px) scale(0.68);
            filter: blur(5px);
          }
          65% {
            opacity: 1;
            transform: translate(-50%, -8px) scale(1.02);
            filter: blur(0px);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, 0px) scale(1);
            filter: blur(0px);
          }
        }

        @keyframes sushi-holo-base {
          0%,
          100% {
            transform: translateX(-50%) scaleX(1);
            opacity: 0.45;
          }
          50% {
            transform: translateX(-50%) scaleX(1.14);
            opacity: 0.9;
          }
        }

        @keyframes sushi-holo-scan {
          0% {
            transform: translateY(-120%);
            opacity: 0;
          }
          15% {
            opacity: 0.7;
          }
          85% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(560%);
            opacity: 0;
          }
        }

        @keyframes sushi-holo-flicker {
          0%,
          96%,
          100% {
            opacity: 1;
          }
          97% {
            opacity: 0.78;
          }
          98% {
            opacity: 1;
          }
          99% {
            opacity: 0.86;
          }
        }
      `}</style>
    </div>
  );
}

function SushiRow({
  number,
  label,
  hasAddon,
  onClick,
}: {
  number: string;
  label: string;
  hasAddon: boolean;
  onClick?: () => void;
}) {
  const commonClass = `
    group
    grid
    w-full
    grid-cols-[24px_minmax(0,1fr)_22px]
    items-start
    gap-2

    rounded-[10px]

    px-1.5
    py-2

    text-left

    transition
    duration-200
  `;

  const content = (
    <>
      <span
        className="
          pt-[1px]
          text-[12px]
          font-semibold
          text-white/65

          sm:text-[13px]
        "
      >
        {number}.
      </span>

      <span
        className={`
          min-w-0

          whitespace-normal
          break-words

          text-[12px]
          font-medium
          leading-[1.35]

          sm:text-[13px]

          ${hasAddon ? "text-[#ff646a]" : "text-white/82"}
        `}
      >
        {label}
      </span>

      {hasAddon ? (
        <span
          className="
            flex
            h-[20px]
            w-[20px]
            items-center
            justify-center

            rounded-full

            border
            border-[#b01920]/40

            text-[12px]
            leading-none
            text-[#ff646a]

            transition

            group-hover:border-[#ff646a]/80
            group-hover:bg-[#b01920]
            group-hover:text-white
          "
        >
          +
        </span>
      ) : (
        <span
          className="
            mt-[8px]
            h-[3px]
            w-[3px]
            justify-self-center
            rounded-full
            bg-white/15
          "
        />
      )}
    </>
  );

  if (!hasAddon || !onClick) {
    return <div className={commonClass}>{content}</div>;
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`${commonClass} hover:bg-[#b01920]/[0.045] active:scale-[0.99]`}
    >
      {content}
    </button>
  );
}

function HologramAddon({
  item,
  anchor,
  onClose,
}: {
  item: SushiItem | null;
  anchor: HologramAnchor | null;
  onClose: () => void;
}) {
  if (!item || !anchor || typeof document === "undefined") return null;

  const baseX = anchor.x;
  const baseY = anchor.y;

  const cardBottom =
    typeof window !== "undefined"
      ? Math.max(105, window.innerHeight - baseY + 118)
      : 160;

  return createPortal(
    <div
      className="
        fixed
        inset-0
        z-[9999]
      "
      onClick={onClose}
      onTouchStart={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
    >
      <div
        className="
          pointer-events-none
          absolute
          inset-0

          bg-[radial-gradient(circle_at_62%_42%,rgba(103,232,249,0.05),transparent_30%)]
        "
      />

      {/* projector base */}
      <div
        className="
          pointer-events-none
          fixed

          h-[26px]
          w-[138px]

          -translate-x-1/2
          -translate-y-1/2

          rounded-[50%]

          border
          border-cyan-200/70

          bg-cyan-200/15

          shadow-[0_0_18px_rgba(103,232,249,0.8),0_0_45px_rgba(103,232,249,0.28)]
        "
        style={{
          left: `${baseX}px`,
          top: `${baseY}px`,
          animation: "sushi-holo-base 1.7s ease-in-out infinite",
        }}
      />

      {/* projector beam */}
      <div
        className="
          pointer-events-none
          fixed

          h-[150px]
          w-[190px]

          -translate-x-1/2

          bg-[linear-gradient(to_top,rgba(103,232,249,0.24),rgba(103,232,249,0.08)_45%,transparent_100%)]

          blur-[2px]
        "
        style={{
          left: `${baseX}px`,
          top: `${baseY - 150}px`,
          clipPath: "polygon(42% 100%, 58% 100%, 82% 0, 18% 0)",
        }}
      />

      {/* hologram card */}
      <div
        className="
          fixed
          w-[min(84vw,360px)]
          origin-bottom
        "
        style={{
          left: `${baseX}px`,
          bottom: `${cardBottom}px`,
          animation:
            "sushi-holo-rise 560ms cubic-bezier(0.22,1,0.36,1) both, sushi-holo-flicker 4.5s linear 650ms infinite",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="
            relative
            overflow-hidden

            rounded-[24px]

            border
            border-cyan-100/45

            bg-[#071519]/96

            px-5
            py-5

            text-white

            shadow-[0_0_24px_rgba(103,232,249,0.30),0_0_70px_rgba(103,232,249,0.16),inset_0_0_26px_rgba(103,232,249,0.05)]

            backdrop-blur-md
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              left-0
              right-0
              top-0

              h-[1px]

              bg-cyan-100/90

              shadow-[0_0_12px_rgba(165,243,252,0.9)]
            "
            style={{
              animation: "sushi-holo-scan 2.4s linear infinite",
            }}
          />

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              opacity-[0.035]

              [background-image:repeating-linear-gradient(to_bottom,rgba(255,255,255,0.35)_0px,rgba(255,255,255,0.35)_1px,transparent_1px,transparent_7px)]
            "
          />

          <div className="relative z-10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p
                  className="
                    text-[9px]
                    font-semibold
                    tracking-[0.35em]
                    text-cyan-200/75
                  "
                >
                  ADD-ON
                </p>

                <h3
                  className="
                    mt-1
                    text-[20px]
                    font-bold
                    leading-tight
                    text-white

                    sm:text-[22px]
                  "
                >
                  {item.title}
                </h3>

                <p className="mt-1 text-[11px] text-cyan-100/60">
                  {item.subtitle}
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="
                  flex
                  h-[30px]
                  w-[30px]
                  shrink-0
                  items-center
                  justify-center

                  rounded-full

                  border
                  border-cyan-100/30

                  bg-white/[0.04]

                  text-[15px]
                  text-cyan-50/90

                  transition

                  hover:bg-white/[0.12]
                "
                aria-label="ปิด Add-on"
              >
                ×
              </button>
            </div>

            {item.image && (
              <div
                className="
                  relative
                  mt-4
                  h-[105px]
                  w-full
                  overflow-hidden

                  rounded-[16px]

                  border
                  border-cyan-100/20

                  bg-black/20
                "
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="360px"
                  className="object-cover object-center"
                />
              </div>
            )}

            <div
              className="
                my-4
                h-px
                w-full

                bg-gradient-to-r
                from-transparent
                via-cyan-100/30
                to-transparent
              "
            />

            <p className="mb-2 text-[12px] font-medium text-cyan-50/80">
              ตัวเลือกเพิ่มเติม
            </p>

            <div
              className="
                rounded-[12px]

                border
                border-cyan-100/12

                bg-white/[0.055]

                px-3.5
                py-3

                text-[13px]
                text-white/75
              "
            >
              {item.addons[0] ?? "ยังไม่ได้ระบุรายการ Add-on"}
            </div>

            <p
              className="
                mt-4
                text-center
                text-[9px]
                tracking-[0.12em]
                text-cyan-100/40
              "
            >
              แตะพื้นที่ด้านนอกเพื่อปิด
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
