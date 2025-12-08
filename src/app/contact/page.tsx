export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Information */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Have questions about exchange rates, our services, or advertising opportunities? We'd love to hear from you.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Email</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">General: info@ethioexchangerate.com</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Support: support@ethioexchangerate.com</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Advertising: ads@ethioexchangerate.com</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Location</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Serving Ethiopian diaspora worldwide
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Response Time</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  We respond within 24-48 hours
                </p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-900 dark:text-yellow-300 mb-2">
              🎯 Business Inquiries
            </h3>
            <p className="text-sm text-yellow-800 dark:text-yellow-400">
              Interested in advertising or partnership opportunities? Contact our business team at <strong>ads@ethioexchangerate.com</strong>
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Send us a Message</h2>
          
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Name *
              </label>
              <input
                type="text"
                id="name"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-2">
                Subject *
              </label>
              <select
                id="subject"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a topic</option>
                <option value="general">General Inquiry</option>
                <option value="support">Technical Support</option>
                <option value="advertising">Advertising & Partnerships</option>
                <option value="feedback">Feedback & Suggestions</option>
                <option value="data">Data Accuracy Issue</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                Message *
              </label>
              <textarea
                id="message"
                required
                rows={5}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your message..."
              />
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Send Message
            </button>

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              By submitting this form, you agree to our Privacy Policy
            </p>
          </form>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <summary className="font-semibold cursor-pointer">
              How often are exchange rates updated?
            </summary>
            <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
              Our exchange rates are updated multiple times daily. Official rates are sourced from CBE and NBE, while parallel market rates are updated in real-time.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <summary className="font-semibold cursor-pointer">
              Can I use your data for my business?
            </summary>
            <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
              Yes! We offer API access for businesses. Contact us at ads@ethioexchangerate.com for pricing and integration details.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <summary className="font-semibold cursor-pointer">
              How can I advertise on your website?
            </summary>
            <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
              We offer various advertising options including banner ads, sponsored content, and newsletter placements. Email ads@ethioexchangerate.com for our media kit.
            </p>
          </details>
        </div>
      </div>
    </div>
  )
}
