import { FC } from "react";
import { LayoutSection } from "@/src/components/layout-section";
import { BreadCrumb } from "@/src/components/bread-crumb";
import PortfolioController from "@/src/components/portfolio/controller.component";
import TableComponent from "@/src/components/portfolio/table.component";
import DashboardComponent from "@/src/components/portfolio/dashboard.component";

export const PortfolioDesktopLayout: FC = () => {
  return (
    <LayoutSection className="pb-[100px]">
      <BreadCrumb data={["Home", "Portfolio"]} />
      <p className="md:text-[32px] text-[20px] text-white mt-[22px]">
        Portfolio
      </p>
      <DashboardComponent />
      <PortfolioController />
      <TableComponent />
    </LayoutSection>
  );
};
