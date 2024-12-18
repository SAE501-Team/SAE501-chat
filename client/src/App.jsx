import "./App.css";
import Chat from "../../client/src/components/Chat";
import Form from "./components/Form";
import Banner from "./components/Banner";

import { useState } from "react";

function App() {
  const [isChatEnabled, setIsChatEnabled] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [formData, setFormData] = useState(null);

  const handleSubmit = (data) => {
    console.log(data);
    setFormData(data);
    setIsFormSubmitted(true);
    setIsChatEnabled(true);
  };

  return (
    <>
      {/* static */}
      <Banner />

      {/* dynamic */}
      {!isFormSubmitted && <Form onSubmit={handleSubmit} />}
      {isChatEnabled && <Chat formData={formData} />}
    </>
  );
}

export default App;
