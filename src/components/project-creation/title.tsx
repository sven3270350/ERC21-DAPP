import React from "react";
import classNames from "classnames";
type Props = {
  text: String;
  para?: boolean;
};

const Title = ({ text, para }: Props) => {
  return (
    <h1
      className={classNames(
        { "font-medium text-sm leading-5 text-[#71717A]": para },
        { "font-bold text-white text-xl leading-8": !para }
      )}
    >
      {text}
    </h1>
  );
};

export { Title };
