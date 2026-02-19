"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  type AboutData,
  defaultAboutData,
  loadAboutData,
  saveAboutData,
} from "@/lib/about-store";

type AboutContextType = {
  data: AboutData;
  update: (data: AboutData) => void;
  reset: () => void;
};

const AboutContext = createContext<AboutContextType>({
  data: defaultAboutData,
  update: () => {},
  reset: () => {},
});

export function AboutProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AboutData>(defaultAboutData);

  // Hydrate from localStorage on mount (client only)
  useEffect(() => {
    setData(loadAboutData());
  }, []);

  const update = (newData: AboutData) => {
    setData(newData);
    saveAboutData(newData);
  };

  const reset = () => {
    setData(defaultAboutData);
    saveAboutData(defaultAboutData);
  };

  return (
    <AboutContext.Provider value={{ data, update, reset }}>
      {children}
    </AboutContext.Provider>
  );
}

export function useAbout() {
  return useContext(AboutContext);
}
