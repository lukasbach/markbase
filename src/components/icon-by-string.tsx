import React, { FC } from "react";
import { allIcons } from "./all-icons";

export const IconByString: FC<{ iconKey: string }> = ({ iconKey }) => {
  return allIcons[iconKey] ? React.createElement(allIcons[iconKey]) : null;
};
