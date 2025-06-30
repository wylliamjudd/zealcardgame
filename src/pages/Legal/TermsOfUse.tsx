import React from 'react';
import { Link } from 'react-router-dom';
import LegalLayout from '../../layouts/LegalLayout';

const TermsOfUse: React.FC = () => {
  return (
    <LegalLayout title="Terms of Use | Zeal TCG">
      <h1 className="text-4xl font-bold mb-8 text-center text-white">Terms of Use</h1>
      
      <div className="prose prose-invert max-w-none">
        <p className="text-gray-300 text-sm mb-8">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">1. Introduction</h2>
          <p className="text-gray-300 mb-4">
            Welcome to <span className="font-semibold">Zeal TCG</span> ("Company," "we," "our," or "us"). These Terms of Use 
            ("Terms") govern your access to and use of our website and services. Please read these Terms carefully before 
            using our services.
          </p>
          <p className="text-gray-300">
            By accessing or using our services, you agree to be bound by these Terms. If you disagree with any part of 
            these Terms, you may not access our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">2. Accounts</h2>
          <p className="text-gray-300 mb-4">
            When you create an account with us, you must provide accurate and complete information. You are responsible 
            for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
          </p>
          <p className="text-gray-300">
            You must be at least 13 years old to use our services. If you are under 18, you confirm that you have 
            permission from your parent or legal guardian to use our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">3. User Conduct</h2>
          <p className="text-gray-300 mb-4">You agree not to use our services to:</p>
          <ul className="list-disc pl-6 text-gray-300 space-y-2 mb-4">
            <li>Violate any laws or regulations</li>
            <li>Infringe on the intellectual property rights of others</li>
            <li>Harass, abuse, or harm others</li>
            <li>Distribute spam or malicious software</li>
            <li>Attempt to gain unauthorized access to our systems or other users' accounts</li>
            <li>Interfere with or disrupt the integrity or performance of our services</li>
          </ul>
          <p className="text-gray-300">
            We reserve the right to suspend or terminate accounts that violate these Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">4. Intellectual Property</h2>
          <p className="text-gray-300 mb-4">
            All content on our website, including text, graphics, logos, images, and software, is the property of 
            Zeal or its content suppliers and is protected by copyright, trademark, and other intellectual property laws.
          </p>
          <p className="text-gray-300">
            You may not reproduce, distribute, modify, create derivative works of, publicly display, or otherwise exploit 
            any of our content without our express written permission.
          </p>
        </section>
      </div>
      
      <div className="mt-12 pt-6 border-t border-gray-700 text-center">
        <Link to="/" className="text-blue-400 hover:underline">
          &larr; Back to Home
        </Link>
      </div>
    </LegalLayout>
  );
};

export default TermsOfUse;
