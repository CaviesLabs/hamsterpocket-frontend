import { FC } from "react";
import { LayoutSection } from "@/src/components/layout-section";
import PortfolioController from "@/src/components/portfolio/controller.component";
import TableComponent from "@/src/components/portfolio/table.component";
import DashboardComponentMobile from "@/src/components/portfolio/dashboard.component";

export const PortfolioDesktopLayout: FC = () => {
  return (
    <LayoutSection className="!pt-[130px] pb-[100px]">
      <p className="md:text-[32px] text-[20px] text-white mt-[22px] mt-20">
        Portfolio
      </p>
      <DashboardComponentMobile />
      <PortfolioController />
      <TableComponent />
    </LayoutSection>
  );
};
