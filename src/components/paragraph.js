import React from "react";

const Paragraph = ({ style, children }) => {
  return (
    <h4 className='mt-5 h4' style={style}>
      {children}
    </h4>
  );
};

export default Paragraph;
