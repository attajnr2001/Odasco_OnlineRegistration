// src/helpers/utils.js
import { useEffect, useState } from "react";
import { useCreatePublicLogItemMutation } from "../slices/logApiSlice";

export const useLocationIP = () => {
  const [locationIP, setLocationIP] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocationIP = async () => {
      try {
        const response = await fetch("https://api64.ipify.org?format=json");
        const data = await response.json();
        setLocationIP(data.ip);
      } catch (error) {
        console.error("Error fetching location IP:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLocationIP();
  }, []);

  return { locationIP, loading };
};

// Function to get the platform type
export const getPlatform = () => {
  const userAgent = navigator.userAgent;
  if (/Mobi|Android/i.test(userAgent)) {
    return "mobile";
  } else if (/Tablet|iPad/i.test(userAgent)) {
    return "tablet";
  } else {
    return "desktop";
  }
};

export const useCreateLog = () => {
  const [createPublicLogItem] = useCreatePublicLogItemMutation();

  const createLog = async (action, userId, locationIP) => {
    try {
      const logDetails = await createPublicLogItem({
        action,
        user: userId,
        locationIP: locationIP || "Unknown",
      }).unwrap();
      console.log("Log created:", logDetails);
      return logDetails;
    } catch (error) {
      console.error("Error creating log:", error);
    }
  };

  return createLog;
};
