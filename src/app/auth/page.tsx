"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await login(username, password);

      if (!result.success) {
        setError(result.error || "Login failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-forest relative overflow-hidden">
      <div className="bg-moss p-8 rounded-2xl shadow-2xl w-full max-w-md border border-jade/30 relative z-10 animate-fadeIn">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4 animate-float">🍃</div>
          <h1 className="text-4xl font-bold text-white mb-2">Infinite Leaf</h1>
          <p className="text-gray-400">Admin Portal</p>
          <div className="h-1 w-20 bg-linear-to-r from-transparent via-emerald to-transparent mx-auto mt-4"></div>
        </div>

        <div className="space-y-6">
          {error && (
            <div className="bg-red-900/30 border border-red-700/50 text-red-300 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSubmit(e)}
              className="w-full px-4 py-3 bg-dark-forest border border-jade/50 rounded-lg 
                                     focus:ring-2 focus:ring-emerald focus:border-transparent 
                                     outline-none transition text-white placeholder-gray-500"
              placeholder="Enter your username"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSubmit(e)}
              className="w-full px-4 py-3 bg-dark-forest border border-jade/50 rounded-lg 
                                     focus:ring-2 focus:ring-emerald focus:border-transparent 
                                     outline-none transition text-white placeholder-gray-500"
              placeholder="Enter your password"
              required
              disabled={isLoading}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-linear-to-r from-jade to-emerald 
                                 hover:from-emerald hover:to-jade 
                                 text-white font-semibold py-3 rounded-lg 
                                 transition-all duration-300 transform hover:scale-105 
                                 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                                 shadow-lg"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push("/")}
            className="text-emerald hover:text-jade text-sm font-medium transition-colors inline-flex items-center gap-2"
          >
            <span>←</span> Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
