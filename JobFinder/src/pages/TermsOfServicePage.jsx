// src/pages/TermsOfServicePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfServicePage = () => {
  // Get current date for the "Last Updated" section
  const getCurrentDate = () => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString(undefined, options);
  };

  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="fw-bold">Terms of Service</h1>
          <p className="text-muted">Last Updated: {getCurrentDate()}</p>
        </div>
      </div>

      <div className="row">
        <div className="col-md-3 mb-4">
          <div className="sticky-md-top pt-md-5" style={{top: "90px"}}>
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h5 className="fw-bold mb-3">Table of Contents</h5>
                <nav className="nav flex-column">
                  <a className="nav-link px-0 py-2" href="#agreement">Agreement to Terms</a>
                  <a className="nav-link px-0 py-2" href="#intellectual-property">Intellectual Property</a>
                  <a className="nav-link px-0 py-2" href="#user-accounts">User Accounts</a>
                  <a className="nav-link px-0 py-2" href="#user-content">User-Generated Content</a>
                  <a className="nav-link px-0 py-2" href="#prohibited-activities">Prohibited Activities</a>
                  <a className="nav-link px-0 py-2" href="#payments">Payments</a>
                  <a className="nav-link px-0 py-2" href="#term">Term and Termination</a>
                  <a className="nav-link px-0 py-2" href="#disclaimer">Disclaimer</a>
                  <a className="nav-link px-0 py-2" href="#limitation">Limitation of Liability</a>
                  <a className="nav-link px-0 py-2" href="#indemnification">Indemnification</a>
                  <a className="nav-link px-0 py-2" href="#governing-law">Governing Law</a>
                  <a className="nav-link px-0 py-2" href="#changes">Changes to Terms</a>
                  <a className="nav-link px-0 py-2" href="#contact">Contact Us</a>
                </nav>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-9">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <section id="agreement" className="mb-5">
                <h2 className="fw-bold mb-3">1. Agreement to Terms</h2>
                <p>
                  Welcome to JobFinder. These Terms of Service ("Terms") govern your access to and use of the JobFinder website, 
                  mobile applications, and services (collectively, the "Service").
                </p>
                <p>
                  By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of the Terms, 
                  you may not access the Service.
                </p>
              </section>

              <section id="intellectual-property" className="mb-5">
                <h2 className="fw-bold mb-3">2. Intellectual Property Rights</h2>
                <p>
                  The Service and its original content, features, and functionality are and will remain the exclusive property of JobFinder 
                  and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.
                </p>
                <p>
                  Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of JobFinder.
                </p>
              </section>

              <section id="user-accounts" className="mb-5">
                <h2 className="fw-bold mb-3">3. User Accounts</h2>
                <p>
                  When you create an account with us, you must provide accurate, complete, and current information at all times. 
                  Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
                </p>
                <p>
                  You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
                </p>
                <p>
                  You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or 
                  unauthorized use of your account.
                </p>
              </section>

              <section id="user-content" className="mb-5">
                <h2 className="fw-bold mb-3">4. User-Generated Content</h2>
                <p>
                  Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, 
                  or other material ("Content"). You are responsible for the Content that you post on or through the Service, including its legality, 
                  reliability, and appropriateness.
                </p>
                <p>
                  By posting Content on or through the Service, you represent and warrant that:
                </p>
                <ul>
                  <li>The Content is yours (you own it) or you have the right to use it and grant us the rights and license as provided in these Terms.</li>
                  <li>The posting of your Content on or through the Service does not violate the privacy rights, publicity rights, copyrights, contract rights, 
                  or any other rights of any person or entity.</li>
                  <li>The Content does not contain any material that is defamatory, obscene, indecent, abusive, offensive, harassing, violent, hateful, 
                  inflammatory, or otherwise objectionable.</li>
                </ul>
                <p>
                  We reserve the right to terminate the account of any user who infringes third-party copyrights or repeatedly infringes the intellectual property 
                  rights of others.
                </p>
              </section>

              <section id="prohibited-activities" className="mb-5">
                <h2 className="fw-bold mb-3">5. Prohibited Activities</h2>
                <p>
                  You may not access or use the Service for any purpose other than that for which we make the Service available. The Service may not be used in 
                  connection with any commercial endeavors except those that are specifically endorsed or approved by us.
                </p>
                <p>
                  As a user of the Service, you agree not to:
                </p>
                <ul>
                  <li>Systematically retrieve data or other content from the Service to create or compile, directly or indirectly, a collection, database, or directory.</li>
                  <li>Make any unauthorized use of the Service, including collecting usernames and/or email addresses of users by electronic or other means to send unsolicited 
                  email or create user accounts by automated means.</li>
                  <li>Circumvent, disable, or otherwise interfere with security-related features of the Service, including features that prevent or restrict the use or copying 
                  of any Content or enforce limitations on the use of the Service and/or the Content contained therein.</li>
                  <li>Engage in unauthorized framing of or linking to the Service.</li>
                  <li>Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information such as user passwords.</li>
                  <li>Make improper use of our support services or submit false reports of abuse or misconduct.</li>
                  <li>Engage in any automated use of the system, such as using scripts to send comments or messages, or using any data mining, robots, or similar data gathering 
                  and extraction tools.</li>
                  <li>Attempt to impersonate another user or person or use the username of another user.</li>
                  <li>Use any information obtained from the Service in order to harass, abuse, or harm another person.</li>
                  <li>Use the Service in a manner inconsistent with any applicable laws or regulations.</li>
                </ul>
              </section>

              <section id="payments" className="mb-5">
                <h2 className="fw-bold mb-3">6. Payments</h2>
                <p>
                  We may offer paid products and/or services on our Service. In that case, we use third-party services for payment processing (e.g., payment processors).
                </p>
                <p>
                  We will not store or collect your payment card details. That information is provided directly to our third-party payment processors whose use of your 
                  personal information is governed by their Privacy Policy.
                </p>
                <p>
                  All payments are non-refundable except as required by law or as otherwise specifically permitted in these Terms.
                </p>
              </section>

              <section id="term" className="mb-5">
                <h2 className="fw-bold mb-3">7. Term and Termination</h2>
                <p>
                  These Terms shall remain in full force and effect while you use the Service.
                </p>
                <p>
                  WITHOUT LIMITING ANY OTHER PROVISION OF THESE TERMS, WE RESERVE THE RIGHT TO, IN OUR SOLE DISCRETION AND WITHOUT NOTICE OR LIABILITY, 
                  DENY ACCESS TO AND USE OF THE SERVICE, TO ANY PERSON FOR ANY REASON OR FOR NO REASON, INCLUDING WITHOUT LIMITATION FOR BREACH OF ANY 
                  REPRESENTATION, WARRANTY, OR COVENANT CONTAINED IN THESE TERMS OR OF ANY APPLICABLE LAW OR REGULATION.
                </p>
                <p>
                  We may terminate your account, delete your profile and any content or information that you have posted on the Service, and/or prohibit you 
                  from using or accessing the Service at any time, in our sole discretion, with or without cause, and without notice to you.
                </p>
              </section>

              <section id="disclaimer" className="mb-5">
                <h2 className="fw-bold mb-3">8. Disclaimer</h2>
                <p>
                  THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. WE EXPRESSLY DISCLAIM ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, 
                  INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                </p>
                <p>
                  WE MAKE NO WARRANTY THAT (i) THE SERVICE WILL MEET YOUR REQUIREMENTS, (ii) THE SERVICE WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE, 
                  (iii) THE RESULTS THAT MAY BE OBTAINED FROM THE USE OF THE SERVICE WILL BE ACCURATE OR RELIABLE, OR (iv) THE QUALITY OF ANY PRODUCTS, SERVICES, 
                  INFORMATION, OR OTHER MATERIAL PURCHASED OR OBTAINED BY YOU THROUGH THE SERVICE WILL MEET YOUR EXPECTATIONS.
                </p>
              </section>

              <section id="limitation" className="mb-5">
                <h2 className="fw-bold mb-3">9. Limitation of Liability</h2>
                <p>
                  IN NO EVENT SHALL JOBFINDER, NOR ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, OR AFFILIATES, BE LIABLE FOR ANY INDIRECT, INCIDENTAL, 
                  SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, 
                  RESULTING FROM (i) YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICE; (ii) ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE SERVICE; 
                  (iii) ANY CONTENT OBTAINED FROM THE SERVICE; AND (iv) UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR TRANSMISSIONS OR CONTENT, WHETHER BASED ON WARRANTY, 
                  CONTRACT, TORT (INCLUDING NEGLIGENCE), OR ANY OTHER LEGAL THEORY, WHETHER OR NOT WE HAVE BEEN INFORMED OF THE POSSIBILITY OF SUCH DAMAGE.
                </p>
              </section>

              <section id="indemnification" className="mb-5">
                <h2 className="fw-bold mb-3">10. Indemnification</h2>
                <p>
                  You agree to defend, indemnify, and hold harmless JobFinder and its licensee and licensors, and their employees, contractors, agents, officers, 
                  and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited 
                  to attorney's fees), resulting from or arising out of (i) your use and access of the Service, by you or any person using your account and password; 
                  (ii) a breach of these Terms; or (iii) Content posted on the Service.
                </p>
              </section>

              <section id="governing-law" className="mb-5">
                <h2 className="fw-bold mb-3">11. Governing Law</h2>
                <p>
                  These Terms shall be governed and construed in accordance with the laws of Israel, without regard to its conflict of law provisions.
                </p>
                <p>
                  Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held 
                  to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.
                </p>
              </section>

              <section id="changes" className="mb-5">
                <h2 className="fw-bold mb-3">12. Changes to Terms</h2>
                <p>
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 
                  30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                </p>
                <p>
                  By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to 
                  the new terms, please stop using the Service.
                </p>
              </section>

              <section id="contact" className="mb-5">
                <h2 className="fw-bold mb-3">13. Contact Us</h2>
                <p>
                  If you have any questions about these Terms, please contact us at:
                </p>
                <address className="mb-4">
                  <strong>JobFinder Legal Team</strong><br />
                  123 Business Avenue<br />
                  Tel Aviv, Israel<br />
                  Email: legal@jobfinder.com<br />
                  Phone: +972 1234 5678
                </address>
              </section>

              <div className="border-top pt-4">
                <p className="mb-0">
                  By accessing or using the Service, you acknowledge that you have read these Terms of Service, understand them, and agree to be bound by them.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;