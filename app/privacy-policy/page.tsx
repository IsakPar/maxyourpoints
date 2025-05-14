import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy - Max Your Points",
  description: "Privacy policy and data protection practices for Max Your Points website.",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="prose prose-lg">
        <p className="mb-6">
          <strong>Effective Date:</strong> March 4, 2025<br />
          <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
        </p>

        <p className="mb-6">
          At MaxYourPoints.com, your privacy matters. We are a Sweden-based travel blog that provides insights on 
          maximizing travel rewards, credit card strategies, and loyalty programs. This Privacy Policy explains how 
          we collect, use, store, and protect your personal data—and your rights under the General Data Protection 
          Regulation (GDPR), UK GDPR, ePrivacy Directive, and California Consumer Privacy Act (CCPA).
        </p>

        <p className="mb-6">
          By using our website, you agree to the terms of this policy. If you have any questions, please contact us 
          at info@maxyourpoints.com.
        </p>

        <hr className="my-8 border-gray-200" />

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
        <p className="mb-4">
          We collect both personal and non-personal data to improve your experience and operate our services.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Personal Data You Provide Voluntarily</h3>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Name and Email Address (e.g., when subscribing to newsletters, submitting forms)</li>
          <li>Information Shared in Communications (e.g., questions, feedback)</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">Automatically Collected Data</h3>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>IP address</li>
          <li>Browser type and device information</li>
          <li>Operating system</li>
          <li>Referral sources and URLs visited</li>
          <li>Time spent on pages, interaction behavior</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">Cookies and Tracking Data</h3>
        <p className="mb-4">
          We use cookies and similar technologies to:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Operate the website</li>
          <li>Analyze site performance</li>
          <li>Deliver relevant content and advertising</li>
        </ul>
        <p className="mb-6">
          (For full details, see our Cookie Policy).
        </p>

        <hr className="my-8 border-gray-200" />

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Lawful Basis for Data Processing</h2>
        <p className="mb-4">
          Under GDPR, we process your data using one or more of the following legal bases:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Consent: When you opt into newsletters or accept non-essential cookies</li>
          <li>Contractual Necessity: When responding to inquiries or fulfilling user requests</li>
          <li>Legitimate Interests: For security, analytics, and improving services—balanced with your rights</li>
          <li>Legal Obligation: To comply with Swedish or EU regulatory requirements</li>
        </ul>

        <hr className="my-8 border-gray-200" />

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. How We Use Your Data</h2>
        <p className="mb-4">
          We use your information to:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Operate, maintain, and enhance MaxYourPoints.com</li>
          <li>Customize your experience based on preferences</li>
          <li>Send email newsletters and promotional content (with consent)</li>
          <li>Analyze usage trends via tools like Google Analytics</li>
          <li>Track affiliate referrals (e.g., through Amazon Associates)</li>
          <li>Protect against fraud and ensure security</li>
          <li>Fulfill legal requirements (e.g., financial reporting)</li>
        </ul>

        <hr className="my-8 border-gray-200" />

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Cookies and Tracking Technologies</h2>
        <p className="mb-4">
          We use cookies to:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Enable essential website functions</li>
          <li>Analyze user behavior</li>
          <li>Store preferences</li>
          <li>Deliver targeted ads and track affiliate referrals</li>
        </ul>
        <p className="mb-6">
          You can manage your cookie preferences via our Cookie Consent Tool or through your browser settings. 
          For more information, visit our full Cookie Policy.
        </p>

        <hr className="my-8 border-gray-200" />

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Data Sharing and Third-Party Services</h2>
        <p className="mb-4">
          We do not sell or rent your personal data. We may share it with trusted partners, including:
        </p>
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-4">Provider</th>
                <th className="text-left py-2 px-4">Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2 px-4">Google Analytics</td>
                <td className="py-2 px-4">Website analytics</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-4">Mailchimp</td>
                <td className="py-2 px-4">Email list management</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 px-4">Amazon Associates</td>
                <td className="py-2 px-4">Affiliate referral tracking</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mb-4">
          These partners may store or process data outside the EU (e.g., the United States). In such cases, we ensure 
          GDPR-compliant safeguards (e.g., Standard Contractual Clauses or equivalent legal protections).
        </p>
        <p className="mb-4">
          We may also disclose your data:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>To comply with legal obligations</li>
          <li>To protect our rights or investigate fraud or abuse</li>
        </ul>
        <p className="mb-6">
          Third-party websites and links on MaxYourPoints.com are subject to their own privacy policies. Please 
          review them separately.
        </p>

        <hr className="my-8 border-gray-200" />

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Your Data Protection Rights</h2>
        <p className="mb-4">
          If you are located in the EU, UK, or another region with similar laws, you have the right to:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Access: Request a copy of your personal data</li>
          <li>Rectification: Correct inaccurate or incomplete data</li>
          <li>Erasure ("Right to be Forgotten"): Ask us to delete your data (with legal exceptions)</li>
          <li>Objection: Object to certain types of processing, such as marketing</li>
          <li>Data Portability: Receive your data in a commonly used, machine-readable format</li>
          <li>Withdraw Consent: Revoke any consent you previously gave (e.g., newsletter opt-in)</li>
        </ul>
        <p className="mb-6">
          📧 To exercise your rights, contact info@maxyourpoints.com.<br />
          📩 California residents may email us with the subject "CCPA Opt-Out" to opt out of any applicable data 
          sharing classified as a "sale" under CCPA.
        </p>

        <hr className="my-8 border-gray-200" />

        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Children's Privacy</h2>
        <p className="mb-6">
          MaxYourPoints.com does not knowingly collect personal data from children under the age of 13. If you 
          believe we may have inadvertently collected data from a child, please contact us so we can delete it.
        </p>

        <hr className="my-8 border-gray-200" />

        <h2 className="text-2xl font-semibold mt-8 mb-4">8. Data Retention</h2>
        <p className="mb-4">
          We only retain your personal data for as long as necessary for the purpose it was collected.
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Newsletter Data: Retained until you unsubscribe or are inactive for 12 months (up to 5 years maximum)</li>
          <li>Analytics Data: Retained up to 24 months, then anonymized</li>
          <li>Legal and Tax Records: Retained per applicable legal requirements</li>
          <li>Non-personal, aggregated data may be stored indefinitely</li>
        </ul>

        <hr className="my-8 border-gray-200" />

        <h2 className="text-2xl font-semibold mt-8 mb-4">9. Security Measures</h2>
        <p className="mb-4">
          We take appropriate security measures to protect your data, including:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>SSL encryption</li>
          <li>Role-based access controls</li>
          <li>Monitoring and detection systems</li>
        </ul>
        <p className="mb-6">
          While we follow best practices, no system is completely secure. In the event of a data breach, we will 
          notify you as required by law.
        </p>

        <hr className="my-8 border-gray-200" />

        <h2 className="text-2xl font-semibold mt-8 mb-4">10. Opt-Out Options</h2>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Emails: Unsubscribe at any time via the link in our messages</li>
          <li>Cookies: Change your preferences via our cookie banner or your browser</li>
          <li>Tracking: We do not respond to browser "Do Not Track" signals, but tools like Google Analytics Opt-Out are supported</li>
        </ul>

        <hr className="my-8 border-gray-200" />

        <h2 className="text-2xl font-semibold mt-8 mb-4">11. External Links</h2>
        <p className="mb-6">
          Our content may include links to external websites (e.g., affiliates, partners, or service providers). 
          We are not responsible for their privacy practices. Please review their policies before submitting data.
        </p>

        <hr className="my-8 border-gray-200" />

        <h2 className="text-2xl font-semibold mt-8 mb-4">12. Complaints and Disputes</h2>
        <p className="mb-4">
          If you have privacy-related concerns:
        </p>
        <ol className="list-decimal pl-6 mb-6 space-y-2">
          <li>Email us at info@maxyourpoints.com with the subject line:<br />
            "Privacy Complaint – [Your Name]"</li>
          <li>We will respond within 30 days.</li>
        </ol>
        <p className="mb-6">
          If unresolved, EU residents may contact their local Data Protection Authority, or the Swedish Authority 
          for Privacy Protection (IMY).
        </p>

        <hr className="my-8 border-gray-200" />

        <h2 className="text-2xl font-semibold mt-8 mb-4">13. Updates to This Privacy Policy</h2>
        <p className="mb-6">
          We may update this policy from time to time. Any changes will be posted here with a revised effective date. 
          Substantial changes will be highlighted on the site or communicated to subscribers.
        </p>
        <p className="mb-6">
          Your continued use of MaxYourPoints.com after changes are posted signifies your acceptance of the revised policy.
        </p>

        <hr className="my-8 border-gray-200" />

        <h2 className="text-2xl font-semibold mt-8 mb-4">14. Contact Us</h2>
        <p className="mb-6">
          For any questions or concerns regarding this Privacy Policy:
        </p>
        <p className="mb-6">
          📧 Email: info@maxyourpoints.com<br />
          🕒 Response Time: Within 5 business days
        </p>
      </div>
    </div>
  )
} 