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

function chunkIntoColumns<T>(items: T[], columns: number): T[][] {
  const buckets = Array.from({ length: columns }, () => [] as T[]);
  items.forEach((item, index) => {
    buckets[index % columns].push(item);
  });
  return buckets;
}

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
        {(system.supplier?.name || system.category || system.system_type) && (
          <div className="mt-1 text-xs text-slate-500 lg:text-sm lg:text-[#61758B]">
            {[system.supplier?.name, system.category, system.system_type]
              .filter(Boolean)
              .join(" · ")}
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
          <div className="border-t border-[#D5DCE3] bg-white px-5 py-4 text-sm text-slate-500 lg:border-white/10 lg:bg-transparent lg:text-white/56">
            No systems linked yet for this variant.
          </div>
        )}
      </div>
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

  return (
    <div className="overflow-hidden rounded-xl border border-[#D5DCE3] bg-white shadow-sm lg:mb-6 lg:inline-block lg:w-full lg:break-inside-avoid lg:rounded-[34px] lg:border-[#D8E3EE] lg:bg-white lg:shadow-[0_22px_50px_rgba(15,23,42,0.09)]">
      <div
        className="flex items-stretch text-white"
        style={{ background: `linear-gradient(145deg, ${palette.header} 0%, ${palette.hover} 100%)` }}
      >
        <div className="flex min-w-0 flex-1 items-center gap-3 px-4 py-4 text-left lg:px-7 lg:py-7">
          <div className="min-w-0 flex-1">
            <p className="hidden lg:block lg:text-[11px] lg:font-semibold lg:uppercase lg:tracking-[0.18em] lg:text-white/62">
              Menu
            </p>
            <div className="text-sm font-semibold text-white lg:text-[34px] lg:font-semibold lg:tracking-[-0.05em]">
              {procedure.name}
            </div>
            {procedure.description && (
              <div className="mt-2 line-clamp-2 text-xs text-white/85 lg:max-w-3xl lg:text-sm lg:leading-7">
                {procedure.description}
              </div>
            )}
          </div>
          <div className="hidden lg:block">
            <span className="rounded-full border border-white/14 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/80">
              {variants.length || 1} approaches
            </span>
          </div>
        </div>
      </div>

      {!suppressBranching && (
        <div className="bg-white lg:bg-white">
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
            <div className="border-t border-[#D5DCE3] bg-white px-5 py-4 text-sm text-slate-500 lg:border-[#E4EDF6] lg:bg-white lg:text-[#61758B]">
              No clinically reliable branching available yet.
            </div>
          )}
        </div>
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
  const desktopColumns = useMemo(
    () => chunkIntoColumns(proceduresWithVariants, 3),
    [proceduresWithVariants],
  );

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

      <div className="hidden lg:grid lg:grid-cols-3 lg:gap-6">
        {desktopColumns.map((column, columnIndex) => (
          <div key={`menu-column-${columnIndex}`} className="space-y-6">
            {column.map(({ procedure, variants, suppressBranching }) => (
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
        ))}
      </div>
    </>
  );
}
