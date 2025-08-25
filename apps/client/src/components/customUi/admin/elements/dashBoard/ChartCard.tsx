import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@client/components/ui/card';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  filter?: React.ReactNode;
}

function ChartCard({ title, children, filter }: ChartCardProps) {
  return (
    <Card className="rounded-lg shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        {filter}
      </CardHeader>
      <CardContent>
        <div className="h-80">{children}</div>
      </CardContent>
    </Card>
  );
}

export default ChartCard;
