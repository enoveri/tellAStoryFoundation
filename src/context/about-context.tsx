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
  update: (data: AboutData) => Promise<void>;
  reset: () => Promise<void>;
  isLoading: boolean;
  saveError: string | null;
};

const AboutContext = createContext<AboutContextType>({
  data: defaultAboutData,
  update: async () => {},
  reset: async () => {},
  isLoading: true,
  saveError: null,
});

export function AboutProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AboutData>(defaultAboutData);
  const [isLoading, setIsLoading] = useState(true);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const hydrate = async () => {
      const next = await loadAboutData();

      if (!mounted) return;
      setData(next);
      setIsLoading(false);
    };

    void hydrate();

    return () => {
      mounted = false;
    };
  }, []);

  const update = async (newData: AboutData) => {
    setSaveError(null);
    setData(newData);

    try {
      await saveAboutData(newData);
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : "Failed to save About content",
      );
      throw error;
    }
  };

  const reset = async () => {
    setData(defaultAboutData);
    await saveAboutData(defaultAboutData);
  };

  return (
    <AboutContext.Provider value={{ data, update, reset, isLoading, saveError }}>
      {children}
    </AboutContext.Provider>
  );
}

export function useAbout() {
  return useContext(AboutContext);
}
