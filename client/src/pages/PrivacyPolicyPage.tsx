import React from 'react';
import { motion } from 'framer-motion';
import { pageVariants, pageTransition } from '../animations';
import PageHeader from '../components/PageHeader';

const PrivacyPolicyPage = () => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <PageHeader 
        title="Privacy Policy"
        breadcrumbs={[
          { name: 'Home', href: '/' },
          { name: 'Privacy Policy', href: '/privacy-policy' }
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
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">1. Introduction</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  ClickBit ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our services, or interact with us.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  By using our services, you agree to the collection and use of information in accordance with this policy.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">2. Information We Collect</h2>
                
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">2.1 Personal Information</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  We may collect personal information that you voluntarily provide to us, including:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-6">
                  <li><strong>Contact Information:</strong> First name, last name, email address, phone number, company name, company address</li>
                  <li><strong>Project Information:</strong> Project name, description, business objectives, target audience, budget, start/end dates, milestones</li>
                  <li><strong>Business Information:</strong> Industry, client background, stakeholders, initial goals, project constraints, future expansion plans</li>
                  <li><strong>Service Preferences:</strong> Selected service categories, specific services, and features from our offerings</li>
                  <li><strong>Communication Records:</strong> Messages, inquiries, and correspondence with our team</li>
                  <li><strong>Payment Information:</strong> Billing details and payment history (processed securely through third-party providers)</li>
                </ul>

                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">2.2 Automatically Collected Information</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  When you visit our website, we automatically collect certain information, including:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-6">
                  <li>IP address and device information</li>
                  <li>Browser type and version</li>
                  <li>Operating system</li>
                  <li>Pages visited and time spent on each page</li>
                  <li>Referring website</li>
                  <li>Cookies and similar tracking technologies</li>
                  <li>Form interaction data and preferences</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">3. How We Use Your Information</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  We use the collected information for various purposes:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-6">
                  <li><strong>Service Delivery:</strong> Providing our comprehensive web development, design, and digital marketing services</li>
                  <li><strong>Project Management:</strong> Managing your projects, timelines, and deliverables</li>
                  <li><strong>Communication:</strong> Responding to inquiries, providing project updates, and maintaining client relationships</li>
                  <li><strong>Service Customization:</strong> Tailoring our services to your specific needs and requirements</li>
                  <li><strong>Payment Processing:</strong> Processing payments and managing billing for our services</li>
                  <li><strong>Marketing:</strong> Sending newsletters and marketing communications (with your consent)</li>
                  <li><strong>Website Improvement:</strong> Analyzing website usage and improving user experience</li>
                  <li><strong>Legal Compliance:</strong> Complying with legal obligations and protecting our rights</li>
                  <li><strong>Security:</strong> Protecting against fraud and security threats</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">4. Information Sharing and Disclosure</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-6">
                  <li><strong>Service Providers:</strong> With trusted third-party service providers who assist us in operating our business</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                  <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                  <li><strong>Consent:</strong> With your explicit consent for specific purposes</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">5. Data Security</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-6">
                  <li>Encryption of sensitive data in transit and at rest</li>
                  <li>Regular security assessments and updates</li>
                  <li>Access controls and authentication measures</li>
                  <li>Employee training on data protection</li>
                  <li>Incident response procedures</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">6. Cookies and Tracking Technologies</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  We use cookies and similar technologies to enhance your browsing experience, analyze website traffic, and understand where our visitors are coming from. You can control cookie settings through your browser preferences.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  Types of cookies we use:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-6">
                  <li><strong>Essential Cookies:</strong> Required for basic website functionality</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our website</li>
                  <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">7. Your Rights and Choices</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  You have the following rights regarding your personal information:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-6">
                  <li><strong>Access:</strong> Request a copy of your personal information</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                  <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                  <li><strong>Objection:</strong> Object to processing of your personal information</li>
                  <li><strong>Withdrawal:</strong> Withdraw consent for marketing communications</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">8. Data Retention</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When we no longer need your information, we will securely delete or anonymize it.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">9. International Data Transfers</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards to protect your information.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">10. Children's Privacy</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">11. Changes to This Privacy Policy</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">12. Contact Information</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
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
  );
};

export default PrivacyPolicyPage; 