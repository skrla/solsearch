import React from "react";

const RowTitle = ({ title }: { title: string }) => {
  return (
    <div className="text-base text-white p-4 border-b border-border w-[10%]">
      <h3>{title}</h3>
    </div>
  );
};

export default RowTitle;
