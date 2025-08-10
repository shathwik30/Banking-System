"use client";
import Link from "next/link";
import "./Home.css";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function Home() {
  const router = useRouter();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (token) router.push("/dashboard");
  }, [token, router]);

  return (
    <div className="home-container">
      <h1 className="title">Welcome to the Banking System</h1>
      <div className="button-container">
        <Link href="/signin" className="button">
          Sign In
        </Link>
        <Link href="/signup" className="button">
          Sign Up
        </Link>
      </div>
    </div>
  );
}

export default Home;
