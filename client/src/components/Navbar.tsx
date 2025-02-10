import { Braces } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="px-4 py-4 border-b border-gray-500 backdrop-blur-sm">
      <Link to="/" className=" flex gap-1 items-center w-fit">
        {/* <Braces className="text-blue-300" size={32} /> */}
        <div className="text-3xl font-medium">
          <span className="text-blue-300">{`\{ `}</span>
          Code<span className="text-blue-300">X</span>
          <span className="text-blue-300">{` \}`}</span>
        </div>
      </Link>
    </div>
  );
};

export default Navbar;
