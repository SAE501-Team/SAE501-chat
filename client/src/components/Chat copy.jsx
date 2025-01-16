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
          setMessages(data); // Charge les messages dans l'état
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
  const sendMessage = async () => {
    if (message.trim()) {
      const newMessage = {
        ticketId: formData.ticketId,
        userId: userData.id,
        content: message,
        date: new Date().toISOString(),
      };

      try {
        await fetch("http://localhost:3000/api/saveMessage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newMessage),
        });

        socket.emit("message", {
          message: newMessage.content,
          user: userData,
          date: newMessage.date,
        });

        setMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  switch (userData?.role) {
    case "client":
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
              {!userData && (
                <div
                  style={{
                    color: "white",
                    textAlign: "center",
                    marginBottom: "10px",
                    marginTop: "20px",
                    fontWeight: "bold",
                  }}
                >
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
                    {console.log("msg", msg)}
                    <p className="message-text">
                      <strong>
                        {msg?.username || msg.user?.username || "Unknown"}:
                      </strong>{" "}
                      {msg?.content || msg?.message}
                    </p>
                    <p>
                      {msg.timestamp ||
                        new Date(msg?.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                    </p>
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
    case "helper":
      console.log("TATATATATATATATTA");

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
                {/* Affichage des messages */}
                <h2>Helper Chat 🛠️</h2>

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
                    {console.log("msg", msg)}
                    <p className="message-text">
                      <strong>
                        {msg?.username || msg.user?.username || "Unknown"}:
                      </strong>{" "}
                      {msg?.content || msg?.message}
                    </p>
                    <p>
                      {msg.timestamp ||
                        new Date(msg?.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                    </p>
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
    default:
      console.log("Chat.jsx default switch case here");

      return (
        <div>Erreur: Veuillez vous reconnecter à votre compte PrestaShop.</div>
      );
  }
};

Chat.propTypes = {
  formData: PropTypes.object.isRequired,
};

export default Chat;
