import {
  LayoutDashboard,
  Hexagon,
  Target,
  Wrench,
  Trophy,
  Briefcase,
  Package,
  Radar,
  Hash,
  Link2,
  PenLine,
  FileText,
  Download,
  ExternalLink,
  LogOut,
  Check,
  Search,
  Eye,
  Users,
  BarChart3,
  Globe,
  MonitorSmartphone,
  ArrowUpRight,
  Gauge,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

// Central registry so the schema can reference icons by name (no emoji).
export const ICONS: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard,
  profile: Hexagon,
  target: Target,
  wrench: Wrench,
  trophy: Trophy,
  briefcase: Briefcase,
  package: Package,
  radar: Radar,
  hash: Hash,
  link: Link2,
  pen: PenLine,
  file: FileText,
  download: Download,
  external: ExternalLink,
  logout: LogOut,
  check: Check,
  search: Search,
  eye: Eye,
  users: Users,
  chart: BarChart3,
  globe: Globe,
  device: MonitorSmartphone,
  arrow: ArrowUpRight,
  gauge: Gauge,
  shield: ShieldCheck,
};

export function Icon({
  name,
  size = 16,
  className,
  strokeWidth = 1.75,
  style,
}: {
  name: string;
  size?: number;
  className?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
}) {
  const Cmp = ICONS[name] ?? Hexagon;
  return (
    <Cmp size={size} strokeWidth={strokeWidth} className={className} style={style} />
  );
}
