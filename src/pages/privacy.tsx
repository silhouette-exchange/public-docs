import type { ReactNode } from "react";
import Layout from "@theme/Layout";
import styles from "./terms.module.css";

export default function PrivacyPage(): ReactNode {
  return (
    <Layout
      title="Privacy Policy"
      description="Silhouette Privacy Policy - Overview"
    >
      <div className={styles.pageContainer} data-name="page-container">
        <div className={styles.container} data-name="Container">
          <div className={styles.header} data-name="Header">
            <div
              className={styles.lastUpdated}
              data-name="Nav - Breadcrumb → Ordered List"
            >
              <p>OVERVIEW</p>
            </div>
            <div className={styles.heading} data-name="Heading 1">
              <h1>Privacy Policy</h1>
            </div>
          </div>

          <div className={styles.section} data-name="section">
            <div className={styles.body} data-name="body">
              <p>
                This privacy policy explains how we process and protect your
                personal data when you use our website available on{" "}
                <a
                  href="https://silhouette.exchange/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.cyanLink}
                >
                  https://silhouette.exchange/
                </a>{" "}
                ("Website")
              </p>
              <p>
                The Website is provided by Silhouette AG, Gartenstrasse 6, 6300
                Zug, Switzerland (the "Company", "we", "our", or "us"). The
                Company is the controller for the data processing described
                below.
              </p>
              <p>
                Unless otherwise defined in this privacy policy, the definitions
                used in this privacy policy have the same meaning as in the
                Swiss Federal Act on Data Protection (FADP) or the EU General
                Data Protection Regulation (GDPR).
              </p>
            </div>
          </div>

          <div className={styles.section} data-name="section">
            <div className={styles.sectionHeading} data-name="Heading 4">
              <h3>Our Policy</h3>
            </div>
            <div className={styles.body} data-name="body">
              <p className={styles.bold}>
                PERSONAL DATA WE COLLECT ABOUT YOU, THE REASONS FOR PROCESSING
                IT, AND THE LEGAL BASIS FOR SUCH PROCESSING
              </p>
              <p>
                When you access, use, connect to, or interact with the Website,
                we may collect certain categories of personal data.
              </p>
              <p>
                This may include your (i) internet protocol (IP) address, (ii)
                digital-asset, smart-contract, or protocol address identifiers
                ("Wallet"), (iii) geolocation data, (iv) as well as the content
                of any communications you send to us. We process this
                information to provide you access to the Website and where
                applicable, to respond to your requests.
              </p>
              <p>
                In addition, when you navigate or interact with the Website, our
                servers automatically log technical and usage data. This may
                include the date, time and country of access, the API endpoints
                accessed, as well as details about your device, operating
                system, browser, user agent, and the transmission protocol used.
                We process this information to provide you access to the
                Website, and, based on our legitimate interests, to maintain the
                security, stability, and functionality of the Website, as well
                as for troubleshooting, analytics, testing, research,
                optimisation, and internal statistical analysis purposes.
              </p>
              <p>
                In our legitimate interests, we may further use your personal
                data to create aggregated, anonymised, or de-identified
                datasets.
              </p>
              <p>
                Finally, we may process your personal data as required to comply
                with legal obligations, enforce our terms and conditions, and
                protect the Website, our rights, and the rights of our users and
                others.
              </p>
            </div>
          </div>

          <div className={styles.section} data-name="section">
            <div className={styles.sectionHeading} data-name="Heading 4">
              <h3>Your Rights</h3>
            </div>
            <div className={styles.body} data-name="body">
              <p>
                Following relevant data protection laws, you may possess
                specific rights concerning your personal data. These rights may
                encompass the following:
              </p>
              <ul>
                <li>
                  You have the right to access your data held by the Company,
                  understand how it's used, and know who it's shared with.
                </li>
                <li>
                  You can request corrections to your personal data held by the
                  Company, pending investigation and verification of any
                  disputed information.
                </li>
                <li>
                  In certain situations, you have the right to delete or remove
                  your personal data.
                </li>
                <li>
                  You may object to the processing of your personal data under
                  specific circumstances. Where the legal basis for our
                  processing of your personal data is our legitimate interest,
                  you have the right to object to such processing on grounds
                  relating to your particular situation. We will abide by your
                  request unless we have a compelling legal basis for the
                  processing which overrides your interests or if we need to
                  continue to process the personal data for the exercise or
                  defence of a legal claim.
                </li>
                <li>
                  You can restrict the processing of your personal data to
                  prevent its use beyond storage purposes, in certain scenarios.
                </li>
                <li>
                  You are entitled to data portability; the Company will strive
                  to provide you, or a third party, with a copy of your personal
                  data in a structured, commonly used, machine-readable format.
                </li>
                <li>
                  You may opt out of marketing communications anytime by
                  utilising the unsubscribe or opt-out options provided in those
                  communications or sending an email to [add].
                </li>
                <li>
                  You will be informed of any personal data breaches unless such
                  a breach is unlikely to harm you.
                </li>
                <li>
                  You can withdraw your consent if the Company relies on it for
                  personal data processing; however, this won't impact the
                  processing of data carried out before the withdrawal or based
                  on other legal grounds.
                </li>
                <li>
                  You have the right of appeal to a data protection supervisory
                  authority if you believe that the processing of your personal
                  data violates data protection law. The competent data
                  protection authority in Switzerland is the Federal Data
                  Protection and Information Commissioner (
                  <a
                    href="http://www.edoeb.admin.ch/edoeb/en/home.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.cyanLink}
                  >
                    www.edoeb.admin.ch/edoeb/en/home.html
                  </a>
                  ). In the EU and EEA, you can exercise this right, for
                  example, before a supervisory authority in the Member State of
                  your residence, your place of work or the place of the alleged
                  infringement. You can find a list of the relevant authorities
                  here:{" "}
                  <a
                    href="https://edpb.europa.eu/about-edpb/board/members_en"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.cyanLink}
                  >
                    https://edpb.europa.eu/about-edpb/board/members_en
                  </a>
                  .
                </li>
              </ul>
            </div>
          </div>

          <div className={styles.section} data-name="section">
            <div className={styles.sectionHeading} data-name="Heading 4">
              <h3>Sharing of Personal Data</h3>
            </div>
            <div className={styles.body} data-name="body">
              <p>
                We may share your information with third parties when you
                consent, when necessary for the provision of the Website, or as
                otherwise allowed by law. In particular, your personal data may
                be shared in the following situations:
              </p>
              <ul>
                <li>
                  With service providers and vendors: The Company may share your
                  data with third parties for processing. These third parties
                  might include blockchain analysis services, know-your-customer
                  and screening providers, developers, content delivery
                  services, and data analytics firms. These service providers
                  may help us with various functions and tasks, such as
                  assessing your eligibility for participation in certain
                  services.
                </li>
                <li>
                  With professional advisors, in our legitimate interests or as
                  required by law: As necessary, we will share your data with
                  professional advisors such as auditors, law firms,
                  cybersecurity specialists, data analysis organisations, and/or
                  consulting or accounting firms.
                </li>
                <li>
                  To safeguard our services and business, we may share
                  information for legal and security reasons, either in our
                  legitimate interests or as mandated by law: This includes
                  cooperation with law enforcement and regulatory bodies to meet
                  legal requirements and respond to official requests for
                  information. Additionally, in connection with activities like
                  asset sales, mergers, bankruptcies, or other business
                  transactions or reorganizations, we may disclose your personal
                  data to the necessary third parties while negotiating or
                  during any corporate restructuring, merger, or sale of assets.
                </li>
              </ul>
              <p>
                We and/or our service providers may transfer your personal data
                to and process it in the following countries:
              </p>
              <ul>
                <li>EU and EEA</li>
                <li>UK</li>
                <li>USA</li>
              </ul>
              <p>
                We may use service providers partly located in so-called third
                countries (outside the European Union or the European Economic
                Area or Switzerland) or process personal data there, i.e.,
                countries whose level of data protection does not correspond to
                that of the EU or Switzerland.
              </p>
              <p>
                We safeguard your personal data per our contractual obligations
                and applicable data protection legislation when transferring
                data abroad.
              </p>
              <p>Such safeguards may include:</p>
              <ul>
                <li>
                  The transfer to countries that have been deemed to provide an
                  adequate level of protection according to the Federal Council,
                  as well as to countries where there is an adequacy decision by
                  the European Commission in place
                </li>
                <li>
                  Applying standard data protection model clauses, binding
                  corporate rules or other standard contractual obligations that
                  provide appropriate data protection
                </li>
              </ul>
              <p>
                If a third country transfer takes place and there is no adequacy
                decision or appropriate safeguards, it is possible and there is
                a risk that authorities in the third country (e.g. intelligence
                services) can gain access to the transferred data and that the
                enforceability of your data subject's rights cannot be
                guaranteed.
              </p>
            </div>
          </div>

          <div className={styles.section} data-name="section">
            <div className={styles.sectionHeading} data-name="Heading 4">
              <h3>Retention</h3>
            </div>
            <div className={styles.body} data-name="body">
              <p>
                We will retain your personal data only for so long as necessary
                to fulfill the purposes for which it was collected, including
                for the purposes of satisfying any legal, accounting or
                reporting requirements, or as otherwise required by law. The
                length of time we retain your data will depend on the nature of
                the data and the purpose for which it was processed. We expect
                to delete your personal data (at the latest) once there is no
                longer any legal or regulatory requirement or legitimate
                business purpose for retaining your data.
              </p>
            </div>
          </div>

          <div className={styles.section} data-name="section">
            <div className={styles.sectionHeading} data-name="Heading 4">
              <h3>Data on the Blockchain</h3>
            </div>
            <div className={styles.body} data-name="body">
              <p>
                When using our Website or using any applicable blockchain in
                relationship with our Website, you should be aware that any
                transactions will be publicly and irrevocably archived on the
                applicable blockchain once you sign them and send them to the
                network. These transactions typically include information about
                how many tokens have been bought, sold, transferred or otherwise
                interacted with, a timestamp, and the involved addresses. They
                do not include data such as your name or e-mail address.
                Nonetheless, once someone knows that a particular address
                belongs to you, they can connect all the transactions involving
                that address to you.
              </p>
            </div>
          </div>

          <div className={styles.section} data-name="section">
            <div className={styles.sectionHeading} data-name="Heading 4">
              <h3>Security Measures Taken to Protect Personal Data</h3>
            </div>
            <div className={styles.body} data-name="body">
              <p>
                We take reasonable technical and organisational security
                measures that we deem appropriate to protect your stored data
                against manipulation, loss, or unauthorised third-party access.
                Our security measures are continually adapted to technological
                developments.
              </p>
              <p>
                Our employees and the service providers that we engage are
                required to maintain secrecy and comply with applicable data
                protection legislation. In addition, they are granted access to
                personal data only insofar as this is necessary for them to
                carry out their respective tasks or mandate.
              </p>
              <p>
                The security of your personal data is important to us but
                remember that no method of transmission over the internet or
                electronic storage is 100% secure. While we strive to use
                commercially acceptable means to protect your personal data, we
                cannot guarantee its absolute security. We recommend using
                antivirus software, a firewall, and other similar software to
                safeguard your system.
              </p>
            </div>
          </div>

          <div className={styles.section} data-name="section">
            <div className={styles.sectionHeading} data-name="Heading 4">
              <h3>Social Media and Other Third-Party Websites and Links</h3>
            </div>
            <div className={styles.body} data-name="body">
              <p>
                Our Website contains links to websites or apps that are not
                operated by us. When you click on a third-party link, you will
                be directed to that third party's website or app. We have no
                control over the content, privacy policies, or practices of any
                third-party websites or services.
              </p>
              <p>
                We maintain online presences on social networks. If you have an
                account on the same network, it is possible that your
                information and media made available there may be seen by us,
                for example, when we access your profile. In addition, the
                social network may allow you to contact us. As soon as we
                transfer personal data into our own system, we are responsible
                for this independently. This is then done to carry out
                pre-contractual measures and to fulfil a contract. For the legal
                basis of the data processing carried out by the social networks
                under their own responsibility, please refer to their data
                protection declarations. Below is a list of social networks on
                which we operate an online presence:
              </p>
              <ul>
                <li>
                  X:{" "}
                  <a
                    href="https://x.com/en/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.cyanLink}
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  Telegram:{" "}
                  <a
                    href="https://telegram.org/privacy?setln=fa#:~:text=Secret%20chats%20use%20end%2Dto,secret%20chats%20on%20our%20servers."
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.cyanLink}
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className={styles.section} data-name="section">
            <div className={styles.sectionHeading} data-name="Heading 4">
              <h3>Periodic Reviews and Updates to Policy</h3>
            </div>
            <div className={styles.body} data-name="body">
              <p>
                The Company may review and update this Policy from time to time.
                Updates to our Policy will apply only to information collected
                after the change date. If we make material changes to the
                Policy, we will update the "Last Revised" date at the top of
                this Policy.
              </p>
            </div>
          </div>

          <div className={styles.section} data-name="section">
            <div className={styles.sectionHeading} data-name="Heading 4">
              <h3>Contact</h3>
            </div>
            <div className={styles.body} data-name="body">
              <p>
                Should you have any questions or complaints about our privacy or
                data protection practices, your personal data, or this Policy,
                you can email us at{" "}
                <a
                  href="mailto:team@silhouette.exchange"
                  className={styles.cyanLink}
                >
                  team@silhouette.exchange
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
