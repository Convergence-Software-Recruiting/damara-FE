import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DamaraLogo from "../../assets/Damara_splash.png";

export default function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 3500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div data-page="스플래시">
      <p>스플래시</p>
    </div>
  );
}