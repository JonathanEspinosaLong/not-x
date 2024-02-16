import React, { type PropsWithChildren } from "react";

const PageDisplay = (props: PageDisplayProps) => {
  return (
    <main className="flex h-screen justify-center ">
      <div className="h-max min-h-full w-full border-x border-slate-400  md:max-w-2xl">
        {props.children}
      </div>
    </main>
  );
};

type PageDisplayProps = PropsWithChildren;

export default PageDisplay;
