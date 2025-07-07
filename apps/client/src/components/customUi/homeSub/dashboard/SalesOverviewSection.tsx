import { Card, CardContent } from "@client/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@client/components/ui/select"

export const SalesOverviewSection = () => {
  // Data for the x-axis labels (thousands)
  const xAxisLabels = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];

  // Data for the y-axis labels (percentages)
  const yAxisLabels = [20, 40, 60, 80, 100];

  return (
    <div className="w-full h-[444px] my-8">
      <Card className="w-full h-full relative">
        <CardContent className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-bold text-2xl text-[#202224] leading-5">
              Users
            </h2>

            <Select defaultValue="October">
              <SelectTrigger className="w-[104px] h-7 bg-[#fcfcfc] text-xs font-semibold text-[#2b303466] border-neutral-300">
                <SelectValue placeholder="October" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="October">October</SelectItem>
                <SelectItem value="November">November</SelectItem>
                <SelectItem value="December">December</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="relative w-full h-[278px]">
            {/* Chart area */}
            <div className="absolute left-[75px] right-0 top-0 bottom-[40px]">
              {/* Tooltip */}
              <div className="absolute w-20 h-7 bg-blue-500 rounded-md text-white px-2.5 py-0.5 left-[240px] top-[11px] z-10">
                <span className="font-bold text-xs">64,3664.77</span>
              </div>

              {/* Chart placeholder - in a real implementation, this would be a proper chart component */}
              <div className="w-full h-full relative">
                {/* Blue line graph with area */}
                <div
                  className="absolute inset-0 bg-gradient-to-b from-blue-100/50 to-transparent rounded-md"
                  style={{
                    clipPath:
                      "polygon(0 80%, 5% 75%, 10% 50%, 15% 45%, 20% 55%, 25% 40%, 30% 35%, 35% 20%, 40% 50%, 45% 45%, 50% 40%, 55% 35%, 60% 40%, 65% 30%, 70% 45%, 75% 40%, 80% 35%, 85% 45%, 90% 40%, 95% 45%, 100% 50%, 100% 100%, 0 100%)",
                  }}
                ></div>

                {/* Line with data points */}
                <svg
                  className="absolute inset-0 w-full h-full"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 80% L5% 75% L10% 50% L15% 45% L20% 55% L25% 40% L30% 35% L35% 20% L40% 50% L45% 45% L50% 40% L55% 35% L60% 40% L65% 30% L70% 45% L75% 40% L80% 35% L85% 45% L90% 40% L95% 45% L100% 50%"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                  />

                  {/* Data points */}
                  <circle cx="0%" cy="80%" r="3" fill="#3b82f6" />
                  <circle cx="5%" cy="75%" r="3" fill="#3b82f6" />
                  <circle cx="10%" cy="50%" r="3" fill="#3b82f6" />
                  <circle cx="15%" cy="45%" r="3" fill="#3b82f6" />
                  <circle cx="20%" cy="55%" r="3" fill="#3b82f6" />
                  <circle cx="25%" cy="40%" r="3" fill="#3b82f6" />
                  <circle cx="30%" cy="35%" r="3" fill="#3b82f6" />
                  <circle cx="35%" cy="20%" r="3" fill="#3b82f6" />
                  <circle cx="40%" cy="50%" r="3" fill="#3b82f6" />
                  <circle cx="45%" cy="45%" r="3" fill="#3b82f6" />
                  <circle cx="50%" cy="40%" r="3" fill="#3b82f6" />
                  <circle cx="55%" cy="35%" r="3" fill="#3b82f6" />
                  <circle cx="60%" cy="40%" r="3" fill="#3b82f6" />
                  <circle cx="65%" cy="30%" r="3" fill="#3b82f6" />
                  <circle cx="70%" cy="45%" r="3" fill="#3b82f6" />
                  <circle cx="75%" cy="40%" r="3" fill="#3b82f6" />
                  <circle cx="80%" cy="35%" r="3" fill="#3b82f6" />
                  <circle cx="85%" cy="45%" r="3" fill="#3b82f6" />
                  <circle cx="90%" cy="40%" r="3" fill="#3b82f6" />
                  <circle cx="95%" cy="45%" r="3" fill="#3b82f6" />
                  <circle cx="100%" cy="50%" r="3" fill="#3b82f6" />

                  {/* Highlighted point */}
                  <circle
                    cx="35%"
                    cy="20%"
                    r="4"
                    fill="#3b82f6"
                    stroke="white"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>

            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-[40px] flex flex-col justify-between">
              {yAxisLabels.map((label, index) => (
                <div
                  key={index}
                  className="font-semibold text-xs text-[#2b303466] leading-[9px]"
                >
                  {label}%
                </div>
              ))}
            </div>

            {/* X-axis labels */}
            <div className="absolute left-[75px] right-0 bottom-0 flex justify-between">
              {xAxisLabels.map((label, index) => (
                <div
                  key={index}
                  className="font-semibold text-xs text-[#2b303466] text-center leading-[9px]"
                >
                  {label}k
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesOverviewSection;