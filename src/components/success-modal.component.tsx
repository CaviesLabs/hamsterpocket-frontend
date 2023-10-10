import { FC, MouseEvent, ReactNode } from "react";
import { Modal } from "antd";
import { Button } from "@hamsterbox/ui-kit";

export const SuccessTransactionModal: FC<{
  okMessage: string;
  message: ReactNode;
  isLoading?: boolean;
  isModalOpen: boolean;
  handleOk(e?: MouseEvent<HTMLElement>): void;
  handleCancel(e?: MouseEvent<HTMLElement>): void;
}> = (props) => {
  return (
    <Modal
      open={props.isModalOpen}
      onOk={props.handleOk}
      onCancel={props.handleCancel}
      width={600}
      footer={null}
      className="hamster-modal"
    >
      <div className="py-6">
        <div className="mx-auto max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 flex flex-col justify-center">
          <img
            src="/assets/images/success-icon.png"
            alt="Swap item Success"
            className="mx-auto"
          />

          <h2 className="mt-4 mb-2 font-bold text-white text-2xl text-center">
            Success!
          </h2>
          <p className="mb-6 text-lg text-center text-white">{props.message}</p>
          <Button
            shape="primary"
            size="large"
            onClick={() => props.handleOk()}
            text={props.okMessage}
            className="mb-3"
            theme={{
              backgroundColor: "#735CF7",
              color: "#FFFFFF",
            }}
          />
        </div>
      </div>
    </Modal>
  );
};
