import { FC, MouseEvent } from "react";
import { Modal } from "antd";
import { Button } from "@hamsterbox/ui-kit";

export const SuccessTransactionModal: FC<{
  isModalOpen: boolean;
  handleOk(e?: MouseEvent<HTMLElement>): void;
  handleCancel(e?: MouseEvent<HTMLElement>): void;
  isLoading?: boolean;
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
          <p className="mb-6 text-lg text-center text-white">
            You have created pocket and deposited successful
          </p>
          <Button
            shape="primary"
            size="large"
            onClick={() => props.handleOk()}
            text="Back to Home"
            className="mb-3"
            theme={{
              backgroundColor: "#B998FB",
              color: "#FFFFFF",
            }}
          />
        </div>
      </div>
    </Modal>
  );
};
