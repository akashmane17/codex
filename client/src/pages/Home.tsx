import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { generateId } from "../utils/utils";

const data = [
  {
    title: "Code with your team",
    text: "Open a Codeshare editor, write or copy code, then share it with friends and colleagues. Pair program and troubleshoot together.",
    button: "Hack Together",
  },
  {
    title: "Interview developers",
    text: "Set coding tasks and observe in real-time when interviewing remotely or in person. Nobody likes writing code on a whiteboard.",
    button: "Start An Interview",
  },
  {
    title: "Teach people to program",
    text: "Share your code with students and peers then educate them. Universities and colleges around the world use Codeshare every day.",
    button: "Teach Code",
  },
];

const Home = () => {
  const navigate = useNavigate();

  const handleEditRoute = () => {
    const id = generateId();
    navigate(`/${id}`);
  };

  return (
    <div>
      <Navbar />

      <div className="mx-auto font-extralight text-center mt-[150px]">
        <h1 className="text-6xl">Code Synergy at Your Fingertips.</h1>
        <h2 className="text-2xl mt-6">
          Your go-to tool for coding interviews, pair programming, and seamless
          knowledge sharing.
        </h2>
      </div>

      <div className="my-10 w-full flex items-center justify-center">
        <button
          onClick={handleEditRoute}
          className="bg-red-500 text-white  px-8 py-4 rounded-md hover:bg-red-400 transition-all duration-300"
        >
          Share code now
        </button>
      </div>

      <div className="w-full flex items-center justify-center my-40">
        <div className="flex gap-6">
          {data.map((elem) => (
            <div className="font-extralight max-w-[350px]">
              <h3 className="text-4xl mb-6">{elem.title}</h3>
              <p className="mb-5 text-lg">{elem.text}</p>
              <button className="text-white border border-white rounded-md px-4 py-2 hover:text-blue-600 hover:bg-white">
                {elem.button}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-700 h-52 flex items-center justify-center">
        <p className="my-10">
          Copyright © 2024 CodeX. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Home;
