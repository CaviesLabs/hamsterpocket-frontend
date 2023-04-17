import { FC } from "react";
import { LayoutSection } from "@/src/components/layout-section";
import PortfolioController from "@/src/components/portfolio/controller.component";
import TableComponent from "@/src/components/portfolio/table.component";
import DashboardComponent from "@/src/components/portfolio/dashboard.component";

export const PortfolioMobileLayout: FC = () => {
  return (
    <LayoutSection className="pb-[100px]">
      <DashboardComponent />
      <PortfolioController />
      <TableComponent />
    </LayoutSection>
  );
};
