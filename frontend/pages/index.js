import Head from 'next/head';
import Link from 'next/link';
import {
  ArrowRightIcon,
  DocumentTextIcon,
  PhotoIcon,
  VideoCameraIcon,
  CloudArrowUpIcon,
  CogIcon,
  ArrowDownTrayIcon,
  CheckIcon,
  ShieldCheckIcon,
  ClockIcon,
  BoltIcon,
  MusicalNoteIcon,
  ArchiveBoxIcon,
} from '@heroicons/react/24/outline';

const stats = [
  { value: '2M+', label: 'Files Processed' },
  { value: '500K+', label: 'Happy Users' },
  { value: '99.9%', label: 'Uptime' },
  { value: '< 1min', label: 'Avg. Processing' },
];

const formats = [
  {
    Icon: DocumentTextIcon,
    title: 'Documents',
    description: 'Convert and compress PDF and Word documents effortlessly',
    items: ['PDF to Word', 'Word to PDF', 'Compress PDF'],
    iconBg: 'bg-primary-600',
    cardBg: 'bg-primary-50',
    accent: 'text-primary-700',
  },
  {
    Icon: PhotoIcon,
    title: 'Images',
    description: 'Transform and optimize images for any use case',
    items: ['JPG to PNG', 'PNG to JPG', 'Compress Images'],
    iconBg: 'bg-sky-500',
    cardBg: 'bg-sky-50',
    accent: 'text-sky-700',
  },
  {
    Icon: VideoCameraIcon,
    title: 'Video & Audio',
    description: 'Extract audio and compress video files in seconds',
    items: ['MP4 to MP3', 'Compress Video', 'Fast Processing'],
    iconBg: 'bg-violet-500',
    cardBg: 'bg-violet-50',
    accent: 'text-violet-700',
  },
];

const steps = [
  {
    Icon: CloudArrowUpIcon,
    title: 'Upload Your File',
    description: 'Drag & drop or click to select any file up to 100MB — no account needed.',
  },
  {
    Icon: CogIcon,
    title: 'Convert or Compress',
    description: 'Our servers process your file instantly with professional-grade quality.',
  },
  {
    Icon: ArrowDownTrayIcon,
    title: 'Download Result',
    description: 'Get your processed file in seconds. Auto-deleted after 1 hour for privacy.',
  },
];

const tools = [
  {
    Icon: DocumentTextIcon,
    name: 'PDF to Word',
    href: '/pdf-to-word',
    description: 'Convert PDF to editable Word format',
  },
  {
    Icon: MusicalNoteIcon,
    name: 'MP4 to MP3',
    href: '/mp4-to-mp3',
    description: 'Extract audio from video files',
  },
  {
    Icon: ArchiveBoxIcon,
    name: 'Compress PDF',
    href: '/compress-pdf',
    description: 'Reduce PDF size without quality loss',
  },
  {
    Icon: PhotoIcon,
    name: 'Compress Image',
    href: '/compress-image',
    description: 'Optimize images for web and email',
  },
  {
    Icon: PhotoIcon,
    name: 'JPG to PNG',
    href: '/jpg-to-png',
    description: 'Convert between image formats',
  },
  {
    Icon: DocumentTextIcon,
    name: 'Word to PDF',
    href: '/word-to-pdf',
    description: 'Save Word documents as PDF',
  },
];

const freePlan = {
  name: 'Free',
  price: '$0',
  period: 'forever',
  description: 'Perfect for occasional use',
  features: [
    'Up to 10MB per file',
    '5 conversions per day',
    'All formats supported',
    'Auto-delete after 1 hour',
  ],
  cta: 'Start Free',
  href: '/convert',
};

const premiumPlan = {
  name: 'Premium',
  price: '$9',
  period: '/month',
  description: 'For power users and professionals',
  features: [
    'Up to 500MB per file',
    'Unlimited conversions',
    'Batch processing',
    'No ads',
    'Priority processing',
    'API access',
  ],
  cta: 'Go Premium',
  href: '/pricing',
};

const trustBadges = [
  { Icon: ShieldCheckIcon, label: 'SSL Encrypted' },
  { Icon: ClockIcon, label: 'Auto-deleted in 1hr' },
  { Icon: BoltIcon, label: 'No Registration' },
];

export default function Home() {
  return (
    <>
      <Head>
        <title>FilePro – Free Online File Converter & Compressor | No Signup</title>
        <meta name="description" content="Convert PDF to Word, Word to PDF, JPG to PNG, MP4 to MP3 — or compress PDF, images and video online. 100% free, no signup required. Files auto-deleted for privacy." />
        <meta name="keywords" content="online file converter, pdf to word, compress pdf online free, jpg to png converter, mp4 to mp3 converter, free file converter, compress image online, word to pdf" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://filepro.neobize.com/" />
        <meta property="og:title" content="FilePro – Free Online File Converter & Compressor" />
        <meta property="og:description" content="Convert PDF to Word, compress PDF, JPG to PNG, MP4 to MP3. Free, no signup required. Files processed in seconds and auto-deleted." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://filepro.neobize.com/" />
        <meta property="og:site_name" content="FilePro" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="FilePro – Free Online File Converter & Compressor" />
        <meta name="twitter:description" content="Convert PDF to Word, compress PDF, JPG to PNG, MP4 to MP3. Free, no signup." />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'FilePro',
              applicationCategory: 'UtilitiesApplication',
              operatingSystem: 'Web',
              description: 'Free online file converter and compressor. Convert PDF to Word, Word to PDF, JPG to PNG, MP4 to MP3. Compress PDF, images, and video without losing quality.',
              url: 'https://filepro.neobize.com',
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'Free plan — no signup required' },
              featureList: ['PDF to Word conversion', 'Word to PDF conversion', 'JPG to PNG conversion', 'PNG to JPG conversion', 'MP4 to MP3 conversion', 'PDF compression', 'Image compression', 'Video compression'],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                { '@type': 'Question', name: 'Is FilePro free to use?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. FilePro is 100% free with no signup required. The free plan supports files up to 20MB.' } },
                { '@type': 'Question', name: 'How do I convert a PDF to Word?', acceptedAnswer: { '@type': 'Answer', text: 'Go to the PDF to Word tool, upload your PDF, and click Convert. Your DOCX file is ready in seconds.' } },
                { '@type': 'Question', name: 'How do I compress a PDF without losing quality?', acceptedAnswer: { '@type': 'Answer', text: 'Use our Compress PDF tool. Choose Low compression for best quality, Medium for balanced results, or High for the smallest file size.' } },
                { '@type': 'Question', name: 'Are my files kept private?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. All files are encrypted in transit and automatically deleted from our servers after 1 hour.' } },
              ],
            }),
          }}
        />
      </Head>

      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-primary-50/20 pt-20 pb-28">
        {/* Ambient blobs */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-48 -right-48 h-96 w-96 rounded-full bg-primary-100/60 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-primary-100/40 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Badge */}
          <div className="mb-7 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-1.5 text-sm font-medium text-primary-700">
              <span className="h-2 w-2 rounded-full bg-primary-500" aria-hidden="true" />
              Free &middot; No Registration &middot; 100% Secure
            </span>
          </div>

          {/* Heading */}
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-primary-900 sm:text-6xl lg:text-7xl">
              Convert & Compress
              <span className="block bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                Any File, Instantly
              </span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-slate-600">
              Professional-grade file processing right in your browser. PDF, Images, Video&nbsp;&mdash;
              no signup required, files deleted automatically.
            </p>

            {/* CTAs */}
            <div className="mb-12 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/convert"
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary-600 px-8 py-4 text-base font-semibold text-white transition-all duration-200 hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Convert Files
                <ArrowRightIcon className="h-5 w-5" aria-hidden="true" />
              </Link>
              <Link
                href="/compress"
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-primary-200 bg-white px-8 py-4 text-base font-semibold text-primary-700 transition-all duration-200 hover:border-primary-400 hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Compress Files
                <ArrowRightIcon className="h-5 w-5" aria-hidden="true" />
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-6">
              {trustBadges.map(({ Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-sm text-slate-500">
                  <Icon className="h-4 w-4 text-primary-500" aria-hidden="true" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats Bar ─── */}
      <section className="bg-primary-600 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <dl className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            {stats.map(({ value, label }) => (
              <div key={label}>
                <dt className="mb-1 text-3xl font-bold text-white">{value}</dt>
                <dd className="text-sm text-primary-100">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ─── Supported Formats ─── */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-primary-900">Supported Formats</h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-500">
              Convert and compress the most popular file formats with professional quality
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {formats.map(({ Icon, title, description, items, iconBg, cardBg, accent }) => (
              <div
                key={title}
                className={`${cardBg} rounded-2xl border border-transparent p-8 transition-all duration-200 hover:border-primary-200 hover:shadow-md`}
              >
                <div className={`mb-5 inline-flex rounded-xl ${iconBg} p-3`}>
                  <Icon className="h-7 w-7 text-white" aria-hidden="true" />
                </div>
                <h3 className={`mb-2 text-xl font-bold ${accent}`}>{title}</h3>
                <p className="mb-5 text-sm leading-relaxed text-slate-600">{description}</p>
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-slate-700">
                      <CheckIcon className="h-4 w-4 flex-shrink-0 text-primary-500" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="bg-primary-50/50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-primary-900">How It Works</h2>
            <p className="text-lg text-slate-500">Three simple steps to process any file</p>
          </div>

          <div className="relative grid gap-8 md:grid-cols-3">
            {/* Connector */}
            <div
              aria-hidden="true"
              className="absolute left-1/3 right-1/3 top-10 hidden h-px bg-primary-200 md:block"
            />

            {steps.map(({ Icon, title, description }, index) => (
              <div key={title} className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-primary-200 bg-white shadow-sm">
                    <Icon className="h-9 w-9 text-primary-600" aria-hidden="true" />
                  </div>
                  <div className="absolute -right-3 -top-3 flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
                    {index + 1}
                  </div>
                </div>
                <h3 className="mb-2 text-lg font-bold text-primary-900">{title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Popular Tools ─── */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-primary-900">Popular Tools</h2>
            <p className="text-lg text-slate-500">Quick access to the most-used converters and compressors</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map(({ Icon, name, href, description }) => (
              <Link
                key={name}
                href={href}
                className="group flex cursor-pointer items-start gap-4 rounded-xl border border-gray-200 p-5 transition-all duration-200 hover:border-primary-300 hover:bg-primary-50/40 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100 transition-colors duration-200 group-hover:bg-primary-200">
                  <Icon className="h-5 w-5 text-primary-600" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-0.5 font-semibold text-gray-800 transition-colors duration-200 group-hover:text-primary-700">
                    {name}
                  </div>
                  <div className="text-sm text-slate-500">{description}</div>
                </div>
                <ArrowRightIcon className="mt-1 h-4 w-4 flex-shrink-0 text-gray-400 transition-colors duration-200 group-hover:text-primary-500" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing ─── */}
      <section className="bg-primary-50/50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-primary-900">Simple Pricing</h2>
            <p className="text-lg text-slate-500">Start for free, upgrade when you need more</p>
          </div>

          <div className="mx-auto grid max-w-3xl gap-8 md:grid-cols-2">
            {/* Free plan */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8">
              <div className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary-600">
                {freePlan.name}
              </div>
              <div className="mb-1 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-primary-900">{freePlan.price}</span>
                <span className="text-sm text-slate-400">{freePlan.period}</span>
              </div>
              <p className="mb-6 text-sm text-slate-500">{freePlan.description}</p>
              <ul className="mb-8 space-y-3">
                {freePlan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <CheckIcon className="h-4 w-4 flex-shrink-0 text-primary-500" aria-hidden="true" />
                    <span className="text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={freePlan.href}
                className="block cursor-pointer rounded-xl bg-primary-600 px-6 py-3 text-center text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                {freePlan.cta}
              </Link>
            </div>

            {/* Premium plan */}
            <div className="relative rounded-2xl bg-primary-600 p-8 shadow-xl shadow-primary-200">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-orange-500 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
                  Most Popular
                </span>
              </div>
              <div className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary-200">
                {premiumPlan.name}
              </div>
              <div className="mb-1 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">{premiumPlan.price}</span>
                <span className="text-sm text-primary-200">{premiumPlan.period}</span>
              </div>
              <p className="mb-6 text-sm text-primary-100">{premiumPlan.description}</p>
              <ul className="mb-8 space-y-3">
                {premiumPlan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <CheckIcon className="h-4 w-4 flex-shrink-0 text-primary-300" aria-hidden="true" />
                    <span className="text-primary-50">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={premiumPlan.href}
                className="block cursor-pointer rounded-xl bg-orange-500 px-6 py-3 text-center text-sm font-semibold text-white transition-all duration-200 hover:bg-orange-400 hover:shadow-lg hover:shadow-orange-300/50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-primary-600"
              >
                {premiumPlan.cta}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="bg-white py-24" id="faq">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-primary-900">Frequently Asked Questions</h2>
            <p className="text-lg text-slate-500">Everything you need to know about FilePro</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
              <h3 className="mb-2 text-base font-semibold text-gray-800">Is FilePro really free to use?</h3>
              <p className="text-sm leading-relaxed text-slate-500">Yes. FilePro is 100% free with no signup required. Upload and convert or compress files instantly. Free plan supports files up to 20MB.</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
              <h3 className="mb-2 text-base font-semibold text-gray-800">How do I convert a PDF to Word?</h3>
              <p className="text-sm leading-relaxed text-slate-500">Go to the <a href="/pdf-to-word" className="text-primary-600 underline underline-offset-2 hover:text-primary-700">PDF to Word tool</a>, upload your PDF, and click Convert. Your editable DOCX file is ready to download in seconds — no registration needed.</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
              <h3 className="mb-2 text-base font-semibold text-gray-800">How do I compress a PDF without losing quality?</h3>
              <p className="text-sm leading-relaxed text-slate-500">Use our <a href="/compress-pdf" className="text-primary-600 underline underline-offset-2 hover:text-primary-700">Compress PDF tool</a>. We use <a href="https://www.ghostscript.com/" target="_blank" rel="noopener noreferrer" className="text-primary-600 underline underline-offset-2 hover:text-primary-700">Ghostscript</a> — the industry-standard PDF compression engine — to reduce file size by 30–70% while preserving quality.</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
              <h3 className="mb-2 text-base font-semibold text-gray-800">Are my files kept private?</h3>
              <p className="text-sm leading-relaxed text-slate-500">Absolutely. All uploaded files are encrypted in transit using <a href="https://www.cloudflare.com/learning/ssl/what-is-ssl/" target="_blank" rel="noopener noreferrer" className="text-primary-600 underline underline-offset-2 hover:text-primary-700">SSL/TLS</a> and automatically deleted from our servers after 1 hour. We never share or analyze your content.</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
              <h3 className="mb-2 text-base font-semibold text-gray-800">What file formats does FilePro support?</h3>
              <p className="text-sm leading-relaxed text-slate-500">FilePro converts PDF ↔ Word (DOCX), JPG ↔ PNG, and MP4 → MP3. For compression: PDF, JPG, PNG, and MP4 files are all supported.</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
              <h3 className="mb-2 text-base font-semibold text-gray-800">What is the maximum file size?</h3>
              <p className="text-sm leading-relaxed text-slate-500">Free users can upload files up to 20MB. Premium users get up to 500MB per file. No signup is required for the free plan.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="bg-gradient-to-br from-primary-700 to-primary-600 py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-4xl font-bold text-white">Ready to Process Your Files?</h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-primary-100">
            Join over 500,000 users who trust FilePro for fast, secure, and free file processing.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/convert"
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-primary-700 transition-all duration-200 hover:bg-primary-50 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600"
            >
              Start Converting Free
              <ArrowRightIcon className="h-5 w-5" aria-hidden="true" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-orange-500 px-8 py-4 text-base font-semibold text-white transition-all duration-200 hover:bg-orange-400 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-primary-600"
            >
              View Pricing
              <ArrowRightIcon className="h-5 w-5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
