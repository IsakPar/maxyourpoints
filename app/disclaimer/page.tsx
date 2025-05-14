import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Legal Disclaimer - Max Your Points",
  description: "Important legal disclaimers and notices for Max Your Points users.",
}

export default function DisclaimerPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Legal Disclaimer</h1>
      
      <div className="prose prose-lg">
        <p className="mb-6">
          <strong>Effective Date:</strong> March 4, 2025<br />
          <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
        </p>

        <p className="mb-6">
          Welcome to MaxYourPoints.com — a Sweden-based travel blog focused on travel rewards, credit card strategies, 
          airline insights, and hotel reviews. This Disclaimer outlines the terms under which you access and use our content. 
          By using our website, you agree to this Disclaimer, along with our Privacy Policy, Terms and Conditions, and Cookie Policy. 
          Please read it carefully.
        </p>

        <hr className="my-8 border-gray-200" />

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Purpose of Content</h2>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Informational Use Only</h3>
        <p className="mb-4">
          All content published on MaxYourPoints.com is intended for general informational and educational purposes only. 
          It reflects personal opinions and research, not professional or regulated advice.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Not Financial or Legal Advice</h3>
        <p className="mb-4">
          We are not licensed financial advisors, legal professionals, tax consultants, or certified travel agents. 
          Our articles, tools, and suggestions should not be interpreted as tailored advice. Always consult a qualified 
          professional before making decisions about credit cards, travel, legal matters, or financial strategies.
        </p>

        <hr className="my-8 border-gray-200" />

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Affiliate Relationships and Compensation Disclosure</h2>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Affiliate Links</h3>
        <p className="mb-4">
          We participate in affiliate marketing programs (e.g., Amazon Associates, travel booking platforms, financial 
          product partners). This means we may earn commissions when users click affiliate links and make qualifying 
          purchases or applications.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Transparency and Editorial Integrity</h3>
        <p className="mb-4">
          While affiliate relationships may influence which products or services are featured, they do not determine our 
          editorial content. We strive to provide honest, unbiased recommendations in compliance with the EU Unfair 
          Commercial Practices Directive and Swedish consumer law.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">No Guarantee of Offers</h3>
        <p className="mb-4">
          Promotions, credit card offers, point valuations, or booking deals mentioned on the site are provided by third 
          parties. We do not control these offers and cannot guarantee their accuracy, availability, or suitability for 
          your situation.
        </p>

        <hr className="my-8 border-gray-200" />

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Accuracy and Timeliness</h2>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Our Commitment</h3>
        <p className="mb-4">
          We do our best to ensure all published information is accurate and up-to-date at the time of writing.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Limitations</h3>
        <p className="mb-4">
          Rewards programs, financial products, and travel policies change frequently. Details like point valuations, 
          bonus categories, or terms of service may evolve without notice. We cannot guarantee that all content remains 
          current or error-free.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Your Responsibility</h3>
        <p className="mb-4">
          Always verify critical details directly with the official source (e.g., banks, airlines, hotels) before making 
          any financial or travel decisions based on our content.
        </p>

        <hr className="my-8 border-gray-200" />

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. External Links and Third-Party Content</h2>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">External Sites</h3>
        <p className="mb-4">
          MaxYourPoints.com includes links to third-party websites, including affiliate partners, advertisers, and travel 
          service providers.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">No Endorsement or Liability</h3>
        <p className="mb-4">
          We are not responsible for the content, practices, or policies of external websites. A link does not imply 
          endorsement. Any interactions, transactions, or issues that occur on third-party platforms are strictly between 
          you and those entities.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Proceed with Caution</h3>
        <p className="mb-4">
          Users should exercise due diligence and caution when visiting external sites, especially when entering personal 
          or financial information.
        </p>

        <hr className="my-8 border-gray-200" />

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Limitation of Liability</h2>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Legal Limitations</h3>
        <p className="mb-4">
          To the fullest extent permitted by applicable law (including the Swedish Tort Liability Act and international 
          consumer protection standards), MaxYourPoints.com and its owners, authors, and affiliates shall not be liable for:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Any direct, indirect, incidental, consequential, or special loss or damage arising from your use of our content;</li>
          <li>Errors, inaccuracies, or omissions in our material;</li>
          <li>Any action taken based on third-party offers or links presented on the website.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">Examples Include</h3>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Denied credit card applications</li>
          <li>Devalued rewards programs</li>
          <li>Delayed or cancelled travel arrangements</li>
          <li>Outdated advice or policy changes</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">Jurisdictional Variance</h3>
        <p className="mb-4">
          Limitations of liability may not apply in jurisdictions where such exclusions are not legally enforceable.
        </p>

        <hr className="my-8 border-gray-200" />

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Your Responsibility as a User</h2>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Independent Decision-Making</h3>
        <p className="mb-4">
          All decisions regarding credit cards, travel bookings, loyalty programs, or financial planning are your own. 
          We offer general guidance—not guarantees.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Risks Acknowledged</h3>
        <p className="mb-4">
          Travel and finance involve inherent risks such as currency fluctuations, political instability, fraud, or 
          program devaluation. You are solely responsible for evaluating such risks in your own context.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Conduct Due Diligence</h3>
        <p className="mb-4">
          We encourage you to research thoroughly and consult multiple sources before making high-impact decisions.
        </p>

        <hr className="my-8 border-gray-200" />

        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Geographic and Legal Scope</h2>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">International Users</h3>
        <p className="mb-4">
          MaxYourPoints.com is operated from Sweden and targets a global audience. However, rewards programs, credit 
          card eligibility, and legal protections vary by country. Content may not be applicable or accurate in your region.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Health, Safety, and Legal Compliance</h3>
        <p className="mb-4">
          We do not provide medical, safety, immigration, or legal travel guidance (e.g., vaccine requirements or visa 
          rules). Users must consult official government sources for travel advisories and entry regulations.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Testimonials and Examples</h3>
        <p className="mb-4">
          User stories, testimonials, or success case studies published on the site are illustrative only and do not 
          guarantee identical results.
        </p>

        <hr className="my-8 border-gray-200" />

        <h2 className="text-2xl font-semibold mt-8 mb-4">8. Updates to This Disclaimer</h2>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Versioning</h3>
        <p className="mb-4">
          We may revise this Disclaimer at any time. Updated versions will be posted on this page with a new effective date.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Notification of Material Changes</h3>
        <p className="mb-4">
          Where legally required, significant changes will be clearly communicated on the website or via email to 
          registered users.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Continued Use = Acceptance</h3>
        <p className="mb-4">
          Your continued use of the site following any changes constitutes acceptance of the revised Disclaimer.
        </p>

        <hr className="my-8 border-gray-200" />

        <h2 className="text-2xl font-semibold mt-8 mb-4">9. Contact</h2>
        
        <p className="mb-4">
          For legal questions or clarification about this Disclaimer, please contact us:
        </p>
        <p className="mb-4">
          📧 Email: info@maxyourpoints.com<br />
          🕒 We aim to respond within 5 business days.
        </p>
      </div>
    </div>
  )
}
