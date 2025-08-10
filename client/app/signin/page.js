"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "../lib/services/api.js";
import "./Signin.css";

function Signin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const router = useRouter();

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const response = await login(formData);

    if (response.error) {
      setMsg(response.error);
    } else if (response.token) {
      if (typeof window !== "undefined") {
        localStorage.setItem("token", response.token);
      }
      setMsg("Welcome back! Redirecting...");
      router.push("/dashboard");
    } else {
      setMsg("Login successful, but no token received.");
    }
  }

  return (
    <div className="signin-container">
      <form onSubmit={handleSubmit}>
        <h2 className="form-title">Sign In</h2>
        <input
          className="input"
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          className="input"
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button className="button" type="submit">
          Log In
        </button>
      </form>
      {msg && <p className="message">{msg}</p>}
      <p className="signup-link">
        Don't have an account? <Link href="/signup">Sign Up</Link>
      </p>
    </div>
  );
}

export default Signin;
