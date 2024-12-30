import { useEffect, useState } from "react";
import io from "socket.io-client";
import PropTypes from "prop-types";
import "./Chat.css";

const socket = io.connect("http://localhost:3000");

const Chat = ({ formData }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/getuser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUserData(data);
        console.log("User Data:", data);

        // Affichage dans la console ou un alert pour le rôle de l'utilisateur
        console.log(`User role is: ${data.role} (react console)`);

      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();

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

  // Fonction pour envoyer un message
  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("message", {
        message,
        user: userData, // Ajouter les données de l'utilisateur avec le message
      });
      setMessage("");
    }
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

                  
                  {userData && (
                    <p>
                      <strong>User:</strong> {userData.email} ({userData.role})
                    </p>
                  )}


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

            {/* Affichage des messages */}
            {messages.map((message, index) => (
              <div key={index}>
                <p>{message}</p>
              </div>
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
                sendMessage();
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
