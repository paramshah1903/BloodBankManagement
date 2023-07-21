import React from "react";
import "./spinner.css";

function Spinner() {
  return (
    <div className="fixed inset-0 bg-black opacity-70 z-[9999] flex items-center justify-center">
      <div class="custom-loader"></div>
    </div>
  );
}

export default Spinner;
