import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cookie Policy - Max Your Points",
  description: "Cookie policy and data collection practices for Max Your Points website.",
}

export default function CookiePolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Cookie Policy</h1>
      
      <div className="prose prose-lg">
        <p className="mb-6">
          <strong>Effective Date:</strong> March 4, 2025<br />
          <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
        </p>

        <p className="mb-6">
          At MaxYourPoints.com, we use cookies and similar technologies to enhance your experience, analyze website 
          performance, and support personalized advertising. This Cookie Policy explains what cookies are, how we use 
          them, your rights, and how to manage your preferences.
        </p>

        <p className="mb-6">
          We comply with the EU General Data Protection Regulation (GDPR), the ePrivacy Directive, UK GDPR, and, 
          where applicable, California Consumer Privacy Act (CCPA).
        </p>

        <hr className="my-8 border-gray-200" />

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. What Are Cookies?</h2>
        <p className="mb-4">
          Cookies are small text files that are stored on your device (e.g., computer, tablet, smartphone) when you 
          visit our website. They help us:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Ensure the website functions properly</li>
          <li>Remember your preferences</li>
          <li>Understand how visitors interact with our content</li>
          <li>Support advertising and affiliate tracking</li>
        </ul>
        <p className="mb-6">
          Cookies may collect information such as your IP address, browser type, device data, pages visited, and 
          session duration.
        </p>

        <hr className="my-8 border-gray-200" />

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Cookies</h2>
        <p className="mb-4">
          We use both first-party and third-party cookies across the following categories:
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Essential Cookies</h3>
        <p className="mb-4">
          These cookies are strictly necessary for the functioning of the site and do not require your consent. 
          They support features such as:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Site navigation</li>
          <li>Security and authentication</li>
          <li>Access to secure areas of the website</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">Performance and Analytics Cookies</h3>
        <p className="mb-4">
          Used to collect anonymized data on how visitors interact with the site. This includes page views, bounce 
          rates, and session durations. These help us improve functionality and usability.
        </p>
        <p className="mb-4">
          Example: Google Analytics
        </p>
        <p className="mb-6">
          Consent Required: Yes
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Functional Cookies</h3>
        <p className="mb-4">
          These remember user preferences and settings to personalize your experience, such as:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Language selection</li>
          <li>Login details (if applicable)</li>
          <li>UI customization</li>
        </ul>
        <p className="mb-6">
          Consent Required: Yes
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Advertising and Targeting Cookies</h3>
        <p className="mb-4">
          Used to deliver relevant ads, track conversions, and measure affiliate referrals. These cookies may be 
          set by us or third-party networks.
        </p>
        <p className="mb-4">
          Examples:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Amazon Associates (for affiliate tracking)</li>
          <li>Ad service providers (for personalized advertising)</li>
        </ul>
        <p className="mb-6">
          Consent Required: Yes
        </p>

        <hr className="my-8 border-gray-200" />

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Third-Party Cookies and Retention Periods</h2>
        <p className="mb-4">
          We work with the following service providers who may place cookies on your device:
        </p>
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-4">Provider</th>
                <th className="text-left py-2 px-4">Purpose</th>
                <th className="text-left py-2 px-4">Retention</th>
                <th className="text-left py-2 px-4">Policy Link</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2 px-4">Google Analytics</td>
                <td className="py-2 px-4">Site analytics</td>
                <td className="py-2 px-4">Up to 2 years</td>
                <td className="py-2 px-4">Privacy Policy</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-4">Amazon Associates</td>
                <td className="py-2 px-4">Affiliate tracking</td>
                <td className="py-2 px-4">Up to 1 year</td>
                <td className="py-2 px-4">Privacy Notice</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-4">Mailchimp</td>
                <td className="py-2 px-4">Email behavior analytics</td>
                <td className="py-2 px-4">Varies</td>
                <td className="py-2 px-4">Privacy Policy</td>
              </tr>
            </tbody>
          </table>
        </div>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Session cookies expire when you close your browser.</li>
          <li>Persistent cookies remain on your device until their set expiration date or you delete them manually.</li>
        </ul>

        <hr className="my-8 border-gray-200" />

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. How to Manage Your Cookie Preferences</h2>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">On Our Site</h3>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Use the Cookie Consent Banner shown when you first visit.</li>
          <li>You can change or withdraw consent at any time via the "Cookie Settings" link in the site footer.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">In Your Browser</h3>
        <p className="mb-4">
          You can control and delete cookies through your browser settings:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Chrome: Settings &gt; Privacy and security &gt; Cookies and other site data</li>
          <li>Firefox: Settings &gt; Privacy & Security &gt; Cookies and Site Data</li>
          <li>Safari: Preferences &gt; Privacy &gt; Manage Website Data</li>
          <li>Microsoft Edge: Settings &gt; Cookies and site permissions</li>
        </ul>
        <p className="mb-6">
          Refer to your browser's help documentation for full instructions.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Third-Party Opt-Out Tools</h3>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Google Analytics: Opt-out browser add-on</li>
          <li>Interest-Based Ads: Opt out via Network Advertising Initiative or Digital Advertising Alliance</li>
        </ul>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="text-yellow-700">
            ⚠️ Note: Disabling some cookies may impact site functionality or personalization features.
          </p>
        </div>

        <hr className="my-8 border-gray-200" />

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Your Data Protection Rights</h2>
        <p className="mb-4">
          Under the GDPR and UK GDPR, you have the right to:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Access the data collected through cookies</li>
          <li>Request deletion or correction</li>
          <li>Withdraw your consent at any time</li>
          <li>Object to data processing based on legitimate interest</li>
        </ul>
        <p className="mb-6">
          To exercise these rights, contact us at info@maxyourpoints.com.
        </p>
        <p className="mb-6">
          For California residents (under CCPA), you may also:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Request information about data collected</li>
          <li>Opt-out of data "sales" (including certain third-party sharing) by emailing us with "CCPA Opt-Out" in the subject line.</li>
        </ul>

        <hr className="my-8 border-gray-200" />

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Children's Privacy</h2>
        <p className="mb-6">
          We do not knowingly use cookies to collect personal data from individuals under the age of 13. If you 
          believe a child's data has been collected, please contact us immediately.
        </p>

        <hr className="my-8 border-gray-200" />

        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Updates to This Policy</h2>
        <p className="mb-6">
          We may update this Cookie Policy from time to time. Updates will be posted here with a revised "Effective 
          Date." Significant changes will be highlighted on the site or communicated to subscribers by email if necessary.
        </p>

        <hr className="my-8 border-gray-200" />

        <h2 className="text-2xl font-semibold mt-8 mb-4">8. Contact Us</h2>
        <p className="mb-6">
          If you have questions or concerns about our use of cookies or your rights:
        </p>
        <p className="mb-6">
          📧 Email: info@maxyourpoints.com<br />
          🕒 Response Time: Within 5 business days
        </p>
      </div>
    </div>
  )
} 