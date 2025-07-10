import React from "react";

function Title({ mainTitle, subTitel }) {
  return (
    <div className="px-2 pt-6">
      <h1 className="text-4.5xl font-black text-white">{mainTitle}</h1>
      {/* subTitel값이 있는지 없는지 판단하는 용도 subTitel값이 있으면 맞는걸로 처리/없으면 값이 틀린걸로 처리하는 걸 이용하는 방식 */}
      {subTitel && (
        <span className="block text-sm mt-3 text-white break-keep pr-9">
          {subTitel}
        </span>
      )}
    </div>
  );
}

export default Title;
