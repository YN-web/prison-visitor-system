"use client";

import Link from "next/link";
import Header from "@/components/Header";
import { useLanguage } from "@/lib/language-context";
import {
  Shield,
  User,
  Calendar,
  CheckCircle,
  DoorOpen,
  Users,
  FileText,
  Clock,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />

      {/* Hero */}
      <section id="home" className="py-12 sm:py-20 lg:py-24 bg-white dark:bg-gray-900">
  <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="max-w-3xl">
      <div className="inline-block bg-gray-100 dark:bg-gray-800 text-[#1a2a3a] dark:text-white px-3 sm:px-4 py-1 rounded-full text-xs font-medium mb-4 sm:mb-6">
        {t("heroBadge")}
      </div>
      <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#1a2a3a] dark:text-white leading-tight mb-4 sm:mb-6 break-words">
        {t("heroTitle")}
        <span className="text-[#d4af37]"> {t("heroTitleHighlight")}</span>
      </h1>
      <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 max-w-2xl">
        {t("heroSubtitle")}
      </p>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <Link
          href="/signup"
          className="inline-flex items-center justify-center gap-2 bg-[#1a2a3a] dark:bg-white text-white dark:text-[#1a2a3a] px-5 sm:px-6 py-3 rounded-md font-medium hover:bg-[#243b4f] dark:hover:bg-gray-200 transition w-full sm:w-auto"
        >
          {t("createAccount")}
          <ArrowRight size={18} />
        </Link>
        <Link
          href="/login"
          className="inline-flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 text-[#1a2a3a] dark:text-white px-5 sm:px-6 py-3 rounded-md font-medium hover:border-[#1a2a3a] dark:hover:border-white transition w-full sm:w-auto"
        >
          {t("loginToAccount")}
        </Link>
      </div>
    </div>
  </div>
</section>

      {/* About */}
      <section
        id="about"
        className="py-12 sm:py-20 lg:py-24 bg-gray-50 dark:bg-gray-800"
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a2a3a] dark:text-white mb-4">
              {t("aboutTitle")}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              {t("aboutText")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <InfoCard
              icon={<Shield className="w-8 h-8 text-[#1a2a3a] dark:text-white" />}
              title={t("secure")}
              description={t("secureDesc")}
            />
            <InfoCard
              icon={<Clock className="w-8 h-8 text-[#1a2a3a] dark:text-white" />}
              title={t("timeSaving")}
              description={t("timeSavingDesc")}
            />
            <InfoCard
              icon={<FileText className="w-8 h-8 text-[#1a2a3a] dark:text-white" />}
              title={t("transparent")}
              description={t("transparentDesc")}
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-12 sm:py-20 lg:py-24 bg-white dark:bg-gray-900">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a2a3a] dark:text-white mb-4">
              {t("howTitle")}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              {t("howSubtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <StepCard
              number="01"
              icon={<User className="w-8 h-8 text-[#1a2a3a] dark:text-white" />}
              title={t("step1Title")}
              description={t("step1Desc")}
            />
            <StepCard
              number="02"
              icon={<Calendar className="w-8 h-8 text-[#1a2a3a] dark:text-white" />}
              title={t("step2Title")}
              description={t("step2Desc")}
            />
            <StepCard
              number="03"
              icon={<CheckCircle className="w-8 h-8 text-[#1a2a3a] dark:text-white" />}
              title={t("step3Title")}
              description={t("step3Desc")}
            />
            <StepCard
              number="04"
              icon={<DoorOpen className="w-8 h-8 text-[#1a2a3a] dark:text-white" />}
              title={t("step4Title")}
              description={t("step4Desc")}
            />
          </div>
        </div>
      </section>

      {/* Services */}
      <section
        id="services"
        className="py-12 sm:py-20 lg:py-24 bg-gray-50 dark:bg-gray-800"
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a2a3a] dark:text-white mb-4">
              {t("servicesTitle")}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              {t("servicesSubtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ServiceCard
              icon={<Calendar className="w-10 h-10 text-[#1a2a3a] dark:text-white" />}
              title={t("applyToVisit")}
              description={t("applyToVisitDesc")}
            />
            <ServiceCard
              icon={<Clock className="w-10 h-10 text-[#1a2a3a] dark:text-white" />}
              title={t("trackRequests")}
              description={t("trackRequestsDesc")}
            />
            <ServiceCard
              icon={<FileText className="w-10 h-10 text-[#1a2a3a] dark:text-white" />}
              title={t("visitHistory")}
              description={t("visitHistoryDesc")}
            />
            <ServiceCard
              icon={<Users className="w-10 h-10 text-[#1a2a3a] dark:text-white" />}
              title={t("manageProfile")}
              description={t("manageProfileDesc")}
            />
            <ServiceCard
              icon={<Shield className="w-10 h-10 text-[#1a2a3a] dark:text-white" />}
              title={t("secureAccess")}
              description={t("secureAccessDesc")}
            />
            <ServiceCard
              icon={<CheckCircle className="w-10 h-10 text-[#1a2a3a] dark:text-white" />}
              title={t("realTimeUpdates")}
              description={t("realTimeUpdatesDesc")}
            />
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-12 sm:py-20 lg:py-24 bg-white dark:bg-gray-900">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a2a3a] dark:text-white mb-4">
              {t("contactTitle")}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              {t("contactSubtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <ContactCard
              icon={<Phone className="w-6 h-6 text-[#1a2a3a] dark:text-white" />}
              title={t("phone")}
              value="+250 788 123 456"
            />
            <ContactCard
              icon={<Mail className="w-6 h-6 text-[#1a2a3a] dark:text-white" />}
              title={t("email")}
              value="support@prison.gov.rw"
            />
            <ContactCard
              icon={<MapPin className="w-6 h-6 text-[#1a2a3a] dark:text-white" />}
              title={t("address")}
              value={t("addressValue")}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a2a3a] dark:bg-black text-white py-12">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-[#d4af37]" />
                <span className="font-bold text-lg">Prison Visitor</span>
              </div>
              <p className="text-gray-400 text-sm max-w-md">
                {t("footerTagline")}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t("quickLinks")}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/login" className="hover:text-white">
                    {t("login")}
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="hover:text-white">
                    {t("register")}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t("contact")}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>+250 788 123 456</li>
                <li>support@prison.gov.rw</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
            © 2026 Rwanda Correctional Service. {t("footerRights")}
          </div>
        </div>
      </footer>
    </div>
  );
}

// ============================================
// COMPONENTS
// ============================================

function InfoCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-bold text-[#1a2a3a] dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm">{description}</p>
    </div>
  );
}

function StepCard({
  number,
  icon,
  title,
  description,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="relative">
      <div className="text-5xl font-bold text-gray-100 dark:text-gray-800 absolute -top-4 -left-2">
        {number}
      </div>
      <div className="relative bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="mb-4">{icon}</div>
        <h3 className="text-lg font-bold text-[#1a2a3a] dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm">{description}</p>
      </div>
    </div>
  );
}

function ServiceCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-[#d4af37] transition">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-bold text-[#1a2a3a] dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm">{description}</p>
    </div>
  );
}

function ContactCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="flex justify-center mb-3">{icon}</div>
      <h3 className="font-semibold text-[#1a2a3a] dark:text-white mb-1">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm">{value}</p>
    </div>
  );
}