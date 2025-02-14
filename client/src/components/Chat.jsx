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
    const fetchMessages = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/getMessages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ticketId: formData.ticketId }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Messages:", data);
          setMessages(data);
        } else {
          console.error("Failed to fetch messages");
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

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

    fetchMessages();
    fetchUserData();
    createRoomTicket();
  }, [formData]);

  // Fonction pour envoyer un message
  const sendMessage = async () => {
    if (message.trim()) {
      const newMessage = {
        ticketId: formData.ticketId,
        userId: userData.id,
        content: message,
        date: new Date().toISOString(),
        username: userData.username, // Ajoutez le nom d'utilisateur ici
      };

      try {
        // Envoie du message au serveur pour le sauvegarder
        await fetch("http://localhost:3000/api/saveMessage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newMessage),
        });

        // Ajoutez immédiatement le message à l'état local pour un affichage instantané
        setMessages((prevMessages) => [...prevMessages, newMessage]);

        // Émettre le message via Socket.io
        socket.emit("message", {
          message: newMessage.content,
          user: userData,
          date: newMessage.date,
        });

        setMessage(""); // Réinitialiser le champ du message
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  return (
    <div className="chat-w">
      <div className="chat-goat">
        <img src="/goat1.png" alt="" />
        <div className="goat2">
          <img src="/goat1-2.png" alt="" />
        </div>
      </div>

      <div className="chat-show">
        <div className="chat-area">
          {!userData && (
            <div className="error-message">
              Erreur: Veuillez vous reconnecter à votre compte PrestaShop.
            </div>
          )}
          <button
            className="close-ticket-btn"
            style={{
              position: "absolute",
              bottom: 65,
              left: 20,
              zIndex: 9999,
            }}
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
                      body: JSON.stringify({
                        ticketId: formData.ticketId,
                      }),
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
                      <strong>Utilisateur:</strong> {userData.email} (
                      {userData.role})
                    </p>
                  )}
                  <strong>Catégorie:</strong> {formData.category}
                </p>
                {formData.product && (
                  <p>
                    <strong>Produit:</strong> {formData.product}
                  </p>
                )}
                <p>
                  <strong>Problème:</strong> {formData.details}
                </p>
              </div>
            )}
            {/* Affichage des messages */}
            <div className="chat-messages">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message ${
                    msg.username === userData?.username
                      ? "message-sent"
                      : "message-received"
                  }`}
                  style={{
                    textAlign:
                      msg.username === userData?.username ? "right" : "left",
                    backgroundColor:
                      msg.username === userData?.username
                        ? "#f0f0f0"
                        : "#d1ffe0",
                    borderRadius: "10px",
                    padding: "5px 10px",
                    margin: "5px 0 10px 0",
                    marginLeft:
                      msg.username === userData?.username ? "0" : "auto",
                    maxWidth: "80%",
                    alignSelf:
                      msg.username === userData?.username
                        ? "flex-end"
                        : "flex-start",
                  }}
                >
                  <p>
                    <strong>
                      {msg?.username || msg.user?.username || "Unknown"}:
                    </strong>{" "}
                    {msg.content}
                  </p>
                  <p style={{ fontSize: "0.8em", color: "gray" }}>
                    {msg?.timestamp ||
                      new Date(msg.date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                  </p>
                </div>
              ))}
            </div>
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
