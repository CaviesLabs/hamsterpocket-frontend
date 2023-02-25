import { FC } from "react";

export const ErrorLabel: FC<{ message: string }> = ({ message }) => (
  <p className="text-red300 text-[14px] normal-text italic mt-[10px]">
    {message}
  </p>
);
