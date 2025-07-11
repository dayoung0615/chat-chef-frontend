import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Info from "./pages/Info";
function App() {
  // logic
  const [ingredientList, setIngredientList] = useState([]); // 사용자가 입력할 재료

  const handSendIngredinetList = (data) => {
    setIngredientList(data);
  };
  // view
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/info"
        element={<Info sendIngredinetList={handSendIngredinetList} />}
      />
      <Route path="/chat" element={<Chat ingredientList={ingredientList} />} />
    </Routes>
  );
}

export default App;
