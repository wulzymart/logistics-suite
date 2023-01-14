import React, { createContext, useContext, useState } from "react";

const NewWaybillContext = createContext();
export const NewWaybillProvider = ({ children }) => {
  const [newCustomer, setNewCustomer] = useState("Yes");

  return (
    <NewWaybillContext.Provider value={{ newCustomer, setNewCustomer }}>
      {children}
    </NewWaybillContext.Provider>
  );
};
export const useNewWaybillContext = () => useContext(NewWaybillContext);
