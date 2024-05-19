import { useRouteError, Link } from "react-router-dom";
import "./ErrorPage.css";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div  >
      <div className="Error-page">
        <div className="error">
          <h1 className="error-title">Something went wrong! Page not Found!</h1>
          <p>
            <i className="error-text">{error.statusText || error.message}</i>
          </p>
          <Link to="/"><button className="home-button">HOME</button></Link>
        </div>
      </div>
    </div>

  );
}