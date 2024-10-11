import React from "react";

const TransactionDataLoader = () => {
  return (
    <tbody>
      {[...Array(10)].map((_, index) => (
        <tr key={index} className="animate-pulse">
          <td className="p-4 whitespace-nowrap w-full">
            <div className="h-4 bg-placeholder rounded-md"></div>
          </td>
          <td className="p-4 whitespace-nowrap w-full ">
            <div className="h-4 bg-placeholder rounded-md"></div>
          </td>
          <td className="p-4 whitespace-nowrap w-full">
            <div className="h-4 bg-placeholder  rounded-md"></div>
          </td>
          <td className="p-4 whitespace-nowrap w-full rounded-md">
            <div className="h-4 bg-placeholder  rounded-md"></div>
          </td>
          <td className="p-4 whitespace-nowrap w-full">
            <div className="h-4 bg-placeholder  rounded-md"></div>
          </td>
          <td className="p-4 whitespace-nowrap w-full relative">
            <div className="h-4 bg-placeholder rounded-md"></div>
          </td>
        </tr>
      ))}
    </tbody>
  );
};

export default TransactionDataLoader;
