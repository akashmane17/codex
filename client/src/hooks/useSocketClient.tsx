import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const useSocketClient = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketInstance = io("http://localhost:5001");
    setSocket(socketInstance);

    return () => {
      socketInstance.close();
    };
  }, []);

  return { socket };
};

export default useSocketClient;
