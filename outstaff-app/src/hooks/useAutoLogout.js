import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const INACTIVITY_LIMIT = 5 * 60; // seconds
const WARNING_TIME = 30; // seconds

export default function useAutoLogout() {

  const navigate = useNavigate();

  const timer = useRef(null);
  const interval = useRef(null);

  const [remaining, setRemaining] = useState(INACTIVITY_LIMIT);
  const [showWarning, setShowWarning] = useState(false);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("permissions");
    navigate("/");
  };

  const resetTimer = () => {
    setRemaining(INACTIVITY_LIMIT);
    setShowWarning(false);
  };

  useEffect(() => {

    const events = ["mousemove","keydown","click","scroll"];

    const activity = () => {
      resetTimer();
    };

    events.forEach(e => window.addEventListener(e, activity));

    interval.current = setInterval(() => {

      setRemaining(prev => {

        if (prev <= 1) {
          logout();
          return 0;
        }

        if (prev <= WARNING_TIME) {
          setShowWarning(true);
        }

        return prev - 1;
      });

    },1000);

    return () => {
      clearInterval(interval.current);
      events.forEach(e => window.removeEventListener(e, activity));
    };

  },[]);

  return { remaining, showWarning, logout };
}