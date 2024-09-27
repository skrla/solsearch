import { title } from "process";
import React from "react";

export type TitleProps = {
  title: string;
};

function Title({ title }: TitleProps) {
  return (
    <div className="flex w-full justify-start items-center h-20 m-5">
      <h2 className="text-6xl bg-solanaLinearGradient text-transparent bg-clip-text">
        {title}
      </h2>
      <hr className="bg-solanaLinearGradient h-1 w-full ml-3" />
    </div>
  );
}

export default Title;
