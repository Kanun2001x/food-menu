"use client";

type HologramAddonProps = {
  open: boolean;
  title: string;
  items: string[];
  onClose: () => void;
};

export default function HologramAddon({
  open,
  title,
  items,
  onClose,
}: HologramAddonProps) {
  return (
    <div
      className={`
        pointer-events-none
        absolute
        inset-0
        z-[120]

        transition-all
        duration-500

        ${open ? "opacity-100" : "opacity-0"}
      `}
    >
      {/* glow บนหน้ากระดาษ */}
      <div
        className={`
          absolute
          left-1/2
          top-[58%]
          h-[120px]
          w-[120px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full

          bg-cyan-300/20
          blur-2xl

          transition-all
          duration-500

          ${open ? "scale-100" : "scale-50"}
        `}
      />

      {/* เสาแสง */}
      <div
        className={`
          absolute
          left-1/2
          top-[42%]
          h-[180px]
          w-[2px]
          -translate-x-1/2

          bg-gradient-to-b
          from-cyan-200/0
          via-cyan-200/70
          to-cyan-200/0

          blur-[1px]

          transition-all
          duration-500

          ${open ? "opacity-100" : "opacity-0"}
        `}
      />

      {/* แผ่น hologram */}
      <div
        className={`
          pointer-events-auto
          absolute
          left-1/2
          top-[48%]

          w-[280px]
          max-w-[82%]

          -translate-x-1/2

          rounded-[22px]
          border
          border-cyan-200/40

          bg-white/8
          backdrop-blur-md

          shadow-[0_0_30px_rgba(103,232,249,0.25)]

          transition-all
          duration-500

          ${
            open
              ? "-translate-y-1/2 scale-100 opacity-100"
              : "translate-y-6 scale-90 opacity-0"
          }
        `}
      >
        <div className="relative overflow-hidden rounded-[22px] px-5 py-5 text-white">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.18),rgba(255,255,255,0.03))]" />

          <div className="relative z-10">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-[18px] font-bold tracking-wide text-cyan-100">
                {title}
              </h3>

              <button
                onClick={onClose}
                className="rounded-full border border-cyan-100/30 px-2 py-1 text-[12px] text-cyan-100 hover:bg-white/10"
              >
                ปิด
              </button>
            </div>

            <div className="mb-3 h-[1px] w-full bg-cyan-100/20" />

            <p className="mb-2 text-[13px] text-cyan-50/85">
              Add-on / ตัวเลือกเพิ่ม
            </p>

            <div className="space-y-2">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-cyan-100/10 bg-white/5 px-3 py-2 text-[14px] text-white/90"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}