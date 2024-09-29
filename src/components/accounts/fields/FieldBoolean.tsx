import React from "react";

const FieldBoolean = ({ boolean }: { boolean: boolean }) => {
  return boolean ? (
    <div className="border border-green-700 bg-green-700 bg-opacity-10 rounded-full">
      <p className="text-green-700 px-2">True</p>
    </div>
  ) : (
    <div className="border border-red-700 bg-red-700 bg-opacity-10 rounded-full">
      <p className="text-red-700 px-2">False</p>
    </div>
  );
};

export default FieldBoolean;
