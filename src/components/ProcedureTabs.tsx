"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  getCuratedVariantsForProcedureWithSystems,
  hasOnlySyntheticBranching,
  type SystemWithSupplier,
  type VariantWithSystems,
} from "@/lib/variants";

type ProcedureListItem = {
  id: string;
  name: string;
  description?: string;
  aliases?: string[];
  status?: string;
};

type Palette = {
  header: string;
  hover: string;
  soft: string;
  softBorder: string;
  softText: string;
};

type ProcedureTabsProps = {
  procedures: ProcedureListItem[];
  setting?: string;
  specialty?: string;
  serviceLine?: string;
  anatomy?: string;
  selectedSystemId?: string;
  palette?: Palette;
};

function Chevron({ expanded, className = "" }: { expanded: boolean; className?: string }) {
  return (
    <svg
      className={`h-4 w-4 transition-transform duration-200 ${expanded ? "rotate-90" : ""} ${className}`}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M7.21 14.77a.75.75 0 0 1 .02-1.06L10.94 10 7.23 6.29a.75.75 0 1 1 1.06-1.06l4.24 4.24a.75.75 0 0 1 0 1.06l-4.24 4.24a.75.75 0 0 1-1.08-.02Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function formatSystemMeta(system: SystemWithSupplier) {
  const categorySuffix =
    system.category?.split("—")[1]?.trim() ||
    system.category?.split("-")[1]?.trim() ||
    "";
  const rawSystemType = system.system_type?.trim() || "";
  const systemType =
    categorySuffix ||
    (rawSystemType.toLowerCase() === "implant" ? "" : rawSystemType);
  return {
    supplier: system.supplier?.name ? `by ${system.supplier.name}` : "",
    type: systemType || "",
  };

}

function SystemRow({
  system,
  procedureId,
  variantId,
  isSelected,
  isDark,
}: {
  system: SystemWithSupplier;
  procedureId: string;
  variantId: string;
  isSelected: boolean;
  isDark: boolean;
}) {
  const rowClassName = isDark
    ? `procedure-system-row flex w-full items-center justify-between gap-3 border-t px-5 py-4 text-left transition lg:px-6 lg:py-5 ${
        isSelected ? "bg-[#334155]" : "bg-[#243244] hover:bg-[#2B3B50]"
      } border-[#334155]`
    : [
        "procedure-system-row flex w-full items-center justify-between gap-3 border-t border-[#D5DCE3] px-5 py-4 text-left transition lg:border-[#D8E3EE] lg:px-6 lg:py-5",
        isSelected ? "bg-[#E1F3F0] lg:bg-[#EEF7FF]" : "bg-white hover:bg-[#F4FBFA] lg:bg-white lg:hover:bg-[#F7FBFF]",
      ].join(" ");

  return (
    <Link
      href={`/procedures/${procedureId}?variant=${encodeURIComponent(variantId)}&system=${encodeURIComponent(system.id)}`}
      className={rowClassName}
    >
      <div className="min-w-0">
        <div className={`text-sm font-medium lg:text-[22px] lg:font-semibold lg:tracking-[-0.03em] ${isDark ? "text-white" : "text-slate-900 lg:text-[#10243E]"}`}>
          {system.name}
        </div>
        {(formatSystemMeta(system).type || formatSystemMeta(system).supplier) && (
          <div className="mt-1 space-y-0.5">
            {formatSystemMeta(system).type && (
              <div className={`text-xs font-semibold uppercase tracking-[0.08em] lg:text-[12px] ${isDark ? "text-[#C7D2E0]" : "text-slate-600 lg:text-[#51677E]"}`}>
                {formatSystemMeta(system).type}
              </div>
            )}
            {formatSystemMeta(system).supplier && (
              <div className={`text-xs lg:text-sm ${isDark ? "text-[#C7D2E0]" : "text-slate-500 lg:text-[#61758B]"}`}>
                {formatSystemMeta(system).supplier}
              </div>
            )}
          </div>
        )}
        {system.description && (
          <div className={`mt-1 line-clamp-2 text-xs lg:text-sm lg:leading-6 ${isDark ? "text-[#C7D2E0]" : "text-slate-500 lg:text-[#61758B]"}`}>
            {system.description}
          </div>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {system.is_default && (
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium lg:border lg:px-3 lg:py-1 ${isDark ? "border-[#334155] bg-[#132238] text-[#E5EEF9]" : "bg-[#E1F3F0] text-[#134E4A] lg:border-[#D6E6F5] lg:bg-[#F3FAF9] lg:text-[#134E4A]"}`}>
            Default
          </span>
        )}
        <Chevron expanded={false} className={isDark ? "text-[#C7D2E0]" : "text-[#7BA9A3] lg:text-[#8AA2BA]"} />
      </div>
    </Link>
  );
}

function VariantSection({
  procedureId,
  variant,
  expanded,
  selectedSystemId,
  onToggle,
  isFirst,
  palette,
  isDark,
}: {
  procedureId: string;
  variant: VariantWithSystems;
  expanded: boolean;
  selectedSystemId?: string;
  onToggle: () => void;
  isFirst: boolean;
  palette: Palette;
  isDark: boolean;
}) {
  return (
    <div className={isFirst ? "" : "procedure-variant-divider border-t border-[#D5DCE3] lg:border-white/10"}>
      <button
        type="button"
        onClick={onToggle}
        className="procedure-variant-bar flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition lg:hidden"
        style={{
          backgroundColor: isDark ? "#243244" : palette.soft,
          color: isDark ? "#E5EEF9" : palette.softText,
          borderLeft: `4px solid ${isDark ? "#334155" : palette.softBorder}`,
        }}
      >
        <div className="min-w-0">
          <div className="text-sm font-medium lg:text-[26px] lg:font-semibold lg:tracking-[-0.04em]">
            {variant.name}
          </div>
          {variant.description && (
            <div className="mt-1 line-clamp-2 text-xs opacity-90 lg:text-sm lg:leading-6">
              {variant.description}
            </div>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Chevron expanded={expanded} className="opacity-80" />
        </div>
      </button>

      <div className="procedure-variant-bar hidden lg:block lg:px-6 lg:py-5" style={{ backgroundColor: isDark ? "#243244" : palette.soft, color: isDark ? "#E5EEF9" : palette.softText }}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] opacity-60">
              Approach
            </p>
            <p className="mt-2 text-[26px] font-semibold tracking-[-0.04em]">
              {variant.name}
            </p>
            {variant.description && (
              <p className="mt-2 max-w-xl text-sm leading-6 opacity-78">
                {variant.description}
              </p>
            )}
          </div>
          <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${isDark ? "border border-[#334155] bg-[#132238] text-[#E5EEF9]" : "border border-black/10 bg-white/55"}`}>
            {variant.systems.length} systems
          </span>
        </div>
      </div>

      {expanded && (
        <div className={`procedure-variant-content lg:hidden ${isDark ? "bg-[#243244]" : "bg-white"}`}>
          {variant.systems.length > 0 ? (
            variant.systems.map((system) => (
              <SystemRow
                key={system.id}
                system={system}
                procedureId={procedureId}
                variantId={variant.id}
                isSelected={selectedSystemId === system.id}
                isDark={isDark}
              />
            ))
          ) : (
            <div className={`procedure-empty-row border-t px-5 py-4 text-sm ${isDark ? "border-[#334155] bg-[#243244] text-[#C7D2E0]" : "border-[#D5DCE3] bg-white text-slate-500 lg:border-white/10 lg:bg-transparent lg:text-white/56"}`}>
              No systems linked yet for this variant.
            </div>
          )}
        </div>
      )}

      <div className="hidden lg:block lg:bg-transparent">
        {variant.systems.length > 0 ? (
          variant.systems.map((system) => (
            <SystemRow
              key={system.id}
              system={system}
              procedureId={procedureId}
              variantId={variant.id}
              isSelected={selectedSystemId === system.id}
              isDark={isDark}
            />
          ))
        ) : (
          <div className={`procedure-empty-row border-t px-5 py-4 text-sm ${isDark ? "border-[#334155] bg-[#243244] text-[#C7D2E0]" : "border-[#D5DCE3] bg-white text-slate-500 lg:border-[#D8E3EE] lg:bg-white lg:text-[#61758B]"}`}>
            No systems linked yet for this variant.
          </div>
        )}
      </div>
    </div>
  );
}

function DesktopProcedureMatrix({
  proceduresWithVariants,
  selectedSystemId,
  palette,
  isDark,
}: {
  proceduresWithVariants: Array<{
    procedure: ProcedureListItem;
    variants: VariantWithSystems[];
    suppressBranching: boolean;
  }>;
  selectedSystemId?: string;
  palette: Palette;
  isDark: boolean;
}) {
  const [collapsedCards, setCollapsedCards] = useState<Record<string, boolean>>({});

  return (
    <div className="hidden space-y-5 lg:block">
      {proceduresWithVariants.map(({ procedure, variants, suppressBranching }) => {
        const procedureApproaches = suppressBranching
          ? []
          : variants.map((variant) => ({
              id: variant.id,
              name: variant.name,
              description: variant.description,
              systems: variant.systems,
            }));

        return (
          <div
            key={procedure.id}
            className="overflow-visible"
          >
            <div className="grid grid-cols-[280px_minmax(0,1fr)] items-start gap-5 overflow-visible">
              <div className="px-2 py-5">
                <div
                  className="rounded-[22px] px-5 py-5"
                  style={{ backgroundColor: palette.hover }}
                >
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/72">
                  Procedure
                </p>
                <p className="mt-2 text-[20px] font-semibold tracking-[-0.03em] text-white">
                  {procedure.name}
                </p>
                {procedure.description && (
                  <p className="mt-2 text-sm leading-6 text-white/78">
                    {procedure.description}
                  </p>
                )}
                </div>
              </div>

              <div className="min-w-0 p-0 overflow-visible">
                {procedureApproaches.length > 0 ? (
                  <div
                    className="grid items-start gap-4 overflow-visible"
                    style={{ gridTemplateColumns: `repeat(${procedureApproaches.length}, minmax(0, 1fr))` }}
                  >
                    {procedureApproaches.map((approach) => {
                      const cardKey = `${procedure.id}:${approach.id}`;
                      const isCollapsed = collapsedCards[cardKey] ?? true;

                      return (
                        <div
                          key={`${procedure.id}-${approach.id}`}
                          className={`procedure-approach-card relative overflow-hidden rounded-[24px] border shadow-[0_8px_18px_rgba(15,23,42,0.04)] ${
                            isCollapsed ? "min-h-[220px]" : ""
                          } ${isDark ? "bg-[#243244] border-[#334155]" : "bg-white"}`}
                          style={{
                            borderColor: isDark ? "#334155" : `${palette.softBorder}55`,
                            backgroundColor: isDark ? "#243244" : "transparent",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              setCollapsedCards((current) => ({
                                ...current,
                                [cardKey]: !isCollapsed,
                              }))
                            }
                            className="w-full text-left transition-[filter] duration-200 hover:brightness-[0.98]"
                          >
                            <div
                              className={`procedure-approach-bar px-4 ${isCollapsed ? "flex min-h-[220px] items-center py-8" : "border-b py-3"}`}
                              style={{
                                borderColor: isDark ? "#334155" : `${palette.softBorder}55`,
                                backgroundColor: isDark ? "#243244" : `${palette.soft}`,
                              }}
                            >
                              <div className="flex w-full flex-col items-center justify-center gap-3 text-center">
                                <div className="flex flex-col items-center text-center">
                                  <p
                                    className="text-[13px] font-semibold uppercase tracking-[0.12em]"
                                    style={{ color: palette.softText }}
                                  >
                                    Approach
                                  </p>
                                  <p className={`mt-1.5 text-[25px] font-semibold tracking-[-0.03em] ${isDark ? "text-white" : "text-[#10243E]"}`}>
                                    {approach.name}
                                  </p>
                                  {approach.description && !isCollapsed && (
                                    <p className={`mt-2 max-w-xl text-[14px] leading-6 ${isDark ? "text-[#C7D2E0]" : "text-[#61758B]"}`}>
                                      {approach.description}
                                    </p>
                                  )}
                                </div>
                                <span
                                  className="text-[13px] font-semibold uppercase tracking-[0.12em]"
                                  style={{ color: palette.softText }}
                                >
                                  {approach.systems.length} system options
                                </span>
                                <Chevron expanded={!isCollapsed} className={isDark ? "text-[#C7D2E0]" : "text-[#46607A]"} />
                              </div>
                            </div>
                          </button>

                          {!isCollapsed && (
                            <div
                              className="procedure-approach-content border-t p-3"
                              style={{
                                backgroundColor: isDark ? "#243244" : `${palette.soft}`,
                                borderColor: isDark ? "#334155" : `${palette.softBorder}55`,
                              }}
                            >
                              {approach.systems.length > 0 ? (
                                <div className="space-y-2">
                                  {approach.systems.map((system) => (
                                    <Link
                                      key={`${procedure.id}-${approach.id}-${system.id}`}
                                      href={`/procedures/${procedure.id}?variant=${encodeURIComponent(approach.id)}&system=${encodeURIComponent(system.id)}`}
                                      className={[
                                        "block rounded-[16px] border px-3 py-3 transition",
                                        selectedSystemId === system.id
                                          ? "shadow-[0_10px_24px_rgba(15,23,42,0.10)]"
                                          : isDark
                                            ? "hover:bg-[#2B3B50]"
                                            : "hover:bg-white/90",
                                      ].join(" ")}
                                      style={
                                        selectedSystemId === system.id
                                          ? {
                                              borderColor: isDark ? "#475569" : `${palette.header}66`,
                                              backgroundColor: isDark ? "#334155" : palette.header,
                                            }
                                          : {
                                              borderColor: isDark ? "#334155" : `${palette.header}33`,
                                              backgroundColor: isDark ? "#243244" : palette.hover,
                                            }
                                      }
                                    >
                                      <div className="min-w-0">
                                        <div className="text-[19px] font-semibold leading-6 text-white">
                                          {system.name}
                                        </div>
                                        {(formatSystemMeta(system).type ||
                                          formatSystemMeta(system).supplier) && (
                                          <div className="mt-1 space-y-0.5">
                                            {formatSystemMeta(system).type && (
                                              <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-white/82">
                                                {formatSystemMeta(system).type}
                                              </div>
                                            )}
                                            {formatSystemMeta(system).supplier && (
                                              <div className="text-[15px] leading-5 text-white/70">
                                                {formatSystemMeta(system).supplier}
                                              </div>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    </Link>
                                  ))}
                                </div>
                              ) : (
                                <div
                                  className={`procedure-empty-row rounded-[16px] border border-dashed px-3 py-4 text-[17px] ${isDark ? "bg-[#243244]" : "bg-[#FAFCFE]"}`}
                                  style={{ borderColor: isDark ? "#334155" : `${palette.softBorder}66`, color: isDark ? "#C7D2E0" : palette.softText }}
                                >
                                  No systems
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="px-2 py-3 text-sm text-[#A2B2C2]">
                    No clinically reliable branching available yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ProcedureSection({
  procedure,
  variants,
  suppressBranching,
  selectedSystemId,
  palette,
  isDark,
}: {
  procedure: ProcedureListItem;
  variants: VariantWithSystems[];
  suppressBranching: boolean;
  selectedSystemId?: string;
  palette: Palette;
  isDark: boolean;
}) {
  const [openVariantId, setOpenVariantId] = useState<string | null>(null);
  const [desktopExpanded, setDesktopExpanded] = useState(false);

  return (
    <div className={`procedure-section-card overflow-hidden rounded-xl border shadow-sm lg:inline-block lg:w-full lg:break-inside-avoid lg:rounded-[28px] lg:shadow-[0_18px_42px_rgba(15,23,42,0.08)] ${isDark ? "border-[#334155] bg-[#243244] lg:bg-[#243244]" : "border-[#D5DCE3] bg-white lg:border-[#D8E3EE] lg:bg-white"}`}>
      <button
        type="button"
        onClick={() => setDesktopExpanded((current) => !current)}
        className="hidden w-full lg:block"
      >
        <div
          className="flex items-stretch text-white"
        style={{ background: `linear-gradient(145deg, ${palette.header} 0%, ${palette.hover} 100%)` }}
        >
          <div className="flex min-w-0 flex-1 items-center gap-3 px-4 py-4 text-left lg:px-5 lg:py-4">
            <div className="min-w-0 flex-1">
              <p className="hidden lg:block lg:text-[11px] lg:font-semibold lg:uppercase lg:tracking-[0.18em] lg:text-white/62">
                Menu
              </p>
              <div className="text-sm font-semibold text-white lg:text-[24px] lg:font-semibold lg:tracking-[-0.04em]">
                {procedure.name}
              </div>
              {desktopExpanded && procedure.description && (
                <div className="mt-1 line-clamp-2 text-xs text-white/85 lg:max-w-3xl lg:text-[13px] lg:leading-5">
                  {procedure.description}
                </div>
              )}
            </div>
            <div className="hidden lg:flex lg:items-center lg:gap-3">
              <span className="rounded-full border border-white/14 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/80">
                {variants.length || 1} approaches
              </span>
              <Chevron expanded={desktopExpanded} className="text-white/80" />
            </div>
          </div>
        </div>
      </button>

      <div
        className="flex items-stretch text-white lg:hidden"
        style={{ background: `linear-gradient(145deg, ${palette.header} 0%, ${palette.hover} 100%)` }}
      >
        <div className="flex min-w-0 flex-1 items-center gap-3 px-4 py-4 text-left">
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-white">
              {procedure.name}
            </div>
            {procedure.description && (
              <div className="mt-1 line-clamp-2 text-xs text-white/85">
                {procedure.description}
              </div>
            )}
          </div>
        </div>
      </div>

      {!suppressBranching && (
        <>
          <div className={`procedure-variant-content lg:hidden ${isDark ? "bg-[#243244]" : "bg-white"}`}>
            {variants.length > 0 ? (
              variants.map((variant, index) => (
                <VariantSection
                  key={variant.id}
                  procedureId={procedure.id}
                  variant={variant}
                  expanded={openVariantId === variant.id}
                  selectedSystemId={selectedSystemId}
                  isFirst={index === 0}
                  palette={palette}
                  isDark={isDark}
                  onToggle={() =>
                    setOpenVariantId((current) => (current === variant.id ? null : variant.id))
                  }
                />
              ))
            ) : (
              <div className={`procedure-empty-row border-t px-5 py-4 text-sm ${isDark ? "border-[#334155] bg-[#243244] text-[#C7D2E0]" : "border-[#D5DCE3] bg-white text-slate-500"}`}>
                No clinically reliable branching available yet.
              </div>
            )}
          </div>

          <div className={`procedure-variant-content hidden lg:block ${isDark ? "lg:bg-[#243244]" : "lg:bg-white"} ${desktopExpanded ? "" : "lg:hidden"}`}>
            {variants.length > 0 ? (
              <div
                className="grid gap-0"
                style={{ gridTemplateColumns: `repeat(${variants.length}, minmax(0, 1fr))` }}
              >
                {variants.map((variant, index) => (
                  <div
                    key={variant.id}
                    className={index === 0 ? "min-w-0" : "min-w-0 border-l border-[#E4EDF6]"}
                  >
                    <VariantSection
                      procedureId={procedure.id}
                      variant={variant}
                      expanded
                      selectedSystemId={selectedSystemId}
                      isFirst
                      palette={palette}
                      isDark={isDark}
                      onToggle={() => {
                        setOpenVariantId((current) => (current === variant.id ? null : variant.id));
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className={`procedure-empty-row border-t px-5 py-4 text-sm ${isDark ? "border-[#334155] bg-[#243244] text-[#C7D2E0]" : "border-[#E4EDF6] bg-white text-[#61758B]"}`}>
                No clinically reliable branching available yet.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function ProcedureTabs({
  procedures,
  selectedSystemId,
  palette = {
    header: "#4DA3FF",
    hover: "#2F8EF7",
    soft: "#C7ECE8",
    softBorder: "#99D8D1",
    softText: "#134E4A",
  },
}: ProcedureTabsProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const syncTheme = () => {
      setIsDark(document.documentElement.dataset.theme === "dark");
    };

    syncTheme();
    window.addEventListener("storage", syncTheme);
    window.addEventListener("prepsight:preferences-changed", syncTheme as EventListener);

    return () => {
      window.removeEventListener("storage", syncTheme);
      window.removeEventListener("prepsight:preferences-changed", syncTheme as EventListener);
    };
  }, []);

  const proceduresWithVariants = useMemo(() => {
    return procedures
      .filter((procedure) => procedure.status !== "inactive")
      .map((procedure) => ({
        procedure,
        variants: getCuratedVariantsForProcedureWithSystems(procedure.id, procedure.name),
        suppressBranching: hasOnlySyntheticBranching(procedure.id, procedure.name),
      }));
  }, [procedures]);
  if (!proceduresWithVariants.length) {
    return (
      <div className={`procedure-empty-row rounded-xl border border-dashed px-5 py-6 text-sm lg:rounded-[28px] lg:px-7 lg:py-7 ${isDark ? "border-[#334155] bg-[#243244] text-[#C7D2E0]" : "border-slate-300 bg-white text-slate-500 lg:border-[#D8E3EE] lg:bg-white lg:text-[#61758B]"}`}>
        No procedures found for this anatomy.
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4 lg:hidden">
        {proceduresWithVariants.map(({ procedure, variants, suppressBranching }) => (
          <ProcedureSection
            key={procedure.id}
            procedure={procedure}
            variants={variants}
            suppressBranching={suppressBranching}
            selectedSystemId={selectedSystemId}
            palette={palette}
            isDark={isDark}
          />
        ))}
      </div>

      <DesktopProcedureMatrix
        proceduresWithVariants={proceduresWithVariants}
        selectedSystemId={selectedSystemId}
        palette={palette}
        isDark={isDark}
      />

    </>
  );
}
