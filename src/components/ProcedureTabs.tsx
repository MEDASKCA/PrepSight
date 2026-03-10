"use client";

import { useMemo, useState } from "react";
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
}: {
  system: SystemWithSupplier;
  procedureId: string;
  variantId: string;
  isSelected: boolean;
}) {
  return (
    <Link
      href={`/procedures/${procedureId}?variant=${encodeURIComponent(variantId)}&system=${encodeURIComponent(system.id)}`}
      className={[
        "flex w-full items-center justify-between gap-3 border-t border-[#D5DCE3] px-5 py-4 text-left transition lg:border-[#D8E3EE] lg:px-6 lg:py-5",
        isSelected ? "bg-[#E1F3F0] lg:bg-[#EEF7FF]" : "bg-white hover:bg-[#F4FBFA] lg:bg-white lg:hover:bg-[#F7FBFF]",
      ].join(" ")}
    >
      <div className="min-w-0">
        <div className="text-sm font-medium text-slate-900 lg:text-[22px] lg:font-semibold lg:tracking-[-0.03em] lg:text-[#10243E]">
          {system.name}
        </div>
        {(formatSystemMeta(system).type || formatSystemMeta(system).supplier) && (
          <div className="mt-1 space-y-0.5">
            {formatSystemMeta(system).type && (
              <div className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 lg:text-[12px] lg:text-[#51677E]">
                {formatSystemMeta(system).type}
              </div>
            )}
            {formatSystemMeta(system).supplier && (
              <div className="text-xs text-slate-500 lg:text-sm lg:text-[#61758B]">
                {formatSystemMeta(system).supplier}
              </div>
            )}
          </div>
        )}
        {system.description && (
          <div className="mt-1 line-clamp-2 text-xs text-slate-500 lg:text-sm lg:leading-6 lg:text-[#61758B]">
            {system.description}
          </div>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {system.is_default && (
          <span className="rounded-full bg-[#E1F3F0] px-2 py-0.5 text-[11px] font-medium text-[#134E4A] lg:border lg:border-[#D6E6F5] lg:bg-[#F3FAF9] lg:px-3 lg:py-1 lg:text-[#134E4A]">
            Default
          </span>
        )}
        <Chevron expanded={false} className="text-[#7BA9A3] lg:text-[#8AA2BA]" />
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
}: {
  procedureId: string;
  variant: VariantWithSystems;
  expanded: boolean;
  selectedSystemId?: string;
  onToggle: () => void;
  isFirst: boolean;
  palette: Palette;
}) {
  return (
    <div className={isFirst ? "" : "border-t border-[#D5DCE3] lg:border-white/10"}>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition lg:hidden"
        style={{
          backgroundColor: palette.soft,
          color: palette.softText,
          borderLeft: `4px solid ${palette.softBorder}`,
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

      <div className="hidden lg:block lg:px-6 lg:py-5" style={{ backgroundColor: palette.soft, color: palette.softText }}>
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
          <span className="rounded-full border border-black/10 bg-white/55 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]">
            {variant.systems.length} systems
          </span>
        </div>
      </div>

      {expanded && (
        <div className="bg-white lg:hidden">
          {variant.systems.length > 0 ? (
            variant.systems.map((system) => (
              <SystemRow
                key={system.id}
                system={system}
                procedureId={procedureId}
                variantId={variant.id}
                isSelected={selectedSystemId === system.id}
              />
            ))
          ) : (
            <div className="border-t border-[#D5DCE3] bg-white px-5 py-4 text-sm text-slate-500 lg:border-white/10 lg:bg-transparent lg:text-white/56">
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
            />
          ))
        ) : (
          <div className="border-t border-[#D5DCE3] bg-white px-5 py-4 text-sm text-slate-500 lg:border-[#D8E3EE] lg:bg-white lg:text-[#61758B]">
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
}: {
  proceduresWithVariants: Array<{
    procedure: ProcedureListItem;
    variants: VariantWithSystems[];
    suppressBranching: boolean;
  }>;
  selectedSystemId?: string;
  palette: Palette;
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
                          className={`relative overflow-hidden rounded-[24px] border bg-white shadow-[0_8px_18px_rgba(15,23,42,0.04)] ${
                            isCollapsed ? "min-h-[220px]" : ""
                          }`}
                          style={{
                            borderColor: `${palette.softBorder}55`,
                            backgroundColor: "transparent",
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
                              className={`px-4 ${isCollapsed ? 'flex min-h-[220px] items-center py-8' : 'py-3 border-b'}`}
                              style={{
                                borderColor: `${palette.softBorder}55`,
                                backgroundColor: `${palette.soft}`,
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
                                  <p className="mt-1.5 text-[25px] font-semibold tracking-[-0.03em] text-[#10243E]">
                                    {approach.name}
                                  </p>
                                  {approach.description && !isCollapsed && (
                                    <p className="mt-2 max-w-xl text-[14px] leading-6 text-[#61758B]">
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
                                <Chevron expanded={!isCollapsed} className="text-[#46607A]" />
                              </div>
                            </div>
                          </button>

                          {!isCollapsed && (
                            <div
                              className="border-t p-3"
                              style={{
                                backgroundColor: `${palette.soft}`,
                                borderColor: `${palette.softBorder}55`,
                              }}
                            >
                              {approach.systems.length > 0 ? (
                                <div className="space-y-2">
                                  {approach.systems.map((system) => (
                                    <Link
                                      key={`${procedure.id}-${approach.id}-${system.id}`}
                                      href={`/procedures/${procedure.id}?variant=${encodeURIComponent(approach.id)}&system=${encodeURIComponent(system.id)}`}
                                      className={[
                                        'block rounded-[16px] border px-3 py-3 transition',
                                        selectedSystemId === system.id
                                          ? 'shadow-[0_10px_24px_rgba(15,23,42,0.10)]'
                                          : 'hover:bg-white/90',
                                      ].join(' ')}
                                      style={
                                        selectedSystemId === system.id
                                          ? {
                                              borderColor: `${palette.header}66`,
                                              backgroundColor: palette.header,
                                            }
                                          : {
                                              borderColor: `${palette.header}33`,
                                              backgroundColor: palette.hover,
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
                                  className="rounded-[16px] border border-dashed bg-[#FAFCFE] px-3 py-4 text-[17px]"
                                  style={{ borderColor: `${palette.softBorder}66`, color: palette.softText }}
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
}: {
  procedure: ProcedureListItem;
  variants: VariantWithSystems[];
  suppressBranching: boolean;
  selectedSystemId?: string;
  palette: Palette;
}) {
  const [openVariantId, setOpenVariantId] = useState<string | null>(null);
  const [desktopExpanded, setDesktopExpanded] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl border border-[#D5DCE3] bg-white shadow-sm lg:inline-block lg:w-full lg:break-inside-avoid lg:rounded-[28px] lg:border-[#D8E3EE] lg:bg-white lg:shadow-[0_18px_42px_rgba(15,23,42,0.08)]">
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
          <div className="bg-white lg:hidden">
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
                  onToggle={() =>
                    setOpenVariantId((current) => (current === variant.id ? null : variant.id))
                  }
                />
              ))
            ) : (
              <div className="border-t border-[#D5DCE3] bg-white px-5 py-4 text-sm text-slate-500">
                No clinically reliable branching available yet.
              </div>
            )}
          </div>

          <div className={`hidden lg:block lg:bg-white ${desktopExpanded ? "" : "lg:hidden"}`}>
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
                      onToggle={() => {
                        setOpenVariantId((current) => (current === variant.id ? null : variant.id));
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-t border-[#E4EDF6] bg-white px-5 py-4 text-sm text-[#61758B]">
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
      <div className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-6 text-sm text-slate-500 lg:rounded-[28px] lg:border-[#D8E3EE] lg:bg-white lg:px-7 lg:py-7 lg:text-[#61758B]">
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
          />
        ))}
      </div>

      <DesktopProcedureMatrix
        proceduresWithVariants={proceduresWithVariants}
        selectedSystemId={selectedSystemId}
        palette={palette}
      />

    </>
  );
}
