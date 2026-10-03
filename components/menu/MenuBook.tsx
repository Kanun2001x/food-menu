"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode, type TouchEvent } from "react";
import SashimiPage from "./SashimiPage";
import DonburiPage from "./DonburiPage";
import SushiPage from "./SushiPage";

type Direction = "next" | "prev";

type MenuPage = {
  number: number;
  content: ReactNode;
};

/*
  เวลาเพิ่มหน้าใหม่:
  1) import component หน้านั้นด้านบน
  2) เพิ่ม 1 บรรทัดใน MENU_PAGES ด้านล่าง

  ตัวอย่างหน้า 4:
  import SushiPage from "./SushiPage";

  แล้วเพิ่ม:
  { number: 4, content: <SushiPage /> },
*/
const MENU_PAGES: MenuPage[] = [
  { number: 2, content: <BestSellerPage /> },
  { number: 3, content: <SashimiPage /> },
  { number: 4, content: <DonburiPage part={1} /> },
  { number: 5, content: <DonburiPage part={2} /> },
  { number: 6, content: <SushiPage part={1} /> },
  { number: 7, content: <SushiPage part={2} /> },
  { number: 8, content: <SushiPage part={3} /> },
];

const TURN_DURATION = 1200;

export default function MenuBook() {
  const [isOpen, setIsOpen] = useState(false);

  // ใช้ index แทนการล็อก type เป็น 2 | 3 | 4 ...
  const [pageIndex, setPageIndex] = useState(0);

  const [turning, setTurning] = useState(false);
  const [sheetFlipped, setSheetFlipped] = useState(false);
  const [direction, setDirection] = useState<Direction>("next");

  // ตอนเปิด Add-on หนังสือจะเข้าสู่โหมด "กางเพื่อฉาย Hologram"
  const [hologramMode, setHologramMode] = useState(false);

  const touchStartX = useRef(0);

  useEffect(() => {
    const handleHologramOpen = () => setHologramMode(true);
    const handleHologramClose = () => setHologramMode(false);

    window.addEventListener("menu:hologram-open", handleHologramOpen);
    window.addEventListener("menu:hologram-close", handleHologramClose);

    return () => {
      window.removeEventListener("menu:hologram-open", handleHologramOpen);
      window.removeEventListener("menu:hologram-close", handleHologramClose);
    };
  }, []);

  const currentPage = MENU_PAGES[pageIndex];
  const firstPage = MENU_PAGES[0];
  const lastPage = MENU_PAGES[MENU_PAGES.length - 1];

  const nextPageDef =
    MENU_PAGES[Math.min(pageIndex + 1, MENU_PAGES.length - 1)];

  const previousPageDef =
    MENU_PAGES[Math.max(pageIndex - 1, 0)];

  function openBook() {
    if (turning) return;

    setPageIndex(0);
    setIsOpen(true);
  }

  function nextPage() {
    if (!isOpen || turning || pageIndex >= MENU_PAGES.length - 1) return;

    // กัน state Hologram ค้างแล้วบล็อกการเปลี่ยนหน้า
    setHologramMode(false);
    window.dispatchEvent(new Event("menu:hologram-close"));

    setDirection("next");
    setTurning(true);
    setSheetFlipped(false);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setSheetFlipped(true);
      });
    });

    window.setTimeout(() => {
      setPageIndex((prev) =>
        Math.min(prev + 1, MENU_PAGES.length - 1)
      );
      setTurning(false);
      setSheetFlipped(false);
    }, TURN_DURATION);
  }

  function previousPage() {
    if (!isOpen || turning) return;

    // อยู่หน้าแรกของเมนู -> ปิดปก
    if (pageIndex === 0) {
      setIsOpen(false);
      return;
    }

    // ถ้า Hologram เปิดอยู่ ให้ปิดก่อนแล้วค่อยย้อนหน้า
    setHologramMode(false);
    window.dispatchEvent(new Event("menu:hologram-close"));

    setDirection("prev");
    setTurning(true);

    // เริ่มจากกระดาษอยู่ฝั่งซ้ายแล้วเปิดกลับมาขวา
    setSheetFlipped(true);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setSheetFlipped(false);
      });
    });

    window.setTimeout(() => {
      setPageIndex((prev) => Math.max(prev - 1, 0));
      setTurning(false);
      setSheetFlipped(false);
    }, TURN_DURATION);
  }

  function handleTouchStart(e: TouchEvent<HTMLDivElement>) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: TouchEvent<HTMLDivElement>) {
    const touchEndX = e.changedTouches[0].clientX;
    const distance = touchStartX.current - touchEndX;

    if (Math.abs(distance) < 50) return;

    if (distance > 0) {
      nextPage();
    } else {
      previousPage();
    }
  }

  return (
    <div
      className="
        relative
        flex
        min-h-[100dvh]
        w-full
        items-center
        justify-start
        overflow-hidden
        bg-[#080808]

        px-2
        pt-[4dvh]

        md:justify-center
        md:pt-0
      "
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background glow */}
      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-[900px]
          w-[1100px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-white/[0.025]
          blur-[130px]
        "
      />

      {/* Book shadow */}
      <div
        className={`
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-[80px]
          -translate-x-1/2
          translate-y-[330px]
          md:translate-y-[320px]
          rounded-full
          bg-black/80
          blur-[40px]
          transition-all
          duration-1000

          ${
            isOpen
              ? "w-[92vw] md:w-[850px]"
              : "w-[80vw] md:w-[390px]"
          }
        `}
      />

      {/* BOOK */}
      <div
        className={`
          relative
          z-10

          w-[calc(100vw-12px)]
          max-w-[430px]

          h-[clamp(590px,72dvh,690px)]

          md:h-[680px]
          md:w-[500px]
          md:max-w-none

          [perspective:1500px]

          transition-[transform,filter]
          duration-[700ms]
          ease-[cubic-bezier(0.22,1,0.36,1)]

          ${isOpen ? "md:translate-x-[250px]" : ""}


        `}
      >
        <div
          className="
            relative
            h-full
            w-full

            [transform-style:preserve-3d]

            transition-transform
            duration-[760ms]
            ease-[cubic-bezier(0.22,1,0.36,1)]
          "
          style={{
            transformOrigin: "50% 82%",
            transform: hologramMode
              ? "rotateX(52deg) scale(0.94) translateY(38px)"
              : "rotateX(0deg) scale(1) translateY(0px)",
          }}
        >
        {/* แสงจากหนังสือก่อน Hologram ฉายขึ้น */}
        <div
          className={`
            pointer-events-none
            absolute
            -left-full
            right-0
            top-[6%]
            bottom-[6%]
            z-[5]

            rounded-[40px]

            bg-cyan-200/[0.035]
            blur-[26px]

            transition-all
            duration-500

            ${
              hologramMode
                ? "scale-100 opacity-100"
                : "scale-[0.92] opacity-0"
            }
          `}
        />

        {/* RIGHT PAPER */}
        <div
          className={`
            absolute
            inset-0
            overflow-visible
            rounded-l-[4px]
            rounded-r-[30px]
            border
            border-black/10
            bg-[#090a0c]
            shadow-[15px_30px_80px_rgba(0,0,0,0.65)]

            transition-transform
            duration-[700ms]
            ease-[cubic-bezier(0.22,1,0.36,1)]

            
          `}
        >
          {/* PAGE UNDERNEATH */}
          <div
            className="
              absolute
              inset-0
              overflow-hidden
              rounded-l-[4px]
              rounded-r-[30px]
              bg-[#090a0c]
            "
          >
            <PaperBackground />

            {!turning && currentPage.content}

            {/* ไปหน้าถัดไป: ใต้กระดาษคือหน้าถัดไป */}
            {turning && direction === "next" && nextPageDef.content}

            {/* ย้อนกลับ: ใต้กระดาษยังเป็นหน้าปัจจุบัน */}
            {turning && direction === "prev" && currentPage.content}
          </div>

          {/* TURNING SHEET */}
          {turning && (
            <div
              className="
                absolute
                inset-0
                z-40
                [transform-style:preserve-3d]
                transition-transform
                duration-[1200ms]
                ease-[cubic-bezier(0.645,0.045,0.355,1)]
              "
              style={{
                transformOrigin: "left center",
                transform: sheetFlipped
                  ? "rotateY(-178deg)"
                  : "rotateY(0deg)",
              }}
            >
              {/* FRONT OF PAPER */}
              <div
                className="
                  absolute
                  inset-0
                  overflow-hidden
                  rounded-l-[4px]
                  rounded-r-[30px]
                  border
                  border-black/10
                  bg-[#090a0c]
                  shadow-[12px_20px_45px_rgba(0,0,0,0.40)]
                  [backface-visibility:hidden]
                "
              >
                <PaperBackground />

                {direction === "next"
                  ? currentPage.content
                  : previousPageDef.content}

                <div
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    bg-gradient-to-l
                    from-black/20
                    via-transparent
                    to-transparent
                  "
                />
              </div>

              {/* BACK OF PAPER */}
              <div
                className="
                  absolute
                  inset-0
                  overflow-hidden
                  rounded-l-[30px]
                  rounded-r-[4px]
                  border
                  border-black/10
                  bg-[#121316]
                  shadow-[12px_20px_45px_rgba(0,0,0,0.40)]
                  [backface-visibility:hidden]
                  [transform:rotateY(180deg)]
                "
              >
                <div
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    bg-[radial-gradient(circle_at_70%_10%,rgba(255,255,255,0.8),transparent_55%)]
                  "
                />

                <div
                  className="
                    pointer-events-none
                    absolute
                    bottom-0
                    right-0
                    top-0
                    w-[45px]
                    bg-gradient-to-l
                    from-black/15
                    to-transparent
                  "
                />
              </div>
            </div>
          )}

          {/* PAGE TURN CLICK ZONE
              หน้า 2 ไม่มีปุ่ม Add-on -> กดตรงไหนบนกระดาษก็ไปหน้า 3 ได้
              หน้าที่มี interaction -> เหลือเฉพาะขอบขวาเพื่อไม่บังปุ่มด้านใน
          */}
          {isOpen &&
            !turning &&
            pageIndex < MENU_PAGES.length - 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  nextPage();
                }}
                aria-label="หน้าถัดไป"
                className={`
                  absolute
                  z-[45]
                  cursor-pointer
                  bg-transparent

                  ${
                    pageIndex === 0
                      ? "inset-0 rounded-r-[30px]"
                      : "right-0 top-0 bottom-0 w-[18%] rounded-r-[30px]"
                  }
                `}
              />
            )}
        </div>

        {/* FRONT COVER */}
        <button
          type="button"
          onClick={openBook}
          className="
            absolute
            inset-0
            z-50
            cursor-pointer
            [transform-style:preserve-3d]
            transition-transform
            duration-[1200ms]
            ease-[cubic-bezier(0.645,0.045,0.355,1)]
            focus:outline-none
          "
          style={{
            transformOrigin: "left center",
            transform: isOpen
              ? hologramMode
                ? "rotateY(-180deg)"
                : "rotateY(-178deg)"
              : "rotateY(0deg)",
            pointerEvents: isOpen ? "none" : "auto",
          }}
        >
          {/* COVER FRONT */}
          <div
            className="
              absolute
              inset-0
              overflow-hidden
              rounded-l-[14px]
              rounded-r-[28px]
              border
              border-black/10
              bg-[#f5f4ef]
              shadow-[0_35px_90px_rgba(0,0,0,0.55)]
              [backface-visibility:hidden]
            "
          >
            <div
              className="
                absolute
                inset-0
                bg-[radial-gradient(circle_at_25%_15%,rgba(255,255,255,0.95),transparent_38%),radial-gradient(circle_at_80%_80%,rgba(0,0,0,0.035),transparent_48%)]
              "
            />

            <div
              className="
                absolute
                bottom-0
                left-0
                top-0
                w-[34px]
                border-r
                border-black/10
                bg-gradient-to-r
                from-[#b7b7b2]
                via-[#e4e3de]
                to-[#faf9f5]
                shadow-[5px_0_18px_rgba(0,0,0,0.20)]
              "
            />

            <div
              className="
                absolute
                bottom-[20px]
                left-[20px]
                top-[20px]
                w-[1px]
                bg-black/10
              "
            />

            <div
              className="
                absolute
                bottom-[22px]
                left-[50px]
                right-[22px]
                top-[22px]
                rounded-[22px]
                border
                border-black/10
              "
            />

            <div
              className="
                absolute
                inset-0
                flex
                items-center
                justify-center
                pl-[30px]
              "
            >
              <div
                className="
                  relative
                  h-[220px]
                  w-[220px]
                  overflow-hidden
                  rounded-full
                  bg-white
                  border
                  border-black/10
                  shadow-[0_18px_42px_rgba(0,0,0,0.22)]
                "
              >
                <Image
                  src="/logo.jpg"
                  alt="JoJo Sushi"
                  fill
                  priority
                  className="object-contain p-3"
                />
              </div>
            </div>
          </div>

          {/* INSIDE COVER */}
          <div
            className="
              absolute
              inset-0
              overflow-hidden
              rounded-l-[30px]
              rounded-r-[4px]
              border
              border-white/[0.08]
              bg-[#0b0b0b]
              shadow-[0_35px_80px_rgba(0,0,0,0.75)]
              [backface-visibility:hidden]
              [transform:rotateY(180deg)]
            "
          >
            <div
              className="
                absolute
                inset-0
                bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.045),transparent_45%)]
              "
            />

            <div
              className="
                absolute
                inset-[24px]
                rounded-[20px]
                border
                border-white/[0.055]
              "
            />

            <div
              className="
                absolute
                inset-0
                flex
                items-center
                justify-center
              "
            >
              <div
                className="
                  h-[58px]
                  w-[58px]
                  rounded-full
                  border
                  border-[#a71319]/55
                "
              />
            </div>
          </div>
        </button>

        {/* CENTER SPINE */}
        <div
          className={`
            pointer-events-none
            absolute
            bottom-[5px]
            left-0
            top-[5px]
            z-[70]
            w-[16px]
            -translate-x-1/2
            bg-gradient-to-r
            from-black/40
            via-white/15
            to-black/25
            blur-[2px]
            transition-opacity
            duration-700

            ${isOpen ? "opacity-100" : "opacity-0"}
          `}
        />

        {/* ฝั่งซ้ายกดย้อนกลับ */}
        {isOpen && (
          <button
            type="button"
            onClick={previousPage}
            aria-label="ย้อนกลับ"
            className="
              absolute
              -left-full
              top-0
              z-[80]
              hidden
              h-full
              w-full
              cursor-pointer
              bg-transparent
              md:block
            "
          />
        )}
        </div>
      </div>

      {/* BOTTOM NAVIGATION */}
      {!isOpen && (
        <div
          className="
            absolute
            bottom-[18px]
            select-none
            text-[10px]
            tracking-[0.25em]
            text-white/25
          "
        >
          CLICK TO OPEN
        </div>
      )}

      {isOpen && (
        <div
          className="
            absolute
            bottom-[15px]
            z-[300]
            flex
            items-center
            gap-5
          "
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              previousPage();
            }}
            disabled={turning}
            className="
              flex
              h-[40px]
              w-[40px]
              items-center
              justify-center
              rounded-full
              border
              border-white/10
              bg-white/[0.04]
              text-[23px]
              text-white/50
              disabled:opacity-20
              disabled:cursor-not-allowed
            "
            style={{ pointerEvents: "auto" }}
          >
            ‹
          </button>

          <span
            className="
              min-w-[72px]
              text-center
              text-[10px]
              tracking-[0.2em]
              text-white/30
            "
          >
            {String(currentPage.number).padStart(2, "0")} /{" "}
            {String(lastPage.number).padStart(2, "0")}
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              nextPage();
            }}
            disabled={
              pageIndex >= MENU_PAGES.length - 1 || turning
            }
            className="
              flex
              h-[40px]
              w-[40px]
              items-center
              justify-center
              rounded-full
              border
              border-white/10
              bg-white/[0.04]
              text-[23px]
              text-white/50
              disabled:opacity-20
              disabled:cursor-not-allowed
            "
            style={{ pointerEvents: "auto" }}
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}

/* ========================================================= */
/* PAGE 2 - BEST SELLER */
/* ========================================================= */

function BestSellerPage() {
  return (
    <div
      className="
        relative
        z-10
        flex
        h-full
        flex-col
        px-9
        py-8
        sm:px-10
        sm:py-9
      "
    >
      {/* รูปบน */}
      <div className="flex justify-between">
        <FoodCircle
          text="รูปที่ 1"
          src="/kawdong.jpg"
        />

        <FoodCircle text="รูปที่ 2" 
        src="/sushisalmon.jpg"
        />
      </div>

      {/* รูปกลาง */}
      <div className="-mt-1 flex justify-center">
        <FoodCircle
          text="รูปที่ 3"
          src="/donburi/dongsalmons.jpg"
          large
        />
      </div>

      {/* เมนู */}
      <div className="mt-4">
        <div className="mb-4 flex items-center gap-3">
          <div
            className="
              h-[34px]
              w-[4px]
              rounded-full
              bg-[#af151c]
            "
          />

          <h1
            className="
              text-[28px]
              font-bold
              text-[#f4f4f4]
            "
          >
            เมนูขายดี
          </h1>
        </div>

        <div
          className="
            space-y-3
            text-[15px]
            font-medium
            text-[#e5e5e5]
            sm:text-[16px]
          "
        >
          <MenuRow name="1. ข้าวด้ง" price="129.-" />
          <MenuRow name="2. ซูชิแซลมอน" price="89.-" />
          <MenuRow name="3. ด้งแซลมอน" price="159.-" />
        </div>
      </div>

      <div className="mt-auto pb-3 text-center">
        <div
          className="
            mx-auto
            mb-4
            h-[1px]
            w-[45px]
            bg-[#af151c]/50
          "
        />

        <p
          className="
            text-[13px]
            text-white/55
            sm:text-[14px]
          "
        >
          (สามารถสั่งทำตามความต้องการได้ค่ะ)
        </p>
      </div>

      <span
        className="
          absolute
          bottom-[16px]
          right-[25px]
          text-[10px]
          tracking-[0.2em]
          text-white/20
        "
      >
        02
      </span>
    </div>
  );
}

/* ========================================================= */
/* FOOD CIRCLE */
/* ========================================================= */

function FoodCircle({
  text,
  src,
  large = false,
}: {
  text: string;
  src?: string;
  large?: boolean;
}) {
  return (
    <div
      className={`
        relative
        flex
        items-center
        justify-center
        overflow-hidden
        rounded-full
        border-[4px]
        border-white/25
        bg-[#18191c]
        text-[12px]
        text-white/40
        shadow-[0_12px_32px_rgba(0,0,0,0.18)]

        ${
          large
            ? "h-[135px] w-[135px] sm:h-[145px] sm:w-[145px]"
            : "h-[115px] w-[115px] sm:h-[125px] sm:w-[125px]"
        }
      `}
    >
      {src ? (
        <Image
          src={src}
          alt={text}
          fill
          sizes={large ? "145px" : "125px"}
          className="object-cover"
        />
      ) : (
        <span className="relative z-10">{text}</span>
      )}
    </div>
  );
}

/* ========================================================= */
/* MENU ROW */
/* ========================================================= */

function MenuRow({
  name,
  price,
}: {
  name: string;
  price: string;
}) {
  return (
    <div className="flex items-end gap-2">
      <span className="whitespace-nowrap">
        {name}
      </span>

      <div
        className="
          mb-[5px]
          flex-1
          border-b
          border-dotted
          border-white/25
        "
      />

      <span className="whitespace-nowrap">
        {price}
      </span>
    </div>
  );
}

/* ========================================================= */
/* PAPER BACKGROUND */
/* ========================================================= */

function PaperBackground() {
  return (
    <>
      <div
        className="
          pointer-events-none
          absolute
          inset-0

          bg-[radial-gradient(circle_at_68%_12%,rgba(255,255,255,0.075),transparent_42%),radial-gradient(circle_at_35%_82%,rgba(255,255,255,0.025),transparent_48%)]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          left-0
          top-0
          z-20
          w-[44px]

          bg-gradient-to-r
          from-black/80
          via-black/30
          to-transparent
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          inset-[14px]

          rounded-[22px]

          border
          border-white/[0.035]
        "
      />
    </>
  );
}
