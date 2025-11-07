"use client";
import {createContext, useContext} from "react";

const LanguageContext = createContext(null);

export function LanguageProvider({value, children}) {
    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguageContext() {
    return useContext(LanguageContext);
}
