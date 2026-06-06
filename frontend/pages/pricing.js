import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  CheckIcon,
  XMarkIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';

const freeFeatures = [
  { text: 'Max file size: 20 MB',          included: true  },
  { text: '1 file at a time',              included: true  },
  { text: 'All conversion formats',        included: true  },
  { text: 'All compression levels',        included: true  },
  { text: 'Files deleted after 1 hour',    included: true  },
  { text: 'No ads',                        included: false },
  { text: 'Batch uploads',                 included: false },
  { text: 'Priority processing',           included: false },
  { text: 'API access',                    included: false },
];

const premiumFeatures = [
  { text: 'Max file size: 500 MB',         included: true  },
  { text: 'Unlimited conversions',         included: true  },
  { text: 'All conversion formats',        included: true  },
  { text: 'All compression levels',        included: true  },
  { text: 'Files deleted after 1 hour',    included: true  },
  { text: 'No ads',                        included: true  },
  { text: 'Batch uploads (multiple files)',included: true  },
  { text: 'Priority processing',          included: true  },
  { text: 'API access',                    included: true  },
];

const faqs = [
  {
    q: 'How does billing work?',
    a: 'Premium is billed monthly. You can cancel anytime and your access will continue until the end of your billing period. No surprise charges.',
  },
  {
    q: 'Is my data secure?',
    a: 'Yes. All files are encrypted during transmission and storage. Files are automatically deleted from our servers after 1 hour regardless of plan.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Absolutely. There are no long-term contracts. Cancel from your account settings in seconds — access continues until your billing period ends.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit cards (Visa, Mastercard, Amex) through Stripe, our PCI-compliant payment partner.',
  },
  {
    q: 'What happens when I hit the free plan limit?',
    a: 'You\'ll see a prompt to upgrade. Free users can convert 1 file at a time up to 20 MB. No data is lost — just upgrade to continue.',
  },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full cursor-pointer items-start justify-between gap-4 py-5 text-left focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-inset rounded-sm"
        aria-expanded={open}
      >
        <span className="text-base font-medium text-gray-800">{q}</span>
        <ChevronDownIcon
          className={`h-5 w-5 flex-shrink-0 text-gray-400 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>
      {open && (
        <p className="pb-5 text-sm leading-relaxed text-gray-500">{a}</p>
      )}
    </div>
  );
}

export default function Pricing() {
  return (
    <>
      <Head>
        <title>Pricing – FilePro Premium Plans</title>
        <meta
          name="description"
          content="Upgrade to FilePro Premium for larger file sizes, batch processing, and an ad-free experience. Simple monthly pricing."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Hero */}
      <section className="bg-gradient-to-b from-primary-50 to-white py-20 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <h1 className="mb-3 text-5xl font-bold text-primary-900">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-slate-500">
            Start free. Upgrade when you need more power.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="pb-20 pt-2">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2">

            {/* Free */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8">
              <div className="mb-6">
                <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-gray-400">Free</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-gray-900">$0</span>
                  <span className="text-sm text-gray-400">/month</span>
                </div>
                <p className="mt-2 text-sm text-gray-500">Perfect for occasional use</p>
              </div>

              <ul className="mb-8 space-y-3">
                {freeFeatures.map(({ text, included }) => (
                  <li key={text} className="flex items-center gap-3 text-sm">
                    {included ? (
                      <CheckIcon className="h-4 w-4 flex-shrink-0 text-primary-500" aria-hidden="true" />
                    ) : (
                      <XMarkIcon className="h-4 w-4 flex-shrink-0 text-gray-300" aria-hidden="true" />
                    )}
                    <span className={included ? 'text-gray-700' : 'text-gray-400'}>{text}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/convert"
                className="block cursor-pointer rounded-xl border-2 border-gray-200 py-3 text-center text-sm font-semibold text-gray-600 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
              >
                Start for Free
              </Link>
            </div>

            {/* Premium */}
            <div className="relative rounded-2xl bg-primary-600 p-8 shadow-xl shadow-primary-200">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-orange-500 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
                  Most Popular
                </span>
              </div>

              <div className="mb-6">
                <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-primary-200">Premium</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-white">$9.99</span>
                  <span className="text-sm text-primary-200">/month</span>
                </div>
                <p className="mt-2 text-sm text-primary-100">For power users and professionals</p>
              </div>

              <ul className="mb-8 space-y-3">
                {premiumFeatures.map(({ text, included }) => (
                  <li key={text} className="flex items-center gap-3 text-sm">
                    {included ? (
                      <CheckIcon className="h-4 w-4 flex-shrink-0 text-primary-300" aria-hidden="true" />
                    ) : (
                      <XMarkIcon className="h-4 w-4 flex-shrink-0 text-primary-700" aria-hidden="true" />
                    )}
                    <span className={included ? 'text-primary-50' : 'text-primary-400'}>{text}</span>
                  </li>
                ))}
              </ul>

              <button className="w-full cursor-pointer rounded-xl bg-orange-500 py-3.5 text-center text-base font-semibold text-white transition-all duration-200 hover:bg-orange-400 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-primary-600">
                Upgrade to Premium
              </button>
            </div>
          </div>

          {/* Trust line */}
          <p className="mt-6 text-center text-xs text-gray-400">
            No contracts &middot; Cancel anytime &middot; SSL encrypted &middot; Files auto-deleted after 1 hour
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-gray-100 bg-gray-50/50 py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <h2 className="mb-2 text-center text-3xl font-bold text-primary-900">
            Frequently Asked Questions
          </h2>
          <p className="mb-10 text-center text-sm text-gray-400">
            Can&apos;t find your answer?{' '}
            <a href="mailto:support@filepro.app" className="cursor-pointer text-primary-600 underline underline-offset-2 hover:text-primary-700">
              Contact support
            </a>
          </p>

          <div className="rounded-2xl border border-gray-200 bg-white px-6">
            {faqs.map((item) => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-gradient-to-br from-primary-700 to-primary-600 py-20 text-center">
        <div className="mx-auto max-w-xl px-4">
          <h2 className="mb-3 text-3xl font-bold text-white">Ready to get started?</h2>
          <p className="mb-8 text-primary-100">
            Join 500,000+ users who trust FilePro to handle their files.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/convert"
              className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-primary-700 transition-all duration-200 hover:bg-primary-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600"
            >
              Start Free
            </Link>
            <button className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-orange-500 px-8 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-orange-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-primary-600">
              Upgrade to Premium
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
