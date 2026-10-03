"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type HologramItem = {
  id: string;
  title: string;
  subtitle: string;
  image?: string;
  addons: string[];
};

type HologramAnchor = {
  x: number;
  y: number;
};

const MENU_ITEMS: HologramItem[] = [
  {
    id: "donburi1",
    title: "ข้างด้งไก่ราดซอสเทอริยากิ",
    subtitle: "DONBURI",
    addons: ["ไข่แดงดิบ +10 บาท", "ขิงดอง +13 บาท", "ยำสาหร่าย +20 บาท", "สาหร่ายอบ +30 บาท", "กิมจิ +20 บาท", "ข้าวญี่ปุ่น +30 บาท", "ข่าวญี่ปุ่นซฺชิ +30 บาท", "ทาโกะวาซาบิ 40 กรัม +129 บาท" , "ไข่หวาน 4 ชิ้น +60 บาท" ,"ไข่กุ้ง 30 กรัม +60 บาท"],
  },
  {
    id: "donburi2",
    title: "ข้าวด้งซาบะย่างราดซอสเทอริยากิ",
    subtitle: "DONBURI",
    addons: ["ไข่แดงดิบ +10 บาท", "ขิงดอง +13 บาท", "ยำสาหร่าย +20 บาท", "สาหร่ายอบ +30 บาท", "กิมจิ +20 บาท", "ข้าวญี่ปุ่น +30 บาท", "ข่าวญี่ปุ่นซฺชิ +30 บาท", "ทาโกะวาซาบิ 40 กรัม +129 บาท" , "ไข่หวาน 4 ชิ้น +60 บาท" ,"ไข่กุ้ง 30 กรัม +60 บาท"],
  },
  {
    id: "donburi3",
    title: "ข้าวด้งแซลมอนเบิร์นราดซอสเทอริยากิ",
    subtitle: "DONBURI",
    addons: ["ไข่แดงดิบ +10 บาท", "ขิงดอง +13 บาท", "ยำสาหร่าย +20 บาท", "สาหร่ายอบ +30 บาท", "กิมจิ +20 บาท", "ข้าวญี่ปุ่น +30 บาท", "ข่าวญี่ปุ่นซฺชิ +30 บาท", "ทาโกะวาซาบิ 40 กรัม +129 บาท" , "ไข่หวาน 4 ชิ้น +60 บาท" ,"ไข่กุ้ง 30 กรัม +60 บาท"],
  },
  {
    id: "tuna",
    title: "ข้าวด้งแซลมอนย่างราดซอสเทอริยากิ",
    subtitle: "DONBURI",
    addons: ["ไข่แดงดิบ +10 บาท", "ขิงดอง +13 บาท", "ยำสาหร่าย +20 บาท", "สาหร่ายอบ +30 บาท", "กิมจิ +20 บาท", "ข้าวญี่ปุ่น +30 บาท", "ข่าวญี่ปุ่นซฺชิ +30 บาท", "ทาโกะวาซาบิ 40 กรัม +129 บาท" , "ไข่หวาน 4 ชิ้น +60 บาท" ,"ไข่กุ้ง 30 กรัม +60 บาท"],
  },
  {
    id: "saba",
    title: "ข้าวด้งแซลมอน+ปลาไหลญี่ปุ่น",
    subtitle: "DONBURI",
    addons: ["ไข่แดงดิบ +10 บาท", "ขิงดอง +13 บาท", "ยำสาหร่าย +20 บาท", "สาหร่ายอบ +30 บาท", "กิมจิ +20 บาท", "ข้าวญี่ปุ่น +30 บาท", "ข่าวญี่ปุ่นซฺชิ +30 บาท", "ทาโกะวาซาบิ 40 กรัม +129 บาท" , "ไข่หวาน 4 ชิ้น +60 บาท" ,"ไข่กุ้ง 30 กรัม +60 บาท"],
  },
  {
    id: "salmonandtuna",
    title: "ข้าวด้งปลาไหลญ่ปุ่น",
    subtitle: "DONBURI",
    addons: ["ไข่แดงดิบ +10 บาท", "ขิงดอง +13 บาท", "ยำสาหร่าย +20 บาท", "สาหร่ายอบ +30 บาท", "กิมจิ +20 บาท", "ข้าวญี่ปุ่น +30 บาท", "ข่าวญี่ปุ่นซฺชิ +30 บาท", "ทาโกะวาซาบิ 40 กรัม +129 บาท" , "ไข่หวาน 4 ชิ้น +60 บาท" ,"ไข่กุ้ง 30 กรัม +60 บาท"],
  },

  {
    id: "hokkigai",
    title: "ข้าวด้งปลาไหลญี่ปุ่นไข่ออนเซ็น",
    subtitle: "DONBURI",
    addons: ["ไข่แดงดิบ +10 บาท", "ขิงดอง +13 บาท", "ยำสาหร่าย +20 บาท", "สาหร่ายอบ +30 บาท", "กิมจิ +20 บาท", "ข้าวญี่ปุ่น +30 บาท", "ข่าวญี่ปุ่นซฺชิ +30 บาท", "ทาโกะวาซาบิ 40 กรัม +129 บาท" , "ไข่หวาน 4 ชิ้น +60 บาท" ,"ไข่กุ้ง 30 กรัม +60 บาท"],
  },
  {
    id: "tamago",
    title: "ข้าวด้งแซลมอน+ทูน่า",
    subtitle: "DONBURI",
    addons: ["ไข่แดงดิบ +10 บาท", "ขิงดอง +13 บาท", "ยำสาหร่าย +20 บาท", "สาหร่ายอบ +30 บาท", "กิมจิ +20 บาท", "ข้าวญี่ปุ่น +30 บาท", "ข่าวญี่ปุ่นซฺชิ +30 บาท", "ทาโกะวาซาบิ 40 กรัม +129 บาท" , "ไข่หวาน 4 ชิ้น +60 บาท" ,"ไข่กุ้ง 30 กรัม +60 บาท"],
  },
  {
    id: "salmon-belly",
    title: "ข้าวด้งสามสหาย",
    subtitle: "DONBURI",
    addons: ["ไข่แดงดิบ +10 บาท", "ขิงดอง +13 บาท", "ยำสาหร่าย +20 บาท", "สาหร่ายอบ +30 บาท", "กิมจิ +20 บาท", "ข้าวญี่ปุ่น +30 บาท", "ข่าวญี่ปุ่นซฺชิ +30 บาท", "ทาโกะวาซาบิ 40 กรัม +129 บาท" , "ไข่หวาน 4 ชิ้น +60 บาท" ,"ไข่กุ้ง 30 กรัม +60 บาท"],
  },

 {
    id: "salmon-belly2",
    title: "ข้าวด้งมันปู+ไข่กุ้ง",
    subtitle: "DONBURI",
    addons: ["ไข่แดงดิบ +10 บาท", "ขิงดอง +13 บาท", "ยำสาหร่าย +20 บาท", "สาหร่ายอบ +30 บาท", "กิมจิ +20 บาท", "ข้าวญี่ปุ่น +30 บาท", "ข่าวญี่ปุ่นซฺชิ +30 บาท", "ทาโกะวาซาบิ 40 กรัม +129 บาท" , "ไข่หวาน 4 ชิ้น +60 บาท" ,"ไข่กุ้ง 30 กรัม +60 บาท"],
  },

   {
    id: "salmon-belly3",
    title: "ข้าวด้งรวม",
    subtitle: "DONBURI",
    addons: ["ไข่แดงดิบ +10 บาท", "ขิงดอง +13 บาท", "ยำสาหร่าย +20 บาท", "สาหร่ายอบ +30 บาท", "กิมจิ +20 บาท", "ข้าวญี่ปุ่น +30 บาท", "ข่าวญี่ปุ่นซฺชิ +30 บาท", "ทาโกะวาซาบิ 40 กรัม +129 บาท" , "ไข่หวาน 4 ชิ้น +60 บาท" ,"ไข่กุ้ง 30 กรัม +60 บาท"],
  },

   {
    id: "salmon-belly4",
    title: "ข้าวด้งมันปู+ทูน่า+แซลมอน",
    subtitle: "DONBURI",
    addons: ["ไข่แดงดิบ +10 บาท", "ขิงดอง +13 บาท", "ยำสาหร่าย +20 บาท", "สาหร่ายอบ +30 บาท", "กิมจิ +20 บาท", "ข้าวญี่ปุ่น +30 บาท", "ข่าวญี่ปุ่นซฺชิ +30 บาท", "ทาโกะวาซาบิ 40 กรัม +129 บาท" , "ไข่หวาน 4 ชิ้น +60 บาท" ,"ไข่กุ้ง 30 กรัม +60 บาท"],
  },

   {
    id: "salmon-belly5",
    title: "ข้าวด้งแซลมอนกุ้งดอง",
    subtitle: "DONBURI",
    addons: ["ไข่แดงดิบ +10 บาท", "ขิงดอง +13 บาท", "ยำสาหร่าย +20 บาท", "สาหร่ายอบ +30 บาท", "กิมจิ +20 บาท", "ข้าวญี่ปุ่น +30 บาท", "ข่าวญี่ปุ่นซฺชิ +30 บาท", "ทาโกะวาซาบิ 40 กรัม +129 บาท" , "ไข่หวาน 4 ชิ้น +60 บาท" ,"ไข่กุ้ง 30 กรัม +60 บาท"],
  },

   {
    id: "salmon-belly6",
    title: "ข้าวด้งแซลมอน+ทูน่าเต๋า",
    subtitle: "DONBURI",
    addons: ["ไข่แดงดิบ +10 บาท", "ขิงดอง +13 บาท", "ยำสาหร่าย +20 บาท", "สาหร่ายอบ +30 บาท", "กิมจิ +20 บาท", "ข้าวญี่ปุ่น +30 บาท", "ข่าวญี่ปุ่นซฺชิ +30 บาท", "ทาโกะวาซาบิ 40 กรัม +129 บาท" , "ไข่หวาน 4 ชิ้น +60 บาท" ,"ไข่กุ้ง 30 กรัม +60 บาท"],
  },




];

const SET_99: HologramItem = {
  id: "donburidice",
  title: "ข้าวด้งแซลมอนเต๋า",
  subtitle: "99 บาท",
  image: "/kawdong.jpg",
  addons: ["ไข่แดงดิบ +10 บาท", "ขิงดอง +13 บาท", "ยำสาหร่าย +20 บาท", "สาหร่ายอบ +30 บาท", "กิมจิ +20 บาท", "ข้าวญี่ปุ่น +30 บาท", "ข่าวญี่ปุ่นซฺชิ +30 บาท", "ทาโกะวาซาบิ 40 กรัม +129 บาท" , "ไข่หวาน 4 ชิ้น +60 บาท" ,"ไข่กุ้ง 30 กรัม +60 บาท"],
};

const SET_129: HologramItem = {
  id: "set-129",
  title: "ข้าวด้งแซลมอน",
  subtitle: "139 บาท",
  image: "/donburi/dongsalmons.jpg",
  addons: ["ไข่แดงดิบ +10 บาท", "ขิงดอง +13 บาท", "ยำสาหร่าย +20 บาท", "สาหร่ายอบ +30 บาท", "กิมจิ +20 บาท", "ข้าวญี่ปุ่น +30 บาท", "ข่าวญี่ปุ่นซฺชิ +30 บาท", "ทาโกะวาซาบิ 40 กรัม +129 บาท" , "ไข่หวาน 4 ชิ้น +60 บาท" ,"ไข่กุ้ง 30 กรัม +60 บาท"],
};

export default function DonburiPage({
  part = 1,
}: {
  part?: 1 | 2;
}) {
  const [selected, setSelected] = useState<HologramItem | null>(null);

  // แบ่ง Donburi 14 รายการเป็น 2 หน้า หน้า ละ 7 รายการ
  const itemsPerPage = 7;
  const startIndex = part === 1 ? 0 : itemsPerPage;
  const pageItems = MENU_ITEMS.slice(startIndex, startIndex + itemsPerPage);
  const leftItems = pageItems.slice(0, 4);
  const rightItems = pageItems.slice(4);
  const startNumber = startIndex + 1;
  const [isPreparingHologram, setIsPreparingHologram] = useState(false);
  const [hologramAnchor, setHologramAnchor] = useState<HologramAnchor | null>(null);

  const pageRef = useRef<HTMLDivElement | null>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function openAddon(item: HologramItem) {
    if (openTimer.current) {
      clearTimeout(openTimer.current);
    }

    // ขั้นที่ 1: ให้หนังสือค่อย ๆ วางราบก่อน
    setIsPreparingHologram(true);
    window.dispatchEvent(new Event("menu:hologram-open"));

    // ขั้นที่ 2: หลังหนังสือนอนแล้ว วัดตำแหน่งหน้ากระดาษจริง
    // แล้ว render Hologram ผ่าน Portal เพื่อไม่ให้เอียงตามหนังสือ
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

      // ถ้าพลิกออกจากหน้า Sashimi ให้หนังสือกลับสภาพปกติ
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
        [transform-style:preserve-3d]
        w-full
        overflow-hidden

        px-8
        py-8

        sm:px-10
        sm:py-9

        text-[#f4f4f4]
      "
    >
      {/* ================================================= */}
      {/* หัวข้อ */}
      {/* ================================================= */}

      <div className="relative z-10">
        <p
          className="
            text-[11px]
            font-semibold
            tracking-[0.42em]
            text-[#ff646a]
          "
        >
          DONBURI
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
      </div>

      {part === 2 && (
        <p
          className="
            mt-3
            text-[10px]
            font-medium
            tracking-[0.28em]
            text-white/35
          "
        >
          CONTINUED · 2/2
        </p>
      )}

      {part === 1 && (
        <>
      {/* ================================================= */}
      {/* FREE */}
      {/* ================================================= */}

      <div
        className="
          absolute
          right-[18px]
          top-[78px]

          z-20

          rotate-[-12deg]

          whitespace-nowrap
          text-right
          text-[11px]
          sm:text-[12px]

          font-medium
          leading-none

          text-white/55
        "
      >
        <span className="font-semibold text-[#ff646a]">
          FREE
        </span>

        <span className="ml-2">
          ( โชยุ 1 วาซาบิ 1 )
        </span>
      </div>

        </>
      )}

      {part === 1 && (
        <>
      {/* ================================================= */}
      {/* กล่องเล็ก 99 - กดเพื่อเปิด Hologram */}
      {/* ================================================= */}

      <div
        className="
          absolute
          left-[30px]
          top-[125px]

          sm:left-[38px]
          sm:top-[130px]
        "
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            openAddon(SET_99);
          }}
          className="
            group
            block
            text-left
            transition-transform
            duration-300
            hover:-translate-y-1
            active:scale-[0.98]
          "
          aria-label="ดู Add-on ข้าวด้งแซลมอนเต๋า"
        >
          <div
            className="
              relative

              h-[140px]
              w-[145px]

              sm:h-[155px]
              sm:w-[160px]

              overflow-hidden
              rounded-[18px]

              border-[4px]
              border-white/30

              bg-[#18191c]

              shadow-[0_15px_35px_rgba(0,0,0,0.18)]
              transition-shadow
              duration-300

              group-hover:shadow-[0_18px_42px_rgba(176,25,32,0.20)]
            "
          >
            <Image
              src="/kawdong.jpg"
              alt="ข้าวด้งแซลมอนเต๋า"
              fill
              className="object-cover"
            />

            <div
              className="
                absolute
                right-[8px]
                top-[8px]

                flex
                h-[42px]
                w-[42px]

                items-center
                justify-center

                rounded-full
                bg-[#b01920]

                text-[15px]
                font-bold
                text-white

                shadow-lg
              "
            >
              99
            </div>
          </div>

          <p
            className="
              mt-3
              text-[17px]
              font-bold
              text-white/90
            "
          >
            ข้าวด้งแซลมอนเต๋า xx บาท
          </p>

          <span className="mt-1 block text-[10px] text-[#ff646a]/60">
            แตะดูตัวเลือกเพิ่ม
          </span>
        </button>
      </div>

      {/* ================================================= */}
      {/* กล่องยาว 129 - กดเพื่อเปิด Hologram */}
      {/* ================================================= */}

      <div
        className="
          absolute
          right-[24px]
          top-[215px]

          sm:right-[32px]
          sm:top-[225px]
        "
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            openAddon(SET_129);
          }}
          className="
            group
            block
            text-left
            transition-transform
            duration-300
            hover:-translate-y-1
            active:scale-[0.98]
          "
          aria-label="ดู Add-on ข้าวด้งแซลมอน"
        >
          <div
            className="
              relative

              h-[105px]
              w-[175px]

              sm:h-[115px]
              sm:w-[195px]

              overflow-hidden
              rounded-[18px]

              border-[4px]
              border-white/30

              bg-[#18191c]

              shadow-[0_15px_35px_rgba(0,0,0,0.18)]
              transition-shadow
              duration-300

              group-hover:shadow-[0_18px_42px_rgba(176,25,32,0.20)]
            "
          >
            <Image
              src="/donburi/dongsalmons.jpg"
              alt="ข้าวด้งแซลมอน 139 บาท"
              fill
              className="object-cover"
            />

            <div
              className="
                absolute
                right-[8px]
                top-[8px]

                flex
                h-[42px]
                w-[42px]

                items-center
                justify-center

                rounded-full
                bg-[#b01920]

                text-[15px]
                font-bold
                text-white

                shadow-lg
              "
            >
              139
            </div>
          </div>

          <p
            className="
              mt-3
              text-[16px]
              font-bold
              text-white/90
            "
          >
            ข้าวด้งแซลมอน 139 บาท
          </p>

          <span className="mt-1 block text-[10px] text-[#ff646a]/60">
            แตะดูตัวเลือกเพิ่ม
          </span>
        </button>
      </div>

      {/* ================================================= */}
              </>
      )}

      {/* รายการ DONBURI แบ่ง 7 รายการต่อหน้า */}
      {/* ================================================= */}

      <div
        className={`
          absolute

          left-[32px]
          right-[32px]

          ${
            part === 1
              ? "top-[385px] sm:top-[405px]"
              : "top-[150px] sm:top-[165px]"
          }

          sm:left-[40px]
          sm:right-[40px]
        `}
      >
        <div className="grid grid-cols-2 gap-x-6 sm:gap-x-8">
          <div className="space-y-[10px] sm:space-y-[12px]">
            {leftItems.map((item, index) => (
              <SashimiRow
                key={item.id}
                number={String(startNumber + index)}
                label={item.title}
                onClick={() => openAddon(item)}
              />
            ))}
          </div>

          <div className="space-y-[10px] sm:space-y-[12px]">
            {rightItems.map((item, index) => (
              <SashimiRow
                key={item.id}
                number={String(startNumber + 4 + index)}
                label={item.title}
                onClick={() => openAddon(item)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* ข้อความล่าง */}
      {/* ================================================= */}

      <div
        className="
          absolute
          bottom-[30px]
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
            bg-[#b01920]/40
          "
        />

        <p
          className="
            text-[12px]
            text-white/50
            sm:text-[14px]
          "
        >
          (แตะชื่อเมนูหรือรูป เพื่อดู Add-on)
        </p>
      </div>

      {/* เลขหน้า */}
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
        {part === 1 ? "04" : "05"}
      </span>

      {/* ================================================= */}
      {/* HOLOGRAM ADD-ON */}
      {/* ================================================= */}

      {/* แสง Charge ก่อน Hologram โผล่ */}
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
        @keyframes holo-rise {
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

        @keyframes holo-base {
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

        @keyframes holo-scan {
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

        @keyframes holo-flicker {
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

/* ========================================================= */
/* CLICKABLE MENU ROW */
/* ========================================================= */

function SashimiRow({
  number,
  label,
  onClick,
}: {
  number: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="
        group
        grid
        w-full
        grid-cols-[22px_minmax(0,1fr)_20px]
        items-center
        gap-1.5

        rounded-[8px]

        px-1
        py-[4px]

        text-left
        text-white/80

        transition
        duration-200

        hover:bg-[#b01920]/[0.035]
      "
    >
      <span
        className="
          self-start
          pt-[2px]
          text-[12px]
          font-semibold
          text-white/80
          sm:text-[14px]
        "
      >
        {number}.
      </span>

      <span
        className="
          min-w-0

          whitespace-normal
          break-words

          text-[13px]
          font-medium
          leading-[1.3]

          text-[#ff646a]

          sm:text-[14px]
        "
      >
        {label}
      </span>

      <span
        className="
          flex
          h-[18px]
          w-[18px]
          shrink-0
          items-center
          justify-center

          rounded-full
          border
          border-[#b01920]/25

          text-[12px]
          leading-none
          text-[#ff646a]/70

          transition
          duration-200

          group-hover:border-[#b01920]/60
          group-hover:bg-[#b01920]
          group-hover:text-white
        "
      >
        +
      </span>
    </button>
  );
}

/* ========================================================= */
/* HOLOGRAM */
/* ========================================================= */

function HologramAddon({
  item,
  anchor,
  onClose,
}: {
  item: HologramItem | null;
  anchor: HologramAnchor | null;
  onClose: () => void;
}) {
  if (!item || !anchor || typeof document === "undefined") return null;

  const manyAddons = item.addons.length > 4;

  const baseY = anchor.y;
  const baseX = anchor.x;

  // การ์ดจะลอยขึ้นจากหน้าหนังสือ แต่ไม่รับ rotateX ของหนังสือ
  // เพราะ render ออกไปที่ document.body ผ่าน Portal
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
      {/* vignette เบา ๆ เพื่อดัน Hologram ออกมาจากฉาก */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[radial-gradient(circle_at_62%_42%,rgba(103,232,249,0.05),transparent_30%)]
        "
      />

      {/* ฐานฉาย: วางตรงหน้าหนังสือ */}
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
          animation: "holo-base 1.7s ease-in-out infinite",
        }}
      />

      {/* ลำแสงจากหน้าหนังสือขึ้นสู่ Hologram */}
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

      {/* Hologram ตั้งตรงเหนือหนังสือ */}
      <div
        className="
          fixed

          w-[min(84vw,360px)]

          origin-bottom

          [transform-style:preserve-3d]
        "
        style={{
          left: `${baseX}px`,
          bottom: `${cardBottom}px`,
          animation:
            "holo-rise 560ms cubic-bezier(0.22,1,0.36,1) both, holo-flicker 4.5s linear 650ms infinite",
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
          {/* scan line */}
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
            style={{ animation: "holo-scan 2.4s linear infinite" }}
          />

          {/* texture ของ Hologram */}
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
                    text-[22px]
                    font-bold
                    text-white
                    sm:text-[24px]
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
                className={`
                  relative
                  mt-4
                  w-full
                  overflow-hidden
                  rounded-[16px]

                  border
                  border-cyan-100/20

                  bg-black/20

                  ${
                    manyAddons
                      ? "h-[96px] sm:h-[108px]"
                      : "h-[120px] sm:h-[132px]"
                  }
                `}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="360px"
                  className="object-cover object-center"
                />

                <div
                  className="
                    pointer-events-none
                    absolute
                    inset-0

                    bg-gradient-to-t
                    from-black/20
                    via-transparent
                    to-transparent
                  "
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

            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="text-[12px] font-medium text-cyan-50/80">
                ตัวเลือกเพิ่มเติม
              </p>

              {manyAddons && (
                <span className="text-[9px] text-cyan-100/45">
                  {item.addons.length} ตัวเลือก • เลื่อนดู
                </span>
              )}
            </div>

            <div className="relative">
              <div
                className={`
                  space-y-2

                  ${
                    manyAddons
                      ? "max-h-[155px] overflow-y-auto overscroll-contain pr-1"
                      : ""
                  }

                  [scrollbar-width:thin]
                `}
                onWheel={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                onTouchEnd={(e) => e.stopPropagation()}
              >
                {item.addons.map((addon) => {
                  const match = addon.match(/^(.*?)(\s*\+\d+\s*บาท)$/);
                  const addonName = match ? match[1].trim() : addon;
                  const addonPrice = match
                    ? match[2].replace("บาท", "").trim()
                    : "";

                  return (
                    <button
                      type="button"
                      key={addon}
                      className="
                        flex
                        w-full
                        items-center
                        gap-3

                        rounded-[12px]

                        border
                        border-cyan-100/12

                        bg-white/[0.055]

                        px-3.5
                        py-3

                        text-left
                        text-[13px]
                        text-white/95

                        transition

                        hover:border-cyan-100/25
                        hover:bg-white/[0.09]

                        sm:text-[14px]
                      "
                    >
                      <span className="min-w-0 flex-1">
                        {addonName}
                      </span>

                      {addonPrice && (
                        <span className="shrink-0 font-semibold text-cyan-100">
                          {addonPrice}
                        </span>
                      )}

                      <span
                        className="
                          flex
                          h-[22px]
                          w-[22px]
                          shrink-0
                          items-center
                          justify-center

                          rounded-full

                          border
                          border-cyan-100/30

                          text-[13px]
                          text-cyan-100/85
                        "
                      >
                        +
                      </span>
                    </button>
                  );
                })}
              </div>

              {manyAddons && (
                <div
                  className="
                    pointer-events-none
                    absolute
                    bottom-0
                    left-0
                    right-0

                    h-[26px]

                    bg-gradient-to-t
                    from-[#071519]
                    to-transparent
                  "
                />
              )}
            </div>

            <p
              className="
                mt-4
                text-center
                text-[9px]
                tracking-[0.16em]
                text-cyan-100/45
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
