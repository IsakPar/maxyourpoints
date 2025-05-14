"use client"

import Navbar from "@/components/Navbar/Navbar"
import Footer from "@/components/Footer/Footer"

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-16">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Disclaimer</h1>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-xl md:text-2xl font-semibold mt-8 mb-4">Information Purpose Only</h2>
            <p>
              The content on MaxYourPoints is for informational purposes only and does not constitute financial advice.
              The information provided on this website is general in nature and is not tailored to your specific
              circumstances or needs.
            </p>

            <h2 className="text-xl md:text-2xl font-semibold mt-8 mb-4">No Financial Advice</h2>
            <p>
              Nothing contained on this website should be construed as financial advice. We are not financial advisors,
              and we do not provide personalized recommendations for any specific individual. Before making any
              financial decisions, including applying for credit cards, participating in rewards programs, or making
              travel arrangements, you should consult with a qualified financial advisor.
            </p>

            <h2 className="text-xl md:text-2xl font-semibold mt-8 mb-4">Accuracy of Information</h2>
            <p>
              While we strive to provide accurate and up-to-date information, credit card offers, airline rewards
              programs, and other products mentioned may change over time. We strongly recommend verifying all terms and
              conditions directly with the respective providers before making any decisions. MaxYourPoints does not
              guarantee the accuracy or completeness of information presented.
            </p>

            <h2 className="text-xl md:text-2xl font-semibold mt-8 mb-4">Third-Party Content</h2>
            <p>
              Our website may contain links to third-party websites or services that are not owned or controlled by
              MaxYourPoints. We have no control over, and assume no responsibility for, the content, privacy policies,
              or practices of any third-party websites or services. You further acknowledge and agree that MaxYourPoints
              shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be
              caused by or in connection with the use of or reliance on any such content, goods, or services available
              on or through any such websites or services.
            </p>

            <h2 className="text-xl md:text-2xl font-semibold mt-8 mb-4">User Responsibility</h2>
            <p>
              By using this website, you acknowledge that any reliance on material published on this site is at your own
              risk. MaxYourPoints is not responsible for any financial decisions made based on the information provided.
              You are solely responsible for evaluating the information provided and determining its relevance and
              appropriateness for your individual circumstances.
            </p>

            <h2 className="text-xl md:text-2xl font-semibold mt-8 mb-4">Affiliate Disclosure</h2>
            <p>
              MaxYourPoints may participate in affiliate marketing programs, which means we may receive commissions on
              purchases made through our links to retailer sites. This does not affect our editorial independence or the
              products and services we choose to review, but it may influence the placement and visibility of certain
              products on our site.
            </p>

            <h2 className="text-xl md:text-2xl font-semibold mt-8 mb-4">Changes to This Disclaimer</h2>
            <p>
              We reserve the right to modify this disclaimer at any time. Changes and clarifications will take effect
              immediately upon their posting on the website. We encourage users to check this page periodically for any
              changes.
            </p>

            <div className="mt-8 p-4 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-700">Last updated: May 12, 2024</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
