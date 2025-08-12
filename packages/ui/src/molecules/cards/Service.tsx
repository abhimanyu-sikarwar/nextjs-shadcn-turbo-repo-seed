import { LucideIcon } from "lucide-react";
import { ServiceCard } from "./ServiceCard.tsx";

export interface ServiceInterface {
  icon: LucideIcon;
  name: string;
  description: string;
  href: string;
  color: string;
  actionText: string;
  lastElection?: string;
  constituencyCount?: number;
}

export interface ServiceProps {
  title: string;
  services: ServiceInterface[];
}

export function Service(props: ServiceProps) {
  return (
    <>
      <h2 className="text-xl font-semibold mb-3">{props.title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {props.services.map((service) => (
          <a key={service.name} href={service.href} className="block h-full">
            <ServiceCard service={service} />
          </a>
        ))}
      </div>
    </>
  );
}
