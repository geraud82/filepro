import Head from 'next/head';
import Link from 'next/link';

const LAST_UPDATED = 'June 6, 2026';
const COMPANY = 'Neobize LLC';
const CONTACT_EMAIL = 'contactneobize@gmail.com';
const SITE_URL = 'https://filepro.neobize.com';
const SITE_NAME = 'FilePro';

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy – FilePro</title>
        <meta name="description" content="FilePro's Privacy Policy. We don't store your files. All uploaded files are automatically deleted after 1 hour. No email required for free use." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={`${SITE_URL}/privacy`} />
        <meta property="og:title" content="Privacy Policy – FilePro" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/privacy`} />
      </Head>

      <div className="min-h-screen bg-gray-50/50 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-primary-900">Privacy Policy</h1>
            <p className="mt-2 text-sm text-gray-400">Last updated: {LAST_UPDATED}</p>
          </div>

          <div className="space-y-8 rounded-2xl border border-gray-200 bg-white p-8 sm:p-10 text-sm leading-relaxed text-gray-600">

            <section>
              <p>
                {COMPANY} (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates {SITE_NAME} ({SITE_URL}).
                This Privacy Policy explains what information we collect, how we use it, and your rights
                with respect to that information. We are committed to protecting your privacy.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-gray-900">1. Information We Collect</h2>

              <h3 className="mb-2 font-semibold text-gray-800">Files you upload</h3>
              <p className="mb-4">
                When you use {SITE_NAME} to convert or compress a file, that file is temporarily
                uploaded to our servers for processing. We do not read, analyze, or retain the content
                of your files beyond what is required to perform the conversion or compression.
                All files (both your original upload and the processed output) are{' '}
                <strong>automatically and permanently deleted within 1 hour</strong>.
              </p>

              <h3 className="mb-2 font-semibold text-gray-800">Usage data</h3>
              <p className="mb-4">
                We collect standard server logs including IP address, browser type, pages visited,
                and time of access. This data is used to maintain security, prevent abuse, and
                improve the service. We do not sell this data to third parties.
              </p>

              <h3 className="mb-2 font-semibold text-gray-800">Account information (Premium only)</h3>
              <p>
                If you sign up for a Premium account, we collect your email address and payment
                information. Payment details are handled by{' '}
                <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer"
                  className="text-primary-600 underline underline-offset-2 hover:text-primary-700">
                  Stripe
                </a>{' '}
                and are never stored on our servers. We receive only a payment token from Stripe.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-gray-900">2. How We Use Your Information</h2>
              <ul className="list-disc space-y-1.5 pl-5">
                <li>To provide the file conversion and compression service you requested</li>
                <li>To prevent abuse and enforce our <Link href="/terms" className="text-primary-600 underline underline-offset-2 hover:text-primary-700">Terms of Service</Link></li>
                <li>To maintain security and detect fraudulent activity</li>
                <li>To process payments (Premium only, via Stripe)</li>
                <li>To send service-related emails (Premium only)</li>
              </ul>
              <p className="mt-3">
                We do not use your data for advertising profiling, behavioral tracking, or machine
                learning model training.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-gray-900">3. File Retention Policy</h2>
              <div className="rounded-xl border border-primary-200 bg-primary-50 p-5">
                <p className="font-semibold text-primary-800 mb-2">Key policy: files are deleted automatically</p>
                <p className="text-primary-700">
                  Every uploaded file and every processed output file is permanently deleted from our
                  servers <strong>no later than 1 hour</strong> after the job is created. This deletion
                  is automatic and irreversible. We do not keep backups of user files.
                </p>
              </div>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-gray-900">4. Cookies and Tracking</h2>
              <p>
                {SITE_NAME} uses minimal cookies to support session management and service functionality.
                We do not use third-party advertising cookies. Analytics, if used, are aggregated and
                anonymized. You can disable cookies in your browser settings; this may affect
                Premium account functionality.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-gray-900">5. Third-Party Services</h2>
              <p className="mb-3">We use the following third-party services:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Stripe</strong> — payment processing for Premium subscriptions.
                  See{' '}
                  <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer"
                    className="text-primary-600 underline underline-offset-2 hover:text-primary-700">
                    Stripe&apos;s Privacy Policy
                  </a>.
                </li>
                <li>
                  <strong>Dokploy / Docker infrastructure</strong> — servers located in cloud
                  data centers. Files are processed and deleted on these servers.
                </li>
              </ul>
              <p className="mt-3">
                We do not share your personal data with any other third parties.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-gray-900">6. Data Security</h2>
              <p>
                All data in transit is encrypted using SSL/TLS. Our servers use industry-standard
                security practices. However, no internet transmission or electronic storage is 100%
                secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-gray-900">7. Children&apos;s Privacy</h2>
              <p>
                {SITE_NAME} is not directed to children under the age of 13. We do not knowingly
                collect personal information from children under 13. If you believe a child has
                provided us with personal information, please contact us and we will delete it.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-gray-900">8. Your Rights</h2>
              <p className="mb-3">Depending on your location, you may have the following rights:</p>
              <ul className="list-disc space-y-1.5 pl-5">
                <li><strong>Access:</strong> Request a copy of personal data we hold about you</li>
                <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                <li><strong>Correction:</strong> Request correction of inaccurate personal data</li>
                <li><strong>Portability:</strong> Request your data in a portable format</li>
                <li><strong>Objection:</strong> Object to certain types of processing</li>
              </ul>
              <p className="mt-3">
                Note: Free users who have not created an account have no personal data stored beyond
                temporary server logs (IP address, timestamps). Files are deleted automatically
                within 1 hour and cannot be retrieved.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-gray-900">9. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will update the
                &quot;Last updated&quot; date at the top of this page. Continued use of {SITE_NAME}
                after any changes constitutes your acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-gray-900">10. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy or wish to exercise your data rights,
                please contact us at:{' '}
                <a href={`mailto:${CONTACT_EMAIL}`}
                  className="text-primary-600 underline underline-offset-2 hover:text-primary-700">
                  {CONTACT_EMAIL}
                </a>
              </p>
            </section>

          </div>

          <div className="mt-8 flex gap-4 text-sm text-gray-400">
            <Link href="/terms" className="hover:text-primary-600 transition-colors duration-150">Terms of Service</Link>
            <span>·</span>
            <Link href="/" className="hover:text-primary-600 transition-colors duration-150">Back to FilePro</Link>
          </div>
        </div>
      </div>
    </>
  );
}
