import React from 'react';
import { motion } from 'framer-motion';
import { pageVariants, pageTransition } from '../animations';
import SiteHead from '../components/SiteHead';
import PageHeader from '../components/PageHeader';

const TermsOfServicePage = () => {
  return (
    <>
      <SiteHead 
        title="Terms of Service"
        description="ClickBit's Terms of Service - Read our service terms, conditions, and policies for using our website and services."
      />
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
      >
      <PageHeader 
        title="Terms of Service"
        breadcrumbs={[
          { name: 'Home', href: '/' },
          { name: 'Terms of Service', href: '/terms' }
        ]}
      />
      
      <div className="py-16 md:py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div className="mb-8">
                <p className="text-gray-600 dark:text-gray-400">
                  <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>

              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">1. Acceptance of Terms</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  By accessing and using the services provided by ClickBit ("we," "our," or "us"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  These Terms of Service ("Terms") govern your use of our website and services, including any information, text, graphics, photos, or other materials uploaded, downloaded, or appearing on the services.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">2. Description of Services</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  ClickBit provides comprehensive web development, design, and digital marketing services, including but not limited to:
                </p>
                
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">2.1 Development Services</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-6">
                  <li>Custom Web Applications and scalable solutions for complex business needs</li>
                  <li>Website Development on any platform with high-performance optimization</li>
                  <li>Mobile App Development for iOS and Android (native and hybrid)</li>
                  <li>Custom Desktop Software and productivity tools</li>
                </ul>

                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">2.2 Infrastructure Services</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-6">
                  <li>Managed Server Solutions and digital infrastructure management</li>
                  <li>Cloud Solutions & Migration (IaaS, PaaS, SaaS)</li>
                  <li>Network Infrastructure & Design (LANs, WANs, wireless)</li>
                  <li>Data Storage Solutions (on-premise and cloud-based)</li>
                  <li>Software Setup & Integration services</li>
                  <li>Maintenance & Support for digital assets</li>
                </ul>

                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">2.3 Specialized Technology Services</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-6">
                  <li>AI & Machine Learning Solutions for data analysis and automation</li>
                  <li>Data Management & Analytics for actionable insights</li>
                </ul>

                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">2.4 Business Systems</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-6">
                  <li>CRM Implementation & Customization</li>
                  <li>ERP Integration & Consulting</li>
                  <li>HRM System Implementation</li>
                  <li>SCM System Solutions</li>
                </ul>

                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">2.5 Design & Branding Services</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-6">
                  <li>Branding & Identity design</li>
                  <li>UI/UX Design for intuitive user experiences</li>
                  <li>Graphic Design and visual assets</li>
                  <li>Printing Services for business materials</li>
                </ul>

                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">2.6 Marketing & Growth Services</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-6">
                  <li>Strategic Digital Marketing (SEO, SEM, content marketing)</li>
                  <li>Digital Marketing Strategy development</li>
                  <li>Paid Advertising (PPC) campaigns</li>
                  <li>Professional Email Hosting and management</li>
                </ul>

                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">2.7 Business Packages</h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-6">
                  <li>Startup Package for new businesses</li>
                  <li>Small Business Package for growing companies</li>
                  <li>Ultimate Package for established market leaders</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">3. User Responsibilities</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  As a user of our services, you agree to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-6">
                  <li>Provide accurate and complete information when requested</li>
                  <li>Maintain the security of your account and passwords</li>
                  <li>Use our services only for lawful purposes</li>
                  <li>Not interfere with or disrupt our services</li>
                  <li>Not attempt to gain unauthorized access to our systems</li>
                  <li>Respect intellectual property rights</li>
                  <li>Comply with all applicable laws and regulations</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">4. Project Terms and Conditions</h2>
                
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">4.1 Project Initiation</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  All projects begin upon receipt of the agreed-upon deposit and signed project agreement. Project timelines are estimates and may vary based on project complexity and client feedback cycles.
                </p>

                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">4.2 Payment Terms</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Payment terms are as follows:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-6">
                  <li>50% deposit required to begin work</li>
                  <li>Remaining balance due upon project completion</li>
                  <li>Additional milestone payments may be required for large projects</li>
                  <li>Late payments may result in project suspension</li>
                  <li>All fees are non-refundable once work has commenced</li>
                </ul>

                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">4.3 Project Changes</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Minor changes to project scope may be accommodated. Major changes that affect project timeline or cost will require a written change order and may result in additional fees.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">5. Intellectual Property Rights</h2>
                
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">5.1 Client Content</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  You retain ownership of all content you provide to us, including text, images, logos, and other materials. You grant us a license to use this content solely for the purpose of providing our services.
                </p>

                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">5.2 Deliverables</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Upon full payment, you will own the final deliverables created specifically for your project. We retain the right to use these works in our portfolio and marketing materials unless otherwise agreed in writing.
                </p>

                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">5.3 Third-Party Materials</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  We may use third-party materials, including fonts, images, and software libraries. These materials remain the property of their respective owners and are subject to their licensing terms.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">6. Confidentiality</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  We understand the importance of confidentiality and will treat all client information as confidential. We will not disclose any confidential information to third parties without your written consent, except as required by law.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  This confidentiality obligation survives the termination of our services and continues indefinitely.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">7. Limitation of Liability</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  In no event shall ClickBit be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-6">
                  <li>Your use or inability to use our services</li>
                  <li>Any unauthorized access to or use of our servers</li>
                  <li>Any interruption or cessation of transmission to or from our services</li>
                  <li>Any bugs, viruses, or other harmful code that may be transmitted through our services</li>
                  <li>Any errors or omissions in any content or for any loss or damage incurred as a result of the use of any content</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">8. Warranty and Support</h2>
                
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">8.1 Warranty</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  We warrant that our services will be performed in a professional manner consistent with industry standards. This warranty is valid for 30 days after project completion.
                </p>

                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">8.2 Support</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  We provide 30 days of free support after project completion for bug fixes and minor adjustments. Additional support and maintenance services are available under separate agreements.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">9. Termination</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Either party may terminate this agreement with written notice. Upon termination:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-6">
                  <li>You will pay for all work completed up to the termination date</li>
                  <li>We will deliver all completed work and materials</li>
                  <li>Confidentiality obligations will continue</li>
                  <li>Intellectual property rights will be transferred as specified in the agreement</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">10. Force Majeure</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Neither party shall be liable for any delay or failure to perform due to circumstances beyond their reasonable control, including but not limited to acts of God, war, terrorism, riots, fire, natural disasters, power outages, or government actions.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">11. Governing Law</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  These Terms shall be governed by and construed in accordance with the laws of New South Wales, Australia, without regard to its conflict of law provisions. Any disputes arising from these Terms shall be resolved in the courts of New South Wales, Australia.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">12. Severability</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary so that these Terms will otherwise remain in full force and effect.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">13. Entire Agreement</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  These Terms constitute the entire agreement between you and ClickBit regarding the use of our services and supersede all prior agreements and understandings, whether written or oral.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">14. Changes to Terms</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the new Terms on our website and updating the "Last updated" date. Your continued use of our services after such changes constitutes acceptance of the new Terms.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">15. Contact Information</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    <strong>Email:</strong> info@clickbit.com.au
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    <strong>Address:</strong> 44 Shoreline Road Moorebank NSW 2170 Australia
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Phone:</strong> +61 2 7229 9577
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
      </motion.div>
    </>
  );
};

export default TermsOfServicePage; 