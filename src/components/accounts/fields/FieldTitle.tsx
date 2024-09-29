import React from "react";

const FieldTitle = ({ title }: { title: string }) => {
  return <h5 className="text-sm text-placeholder pb-2">{title}:</h5>;
};

export default FieldTitle;
