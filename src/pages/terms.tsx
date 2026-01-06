import { JSX } from "react";
import Layout from "@theme/Layout";
import styles from "./terms.module.css";
import { MAIN_LINKS } from "../constants/main-links";

export default function TermsPage(): JSX.Element {
  return (
    <Layout
      title="Terms and Conditions"
      description="Silhouette Terms and Conditions - Last updated: 1 November 2025"
    >
      <div className={styles.pageContainer} data-name="page-container">
        <div className={styles.container} data-name="Container">
          <div className={styles.header} data-name="Header">
            <div className={styles.heading} data-name="Heading 1">
              <h1>Silhouette Terms and Conditions</h1>
            </div>
            <div
              className={styles.lastUpdated}
              data-name="Nav - Breadcrumb → Ordered List"
            >
              <p>Last updated: 1 November 2025</p>
            </div>
          </div>

          <div className={styles.section} data-name="section">
            <div className={styles.sectionHeading} data-name="Heading">
              <h3>Scope</h3>
            </div>
            <div className={styles.body} data-name="body">
              <p>
                These terms and conditions ("Terms") apply to the access to, and
                the use of the website available on{" "}
                <a
                  href={MAIN_LINKS.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.cyanLink}
                >
                  {MAIN_LINKS.website}
                </a>{" "}
                ("Website") offered by Silhouette AG, Gartenstrasse 6, 6300 Zug,
                Switzerland ("Company"), and including the website-hosted user
                interface ("Interface"). The Company is a software development
                company specialising in blockchain protocols.
              </p>
              <p>
                To access or use the Website or the Interface, you ("User") have
                to agree to these Terms. By accessing or using the Website or
                the Interface, you signify that you have read, understand, and
                agree to be bound by these Terms in their entirety. If you do
                not agree, you are not authorized to access or use, and you
                should not use the Website or the Interface.
              </p>
            </div>
          </div>

          <div className={styles.section} data-name="section">
            <div className={styles.sectionHeading} data-name="Heading 4">
              <h3>Interface and User's acknowledgements</h3>
            </div>
            <div className={styles.body} data-name="body">
              <p>
                The Interface provides a means of easier access to a
                decentralised protocol on the Hyperliquid blockchain that allows
                users to trade certain digital assets ("Protocol"). The
                Interface generates draft transactions for the User which the
                User can then submit independently to the Protocol via its own
                third-party wallet application ("Wallet"). The User personally
                submits and approves all transactions sent via the Interface
                which are solely effected via the User's actions, and the User
                is solely responsible and liable for all activities conducted
                through the User's Wallet.
              </p>
              <p>The User hereby acknowledges and agrees that:</p>
              <ul>
                <li>
                  the User independently decides to submit any draft
                  transactions generated via the Interface through the User's
                  own Wallet;
                </li>
                <li>
                  the Company does not own, operate, control, or otherwise have
                  access to the User's funds, Wallet, or any related private
                  keys;
                </li>
                <li>
                  the Company does not own, operate, or otherwise control the
                  Protocol;
                </li>
                <li>
                  the Interface is one, but not the exclusive, means of
                  interacting the Protocol and the Interface is entirely
                  optional;
                </li>
                <li>
                  the Interface is a purely non-custodial application, meaning
                  the User is solely responsible for the custody of the
                  cryptographic private keys to the User's Wallet;
                </li>
                <li>
                  the Company does not, and is not able to, check or otherwise
                  review the suitability of the trades made by the User via its
                  Wallet and is not responsible for the way the User uses the
                  Interface or the Protocol;
                </li>
                <li>
                  the use of the Interface is unsolicited and the User
                  independently decided to use the Interface;
                </li>
                <li>
                  the User has not received any investment advice from the
                  Company in connection with any trades;
                </li>
                <li>
                  neither the Interface, the Website, nor any information or
                  data contained on the Website constitute financial,
                  investment, tax, legal, accounting, or other advice;
                </li>
                <li>
                  the Website may contain statements that constitute
                  "forward-looking statements." The Company is under no
                  obligation to update or alter the forward-looking statements,
                  whether as a result of new information, future events, or
                  otherwise and makes no warranty regarding the accuracy of such
                  statements;
                </li>
                <li>
                  there are inherent risks associated with submitting
                  transactions to the Protocol, including but not limited to
                  market volatility, complete loss, operational risk, and
                  regulatory changes, and that the Company is not responsible
                  for any of these variables and risks; and
                </li>
                <li>
                  the User uses the Interface and the Website at its own risk.
                </li>
              </ul>
              <p>
                By accessing and using the Interface, the User represents being
                financially and technically sophisticated enough to understand
                the inherent risks associated with using cryptographic and
                blockchain-based systems, and having a working knowledge of the
                usage and intricacies of relevant digital assets. In particular,
                the User understands that blockchain-based transactions are
                irreversible and that the Company has no possibility whatsoever
                to influence or reverse any transactions submitted to the
                Protocol.
              </p>
            </div>
          </div>

          <div className={styles.section} data-name="section">
            <div className={styles.sectionHeading} data-name="Heading 4">
              <h3>Access to the Interface</h3>
            </div>
            <div className={styles.body} data-name="body">
              <p>
                The Interface is provided exclusively to persons of the age of
                majority in the relevant jurisdiction (e.g., eighteen years old)
                and having the full right, power, and authority to enter into
                and comply with the Terms on their behalf and any company or
                legal entity for which they may access or use the Interface
                ("Legal Capacity").
              </p>
              <p>
                The Interface is not available to residents of Afghanistan,
                Belarus, Burundi, the Central African Republic, the Democratic
                Republic of Congo, the Democratic People's Republic of Korea,
                the Crimea region of Ukraine, Cuba, Guinea, Guinea-Bissau,
                Haiti, Iraq, Iran, Libya, Mali, Moldova, Myanmar, Nicaragua,
                Russia, Somalia, Sudan, South Sudan, Syria, the USA, Venezuela,
                Yemen, and Zimbabwe or any other jurisdiction in which accessing
                or using the Interface is prohibited ("Prohibited
                Jurisdictions").
              </p>
              <p>
                When using the Interface, the User represents and warrants that
                the User has full Legal Capacity, is not located in,
                incorporated or otherwise established in, or a citizen or
                resident of, a Prohibited Jurisdiction, is not otherwise subject
                to sanctions or prohibited to interact with the Interface or the
                Website, and will not access or use the Interface or the Website
                to conduct, promote, or otherwise facilitate any illegal
                activity.
              </p>
              <p>
                The Company may, but has no obligation to (i) ask the User to
                provide identification or other information, (ii) undertake
                checks designed to help verify User's identity or background and
                (iii) screen the User against third-party databases or other
                sources and request reports from service providers. The Company
                may reject or cancel a User's access to the Interface in its
                sole discretion and without specifying any reason. The Company
                may subject the full access of a User to the Interface to its
                prior approval. For the avoidance of doubt, the access to the
                Protocol is possible independent of the access of the Interface
                and Users may interact with the Protocol regardless of any
                restrictions by the Company on the Interface level.
              </p>
            </div>
          </div>

          <div className={styles.section} data-name="section">
            <div className={styles.sectionHeading} data-name="Heading 4">
              <h3>Rights & Obligations of the Company</h3>
            </div>
            <div className={styles.body} data-name="body">
              <p>
                The Company will provide the User with the Interface and the
                Website as agreed in these Terms.
              </p>
              <p>
                The Company reserves the right, but is not obliged, to (i)
                review, modify, filter, disable, delete and remove any and all
                content and information from the Website; and (ii) to cooperate
                with any law enforcement, court or government investigation or
                order or third party requesting or directing that we disclose
                information or content or information that the User provides via
                the Interface or the Website.
              </p>
              <p>
                The Company may amend the Terms from time to time at its sole
                discretion by publishing an updated version of the Terms on the
                Website. The version of the Terms uploaded on the Website at the
                time of each instance of use of the Interface is applicable to
                such use of the Interface. The Terms do not remain in force
                between each independent use of the Interface by the User and
                the User agrees to the then-uploaded Terms for each instance of
                use of the Interface.
              </p>
              <p>
                The Company constantly develops and improves the Interface and
                the Website and may modify or either temporarily or permanently
                stop providing the Interface or the Website or any part of them
                at its sole discretion.
              </p>
              <p>
                The Company reserves the right to ask the User to provide
                feedback through forms, questionnaires, and polls in order to
                improve the Interface or the Website ("Feedback"). The Company
                may use, or not use, any such Feedback, without any obligation,
                whether financial or otherwise, to the User. The User hereby
                assigns all rights (including but not limited to intellectual
                property rights), title, and interest in the Feedback to the
                Company and acknowledges it has no claim in relation to the
                Feedback.
              </p>
            </div>
          </div>

          <div className={styles.section} data-name="section">
            <div className={styles.sectionHeading} data-name="Heading 4">
              <h3>Rights & Obligations of the User</h3>
            </div>
            <div className={styles.body} data-name="body">
              <p>
                The User shall use the Interface and the Website in compliance
                with the Terms and all legal and moral obligations applicable in
                the territory where they are located.
              </p>
              <p>The User shall, for each independent use of the Interface:</p>
              <ul>
                <li>
                  cooperate in the performance of these Terms to the necessary
                  extent free of charge; and
                </li>
                <li>
                  immediately inform the Company of all circumstances within its
                  sphere that might endanger or may be relevant to the provision
                  the Interface and all misuses or suspicions of misuse of the
                  Interface.
                </li>
              </ul>
              <p>
                The User shall not, unless with the Company's prior written
                permission:
              </p>
              <ul>
                <li>
                  circumvent or attempt to circumvent any security protection of
                  the Interface or the Website;
                </li>
                <li>
                  use the Interface in unlawful or fraudulent ways or for any
                  unlawful or fraudulent purpose or effect;
                </li>
                <li>
                  take any action that may impose an unreasonable load on the
                  Company's infrastructure;
                </li>
                <li>
                  bypass the measures that the Company may use to prevent or
                  restrict access to or use of the Interface or the Website;
                </li>
                <li>
                  try to decompile or reverse engineer the Interface, the
                  Website, or any part of them, or derive the source code;
                </li>
                <li>
                  copy, modify, distribute, reproduce, translate, disassemble or
                  use in any other way any information, text, graphics, images,
                  software obtained from the Interface, or any other part of the
                  Interface; or
                </li>
                <li>
                  sell, sublicense, allow access or make the Interface or any
                  part of it otherwise available to third-parties.
                </li>
              </ul>
            </div>
          </div>

          <div className={styles.section} data-name="section">
            <div className={styles.sectionHeading} data-name="Heading 4">
              <h3>Intellectual Property</h3>
            </div>
            <div className={styles.body} data-name="body">
              <p>
                Each party retains all rights, titles, and interests to its own
                intellectual property, including all copyrights, inventions,
                trademarks, designs, domain names, know-how, trade secrets, data
                and other intangible property rights ("Intellectual Property
                Rights").
              </p>
              <p>
                Except to the extent set forth otherwise in this Section, all
                Intellectual Property Rights in the Interface, the Website or
                any part of them remain vested in the Company. The Company
                hereby grants the User a limited, revocable, non-exclusive,
                non-transferable, non-sublicensable right to access and use the
                Interface and the Website in accordance with the Terms.
              </p>
              <p>
                The Company releases the front-end code, design, and other
                external-side facing elements of the Interface under the MIT
                License. The User is free to use the Interface at its own
                discretion, to the extent released by the Company and in
                accordance with the applicable open-source license.
              </p>
              <p>
                The Interface and the Website may each contain open-source
                components. Such components are subject to the respective
                license.
              </p>
            </div>
          </div>

          <div className={styles.section} data-name="section">
            <div className={styles.sectionHeading} data-name="Heading 4">
              <h3>Privacy</h3>
            </div>
            <div className={styles.body} data-name="body">
              <p>
                The Company collects and processes personal data as described in
                its Privacy Policy available at{" "}
                <a href="#" className={styles.cyanLink}>
                  [link]
                </a>
                . The Company protects the collected personal data by means of
                appropriate technical and organisational measures and in
                accordance with the data protection legislation applicable in
                Switzerland and the European Union.
              </p>
              <p>
                The User authorises the Company to use, process, and store
                relevant data for the performance of the Terms and to use
                anonymised data to improve its services or for analysis
                purposes.
              </p>
            </div>
          </div>

          <div className={styles.section} data-name="section">
            <div className={styles.sectionHeading} data-name="Heading 4">
              <h3>Liability & Indemnity</h3>
            </div>
            <div className={styles.body} data-name="body">
              <p>
                The Company is fully liable to the User for damages resulting
                from the Company's gross negligence or wilful misconduct. In all
                other cases, the Company's liability under the Terms is excluded
                to the maximum extent permitted under applicable law.
              </p>
              <p>
                In particular, the Company will not be held liable for
                inaccuracy or incompleteness of the Interface or the Website, or
                the incompatibility of the Interface or the Website with any
                specific objectives that the User is hoping to achieve.
              </p>
              <p>
                The User agrees to indemnify, and hold the Company, its
                officers, directors, employees, or contractors, harmless from
                and against any loss, damage, liability, claim, or demand,
                including reasonable attorneys' fees and expenses, made by any
                third party due to or arising out of: (i) the User's access and
                use of the Website and or the Interface, (ii) breach of these
                Terms or any legal regulation by the User, its employees or
                other persons acting on behalf of the User; (iii) any breach of
                User's representations and warranties set forth in the Terms;
                (iv) User's violation of the rights of a third party.
              </p>
            </div>
          </div>

          <div className={styles.section} data-name="section">
            <div className={styles.sectionHeading} data-name="Heading 4">
              <h3>Warranties & Representations</h3>
            </div>
            <div className={styles.body} data-name="body">
              <p>
                The User acknowledges that the Interface and the Website are
                provided "as is" and "as available", and the Company makes no
                warranties or representations of any kind related to the
                Interface, the Website or the information and materials
                contained thereon.
              </p>
              <p>
                The Company does not warrant or guarantee that the Interface and
                the Website are error-free and will function without any
                interruption or disruption. The Company may at its own
                discretion carry out maintenance or improvements to the
                Interface, the Website, and their infrastructures, and the User
                acknowledges that this may result in temporary delays and
                interruptions from time to time.
              </p>
              <p>
                Any further warranty, either express, implied, or statutory, is
                excluded to the fullest extent permitted by law.
              </p>
            </div>
          </div>

          <div className={styles.section} data-name="section">
            <div className={styles.sectionHeading} data-name="Heading 4">
              <h3>Miscellaneous</h3>
            </div>
            <div className={styles.body} data-name="body">
              <p>
                <span className={styles.bold}>Entire Agreement:</span> The Terms
                constitute the entire agreement between the Company and the
                User, and supersedes all prior agreements, between the parties
                relating to the subject matter of the Terms.
              </p>
              <p className={styles.bold}>
                Notices: Notices to the Company's attention must be given in
                text form via email to [e-mail address].
              </p>
              <p>
                <span className={styles.bold}>Assignment:</span> The User may
                not assign any of its rights, obligations, or claims under the
                Agreement without the previous consent of the Company. The
                Company may assign any of its rights, obligations or claims
                under these Terms at its sole discretion.
              </p>
              <p>
                <span className={styles.bold}>Severability:</span> If any
                provision of the Terms (in whole or part) is held to be illegal,
                invalid or otherwise unenforceable, the other provisions will
                remain in full force and effect.
              </p>
              <p>
                <span className={styles.bold}>
                  Governing Law & Jurisdiction:
                </span>{" "}
                These Terms, and all claims or causes of action that may be
                based upon, arise out of or relate to these Terms shall be
                governed by and construed in accordance with the substantive
                laws of Switzerland, excluding its conflict of law provisions
                and the United Nations Convention on Contracts for the
                International Sale of Goods (CISG). The ordinary court at the
                seat of the Company has jurisdiction for all disputes arising
                from or in connection with the Terms.
              </p>
              <p>
                <span className={styles.bold}>Links:</span> The Website may
                contain third-party content or links to third-party websites.
                The Company does not assume any responsibility for and does not
                make any warranties or representations as to any third-party
                content or websites, including but not limited to the accuracy,
                subject matter, quality, or timeliness.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
