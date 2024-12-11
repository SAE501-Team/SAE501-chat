import "./App.css";
import Chat from "../../client/src/components/Chat";
import Form from "./components/Form";
import Banner from "./components/Banner";

import { useState } from "react";

function App() {
  const [isChatEnabled, setIsChatEnabled] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(true);

  return (
    <>
      {/* static */}
      <Banner />

      {/* dynamic */}
      {isFormSubmitted && <Form />}
      {isChatEnabled && <Chat />}
    </>
  );
}

export default App;
