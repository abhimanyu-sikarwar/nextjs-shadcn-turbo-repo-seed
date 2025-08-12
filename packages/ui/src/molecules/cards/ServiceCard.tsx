import { Badge } from "@workspace/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui";
import { Grid } from "@workspace/ui";
import { ArrowRight, Calendar, LucideIcon } from "lucide-react";
import { ServiceInterface } from "./Service.tsx";

export interface ServiceCardProps {
  service: ServiceInterface;
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Card className="h-full relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <service.icon className={`w-6 h-6 ${service.color}`} />
          <CardTitle className="text-lg flex items-center justify-between w-full">
            <span>{service.name}</span>
            {service.constituencyCount && (
              <Badge variant="outline" className="text-sm">
                {service.constituencyCount} Constituencies
              </Badge>
            )}
          </CardTitle>
        </div>
        {service.lastElection ? (
          <CardDescription>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Last Election: {service.lastElection}</span>
            </div>
          </CardDescription>
        ) : (
          <CardDescription>{service.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex items-end">
        <div className="flex items-center text-sm text-muted-foreground group">
          {/* {
                    service.lastElection 
                        ? <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>Last Election: {service.lastElection}</span>
                        </div>
                        & 
                } */}
          <span className="group-hover:underline">{service.actionText}</span>
          <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
        </div>
      </CardContent>
      <Grid size={20} />
    </Card>
  );
}
