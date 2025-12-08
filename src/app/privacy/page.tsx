import Section from '@/components/Section'

export const metadata = {
  title: 'Privacy Policy - Ethiopian Today',
  description: 'Privacy Policy for Ethiopian Today - Learn how we collect, use, and protect your data.',
}

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4 pb-6 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-4xl font-bold">Privacy Policy</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Last updated: December 1, 2025
        </p>
      </div>

      <Section title="Introduction">
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Ethiopian Today ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains 
            how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
            By using Ethiopian Today, you agree to the collection and use of information in accordance with this policy.
          </p>
        </div>
      </Section>

      <Section title="Information We Collect">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">1. Information You Provide</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We may collect personal information that you voluntarily provide when you:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-700 dark:text-gray-300">
              <li>Create an account or sign up for our services</li>
              <li>Subscribe to our newsletter or email updates</li>
              <li>Contact us through our contact forms</li>
              <li>Participate in surveys or feedback requests</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-3">
              This information may include your name, email address, and any other information you choose to provide.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">2. Automatically Collected Information</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              When you visit our website, we automatically collect certain information about your device, including:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-700 dark:text-gray-300">
              <li>IP address and browser type</li>
              <li>Operating system and device information</li>
              <li>Pages visited and time spent on our site</li>
              <li>Referring website and search terms used</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">3. Cookies and Tracking Technologies</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We use cookies and similar tracking technologies to improve your experience, including:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-700 dark:text-gray-300">
              <li>Essential cookies for site functionality</li>
              <li>Analytics cookies to understand usage patterns</li>
              <li>Preference cookies to remember your settings (e.g., dark mode)</li>
              <li>Local storage for caching content and improving performance</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section title="How We Use Your Information">
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            We use the collected information for the following purposes:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>To provide and maintain our exchange rate and economic news services</li>
            <li>To improve and personalize your experience on our website</li>
            <li>To send you updates about exchange rates and economic news (if subscribed)</li>
            <li>To respond to your inquiries and provide customer support</li>
            <li>To analyze website usage and improve our content and features</li>
            <li>To detect and prevent fraud or security issues</li>
            <li>To comply with legal obligations and enforce our terms</li>
          </ul>
        </div>
      </Section>

      <Section title="Data Sharing and Disclosure">
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li><strong>Service Providers:</strong> With trusted third-party service providers who assist us in operating our website and services (e.g., hosting, analytics)</li>
            <li><strong>Legal Requirements:</strong> When required by law, court order, or government request</li>
            <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
            <li><strong>With Your Consent:</strong> When you explicitly consent to share your information</li>
          </ul>
        </div>
      </Section>

      <Section title="Third-Party Services">
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            Our website may use third-party services, including:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li><strong>Analytics:</strong> We may use analytics services to understand how users interact with our website</li>
            <li><strong>AI Services:</strong> We use AI services (Groq) to generate economic news content</li>
            <li><strong>External Data Sources:</strong> We fetch exchange rate data from external sources and APIs</li>
          </ul>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
            These third parties have their own privacy policies and we encourage you to review them.
          </p>
        </div>
      </Section>

      <Section title="Data Security">
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            We implement appropriate technical and organizational security measures to protect your personal information 
            against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over 
            the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
          </p>
        </div>
      </Section>

      <Section title="Data Retention">
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            We retain your personal information only for as long as necessary to fulfill the purposes outlined in this 
            Privacy Policy, unless a longer retention period is required by law. Cached content and preferences stored 
            in your browser's local storage remain until you clear them.
          </p>
        </div>
      </Section>

      <Section title="Your Rights">
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            Depending on your location, you may have the following rights regarding your personal information:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li><strong>Access:</strong> Request access to the personal information we hold about you</li>
            <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
            <li><strong>Deletion:</strong> Request deletion of your personal information</li>
            <li><strong>Objection:</strong> Object to the processing of your personal information</li>
            <li><strong>Data Portability:</strong> Request a copy of your data in a portable format</li>
            <li><strong>Withdraw Consent:</strong> Withdraw consent for data processing where applicable</li>
          </ul>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
            To exercise these rights, please contact us at <a href="mailto:privacy@ethioexchangerate.com" className="text-blue-600 dark:text-blue-400 hover:underline">privacy@ethioexchangerate.com</a>.
          </p>
        </div>
      </Section>

      <Section title="Children's Privacy">
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Our services are not directed to individuals under the age of 13. We do not knowingly collect personal 
            information from children under 13. If you become aware that a child has provided us with personal information, 
            please contact us and we will take steps to delete such information.
          </p>
        </div>
      </Section>

      <Section title="International Data Transfers">
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Your information may be transferred to and processed in countries other than your country of residence. 
            These countries may have data protection laws that are different from the laws of your country. We take 
            appropriate measures to ensure that your personal information remains protected in accordance with this Privacy Policy.
          </p>
        </div>
      </Section>

      <Section title="Changes to This Privacy Policy">
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new 
            Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy 
            Policy periodically for any changes.
          </p>
        </div>
      </Section>

      <Section title="Contact Us">
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            If you have any questions about this Privacy Policy or our data practices, please contact us:
          </p>
          <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
            <p className="text-gray-700 dark:text-gray-300"><strong>Email:</strong> privacy@ethiopiantoday.com</p>
            <p className="text-gray-700 dark:text-gray-300 mt-2"><strong>Address:</strong> Addis Ababa, Ethiopia</p>
          </div>
        </div>
      </Section>

      <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          By using Ethiopian Today, you acknowledge that you have read and understood this Privacy Policy.
        </p>
      </div>
    </div>
  )
}
