import { useEffect, useState } from "react";
import Chat from "../../client/src/components/Chat";
import Form from "./components/Form";
import Banner from "./components/Banner";

function App() {
  const [isChatEnabled, setIsChatEnabled] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ticketData, setTicketData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

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
          throw new Error(`Erreur API: ${response.status}`);
        }

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données utilisateur :",
          error
        );
        setErrorMessage("Impossible de charger les données utilisateur");
      }
    };

    const checkOpenTicket = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/checkopenticket",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(`Erreur API: ${response.status}`);
        }

        const data = await response.json();
        if (data.ticket) {
          setTicketData(data.ticket);
          setIsChatEnabled(true);
        }
      } catch (error) {
        console.error("Erreur lors de la vérification des tickets :", error);
        setErrorMessage("Impossible de charger les tickets");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    checkOpenTicket();
  }, []);

  const handleSubmit = (data) => {
    setFormData(data);
    setIsFormSubmitted(true);
    setIsChatEnabled(true);
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <>
      <Banner />
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {userData && userData.role === "helper" ? (
        <Chat formData={ticketData || { helperView: true }} />
      ) : (
        <>
          {ticketData ? (
            <Chat formData={ticketData} />
          ) : !isFormSubmitted ? (
            <Form onSubmit={handleSubmit} />
          ) : (
            <Chat formData={formData} />
          )}
        </>
      )}
    </>
  );
}

export default App;
