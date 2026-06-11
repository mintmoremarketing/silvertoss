import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

// Backend authentication is disabled in static mode. The login form simply
// redirects to the dashboard so these imports are unused.

export function AdminLoginPage() {
  const navigate = useNavigate();
  // Use a relative path for the admin logo. In static mode the image lives
  // under the `public/assets/images` folder.
  const logoSrc = `/assets/images/logo.webp`;
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Without a backend there is nothing to authenticate against. Simply
    // redirect to the admin dashboard regardless of the entered credentials.
    navigate("/admin/dashboard", { replace: true });
  };

  return (
    <div className="admin-login-body">
      <main className="admin-login-card">
        <header className="admin-login-header">
          <img
            src={logoSrc}
            alt="Silvertoos Logo"
            className="admin-login-logo"
            onError={(event) => {
              const target = event.currentTarget;
              target.style.display = "none";
            }}
          />
          <h1>Admin Login</h1>
          <p>Sign in to manage Silvertoos dashboard</p>
        </header>
        <form className="admin-login-form" onSubmit={handleSubmit}>
          <label>
            <span>Email or Mobile</span>
            <input
              type="text"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              placeholder="admin@silvertoos.com"
              required
            />
          </label>
          <label>
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="********"
              required
            />
          </label>
          <button className="quote-btn" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Please wait..." : "Login"}
          </button>
          <p className="admin-login-message" aria-live="polite">
            {message}
          </p>
        </form>
        <footer className="admin-login-footer">
          <p>
            Forgot your password? <Link to="/admin/dashboard">Reset</Link>
          </p>
        </footer>
      </main>
    </div>
  );
}
