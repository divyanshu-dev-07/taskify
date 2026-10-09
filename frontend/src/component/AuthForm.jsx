import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import { clearDemoSession } from "../lib/taskUtils";

export default function AuthForm({ initialMode = "login" }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setSubmitError("");
  };

  const validate = () => {
    const newErrors = {};

    if (mode === "signup" && form.name.trim().length < 2) {
      newErrors.name = "Enter your full name";
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (mode === "signup" && form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    setSubmitError("");

    if (Object.keys(newErrors).length !== 0) return;

    try {
      const url =
        mode === "signup"
          ? "http://localhost:5000/api/auth/register"
          : "http://localhost:5000/api/auth/login";

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (data.success && data.token) {
        clearDemoSession();
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        navigate("/app");
      } else {
        setSubmitError(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      setSubmitError("Could not reach the server. Make sure the backend is running.");
    }
  };

  const switchMode = (next) => {
    setMode(next);
    setErrors({});
    setSubmitError("");
    setForm({ name: "", email: "", password: "", confirmPassword: "" });
    navigate(next === "login" ? "/login" : "/signup", { replace: true });
  };

  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2 bg-[#F4F7FB]">
      <div className="hidden lg:flex flex-col justify-between bg-[#3B82F6] text-white p-12">
        <Link to="/" className="flex items-center gap-3 text-white no-underline">
          <span className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center">
            <FaCheck className="text-white" />
          </span>
          <span className="text-2xl font-bold">Taskify</span>
        </Link>
        <div>
          <h2 className="text-4xl font-extrabold leading-tight mb-4">
            Plan today.<br />Get more done.
          </h2>
          <p className="text-blue-100 text-lg max-w-md">
            Log in to manage your tasks, or create an account to sync them across devices.
          </p>
        </div>
        <p className="text-blue-100 text-sm">Free to use · Simple & fast</p>
      </div>

      <div className="flex min-h-screen w-full items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-lg">
          <Link to="/" className="lg:hidden flex items-center gap-3 mb-10 text-slate-800 no-underline">
            <span className="w-10 h-10 rounded-full bg-[#3B82F6] flex items-center justify-center">
              <FaCheck className="text-white text-sm" />
            </span>
            <span className="text-xl font-bold">Taskify</span>
          </Link>

          <h1 className="text-3xl font-semibold tracking-tight text-slate-800">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-2 text-slate-400">
            {mode === "login"
              ? "Log in to continue to your dashboard."
              : "Sign up to get started in seconds."}
          </p>

          <div className="mt-8 mb-7 grid grid-cols-2 rounded-xl border border-slate-100 bg-slate-50 p-1">
            <button
              type="button"
              onClick={() => switchMode("login")}
              className={`rounded-lg py-2.5 text-sm font-medium transition-colors cursor-pointer border-0 ${
                mode === "login"
                  ? "bg-[#3B82F6] text-white"
                  : "text-slate-400 hover:text-slate-700 bg-transparent"
              }`}
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => switchMode("signup")}
              className={`rounded-lg py-2.5 text-sm font-medium transition-colors cursor-pointer border-0 ${
                mode === "signup"
                  ? "bg-[#3B82F6] text-white"
                  : "text-slate-400 hover:text-slate-700 bg-transparent"
              }`}
            >
              Sign up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {mode === "signup" && (
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-600">
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Jordan Lee"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 transition-colors hover:border-slate-300 focus:border-blue-400 focus:outline-none"
                />
                {errors.name && <p className="mt-1.5 text-xs text-rose-500">{errors.name}</p>}
              </div>
            )}

            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-600">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 transition-colors hover:border-slate-300 focus:border-blue-400 focus:outline-none"
              />
              {errors.email && <p className="mt-1.5 text-xs text-rose-500">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-600">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-800 placeholder:text-slate-400 transition-colors hover:border-slate-300 focus:border-blue-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 cursor-pointer border-0 bg-transparent"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs text-rose-500">{errors.password}</p>}
            </div>

            {mode === "signup" && (
              <div>
                <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-slate-600">
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 transition-colors hover:border-slate-300 focus:border-blue-400 focus:outline-none"
                />
                {errors.confirmPassword && (
                  <p className="mt-1.5 text-xs text-rose-500">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            {submitError && (
              <p className="text-sm text-rose-500">{submitError}</p>
            )}

            <button
              type="submit"
              className="mt-2 w-full rounded-xl bg-[#3B82F6] py-3.5 text-sm font-semibold text-white transition-colors hover:bg-blue-600 focus:outline-none cursor-pointer border-0"
            >
              {mode === "login" ? "Log in" : "Create account"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-400">
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => switchMode(mode === "login" ? "signup" : "login")}
              className="font-medium text-blue-500 hover:text-blue-600 cursor-pointer border-0 bg-transparent"
            >
              {mode === "login" ? "Sign up" : "Log in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
