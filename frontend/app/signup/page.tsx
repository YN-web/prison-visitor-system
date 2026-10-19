"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { useState } from "react";
import { Eye, EyeOff, Shield } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
const { t } = useLanguage();
const router = useRouter();
const [fullName, setFullName] = useState("");
const [nationalId, setNationalId] = useState("");
const [phoneNumber, setPhoneNumber] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");

const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
const passwordsMatch = password === confirmPassword;

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (!fullName.trim()) {
    alert(`${t("fullName")}: ${t("requiredField")}`);
    return;
  }

  if (!/^\d{16}$/.test(nationalId)) {
    alert(t("invalidNationalId"));
    return;
  }

  if (!/^\d{9}$/.test(phoneNumber)) {
    alert(t("invalidPhone"));
    return;
  }

  if (!email.includes("@")) {
    alert(t("invalidEmail"));
    return;
  }

  if (password.length < 8) {
    alert(t("passwordTooShort"));
    return;
  }

  if (!passwordsMatch) {
    alert(t("passwordMismatch"));
    return;
  }

  if (!profilePhoto) {
    alert(`${t("profilePhoto")}: ${t("requiredField")}`);
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName,
        nationalId,
        phoneNumber,
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Registration failed");
      return;
    }

    alert("Account created successfully");
    router.push("/login");
  
  } catch (error) {
    console.error(error);
    alert("Unable to connect to the server");
  }
};

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 text-[#1a2a3a] dark:text-white">
      {
            <div className="flex min-h-screen items-center justify-center px-4 py-10">
  <div className="w-full max-w-lg">
    
    {/* Logo */}
    <div className="mb-8 flex flex-col items-center">
      <div className="mb-3 rounded-full bg-[#1a2a3a] p-3 dark:bg-white">
        <Shield className="h-8 w-8 text-white dark:text-[#1a2a3a]" />
      </div>

      <h1 className="text-center text-2xl font-bold">
        {t("signupTitle")}
      </h1>

      <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
        {t("signupSubtitle")}
      </p>
    </div>

    { 
    
        <form 

        onSubmit={handleSubmit}
        className="space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
        >
  
  {/* Full Name */}
  <div>
    <label
      htmlFor="fullName"
      className="mb-2 block text-sm font-medium"
    >
      {t("fullName")}
    </label>

    <input
      id="fullName"
      type="text"
      value={fullName}
      onChange={(e) => setFullName(e.target.value)}
      placeholder={t("fullName")}
      className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#1a2a3a] dark:border-gray-600 dark:bg-gray-900 dark:focus:border-white"
    />
  </div>

  {/* National ID */}
  <div>
    <label
      htmlFor="nationalId"
      className="mb-2 block text-sm font-medium"
    >
      {t("nationalId")}
    </label>

    <input
  id="nationalId"
  type="text"
  inputMode="numeric"
  maxLength={16}
  minLength={16}
  pattern="[0-9]{16}"
  value={nationalId}
  onChange={(e) => {
    const value = e.target.value.replace(/\D/g, "");
    setNationalId(value);
  }}
  placeholder={t("nationalId")}
  className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#1a2a3a] dark:border-gray-600 dark:bg-gray-900 dark:focus:border-white"
/>
  </div>

  {/* Phone Number */}
  <div>
  <label
    htmlFor="phoneNumber"
    className="mb-2 block text-sm font-medium"
  >
    {t("phoneNumber")}
  </label>

  <div className="flex">
    <span className="flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-100 px-4 text-sm font-medium text-gray-700 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200">
      +250
    </span>

    <input
      id="phoneNumber"
      type="tel"
      inputMode="numeric"
      maxLength={9}
      value={phoneNumber}
      onChange={(e) => {
        const value = e.target.value.replace(/\D/g, "");
        setPhoneNumber(value);
      }}
      placeholder="7XXXXXXXX"
      className="w-full rounded-r-md border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#1a2a3a] dark:border-gray-600 dark:bg-gray-900 dark:focus:border-white"
    />
  </div>
</div>

  {/* Email */}
  <div>
    <label
      htmlFor="email"
      className="mb-2 block text-sm font-medium"
    >
      {t("email")}
    </label>

    <input
      id="email"
      type="email"
      required
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder={t("email")}
      className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#1a2a3a] dark:border-gray-600 dark:bg-gray-900 dark:focus:border-white"
    />
  </div>
  {/* Password */}
<div>
  <label
    htmlFor="password"
    className="mb-2 block text-sm font-medium"
  >
    {t("password")}
  </label>

  <div className="relative">
    <input
      id="password"
      type={showPassword ? "text" : "password"}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder={t("password")}
      required
      className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 pr-12 text-sm outline-none focus:border-[#1a2a3a] dark:border-gray-600 dark:bg-gray-900 dark:focus:border-white"
    />

    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      aria-label={showPassword ? "Hide password" : "Show password"}
    >
      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  </div>
</div>

      {/* Confirm Password */}
<div>
  <label
    htmlFor="confirmPassword"
    className="mb-2 block text-sm font-medium"
  >
    {t("confirmPassword")}
  </label>

  <div className="relative">
    <input
      id="confirmPassword"
      type={showConfirmPassword ? "text" : "password"}
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      placeholder={t("confirmPassword")}
      required
      className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 pr-12 text-sm outline-none focus:border-[#1a2a3a] dark:border-gray-600 dark:bg-gray-900 dark:focus:border-white"
    />

    <button
      type="button"
      onClick={() =>
        setShowConfirmPassword(!showConfirmPassword)
      }
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      aria-label={
        showConfirmPassword
          ? "Hide password"
          : "Show password"
      }
    >
      {showConfirmPassword ? (
        <EyeOff size={18} />
      ) : (
        <Eye size={18} />
      )}
    </button>
  </div>
</div>
      {/* Profile Photo */}
<div>       
  <label
    htmlFor="profilePhoto"
    className="mb-2 block text-sm font-medium"
  >
    {t("profilePhoto")}
  </label>

  <input

    id="profilePhoto"
    type="file"
    required
    accept="image/jpeg,image/png,image/webp"
    onChange={(e) => {
  const file = e.target.files?.[0] || null;

  if (!file) {
    setProfilePhoto(null);
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    alert(t("profilePhotoTooLarge"));
    e.target.value = "";
    setProfilePhoto(null);
    return;
  }

  setProfilePhoto(file);
}}
    className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-[#1a2a3a] file:px-4 file:py-2 file:text-white dark:border-gray-600 dark:bg-gray-900"
  />
  {profilePhoto && (
  <div className="mt-4 flex justify-center">
    <img
      src={URL.createObjectURL(profilePhoto)}
      alt="Profile preview"
      className="h-24 w-24 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
    />
  </div>
)}

  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
    JPG, PNG, or WebP image
  </p>

  
</div>
    <button
  type="submit"
  className="w-full rounded-md bg-[#1a2a3a] px-4 py-3 font-medium text-white transition hover:bg-[#243b4f] dark:bg-white dark:text-[#1a2a3a] dark:hover:bg-gray-200"
>
  {t("createAccount")}
</button>

</form>

    

    }
    <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
  {t("alreadyHaveAccount")}{" "}
  <Link
    href="/login"
    className="font-medium text-[#1a2a3a] hover:underline dark:text-white"
  >
    {t("loginHere")}
  </Link>
</p>

  </div>
</div>


      }
      
    </main>
  );
}