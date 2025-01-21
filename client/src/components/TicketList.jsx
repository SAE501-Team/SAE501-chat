// TicketList.js
import React from "react";
import PropTypes from "prop-types";

const TicketList = ({ tickets, onJoinTicket, title, filterCondition }) => {
  return (
    <>
      <h2>{title}</h2>
      <ul className="tickets-list">
        {tickets.length > 0 ? (
          tickets.filter(filterCondition).map((ticket) => (
            <li
              key={ticket.ticketId}
              className="ticket-item"
              onClick={() => onJoinTicket(ticket.ticketId)}
              style={{ cursor: "pointer" }}
            >
              {ticket.userId && (
                <div>
                  <strong>User ID:</strong> {ticket.userId} <br />
                </div>
              )}
              {ticket.category && (
                <div>
                  <strong>Catégorie:</strong> {ticket.category} <br />
                </div>
              )}
              {ticket.product && (
                <div>
                  <strong>Produit:</strong> {ticket.product} <br />
                </div>
              )}
              {ticket.details && (
                <div>
                  <strong>Détails:</strong>{" "}
                  {ticket.details.length > 10
                    ? `${ticket.details.substring(0, 10)}...`
                    : ticket.details}{" "}
                  <br />
                </div>
              )}
              {ticket.isClosed ? "Fermé" : "Ouvert"}
            </li>
          ))
        ) : (
          <p>Aucun ticket disponible</p>
        )}
      </ul>
    </>
  );
};
TicketList.propTypes = {
  tickets: PropTypes.arrayOf(
    PropTypes.shape({
      ticketId: PropTypes.string.isRequired,
      userId: PropTypes.string,
      category: PropTypes.string,
      product: PropTypes.string,
      details: PropTypes.string,
    })
  ).isRequired,
  onJoinTicket: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  filterCondition: PropTypes.func.isRequired,
};

export default TicketList;
