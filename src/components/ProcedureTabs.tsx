"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  getVariantsForProcedureWithSystems,
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

type ProcedureTabsProps = {
  procedures: ProcedureListItem[];
  setting?: string;
  specialty?: string;
  serviceLine?: string;
  anatomy?: string;
  selectedSystemId?: string;
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
        "flex w-full items-center justify-between gap-3 border-t border-[#D5DCE3] px-5 py-4 text-left transition",
        isSelected ? "bg-[#E1F3F0]" : "bg-white hover:bg-[#F4FBFA]",
      ].join(" ")}
    >
      <div className="min-w-0">
        <div className="text-sm font-medium text-slate-900">{system.name}</div>
        {(system.supplier?.name || system.category || system.system_type) && (
          <div className="mt-1 text-xs text-slate-500">
            {[system.supplier?.name, system.category, system.system_type]
              .filter(Boolean)
              .join(" · ")}
          </div>
        )}
        {system.description && (
          <div className="mt-1 line-clamp-2 text-xs text-slate-500">{system.description}</div>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {system.is_default && (
          <span className="rounded-full bg-[#E1F3F0] px-2 py-0.5 text-[11px] font-medium text-[#134E4A]">
            Default
          </span>
        )}
        <Chevron expanded={false} className="text-[#7BA9A3]" />
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
}: {
  procedureId: string;
  variant: VariantWithSystems;
  expanded: boolean;
  selectedSystemId?: string;
  onToggle: () => void;
  isFirst: boolean;
}) {
  return (
    <div className={isFirst ? "" : "border-t border-[#D5DCE3]"}>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition"
        style={{
          backgroundColor: "#C7ECE8",
        }}
      >
        <div className="min-w-0">
          <div className="text-sm font-medium text-[#134E4A]">{variant.name}</div>
          {variant.description && (
            <div className="mt-1 line-clamp-2 text-xs text-[#0F766E]">{variant.description}</div>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {variant.systems.length > 0 && (
            <span className="text-xs tabular-nums text-[#0F766E]">
              {variant.systems.length} system{variant.systems.length === 1 ? "" : "s"}
            </span>
          )}
          <Chevron expanded={expanded} className="text-[#0F766E]" />
        </div>
      </button>

      {expanded && (
        <div className="bg-white">
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
            <div className="border-t border-[#D5DCE3] bg-white px-5 py-4 text-sm text-slate-500">
              No systems linked yet for this variant.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ProcedureSection({
  procedure,
  variants,
  expanded,
  selectedSystemId,
  onToggle,
}: {
  procedure: ProcedureListItem;
  variants: VariantWithSystems[];
  expanded: boolean;
  selectedSystemId?: string;
  onToggle: () => void;
}) {
  const [openVariantId, setOpenVariantId] = useState<string | null>(null);
  const firstVariantWithSystem = variants.find((variant) => variant.systems.length > 0);
  const quickCardHref = firstVariantWithSystem
    ? `/procedures/${procedure.id}?variant=${encodeURIComponent(firstVariantWithSystem.id)}&system=${encodeURIComponent(firstVariantWithSystem.systems[0].id)}`
    : `/procedures/${procedure.id}`;

  return (
    <div className="overflow-hidden rounded-xl border border-[#D5DCE3] bg-white shadow-sm">
      {/* Header row: expand/collapse toggle + "View card" link */}
      <div className="flex items-stretch bg-[#4DA3FF]">
        <button
          type="button"
          onClick={onToggle}
          className="flex min-w-0 flex-1 items-center gap-3 px-4 py-4 text-left transition hover:bg-[#4398F0]"
        >
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-white">{procedure.name}</div>
            {procedure.description && (
              <div className="mt-1 line-clamp-2 text-xs text-white/85">{procedure.description}</div>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {variants.length > 0 && (
              <span className="text-xs tabular-nums text-white/85">
                {variants.length} variant{variants.length === 1 ? "" : "s"}
              </span>
            )}
            <Chevron expanded={expanded} className="text-white" />
          </div>
        </button>

        {/* View card link */}
        <Link
          href={quickCardHref}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center border-l border-white/20 px-3 text-xs font-semibold text-white/80 transition hover:bg-[#4398F0] hover:text-white shrink-0"
          title="View procedure card"
        >
          Card&nbsp;→
        </Link>
      </div>

      {expanded && (
        <div className="bg-white">
          {variants.length > 0 ? (
            variants.map((variant, index) => (
              <VariantSection
                key={variant.id}
                procedureId={procedure.id}
                variant={variant}
                expanded={openVariantId === variant.id}
                selectedSystemId={selectedSystemId}
                isFirst={index === 0}
                onToggle={() =>
                  setOpenVariantId((current) =>
                    current === variant.id ? null : variant.id,
                  )
                }
              />
            ))
          ) : (
            <div className="border-t border-[#D5DCE3] bg-white px-5 py-4 text-sm text-slate-500">
              No procedure variants available yet.
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
}: ProcedureTabsProps) {
  const [openProcedureId, setOpenProcedureId] = useState<string | null>(null);

  const proceduresWithVariants = useMemo(() => {
    return procedures
      .filter((procedure) => procedure.status !== "inactive")
      .map((procedure) => ({
        procedure,
        variants: getVariantsForProcedureWithSystems(procedure.id),
      }));
  }, [procedures]);

  if (!proceduresWithVariants.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-6 text-sm text-slate-500">
        No procedures found for this anatomy.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {proceduresWithVariants.map(({ procedure, variants }) => (
        <ProcedureSection
          key={procedure.id}
          procedure={procedure}
          variants={variants}
          expanded={openProcedureId === procedure.id}
          selectedSystemId={selectedSystemId}
          onToggle={() =>
            setOpenProcedureId((current) =>
              current === procedure.id ? null : procedure.id,
            )
          }
        />
      ))}
    </div>
  );
}
