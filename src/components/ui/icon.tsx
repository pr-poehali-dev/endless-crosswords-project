
import { LucideIcon, LucideProps } from "lucide-react";
import * as Icons from "lucide-react";

interface IconProps extends LucideProps {
  name: string;
  fallback?: string;
  size?: number;
}

const Icon = ({ name, fallback, size = 24, ...props }: IconProps) => {
  // @ts-ignore - dynamic import from lucide-react
  const IconComponent = Icons[name] || (fallback && Icons[fallback]);

  if (!IconComponent) {
    return <span className="text-red-500 text-xs">Icon {name} not found</span>;
  }

  return <IconComponent size={size} {...props} />;
};

export default Icon;
