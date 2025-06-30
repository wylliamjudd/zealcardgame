import React from 'react';
import LegalLayout from '../../layouts/LegalLayout';

const PrivacyPolicy: React.FC = () => {
  return (
    <LegalLayout title="Privacy Policy | Zeal TCG">
      <h1 className="text-4xl font-bold mb-8 text-center text-white">Privacy Policy</h1>
      
      <div className="prose prose-invert max-w-none">
        <p className="text-gray-300 text-sm mb-8">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">1. Introduction</h2>
          <p className="text-gray-300 mb-4">
            Welcome to <span className="font-semibold">Zeal</span> ("we," "our," or "us"). We are committed to 
            protecting your personal information and your right to privacy. If you have any questions or concerns about 
            this privacy policy or our practices regarding your personal information, please contact us at 
            <a href="mailto:privacy@zealtcg.com" className="text-blue-400 hover:underline">privacy@zealtcg.com</a>.
          </p>
          <p className="text-gray-300">
            This privacy policy describes how we might use your information if you visit our website, use our services, 
            or otherwise engage with us. By using our services, you agree to the collection and use of information in 
            accordance with this policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">2. Information We Collect</h2>
          <p className="text-gray-300 mb-4">We collect several different types of information for various purposes to provide and improve our service to you.</p>
          
          <h3 className="text-xl font-semibold mb-2 mt-4 text-blue-300">Personal Data</h3>
          <p className="text-gray-300 mb-4">While using our service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). This may include, but is not limited to:</p>
          <ul className="list-disc pl-6 text-gray-300 space-y-2 mb-4">
            <li>Email address</li>
            <li>First name and last name</li>
            <li>Phone number</li>
            <li>Address, State, Province, ZIP/Postal code, City</li>
            <li>Cookies and Usage Data</li>
          </ul>

          <h3 className="text-xl font-semibold mb-2 mt-4 text-blue-300">Usage Data</h3>
          <p className="text-gray-300 mb-4">We may also collect information on how the service is accessed and used ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol address (e.g., IP address), browser type, browser version, the pages of our service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers, and other diagnostic data.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">3. How We Use Your Information</h2>
          <p className="text-gray-300 mb-4">We use the collected data for various purposes, including:</p>
          <ul className="list-disc pl-6 text-gray-300 space-y-2 mb-4">
            <li>To provide and maintain our service</li>
            <li>To notify you about changes to our service</li>
            <li>To allow you to participate in interactive features of our service when you choose to do so</li>
            <li>To provide customer support</li>
            <li>To gather analysis or valuable information so that we can improve our service</li>
            <li>To monitor the usage of our service</li>
            <li>To detect, prevent and address technical issues</li>
            <li>To provide you with news, special offers, and general information about other goods, services, and events which we offer</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">4. Data Security</h2>
          <p className="text-gray-300 mb-4">
            The security of your data is important to us. We implement appropriate technical and organizational measures to protect 
            the security of your personal information. However, please remember that no method of transmission over the Internet or 
            method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal 
            information, we cannot guarantee its absolute security.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">5. Your Data Protection Rights</h2>
          <p className="text-gray-300 mb-4">Depending on your location, you may have the following rights regarding your personal information:</p>
          <ul className="list-disc pl-6 text-gray-300 space-y-2 mb-4">
            <li><strong>Access:</strong> You have the right to request copies of your personal data.</li>
            <li><strong>Rectification:</strong> You have the right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete.</li>
            <li><strong>Erasure:</strong> You have the right to request that we erase your personal data, under certain conditions.</li>
            <li><strong>Restrict Processing:</strong> You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>
            <li><strong>Object to Processing:</strong> You have the right to object to our processing of your personal data, under certain conditions.</li>
            <li><strong>Data Portability:</strong> You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.</li>
          </ul>
          <p className="text-gray-300">
            If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us at 
            <a href="mailto:privacy@zealtcg.com" className="text-blue-400 hover:underline">privacy@zealtcg.com</a>.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">6. Children&apos;s Privacy</h2>
          <p className="text-gray-300">
            Our service does not address anyone under the age of 13. We do not knowingly collect personally identifiable 
            information from children under 13. If you are a parent or guardian and you are aware that your child has provided 
            us with personal information, please contact us.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">8. Changes to This Privacy Policy</h2>
          <p className="text-gray-300 mb-4">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new 
            Privacy Policy on this page and updating the "Last updated" date.
          </p>
          <p className="text-gray-300">
            You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy 
            are effective when they are posted on this page.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">9. Contact Us</h2>
          <p className="text-gray-300">
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p className="text-gray-300 mt-2">
            Email: <a href="mailto:privacy@zealtcg.com" className="text-blue-400 hover:underline">privacy@zealtcg.com</a><br />
            Address: 123 Fantasy Lane, Greywick, GW 12345
          </p>
        </section>
      </div>
    </LegalLayout>
  );
};

export default PrivacyPolicy;
