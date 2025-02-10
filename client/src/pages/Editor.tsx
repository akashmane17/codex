import { Link, useParams } from "react-router-dom";
import CodeEditor from "../components/CodeEditor";
import { generateUsername } from "../utils/utils";

const Editor = () => {
  const { roomId } = useParams();
  const username = generateUsername();

  function handleCopyLink() {
    navigator.clipboard.writeText(`http://localhost:5173/${roomId}`);
  }

  return (
    <div>
      <div className="flex justify-between px-4 py-2 border-b border-gray-500 backdrop-blur-sm">
        <Link to="/" className=" flex gap-1 items-center">
          {/* <Braces className="text-blue-300" size={32} /> */}
          <div className="text-3xl font-medium">
            <span className="text-blue-300">{`\{ `}</span>
            Code<span className="text-blue-300">X</span>
            <span className="text-blue-300">{` \}`}</span>
          </div>
        </Link>

        <button
          onClick={handleCopyLink}
          className="bg-blue-300 text-blue-950 px-3 py-1 rounded-md hover:bg-blue-200 transition-all duration-300"
        >
          Share
        </button>
      </div>

      <CodeEditor roomId={roomId} username={username} />
    </div>
  );
};

export default Editor;
