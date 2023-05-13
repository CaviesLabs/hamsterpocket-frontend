import { FC } from "react";
import { LayoutSection } from "@/src/components/layout-section";
import HistoryController from "@/src/components/history/controller.component";
import TableComponent from "@/src/components/history/table.component";

export const HistoryDesktopLayout: FC = () => {
  return (
    <LayoutSection className="!pt-[130px] pb-[100px]">
      <p className="md:text-[32px] text-[20px] text-white mt-[22px]">History</p>
      <HistoryController />
      <TableComponent />
    </LayoutSection>
  );
};
