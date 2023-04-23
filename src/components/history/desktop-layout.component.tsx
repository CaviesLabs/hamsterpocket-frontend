import { FC } from "react";
import { LayoutSection } from "@/src/components/layout-section";
import { BreadCrumb } from "@/src/components/bread-crumb";
import HistoryController from "@/src/components/history/controller.component";
import TableComponent from "@/src/components/history/table.component";

export const HistoryDesktopLayout: FC = () => {
  return (
    <LayoutSection className="pb-[100px]">
      <BreadCrumb data={["Home", "History"]} />
      <p className="md:text-[32px] text-[20px] text-white mt-[22px]">History</p>
      <HistoryController />
      <TableComponent />
    </LayoutSection>
  );
};
