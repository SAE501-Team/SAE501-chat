import { useEffect, useState } from "react";
import io from "socket.io-client";
import PropTypes from "prop-types";
import "./Chat.css";

const socket = io("http://localhost:3000", { reconnection: true });

const Chat = ({ formData }) => {
  const [userData, setUserData] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

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

    const createRoomTicket = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/createticket", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ticketId: formData.ticketId,
            category: formData.category,
            product: formData.product || "",
            details: formData.details,
          }),
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to create a room");
        } else {
          // Join socket room
          if (formData.ticketId) {
            socket.emit("joinRoom", formData.ticketId);
          }
        }
      } catch (error) {
        console.error("Error creating roomTicket:", error);
      }
    };

    fetchUserData();
    createRoomTicket();

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
        user: userData,
        date: new Date(),
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
          <button
            className="close-ticket-btn"
            style={{ position: "absolute", bottom: 65, left: 20, zIndex: 9999 }}
            onClick={async () => {
              const confirmed = window.confirm(
                "Es-tu sûr d'avoir résolu le problème ?"
              );
              if (confirmed) {
                try {
                  const response = await fetch(
                    "http://localhost:3000/api/closeticket",
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ ticketId: formData.ticketId }),
                      credentials: "include",
                    }
                  );

                  if (!response.ok) {
                    throw new Error("Failed to close the ticket");
                  } else {
                    console.log("Ticket closed successfully");
                    window.location.reload();
                  }
                } catch (error) {
                  console.error("Error closing the ticket:", error);
                }
              }
            }}
          >
            Problème résolu
          </button>
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
            {messages.map((msg, index) => (
              <div
                key={index}
                className={msg.local ? "message-sent" : "message-received"}
                style={{
                  textAlign: msg.local ? "right" : "left",
                  backgroundColor: msg.local ? "#d1ffe0" : "#f0f0f0",
                  borderRadius: "10px",
                  padding: "5px 10px",
                  margin: "5px 0",
                  maxWidth: "80%",
                  alignSelf: msg.local ? "flex-end" : "flex-start",
                }}
              >
                <p className="message-text">
                  <strong>{msg.user?.email || "Unknown"}:</strong> {msg.message}
                </p>
                <p>{msg.timestamp}</p>
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
