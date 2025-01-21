import { React, useEffect, useState } from "react";
import io from "socket.io-client";
import "./Chat.css";
import TicketList from "./TicketList";

const socket = io("http://localhost:3000", { reconnection: true });

const ChatHelper = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(
    localStorage.getItem("selectedTicket") || null
  );
  const [isTicketJoined, setIsTicketJoined] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/getrooms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok)
          throw new Error("Erreur lors de la récupération des tickets");
        const data = await response.json();
        setTickets(data);

        const storedTicket = localStorage.getItem("selectedTicket");
        if (storedTicket) {
          setSelectedTicket(storedTicket);
          setIsTicketJoined(true);
          socket.emit("joinTicket", storedTicket);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des tickets :", error);
      }
    };

    fetchTickets();
  }, []);

  const joinTicket = (ticketId) => {
    socket.emit("joinTicket", ticketId);
    setSelectedTicket(ticketId);
    setIsTicketJoined(true);
    localStorage.setItem("selectedTicket", ticketId);
  };

  const leaveRoom = () => {
    socket.emit("leaveTicket", selectedTicket);
    setSelectedTicket(null);
    setIsTicketJoined(false);
    localStorage.removeItem("selectedTicket");
  };

  const closeTicket = (ticketId) => {
    // Implement the logic to close the ticket
    const updatedTickets = tickets.map((ticket) =>
      ticket.ticketId === ticketId ? { ...ticket, isClosed: true } : ticket
    );
    setTickets(updatedTickets);
    if (selectedTicket === ticketId) {
      setIsTicketJoined(false);
      setSelectedTicket(null);
      localStorage.removeItem("selectedTicket");
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-w">
        <div className="chat-goat">
          <img src="/goat1.png" alt="" />
          <div className="goat2">
            <img src="/goat1-2.png" alt="" />
          </div>
        </div>

        <div className="chat-show">
          <div className="chat-area">
            <div className="chat-text">
              {!isTicketJoined ? (
                <>
                  <TicketList
                    tickets={tickets}
                    onJoinTicket={joinTicket}
                    title="Tickets à traiter 🛠️"
                    filterCondition={(ticket) => !ticket.isClosed}
                  />
                  <TicketList
                    tickets={tickets}
                    onJoinTicket={joinTicket}
                    title="Tickets fermés 🛠️"
                    filterCondition={(ticket) => ticket.isClosed}
                  />
                </>
              ) : (
                <>
                  {/* <h2>Ticket ID: {selectedTicket}</h2> */}
                  <button
                    onClick={leaveRoom}
                    className="leave-room-btn"
                    style={{ display: "absolute", top: 20, left: 20 }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      width="24px"
                      height="24px"
                    >
                      <path d="M0 0h24v24H0z" fill="none" />
                      <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                    </svg>
                  </button>
                  <div>
                    {tickets
                      .filter((ticket) => ticket.ticketId === selectedTicket)
                      .map((ticket) => (
                        <div key={ticket.ticketId}>
                          <div
                            style={{
                              display: "flex",
                              gap: 30,
                              justifyContent: "center",
                            }}
                          >
                            <div>
                              <p>
                                <strong>User ID:</strong> {ticket.userId}
                              </p>
                              <p>
                                <strong>Catégorie:</strong> {ticket.category}
                              </p>
                            </div>
                            <div>
                              {ticket.product && (
                                <p>
                                  <strong>Produit:</strong> {ticket.product}
                                </p>
                              )}
                              <p>
                                <strong>Détails:</strong>{" "}
                                {ticket.details.length > 10
                                  ? `${ticket.details.substring(0, 10)}...`
                                  : ticket.details}
                              </p>
                              <p>
                                <strong>Statut:</strong>{" "}
                                {ticket.isClosed ? "Fermé" : "Ouvert"}
                              </p>
                            </div>
                          </div>
                          {!ticket.isClosed && (
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
                                          ticketId: ticket.ticketId,
                                        }),
                                        credentials: "include",
                                      }
                                    );

                                    if (!response.ok) {
                                      throw new Error(
                                        "Failed to close the ticket"
                                      );
                                    } else {
                                      console.log("Ticket closed successfully");
                                      window.location.reload();
                                    }
                                  } catch (error) {
                                    console.error(
                                      "Error closing the ticket:",
                                      error
                                    );
                                  }
                                }
                              }}
                            >
                              Problème résolu
                            </button>
                          )}
                        </div>
                      ))}
                  </div>
                </>
              )}
            </div>
            <div className="chat-blank" />
          </div>

          <div className="chat-br">
            <input
              type="text"
              className="chat-in"
              placeholder="Type something..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  // TODO: Implémenter l'envoi de message
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHelper;
