import { Quantum } from "ldrs/react";
import "ldrs/react/Quantum.css";

function Loader() {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black/60 z-[9999]">
      <Quantum size={60} speed={1.75} color="white" />
    </div>
  );
}

export default Loader;
