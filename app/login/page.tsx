"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.message);

    localStorage.setItem("user", JSON.stringify(data));

    setTimeout(() => {
      const roleRedirectMap: Record<string, string> = {
        admin: "/admin",
        cloud: "/cloud",
        devops: "/devops",
        pm: "/pm",
      };

      const redirectPath = roleRedirectMap[data.role] || "/admin";
      router.push(redirectPath);
    }); 
  };

  return (
    <div className="min-h-screen bg-gray-100  py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-sky-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold mb-2 text-gray-900">Login</h1>
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            </div>

            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="relative">
                  <input
                    autoComplete="off"
                    id="email"
                    name="email"
                    type="email"
                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all
                      peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                      peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600
                      peer-focus:text-sm"
                  >
                    Email Address
                  </label>
                </div>

                <div className="relative">
                  <input
                    autoComplete="off"
                    id="password"
                    name="password"
                    type="password"
                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <label
                    htmlFor="password"
                    className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all
                      peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                      peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600
                      peer-focus:text-sm"
                  >
                    Password
                  </label>
                </div>

                <div className="relative">
                  <button
                    type="submit"
                    className="bg-cyan-500 text-white rounded-md px-4 py-2 mt-4 w-full hover:bg-cyan-600 transition"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </form>

          <div className="w-full flex justify-center mt-6">
            <button className="flex items-center bg-white border border-gray-300 rounded-lg shadow-md px-6 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
              <svg
                className="h-6 w-6 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="-0.5 0 48 48"
              >
                <path
                  fill="#FBBC05"
                  d="M9.827 24c0-1.524.253-2.986.705-4.356L2.623 13.604C1.082 16.734.214 20.26.214 24c0 3.737.867 7.262 2.407 10.389l7.904-6.051A14.17 14.17 0 0 1 9.827 24z"
                />
                <path
                  fill="#EB4335"
                  d="M23.714 10.133c3.311 0 6.302 1.173 8.652 3.093l6.836-6.827C35.036 2.773 29.695.533 23.714.533 14.427.533 6.445 5.844 2.623 13.604l7.909 6.04c1.823-5.532 7.017-9.511 13.182-9.511z"
                />
                <path
                  fill="#34A853"
                  d="M23.714 37.867c-6.165 0-11.36-3.978-13.182-9.51l-7.909 6.039c3.822 7.761 11.804 13.072 21.091 13.072 5.732 0 11.205-2.035 15.312-5.848l-7.507-5.804a13.965 13.965 0 0 1-8.805 2.051z"
                />
                <path
                  fill="#4285F4"
                  d="M46.145 24c0-1.387-.214-2.88-.534-4.267H23.714v9.067H36.318c-.63 3.091-2.346 5.468-4.8 7.015l7.507 5.804C43.34 37.614 46.145 31.649 46.145 24z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
