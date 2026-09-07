import {
  ClipboardCheck,
  Cog,
  DraftingCompass,
  Factory,
  GanttChart,
  HardHat,
  ScanLine,
  ShieldCheck,
  Waves,
  type LucideProps,
} from "lucide-react";

import type { ServiceIcon as ServiceIconName } from "@/content/services";

const icons: Record<ServiceIconName, React.ComponentType<LucideProps>> = {
  turbine: Waves,
  drafting: DraftingCompass,
  scan: ScanLine,
  cog: Cog,
  hardhat: HardHat,
  clipboard: ClipboardCheck,
  factory: Factory,
  gantt: GanttChart,
  shield: ShieldCheck,
};

export function ServiceIcon({
  name,
  ...props
}: { name: ServiceIconName | undefined } & LucideProps) {
  const Icon = (name && icons[name]) || Cog;
  return <Icon aria-hidden="true" {...props} />;
}
