import Section from '@/components/Section'

export const metadata = {
  title: 'Terms of Service - Ethiopian Today',
  description: 'Terms of Service for Ethiopian Today - Read our terms and conditions for using our exchange rate and economic news services.',
}

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4 pb-6 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-4xl font-bold">Terms of Service</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Last updated: December 1, 2025
        </p>
      </div>

      <Section title="Acceptance of Terms">
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Welcome to Ethiopian Today. By accessing or using our website and services, you agree to be bound by these 
            Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our services.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
            We reserve the right to modify these Terms at any time. Your continued use of the service after changes 
            constitutes acceptance of the modified Terms.
          </p>
        </div>
      </Section>

      <Section title="Description of Services">
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            Ethiopian Today provides the following services:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>Real-time Ethiopian Birr exchange rate information (official and parallel market rates)</li>
            <li>Historical exchange rate data and trend analysis</li>
            <li>Currency conversion calculator</li>
            <li>AI-generated economic news and analysis</li>
            <li>Information about Ethiopia's exchange rate reform and economic developments</li>
          </ul>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
            Our services are provided "as is" and we reserve the right to modify, suspend, or discontinue any part 
            of our services at any time without notice.
          </p>
        </div>
      </Section>

      <Section title="User Responsibilities">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-3">1. Acceptable Use</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
              You agree to use our services only for lawful purposes. You must not:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
              <li>Use the service in any way that violates applicable laws or regulations</li>
              <li>Attempt to gain unauthorized access to our systems or networks</li>
              <li>Use automated tools to scrape or harvest data without permission</li>
              <li>Transmit viruses, malware, or other harmful code</li>
              <li>Impersonate any person or entity or misrepresent your affiliation</li>
              <li>Interfere with or disrupt the service or servers</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">2. Account Registration</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              If you create an account, you are responsible for maintaining the confidentiality of your account 
              credentials and for all activities that occur under your account. You must notify us immediately of 
              any unauthorized use of your account.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">3. Accuracy of Information</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              You agree to provide accurate, current, and complete information when using our services and to update 
              such information as necessary to maintain its accuracy.
            </p>
          </div>
        </div>
      </Section>

      <Section title="Disclaimer of Warranties">
        <div className="p-6 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <h3 className="text-lg font-semibold mb-3 text-yellow-900 dark:text-yellow-100">Important Notice</h3>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              <strong>Exchange Rate Information:</strong> The exchange rates displayed on our website are provided for 
              informational purposes only. While we strive to provide accurate and up-to-date information, we do not 
              guarantee the accuracy, completeness, or timeliness of the data.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              <strong>Not Financial Advice:</strong> The information provided on Ethiopian Today is not intended to be 
              and does not constitute financial advice, investment advice, trading advice, or any other type of professional 
              advice. You should not make any financial decisions based solely on the information provided on our website.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              <strong>AI-Generated Content:</strong> Some content on our website is generated using artificial intelligence. 
              While we strive for accuracy, AI-generated content may contain errors or inaccuracies. Always verify important 
              information from official sources.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              <strong>Third-Party Data:</strong> Exchange rates are sourced from various third-party providers. We are not 
              responsible for the accuracy of data provided by these third parties.
            </p>
          </div>
        </div>
      </Section>

      <Section title="Limitation of Liability">
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            To the fullest extent permitted by law:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>Ethiopian Today and its affiliates shall not be liable for any indirect, incidental, special, consequential, 
            or punitive damages arising from your use of our services</li>
            <li>We are not responsible for any financial losses resulting from reliance on exchange rate information or 
            economic analysis provided on our website</li>
            <li>We do not guarantee uninterrupted, secure, or error-free operation of our services</li>
            <li>Our total liability to you for all claims related to our services shall not exceed the amount you paid 
            us (if any) in the twelve months prior to the claim</li>
          </ul>
        </div>
      </Section>

      <Section title="Intellectual Property Rights">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-3">1. Our Content</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              All content on Ethiopian Today, including text, graphics, logos, images, and software, is the property 
              of Ethiopian Today or its content suppliers and is protected by intellectual property laws. You may not 
              reproduce, distribute, modify, or create derivative works without our express written permission.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">2. Limited License</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We grant you a limited, non-exclusive, non-transferable license to access and use our services for personal, 
              non-commercial purposes. This license does not include the right to download (except for page caching), 
              modify, or resell any content without our permission.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">3. Trademarks</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              "Ethiopian Today" and our logos are trademarks. You may not use these trademarks without our prior written consent.
            </p>
          </div>
        </div>
      </Section>

      <Section title="Third-Party Links and Services">
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Our website may contain links to third-party websites or services that are not owned or controlled by 
            Ethiopian Today. We have no control over and assume no responsibility for the content, privacy policies, 
            or practices of any third-party websites or services. You acknowledge and agree that we shall not be 
            responsible or liable for any damage or loss caused by your use of any third-party content or services.
          </p>
        </div>
      </Section>

      <Section title="Data Collection and Privacy">
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Your use of our services is also governed by our Privacy Policy. By using our services, you consent to 
            the collection and use of your information as described in our{' '}
            <a href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </Section>

      <Section title="Indemnification">
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            You agree to indemnify and hold harmless Ethiopian Today, its affiliates, officers, directors, employees, 
            and agents from any claims, losses, damages, liabilities, and expenses (including legal fees) arising from:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-700 dark:text-gray-300">
            <li>Your use of our services</li>
            <li>Your violation of these Terms</li>
            <li>Your violation of any rights of another party</li>
            <li>Any content you submit or transmit through our services</li>
          </ul>
        </div>
      </Section>

      <Section title="Termination">
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            We reserve the right to terminate or suspend your access to our services immediately, without prior notice 
            or liability, for any reason, including if you breach these Terms. Upon termination, your right to use the 
            service will immediately cease. All provisions of these Terms that by their nature should survive termination 
            shall survive, including ownership provisions, warranty disclaimers, and limitations of liability.
          </p>
        </div>
      </Section>

      <Section title="Governing Law and Dispute Resolution">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-3">1. Governing Law</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of Ethiopia, without regard 
              to its conflict of law provisions.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">2. Dispute Resolution</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Any disputes arising from these Terms or your use of our services shall be resolved through good faith 
              negotiations. If negotiations fail, disputes shall be subject to the exclusive jurisdiction of the courts 
              of Ethiopia.
            </p>
          </div>
        </div>
      </Section>

      <Section title="Severability">
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall 
            continue in full force and effect. The invalid or unenforceable provision shall be replaced with a valid 
            provision that most closely matches the intent of the original provision.
          </p>
        </div>
      </Section>

      <Section title="Entire Agreement">
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            These Terms, together with our Privacy Policy, constitute the entire agreement between you and Ethiopian 
            Today regarding your use of our services and supersede all prior agreements and understandings.
          </p>
        </div>
      </Section>

      <Section title="Contact Information">
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            If you have any questions about these Terms of Service, please contact us:
          </p>
          <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
            <p className="text-gray-700 dark:text-gray-300"><strong>Email:</strong> legal@ethioexchangerate.com</p>
            <p className="text-gray-700 dark:text-gray-300 mt-2"><strong>Address:</strong> Addis Ababa, Ethiopia</p>
          </div>
        </div>
      </Section>

      <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          By using Ethiopian Today, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
        </p>
      </div>
    </div>
  )
}
