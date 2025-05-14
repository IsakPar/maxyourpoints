import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms and Conditions - Max Your Points",
  description: "Terms and conditions for using Max Your Points website.",
}

export default function TermsAndConditionsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Terms and Conditions</h1>
      
      <div className="prose prose-lg">
        <p className="mb-6">
          <strong>Effective Date:</strong> March 4, 2025<br />
          <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
        </p>

        <p className="mb-6">
          Welcome to MaxYourPoints.com, a Sweden-based blog offering expert insights on travel rewards, credit card 
          strategies, airline loyalty programs, and hotel experiences. By accessing or using this website, you agree 
          to be bound by these Terms and Conditions, along with our Privacy Policy, Cookie Policy, and Disclaimer. 
          If you do not agree, please do not use our website.
        </p>

        <hr className="my-8 border-gray-200" />

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>
            <strong>Agreement to Terms:</strong> Your continued use of MaxYourPoints.com constitutes acceptance of 
            these Terms, forming a binding agreement between you and the site operator.
          </li>
          <li>
            <strong>Scope:</strong> These Terms apply to all site visitors, including those who browse, comment, 
            subscribe, or otherwise interact with our content.
          </li>
        </ul>

        <hr className="my-8 border-gray-200" />

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Permitted Use of the Website</h2>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>
            <strong>Intended Use:</strong> This website provides informational content for personal, non-commercial use only.
          </li>
          <li>
            <strong>Age Requirement:</strong> You must be at least 13 years old to access the website. Additional 
            protections for minors are outlined in our Privacy Policy.
          </li>
          <li>
            <strong>Lawful Use Only:</strong> You agree to use the site in compliance with applicable Swedish, EU, 
            and local laws.
          </li>
          <li>
            <strong>Prohibited Uses</strong> include, but are not limited to:
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Attempting to hack, scrape, reverse-engineer, or disrupt the site.</li>
              <li>Publishing unlawful, misleading, defamatory, or infringing content.</li>
              <li>Republishing or using our content commercially without explicit written permission.</li>
            </ul>
          </li>
        </ul>
        <p className="mb-6">
          Violation of these conditions may result in account termination and/or legal action.
        </p>

        <hr className="my-8 border-gray-200" />

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Intellectual Property</h2>
        <p className="mb-6">
          A. Our Original Content
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>
            All original content published on MaxYourPoints.com—including but not limited to text, articles, logos, graphics, and branding—is the intellectual property of MaxYourPoints.com and protected under Swedish and international copyright laws.
          </li>
          <li>
            You may:
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Quote or share excerpts for personal, non-commercial purposes with proper attribution (including a link back to the original source)</li>
              <li>Reference our material as long as it is not modified or misrepresented</li>
            </ul>
          </li>
          <li>
            You may not:
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Reproduce entire articles or content without written permission</li>
              <li>Use our brand, logo, or custom graphics for commercial use</li>
              <li>Claim ownership of any MaxYourPoints content as your own</li>
            </ul>
          </li>
        </ul>
        <p className="mb-6">
          B. Licensed and Third-Party Content
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>
            Some images and media on MaxYourPoints.com are used under open, royalty-free licenses (e.g., Unsplash, Pexels, Creative Commons Zero). These assets remain the property of their original creators and are subject to the terms of their respective licenses.
          </li>
          <li>
            We do not claim copyright over such third-party media.
          </li>
          <li>
            Where required, attribution is provided in line with the license terms. If you believe an image or file has been used in violation of your rights, please contact us at info@maxyourpoints.com, and we will investigate and respond promptly.
          </li>
        </ul>
        <p className="mb-6">
          C. Your Use of Our Content
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>
            You are permitted to share links or excerpts of our content non-commercially, provided:
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>You do not alter the original content</li>
              <li>You include visible credit to MaxYourPoints.com</li>
              <li>You link directly to the original article or page</li>
            </ul>
          </li>
          <li>
            All other uses—particularly commercial republication or wholesale copying—are strictly prohibited without written consent.
          </li>
        </ul>

        <hr className="my-8 border-gray-200" />

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Affiliate Disclosure</h2>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>
            <strong>How We Earn:</strong> MaxYourPoints.com participates in affiliate programs (e.g., Amazon Associates, 
            travel booking affiliates) and may receive commissions when you click affiliate links and make purchases.
          </li>
          <li>
            <strong>Transparency:</strong> Our editorial integrity is maintained, and affiliate partnerships do not 
            influence our objectivity.
          </li>
          <li>
            <strong>No Endorsement or Guarantee:</strong> We do not guarantee the accuracy or reliability of third-party 
            offers. Always review terms directly with the provider.
          </li>
          <li>
            <strong>Compliance:</strong> All affiliate relationships are disclosed in accordance with Swedish, EU, and 
            US consumer protection and advertising laws.
          </li>
        </ul>

        <hr className="my-8 border-gray-200" />

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Limitation of Liability</h2>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>
            <strong>Informational Content:</strong> Content on the website is provided "as is" for general guidance. 
            It does not constitute professional financial, legal, or travel advice.
          </li>
          <li>
            <strong>No Guarantees:</strong> We make no warranties regarding the accuracy, completeness, or timeliness 
            of any content.
          </li>
          <li>
            <strong>Liability Cap:</strong> To the extent permitted by Swedish and EU law, MaxYourPoints.com, its 
            owners, affiliates, and contributors are not liable for:
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Losses resulting from site use or reliance on information presented;</li>
              <li>Third-party link outcomes (e.g., declined credit applications or travel disruptions);</li>
              <li>Any indirect, consequential, or incidental damages.</li>
            </ul>
          </li>
        </ul>

        <hr className="my-8 border-gray-200" />

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. External Links</h2>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>
            <strong>Third-Party Websites:</strong> The website may link to external resources, including affiliate or 
            advertising partners.
          </li>
          <li>
            <strong>No Control or Endorsement:</strong> We are not responsible for the content, policies, or actions 
            of third-party websites. Use them at your own risk.
          </li>
        </ul>

        <hr className="my-8 border-gray-200" />

        <h2 className="text-2xl font-semibold mt-8 mb-4">7. User-Generated Content</h2>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>
            <strong>Ownership and License:</strong> By posting comments, reviews, or content on MaxYourPoints.com, 
            you grant us a perpetual, royalty-free, worldwide license to use, display, and modify your submission.
          </li>
          <li>
            <strong>Content Standards:</strong> User submissions must comply with Swedish and EU laws, and must not 
            include spam, hate speech, personal attacks, illegal content, or intellectual property violations.
          </li>
          <li>
            <strong>Moderation Rights:</strong> We reserve the right to moderate, edit, or remove content at our 
            sole discretion.
          </li>
        </ul>

        <hr className="my-8 border-gray-200" />

        <h2 className="text-2xl font-semibold mt-8 mb-4">8. Data Protection and Privacy</h2>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>
            <strong>GDPR Compliance:</strong> We process personal data in accordance with the General Data Protection 
            Regulation (GDPR) and Swedish data protection laws.
          </li>
          <li>
            <strong>Your Rights:</strong> For information about how we collect, use, and protect your data, see our 
            Privacy Policy.
          </li>
          <li>
            <strong>Cookies:</strong> See our Cookie Policy for information on tracking technologies and your control 
            options.
          </li>
        </ul>

        <hr className="my-8 border-gray-200" />

        <h2 className="text-2xl font-semibold mt-8 mb-4">9. Indemnification</h2>
        <p className="mb-6">
          You agree to indemnify and hold harmless MaxYourPoints.com, its affiliates, and contributors from and 
          against any claims, losses, liabilities, damages, or legal costs resulting from:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Your use of the website;</li>
          <li>Breach of these Terms;</li>
          <li>Any unlawful activity committed through your use of the site.</li>
        </ul>

        <hr className="my-8 border-gray-200" />

        <h2 className="text-2xl font-semibold mt-8 mb-4">10. Termination of Use</h2>
        <p className="mb-6">
          We may terminate or suspend your access to the site, without notice, if we reasonably believe you have 
          violated these Terms or applicable laws. Upon termination, your rights to use the site cease immediately. 
          We reserve the right to retain necessary data in accordance with applicable legal obligations.
        </p>

        <hr className="my-8 border-gray-200" />

        <h2 className="text-2xl font-semibold mt-8 mb-4">11. Dispute Resolution</h2>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>
            <strong>Initial Resolution:</strong> We encourage users to contact us first to resolve any concerns informally.
          </li>
          <li>
            <strong>Mediation and Arbitration:</strong> If disputes remain unresolved, they will be referred to a 
            neutral mediator in Sweden. If necessary, binding arbitration may follow, governed by the Swedish 
            Arbitration Act.
          </li>
          <li>
            <strong>Legal Venue:</strong> If arbitration fails or is not applicable, disputes shall be submitted 
            to the exclusive jurisdiction of the Swedish courts.
          </li>
        </ul>

        <hr className="my-8 border-gray-200" />

        <h2 className="text-2xl font-semibold mt-8 mb-4">12. Changes to These Terms</h2>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>
            <strong>Updates:</strong> We may modify these Terms at any time. Updated versions will be posted on this 
            page with the new effective date.
          </li>
          <li>
            <strong>User Notification:</strong> Significant changes will be highlighted on the site or communicated 
            via email to subscribers.
          </li>
          <li>
            <strong>Continued Use:</strong> Your continued use of the website after such updates constitutes your 
            acceptance of the revised Terms.
          </li>
        </ul>

        <hr className="my-8 border-gray-200" />

        <h2 className="text-2xl font-semibold mt-8 mb-4">13. Governing Law</h2>
        <p className="mb-6">
          These Terms and Conditions are governed by Swedish law and applicable EU regulations. Any unresolved 
          disputes shall be brought exclusively before the courts of Sweden.
        </p>

        <hr className="my-8 border-gray-200" />

        <h2 className="text-2xl font-semibold mt-8 mb-4">14. Email Communications and Subscriptions</h2>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>
            <strong>Opt-In:</strong> By subscribing, you agree to receive newsletters, promotions, and other 
            communications from us.
          </li>
          <li>
            <strong>Opt-Out:</strong> You may unsubscribe at any time via the link in our emails or by contacting 
            info@maxyourpoints.com.
          </li>
          <li>
            <strong>Frequency:</strong> We aim to provide high-value content without overwhelming your inbox.
          </li>
        </ul>

        <hr className="my-8 border-gray-200" />

        <h2 className="text-2xl font-semibold mt-8 mb-4">15. Cookie Usage</h2>
        <p className="mb-6">
          We use cookies and similar technologies to improve functionality, analyze site traffic, and support 
          affiliate tracking. See our Cookie Policy for full details and consent options.
        </p>

        <hr className="my-8 border-gray-200" />

        <h2 className="text-2xl font-semibold mt-8 mb-4">16. Force Majeure</h2>
        <p className="mb-6">
          We are not liable for any delays, interruptions, or failures in service due to causes beyond our 
          reasonable control, including natural disasters, cyberattacks, government regulations, or utility failures.
        </p>

        <hr className="my-8 border-gray-200" />

        <h2 className="text-2xl font-semibold mt-8 mb-4">17. Contact Us</h2>
        <p className="mb-6">
          If you have questions about these Terms and Conditions, please contact us:
        </p>
        <p className="mb-6">
          📧 Email: info@maxyourpoints.com<br />
          🕒 Response Time: Within 5 business days.
        </p>
      </div>
    </div>
  )
} 