import Head from 'next/head';
import Link from 'next/link';

const LAST_UPDATED = 'June 6, 2026';
const COMPANY = 'Neobize LLC';
const CONTACT_EMAIL = 'contactneobize@gmail.com';
const SITE_URL = 'https://filepro.neobize.com';
const SITE_NAME = 'FilePro';

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms of Service – FilePro</title>
        <meta name="description" content="Read FilePro's Terms of Service. Learn about acceptable use, file handling, privacy, and your rights when using our free online file converter and compressor." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={`${SITE_URL}/terms`} />
        <meta property="og:title" content="Terms of Service – FilePro" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/terms`} />
      </Head>

      <div className="min-h-screen bg-gray-50/50 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-primary-900">Terms of Service</h1>
            <p className="mt-2 text-sm text-gray-400">Last updated: {LAST_UPDATED}</p>
          </div>

          <div className="space-y-8 rounded-2xl border border-gray-200 bg-white p-8 sm:p-10 text-sm leading-relaxed text-gray-600">

            <section>
              <p>
                Welcome to {SITE_NAME} ({SITE_URL}), operated by {COMPANY}. By accessing or using our
                service, you agree to be bound by these Terms of Service. If you do not agree, please
                do not use {SITE_NAME}.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-gray-900">1. The Service</h2>
              <p>
                {SITE_NAME} provides an online file conversion and compression service. You can upload
                files (PDF, DOCX, JPG, PNG, MP4), convert them between supported formats, or compress
                them to reduce file size. The service is provided &quot;as is&quot; and is subject to change
                or discontinuation at any time without notice.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-gray-900">2. Acceptable Use</h2>
              <p className="mb-3">By using {SITE_NAME}, you agree that you will not:</p>
              <ul className="list-disc space-y-1.5 pl-5">
                <li>Upload files that contain malware, viruses, or malicious code</li>
                <li>Upload files that infringe on any third party&apos;s intellectual property rights</li>
                <li>Upload files containing illegal content, including but not limited to child sexual abuse material</li>
                <li>Use the service to violate any applicable local, national, or international law</li>
                <li>Attempt to circumvent any technical measures or rate limits</li>
                <li>Use automated tools to abuse or overload the service</li>
                <li>Resell or commercially exploit the service without our written permission</li>
              </ul>
              <p className="mt-3">
                We reserve the right to suspend access to any user who violates these terms.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-gray-900">3. File Handling &amp; Privacy</h2>
              <ul className="list-disc space-y-1.5 pl-5">
                <li>
                  <strong>Automatic deletion:</strong> All uploaded and processed files are automatically
                  and permanently deleted from our servers after 1 hour.
                </li>
                <li>
                  <strong>No analysis:</strong> We do not read, analyze, index, sell, or share the
                  contents of your files. Files are processed mechanically and discarded.
                </li>
                <li>
                  <strong>Encryption:</strong> All file transfers are encrypted using SSL/TLS.
                </li>
                <li>
                  <strong>No account required:</strong> The free tier requires no registration. We do
                  not collect your email address or personal information for free use.
                </li>
              </ul>
              <p className="mt-3">
                For full details, see our <Link href="/privacy" className="text-primary-600 underline underline-offset-2 hover:text-primary-700">Privacy Policy</Link>.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-gray-900">4. Intellectual Property</h2>
              <p>
                You retain full ownership of any files you upload. By uploading a file, you grant
                {' '}{COMPANY} a temporary, limited license solely to process the file for the purpose
                of providing the conversion or compression you requested. This license expires when
                the file is deleted (within 1 hour of processing).
              </p>
              <p className="mt-3">
                The {SITE_NAME} name, logo, interface, and source code are the intellectual property of
                {' '}{COMPANY} and may not be copied, reproduced, or used without written permission.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-gray-900">5. Free Plan Limitations</h2>
              <p>
                The free tier of {SITE_NAME} is provided at no cost with the following limitations:
              </p>
              <ul className="mt-3 list-disc space-y-1.5 pl-5">
                <li>Maximum file size: 20 MB per file</li>
                <li>One file processed at a time</li>
                <li>Rate limits apply to prevent abuse (100 requests per 15 minutes)</li>
                <li>Ads may be displayed</li>
              </ul>
              <p className="mt-3">
                Premium plan limits are described on the <Link href="/pricing" className="text-primary-600 underline underline-offset-2 hover:text-primary-700">Pricing page</Link>.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-gray-900">6. Premium Subscriptions</h2>
              <p>
                Premium subscriptions are billed monthly via Stripe. By subscribing, you authorize us
                to charge your payment method on a recurring basis. You may cancel at any time from
                your account settings. Upon cancellation, access continues until the end of the current
                billing period. No refunds are issued for partial months unless required by applicable law.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-gray-900">7. Disclaimer of Warranties</h2>
              <p>
                {SITE_NAME} is provided &quot;as is&quot; and &quot;as available&quot; without any warranty of any kind,
                express or implied, including but not limited to warranties of merchantability, fitness
                for a particular purpose, or non-infringement. We do not guarantee that the service
                will be uninterrupted, error-free, or produce accurate conversion results in all cases.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-gray-900">8. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, {COMPANY} shall not be liable for any indirect,
                incidental, special, consequential, or punitive damages arising from your use of or
                inability to use {SITE_NAME}, including loss of data, even if we have been advised of
                the possibility of such damages. Our total liability to you shall not exceed the amount
                you paid us in the 12 months preceding the claim.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-gray-900">9. Changes to These Terms</h2>
              <p>
                We may update these Terms of Service from time to time. When we do, we will update the
                &quot;Last updated&quot; date at the top of this page. Continued use of {SITE_NAME} after any
                changes constitutes your acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-gray-900">10. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the
                jurisdiction in which {COMPANY} is registered, without regard to conflict of law
                principles.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-lg font-semibold text-gray-900">11. Contact</h2>
              <p>
                If you have questions about these Terms of Service, please contact us at:{' '}
                <a href={`mailto:${CONTACT_EMAIL}`}
                  className="text-primary-600 underline underline-offset-2 hover:text-primary-700">
                  {CONTACT_EMAIL}
                </a>
              </p>
            </section>

          </div>

          <div className="mt-8 flex gap-4 text-sm text-gray-400">
            <Link href="/privacy" className="hover:text-primary-600 transition-colors duration-150">Privacy Policy</Link>
            <span>·</span>
            <Link href="/" className="hover:text-primary-600 transition-colors duration-150">Back to FilePro</Link>
          </div>
        </div>
      </div>
    </>
  );
}
