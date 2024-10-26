import { useEffect, useState } from "react";
import "../Chat.css";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3000");

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // TODO: Faudra faire que le chat soit relié à la base de donnée pour que les messages soient enregistrés
  // TODO: Faudra aussi faire quand on land sur la page de chat, ça crée un chat avec un id unique (room) avec les informations du ticket uqi a été rentrée par l'utilisateur à l'étape d'avant etc...
  // TODO: Faudra faire que côté Admin, il puisse voir les rooms des utilisateurs et répondre à ces messages (donc interface différente de l'utilisateur)

  useEffect(() => {
    // Listener pour les nouveaux messages
    socket.on("message", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Clean up on unmount
    return () => {
      socket.off("message");
    };
  }, []);

  const sendMessage = () => {
    socket.emit("message", message);
    setMessage(""); // Réinitialise le champ
  };

  return (
    <div className="chat-w">
      <div className="chat-goat">
        <img src="/goat1.png" alt="" />

        <div className="goat2">
          <img src="/goat2.png" alt="" />
        </div>
      </div>

      <div className="chat-show">
        <div className="chat-area">
          <div className="chat-text">
            {messages.map((msg, index) => (
              <p key={index}>{msg}</p>
            ))}
          </div>
        </div>

        <div className="chat-br">
          <input
            type="text"
            className="chat-in"
            placeholder="Type something..."
          />
          <button className="chat-send" onClick={sendMessage}>
            <img src="chat-submit.svg" alt="Send" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
