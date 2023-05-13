import { FC } from "react";
import { LayoutSection } from "@/src/components/layout-section";
import HistoryController from "@/src/components/history/controller.component";
import TableComponent from "@/src/components/history/table.component";

export const HistoryMobileLayout: FC = () => {
  return (
    <LayoutSection className="pb-[100px]">
      <p className="md:text-[32px] text-[20px] text-white">History</p>
      <HistoryController />
      <TableComponent />
    </LayoutSection>
  );
};
