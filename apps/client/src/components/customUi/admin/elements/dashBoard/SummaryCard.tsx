import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@client/components/ui/card';

interface SummaryCardProps {
  title: string;
  icon: React.ReactNode;
  mainMetric: string;
  mainLabel: string;
  subMetric?: string;
  subLabel?: string;
}

function SummaryCard({
  title,
  icon,
  mainMetric,
  mainLabel,
  subMetric,
  subLabel,
}: SummaryCardProps) {
  return (
    <Card className="rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 hover:-translate-y-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <div className="text-2xl font-bold">{mainMetric}</div>
            <p className="text-xs text-muted-foreground">{mainLabel}</p>
          </div>
          {subMetric && subLabel && (
            <div>
              <div className="text-lg font-semibold">{subMetric}</div>
              <p className="text-xs text-muted-foreground">{subLabel}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default SummaryCard;
