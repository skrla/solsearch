"use client";
import React, { useState } from "react";
import ReactPaginate from "react-paginate";

const TransactionTable = ({ data }: any) => {
  const [currentPage, setCurrentPage] = useState(0);

  const offset = currentPage * 10;
  const currentData = data.slice(offset, offset + 10);
  const pageCount = Math.ceil(data.length / 10);

  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Signature</th>
            <th>Time</th>
            <th>Instructions</th>
            <th>Made by</th>
            <th>Transaction value (SOL)</th>
            <th>Fee (SOL)</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((item: any, index: number) => (
            <tr key={index}>
              <td>{item.column1}</td>
              <td>{item.column2}</td>
              <td>{item.column3}</td>
              <td>{item.column4}</td>
              <td>{item.column5}</td>
            </tr>
          ))}
        </tbody>
      </table>{" "}
      <div>
        <ReactPaginate
          previousLabel={"← Previous"}
          nextLabel={"Next →"}
          pageCount={pageCount}
          onPageChange={handlePageClick}
          containerClassName=""
          previousLinkClassName=""
          nextLinkClassName=""
          disabledClassName=""
          activeClassName=""
        />
      </div>
    </div>
  );
};

export default TransactionTable;
