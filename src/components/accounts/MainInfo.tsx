import React from "react";

type MainInfoProps = {
  img?: string;
};

const MainInfo = ({ img}: MainInfoProps) => {
  return (
    <div className="w-[30%] m-5 bg-dark rounded-l-lg border-b-4 border-purple">
      {img ?  <img src={img} alt="" className="w-full p-4 h-full" /> : null}
    </div>
  );
};

export default MainInfo;
