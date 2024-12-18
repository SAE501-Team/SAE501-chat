import { useEffect, useState } from "react";
import io from "socket.io-client";
import PropTypes from "prop-types";
import "./Chat.css";

const socket = io.connect("http://localhost:3000");

// TODO: Faudra aussi faire quand on land sur la page de chat, ça crée un chat avec un id unique (room) avec les informations du ticket uqi a été rentrée par l'utilisateur à l'étape d'avant etc...
// TODO: Faudra faire que côté Admin, il puisse voir les rooms des utilisateurs et répondre à ces messages (donc interface différente de l'utilisateur)
// TODO: Faire une verification avec une requete sur le express pour qu'avant de chatter, l'utilisateur soit bien connecté, si il est pas connecté, requete API pour le connecter

const Chat = ({ formData }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    //! Marche pas (401 unauthorized) parce que le cookie n'est pas enregistré
    // TODO: il faut que je fasse que quand on se connecte avec presta, on enregistre le cookie dans le navigateur (jspcomment)

    fetch("http://localhost:3000/api/getuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error("Error:", error));

    if (formData.ticketId) {
      socket.emit("joinRoom", formData.ticketId);
      console.log("Room joined:", formData.ticketId);
    }

    // Listener pour les nouveaux messages
    socket.on("message", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      console.log("Message reçu :", newMessage);
    });

    return () => {
      socket.off("message");
    };
  }, [formData]);

  const sendMessage = () => {
    fetch("http://localhost:3000/api/getuser", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        } else {
          console.error("User not found");
        }
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
      });

    socket.emit("message", {
      // user,
      message,
    });
    setMessage("");
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
            {formData && ( // Affiche les informations du ticket
              <div className="chat-ticket">
                <p>
                  <strong>Category:</strong> {formData.category}
                </p>
                {formData.product && (
                  <p>
                    <strong>Product:</strong> {formData.product}
                  </p>
                )}
                <p>
                  <strong>Details:</strong> {formData.details}
                </p>
              </div>
            )}

            {messages.map((message, index) => (
              <p key={index}>{message}</p>
            ))}
          </div>
          <div className="chat-blank" />
        </div>

        <div className="chat-br">
          <input
            type="text"
            className="chat-in"
            placeholder="Type something..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage(e.target.value);
              }
            }}
          />
          <button className="chat-send" onClick={sendMessage}>
            <img src="chat-submit.svg" alt="Send" />
          </button>
        </div>
      </div>
    </div>
  );
};
Chat.propTypes = {
  formData: PropTypes.object.isRequired,
};

export default Chat;
