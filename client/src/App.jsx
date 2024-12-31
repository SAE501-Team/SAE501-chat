import { useEffect, useState } from "react";
import Chat from "../../client/src/components/Chat";
import Form from "./components/Form";
import Banner from "./components/Banner";

function App() {
  const [isChatEnabled, setIsChatEnabled] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true); // Ajout d'un état pour le chargement initial
  const [ticketData, setTicketData] = useState(null);

  useEffect(() => {
    // Fonction pour vérifier si l'utilisateur a un ticket ouvert
    const checkOpenTicket = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/checkOpenTicket", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (data.ticket) {
            setTicketData(data.ticket); // Stocke les données du ticket
            setIsChatEnabled(true);
          }
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du ticket:", error);
      } finally {
        setLoading(false);
      }
    };

    checkOpenTicket(); // Appel de la fonction au lancement de l'app
  }, []);

  const handleSubmit = (data) => {
    console.log(data);
    setFormData(data);
    setIsFormSubmitted(true);
    setIsChatEnabled(true);
  };

  if (loading) {
    return <div>Chargement...</div>; // Affiche un message de chargement si l'état est en cours
  }

  return (
    <>
      {/* static */}
      <Banner />

      {/* dynamic */}
      {ticketData ? (
        <Chat formData={ticketData} /> // Redirige directement vers le chat si un ticket est ouvert
      ) : !isFormSubmitted ? (
        <Form onSubmit={handleSubmit} />
      ) : (
        <Chat formData={formData} />
      )}
    </>
  );
}

export default App;
