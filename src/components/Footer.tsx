import Image from "next/image";
import Link from "next/link";
import { Camera, CirclePlay, Mail, MapPin, Phone } from "lucide-react";

const quickLinks = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#problem" },
  { label: "Seminars", href: "#seminars" },
  { label: "Experts", href: "#experts" },
  { label: "Contact", href: "#register" },
];

const policyLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Refund Policy", href: "#" },
];

export default function Footer() {
  return (
    <footer className="border-t border-saffron/20 bg-charcoal px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div>
            <Link
              href="#hero"
              className="inline-flex items-center gap-2 text-saffron"
              scroll={false}
            >
              <Image
                src="/logo.svg"
                alt="Vedanta Life School logo"
                width={24}
                height={24}
                className="size-5"
              />
              <span className="font-heading text-2xl font-bold">
                Vedanta Life School
              </span>
            </Link>
            <p className="mt-4 max-w-sm font-body text-sm leading-relaxed text-muted-warm">
              Transforming 10 Million Lives through Ancient Wisdom
            </p>

            <div className="mt-5 flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-saffron/30 text-ivory transition-colors hover:bg-saffron/10 hover:text-saffron"
              >
                <Camera className="size-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-saffron/30 text-ivory transition-colors hover:bg-saffron/10 hover:text-saffron"
              >
                <CirclePlay className="size-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-heading text-xl font-semibold text-gold">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="font-body text-sm text-muted-warm transition-colors hover:text-saffron"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-xl font-semibold text-gold">
              Get in Touch
            </h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-center gap-2 font-body text-sm text-muted-warm">
                <Mail className="size-4 text-saffron" />
                <a
                  href="mailto:hello@vedantalifeschool.org"
                  className="transition-colors hover:text-saffron"
                >
                  hello@vedantalifeschool.org
                </a>
              </li>
              <li className="flex items-center gap-2 font-body text-sm text-muted-warm">
                <Phone className="size-4 text-saffron" />
                <a
                  href="tel:+919999999999"
                  className="transition-colors hover:text-saffron"
                >
                  +91 99999 99999
                </a>
              </li>
              <li className="flex items-center gap-2 font-body text-sm text-muted-warm">
                <MapPin className="size-4 text-saffron" />
                <span>Delhi, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 h-px w-full bg-saffron/10" />

        <div className="mt-6 flex flex-col gap-3 text-sm text-muted-warm md:flex-row md:items-center md:justify-between">
          <p>© 2026 Vedanta Life School. All Rights Reserved.</p>
          <div className="flex flex-wrap items-center gap-2">
            {policyLinks.map((link, index) => (
              <span key={link.label} className="inline-flex items-center gap-2">
                <a
                  href={link.href}
                  className="transition-colors hover:text-saffron"
                >
                  {link.label}
                </a>
                {index < policyLinks.length - 1 ? <span>·</span> : null}
              </span>
            ))}
          </div>
        </div>
        <p className="mt-4 text-xs italic text-muted-warm">
          Powered by <a className="text-amber-300" href="https://sapnendra.dev" target="_blank"></a>
        </p>
      </div>
    </footer>
  );
}
