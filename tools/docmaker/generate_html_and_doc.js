const fs = require('fs');
const path = require('path');

const outputHtmlPath = path.join(__dirname, '..', '..', 'docs', 'CyberShield_Internship_Report.html');
const outputDocPath = path.join(__dirname, '..', '..', 'docs', 'CyberShield_Internship_Report.doc');

// Styles strictly according to user instructions:
// - border around page like reference pdf
// - content font 12pt
// - heading font 14pt
// - clg name font 16pt
// - 1.5 line spacing, Times New Roman
const htmlHeader = `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office'
      xmlns:w='urn:schemas-microsoft-com:office:word'
      xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset="utf-8">
<title>CyberShield - Cybersecurity Internship Report</title>
<!--[if gte mso 9]>
<xml>
 <w:WordDocument>
  <w:View>Print</w:View>
  <w:Zoom>100</w:Zoom>
  <w:DoNotOptimizeForBrowser/>
 </w:WordDocument>
</xml>
<![endif]-->
<style>
@page {
    size: 210mm 297mm; /* A4 */
    margin: 0.5in 0.5in 0.5in 0.5in;
    mso-header-margin: 0.3in;
    mso-footer-margin: 0.3in;
}

body {
    font-family: "Times New Roman", Times, serif;
    font-size: 12pt;
    line-height: 1.5;
    color: #000000;
    margin: 0;
    padding: 20px 0;
    background-color: #f3f4f6;
}

@media print {
    body {
        background-color: #ffffff;
        padding: 0;
    }
}

/* Page Border Container for EVERY page - exactly like reference PDF */
.page-container {
    width: 8.0in;
    min-height: 10.8in;
    margin: 0 auto 30px auto;
    padding: 28px 32px;
    border: 1.5pt solid #000000;
    box-sizing: border-box;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    page-break-before: always;
    page-break-after: always;
    mso-break-type: section-break;
}

.page-container:first-child {
    page-break-before: avoid;
}

@media print {
    .page-container {
        margin: 0;
        width: 100%;
        min-height: 10.8in;
        border: 1.5pt solid #000000;
        page-break-before: always;
    }
}

/* Typography strictly adhering to prompt: */
/* 1. College name: 16pt */
.clg-name {
    font-size: 16pt;
    font-weight: bold;
    text-align: center;
    line-height: 1.3;
    margin: 10px 0 5px 0;
}

/* 2. Headings: 14pt */
.chapter-heading {
    font-size: 14pt;
    font-weight: bold;
    text-align: center;
    text-transform: uppercase;
    margin: 15px 0 20px 0;
}

.section-heading {
    font-size: 13pt;
    font-weight: bold;
    margin: 14px 0 8px 0;
}

.subsection-heading {
    font-size: 12pt;
    font-weight: bold;
    font-style: italic;
    margin: 10px 0 4px 0;
}

/* 3. Content: 12pt, 1.5 line spacing, justified */
p, li, td {
    font-size: 12pt;
    line-height: 1.5;
    text-align: justify;
    text-justify: inter-word;
    margin-top: 4px;
    margin-bottom: 8px;
}

ul, ol {
    margin-top: 4px;
    margin-bottom: 10px;
    padding-left: 24px;
}

li {
    margin-bottom: 6px;
}

/* Running Header like reference PDF */
.running-header {
    width: 100%;
    text-align: right;
    font-size: 10pt;
    font-weight: bold;
    border-bottom: 1px solid #000000;
    padding-bottom: 4px;
    margin-bottom: 15px;
}

/* Running Footer like reference PDF: Dept. of CSE | 2026-27 | Page */
.running-footer {
    width: 100%;
    display: flex;
    justify-content: space-between;
    font-size: 10pt;
    margin-top: 20px;
    padding-top: 4px;
}

/* Content block */
.page-content {
    flex-grow: 1;
}

/* Tables */
table.clean-table {
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0;
    font-size: 11pt;
}

table.clean-table th, table.clean-table td {
    border: 1px solid #000000;
    padding: 6px 8px;
    font-size: 11pt;
    line-height: 1.4;
}

table.clean-table th {
    background-color: #f2f2f2;
    font-weight: bold;
    text-align: left;
}

/* Code & Preformatted box */
pre.code-box {
    background-color: #f8fafc;
    border: 1px solid #94a3b8;
    padding: 10px;
    font-family: "Courier New", Courier, monospace;
    font-size: 9pt;
    line-height: 1.35;
    white-space: pre-wrap;
    margin: 10px 0;
}

.equation-box {
    text-align: center;
    font-style: italic;
    font-size: 12pt;
    font-weight: bold;
    margin: 12px 0;
    padding: 8px;
    background: #f8fafc;
    border: 1px solid #cbd5e1;
}

.center { text-align: center; }
.bold { font-weight: bold; }
.emblem-box {
    width: 130px;
    height: 130px;
    margin: 15px auto;
    border: 1px dashed #666;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: 9pt;
    background: #fafafa;
}
</style>
</head>
<body>
`;

// Build all 33 pages
const pages = [];

// ================= PAGE 1 =================
pages.push(`
<div class="page-container">
    <div class="page-content center">
        <div class="clg-name">UNIVERSITY OF VISVESVARAYA COLLEGE OF ENGINEERING</div>
        <p class="center" style="margin: 0; font-size: 12pt;">(First State Autonomous University on IIT Model)</p>
        <p class="center" style="margin: 0 0 15px 0; font-size: 12pt;">K R Circle, Bengaluru – 560 001</p>

        <div class="emblem-box">
            <b>ESTD 1917</b><br>
            [ UVCE EMBLEM ]<br>
            <span style="font-size: 8pt;">विद्या सर्वस्य गौरवं</span>
        </div>

        <p class="center" style="font-size: 12pt; margin-top: 15px; margin-bottom: 2px;">A Report on Summer Internship-II</p>
        <div class="chapter-heading" style="margin: 5px 0 15px 0;">"CYBERSECURITY INTERNSHIP"</div>
        <p class="center" style="font-size: 11pt; margin-bottom: 4px;">Submitted under the mandatory Summer Internship required for the III Year (V Semester)</p>
        <p class="center bold" style="font-size: 12pt; margin: 2px 0;">Bachelor of Technology</p>
        <p class="center" style="margin: 2px 0;">in</p>
        <p class="center bold" style="font-size: 12pt; margin: 2px 0 25px 0;">Information Science and Engineering</p>

        <table style="width: 100%; border: none; margin: 15px 0;">
            <tr>
                <td style="width: 50%; border: none; vertical-align: top; text-align: center;">
                    <b>Submitted by:</b><br>
                    <span style="font-size: 12pt;">Pavithra Devadiga (U25UV24TXXXXXX)</span><br>
                    <span>V Sem, B.Tech, ISE</span>
                </td>
                <td style="width: 50%; border: none; vertical-align: top; text-align: center;">
                    <b>Conducted by:</b><br>
                    <span style="font-size: 12pt; font-weight: bold;">HONEYWELL</span><br>
                    <span style="font-size: 11pt; font-style: italic;">Powered by BharatCares</span><br><br>
                    <b>Proctor:</b><br>
                    <span>Dr. Tanuja R</span><br>
                    <span style="font-size: 11pt;">Associate Professor</span>
                </td>
            </tr>
        </table>
    </div>

    <div class="center" style="border-top: 1px solid #000; padding-top: 10px;">
        <p class="center bold" style="margin: 2px 0;">DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING</p>
        <p class="center" style="margin: 2px 0;">UVCE, KR Circle, Bengaluru- 560 001</p>
        <p class="center bold" style="margin: 2px 0;">2026-2027</p>
    </div>
</div>
`);

// ================= PAGE 2 =================
pages.push(`
<div class="page-container">
    <div class="page-content center">
        <div class="clg-name">UNIVERSITY OF VISVESVARAYA COLLEGE OF ENGINEERING</div>
        <p class="center" style="margin: 0 0 15px 0;">K R Circle, Bengaluru – 560 001</p>

        <div class="emblem-box" style="width: 100px; height: 100px; margin: 10px auto;">
            [ UVCE SEAL ]
        </div>

        <p class="center bold" style="margin-top: 15px; margin-bottom: 5px;">Department of Computer Science and Engineering</p>
        <div class="chapter-heading" style="text-decoration: underline; margin-top: 5px; margin-bottom: 25px;">Certificate</div>

        <p style="text-align: justify; line-height: 1.8; margin: 25px 0;">
            This is to certify that <b>PAVITHRA DEVADIGA</b>, bearing Register Number <b>U25UV24TXXXXXX</b>, has successfully completed the Summer Internship – II work on <b>"Cybersecurity"</b> conducted by the <b>Honeywell Future Skills Edge Program</b>, implemented by <b>BharatCares</b>, for a duration of 120 hours from June 2026 to July 2026, in partial fulfilment of the requirements for the V Semester, Bachelor of Technology in Information Science and Engineering, University of Visvesvaraya College of Engineering, during the academic year 2026–2027.
        </p>

        <table style="width: 100%; border: none; margin-top: 40px;">
            <tr>
                <td style="width: 50%; border: none; text-align: left; vertical-align: top;">
                    <b>Proctor:</b><br><br><br>
                    --------------------------------<br>
                    <b>Dr. Tanuja R</b><br>
                    Associate Professor<br>
                    Dept. of CSE,<br>
                    UVCE, Bengaluru
                </td>
                <td style="width: 50%; border: none; text-align: left; vertical-align: top;">
                    <b>Chairperson:</b><br><br><br>
                    --------------------------------<br>
                    <b>Dr. Manjula S H</b><br>
                    Professor<br>
                    Dept. of CSE,<br>
                    UVCE, Bengaluru
                </td>
            </tr>
            <tr>
                <td style="border: none; text-align: left; padding-top: 40px;">
                    <b>Examiner 1</b><br><br><br>
                    --------------------------------
                </td>
                <td style="border: none; text-align: left; padding-top: 40px;">
                    <b>Examiner 2</b><br><br><br>
                    --------------------------------
                </td>
            </tr>
        </table>
    </div>
</div>
`);

// ================= PAGE 3 =================
pages.push(`
<div class="page-container">
    <div class="page-content">
        <div class="chapter-heading">ACKNOWLEDGEMENT</div>
        <p>I express my sincere gratitude to the University of Visvesvaraya College of Engineering (UVCE), Bengaluru, and the Department of Information Science and Engineering for providing me with the opportunity and support to undertake this internship.</p>
        <p>I am especially thankful to my academic guide, Dr. TANUJA R, for her valuable guidance, suggestions and encouragement throughout the project and report preparation.</p>
        <p>I would also like to express my sincere gratitude to the Chairperson of the Department and the Director of UVCE for providing me with this valuable opportunity and for their support in facilitating the internship, which contributed significantly to my academic and professional learning.</p>
        <p>I sincerely thank Honeywell and BharatCares for providing the opportunity to participate in the Honeywell Future Skills Edge Program on Cybersecurity and complete the 120-hour internship. The program enhanced my understanding of cybersecurity fundamentals, network security and vulnerability assessment.</p>
        <p>As part of the internship, I developed CyberShield, an enterprise web application vulnerability scanner and security assessment platform built purely in Java 21 and Spring Boot 3 with a React 18 frontend. The project provided practical experience in automated security checks, SSRF defense, risk assessment, security score formulation, OpenPDF report generation, and interactive dashboard development.</p>
        <p>Finally, I thank my parents, friends, classmates and well-wishers for their constant encouragement and support throughout this learning journey.</p>

        <div style="margin-top: 60px; text-align: right;">
            <p style="margin: 2px 0;"><b>Name:</b> Pavithra Devadiga</p>
            <p style="margin: 2px 0;"><b>USN:</b> U25UV24TXXXXXX</p>
        </div>
    </div>
</div>
`);

// ================= PAGE 4 =================
pages.push(`
<div class="page-container">
    <div class="page-content">
        <div class="chapter-heading">ABSTRACT</div>
        <p>Cybersecurity has become essential with the rapid growth of digital services, cloud computing and interconnected web applications. As organizations increasingly store sensitive information on digital platforms and expose APIs, protecting web applications from unauthorized access, data exposure, injection attacks and security misconfigurations is a major requirement.</p>
        <p>This report presents the experience gained during a 120-hour Cybersecurity Internship organized by BharatCares under the Honeywell Future Skills Edge Program from June 2026 to July 2026, following the 80-hour cybersecurity training completed. The training covered cybersecurity fundamentals, security threats, network protocols, cryptography, vulnerability assessment, access control, data protection and risk analysis.</p>
        <p>As part of the internship, I developed CyberShield, an automated web application vulnerability scanner and security assessment platform developed purely in Java 21 and Spring Boot 3 with a React 18 Single Page Application, consciously eliminating Python. The platform incorporates eight modular scanners: HTTP Security Headers, SSL/TLS Ciphers, SQL Injection, Cross-Site Scripting (XSS), Endpoint Exposure, Sensitive Information Leakage, Website Technology Fingerprinting, and OWASP ZAP REST integration. It provides SSRF protection, risk classification, a normalized 0–100 security score, remediation recommendations, automated PDF reports using OpenPDF, and an interactive React dashboard.</p>
        <p>The internship provided practical experience in web application security, enterprise Java architecture, full-stack development, vulnerability assessment and risk management. This report describes the internship objectives, training, project development, technologies used, skills acquired and overall learning outcomes.</p>
    </div>
</div>
`);

// ================= PAGE 5 =================
pages.push(`
<div class="page-container">
    <div class="page-content">
        <div class="chapter-heading">TABLE OF CONTENTS</div>
        <table class="clean-table">
            <thead>
                <tr>
                    <th style="width: 15%; text-align: center;">Sl. No.</th>
                    <th style="width: 70%;">Title</th>
                    <th style="width: 15%; text-align: center;">Page no.</th>
                </tr>
            </thead>
            <tbody>
                <tr><td class="center">1</td><td>Introduction</td><td class="center">1</td></tr>
                <tr><td class="center">2</td><td>About the Organisation</td><td class="center">2</td></tr>
                <tr><td class="center">3</td><td>Objectives of the internship</td><td class="center">3</td></tr>
                <tr><td class="center">4</td><td>Cybersecurity Training and Guided Project Work</td><td class="center">4</td></tr>
                <tr><td class="center">5</td><td>Specific Skills Acquired</td><td class="center">6</td></tr>
                <tr><td class="center">6</td><td>CyberShield Vulnerability Scanner – Project Overview</td><td class="center">7</td></tr>
                <tr><td class="center">7</td><td>Project Architecture and Design</td><td class="center">9</td></tr>
                <tr><td class="center">8</td><td>Project Implementation</td><td class="center">15</td></tr>
                <tr><td class="center">9</td><td>Project Results and Analysis</td><td class="center">19</td></tr>
                <tr><td class="center">10</td><td>Learning Outcomes and Cybersecurity Relevance</td><td class="center">22</td></tr>
                <tr><td class="center">11</td><td>Challenges and Limitations</td><td class="center">24</td></tr>
                <tr><td class="center">12</td><td>Conclusion</td><td class="center">26</td></tr>
                <tr><td class="center">13</td><td>References</td><td class="center">27</td></tr>
                <tr><td class="center">14</td><td>Certificate</td><td class="center">28</td></tr>
            </tbody>
        </table>
    </div>
</div>
`);

// Helper for Chapters 1-14 (Pages 6 to 33, labelled page 1 to 28)
function makeBodyPage(pageNum, contentHtml) {
    return `
<div class="page-container">
    <div class="running-header">Summer Internship - II</div>
    <div class="page-content">
        ${contentHtml}
    </div>
    <div class="running-footer">
        <span>Dept. of CSE</span>
        <span>2026-27</span>
        <span>${pageNum}</span>
    </div>
</div>
`;
}

// ================= PAGE 6 (Body Page 1): Chapter 1 =================
pages.push(makeBodyPage(1, `
<div class="chapter-heading">1. INTRODUCTION</div>
<p>Cybersecurity has become an essential component of modern computing due to the rapid growth of digital services, cloud platforms, connected devices and online communication. Organizations increasingly depend on digital infrastructure to store, process and exchange sensitive information. Consequently, protecting these systems against unauthorized access, data breaches, security misconfigurations and cyberattacks has become a critical requirement.</p>
<p>Web applications have transformed how organizations conduct business by providing scalable portals, transactional endpoints and cloud services. However, they also introduce security challenges concerning access permissions, input validation, configuration management and public exposure of sensitive information.</p>
<p>This report presents the learning and experience gained during a 120-hour Cybersecurity Internship organized by BharatCares under the Honeywell Future Skills Edge Program, from June 2026 to July 2026, following the 80-hour Honeywell Future Skills Edge training on Cybersecurity completed on their platform.</p>
<p>The internship provided an opportunity to understand cybersecurity concepts and explore their practical applications. The learning activities covered cybersecurity fundamentals, security threats, network protocols, vulnerability identification, access control, risk assessment and data protection.</p>
<p>As part of the internship, I developed CyberShield, an enterprise web application vulnerability scanner and security assessment platform developed purely in Java 21 and Spring Boot 3 with a React 18 frontend, strictly eliminating Python. The application automates multi-vector security checks including HTTP security headers, SSL/TLS certificate configurations, SQL injection, reflected Cross-Site Scripting (XSS), sensitive file exposure, and hardcoded secrets. It also incorporates a risk assessment mechanism to classify security issues, calculate an objective 0–100 Security Score and generate security recommendations.</p>
<p>An interactive dashboard was developed using React 18, Vite and Tailwind CSS to present security assessment results. It provides security metrics, severity distribution visualizations, target-wise findings and downloadable PDF reports generated using OpenPDF.</p>
<p>The project provided practical exposure to web application security, enterprise Java development, Spring Boot architecture, security automation and vulnerability assessment. It demonstrated how automated security tools can help identify configuration weaknesses and improve the security posture of web application environments.</p>
<p>Overall, the internship helped bridge the gap between theoretical knowledge and practical implementation while strengthening my understanding of cybersecurity and its applications in enterprise software engineering.</p>
`));

// ================= PAGE 7 (Body Page 2): Chapter 2 =================
pages.push(makeBodyPage(2, `
<div class="chapter-heading">2. About the Organisation</div>
<div class="section-heading">Honeywell</div>
<p>Honeywell is a multinational technology and engineering company that provides solutions across industries such as aerospace, building automation, industrial operations and digital technologies. The organization focuses on innovation, automation and advanced technological solutions. Through initiatives such as the Honeywell Future Skills Edge Program, it supports skill development and provides students with exposure to emerging technologies, including cybersecurity.</p>
<div class="section-heading">BharatCares</div>
<p>BharatCares is an organization involved in social development, education and skill-development initiatives. It works towards creating learning opportunities and improving employability through industry-oriented training programs. As the implementation partner of the Honeywell Future Skills Edge Program, BharatCares facilitated the cybersecurity training and internship, providing an opportunity to gain practical knowledge and technical skills.</p>
<div class="section-heading">Honeywell Future Skills Edge Program</div>
<p>The Honeywell Future Skills Edge Program is a skill-development initiative designed to equip students with industry-relevant knowledge and practical skills. Under this program, I completed 80 hours of cybersecurity training from their platform, followed by a 120-hour internship from June 2026 to July 2026. The program provided exposure to cybersecurity fundamentals and their practical applications through project development.</p>
`));

// ================= PAGE 8 (Body Page 3): Chapter 3 =================
pages.push(makeBodyPage(3, `
<div class="chapter-heading">3. Objectives of the Internship</div>
<p>The primary objective of the internship was to develop a practical understanding of cybersecurity concepts and explore their applications in web application and enterprise environments. The internship aimed to bridge theoretical knowledge with practical implementation through the development of CyberShield.</p>
<p>The major objectives were:</p>
<ol>
    <li>To understand fundamental concepts of cybersecurity, including common threats, vulnerabilities, the CIA Triad and attack techniques.</li>
    <li>To gain knowledge of web application security and understand the importance of securing online services against OWASP Top 10 risks.</li>
    <li>To implement an enterprise backend in Java 21 and Spring Boot 3, strictly without Python, following clean layered architecture.</li>
    <li>To engineer robust Server-Side Request Forgery (SSRF) defenses blocking loopback, internal subnets and cloud metadata endpoints.</li>
    <li>To develop automated security scanners for HTTP headers, SSL/TLS ciphers, SQL injection, XSS reflection and endpoint exposures.</li>
    <li>To integrate OWASP ZAP through its REST API for automated active vulnerability scanning.</li>
    <li>To implement a risk assessment mechanism for classifying identified security issues based on their severity.</li>
    <li>To calculate security scores and compliance metrics and generate recommendations for improving web application security.</li>
    <li>To develop an interactive React 18 dashboard for visualizing security findings, metrics and assessment results.</li>
    <li>To gain practical experience in software development, debugging, automated testing with JUnit 5/Mockito, and technical documentation.</li>
</ol>
`));

// ================= PAGE 9 (Body Page 4): Chapter 4.1 =================
pages.push(makeBodyPage(4, `
<div class="chapter-heading">4. CYBERSECURITY TRAINING AND GUIDED PROJECT WORK</div>
<p>The Honeywell Future Skills Edge Program, implemented by BharatCares, included a total of 120 hours of cybersecurity learning and practical activities conducted through an online learning platform from June 2026 to July 2026.</p>
<p>The program consisted of 80 hours of structured online cybersecurity training and 40 hours of guided practical work and project development. The training introduced fundamental cybersecurity concepts before progressing towards practical applications and project implementation.</p>
<div class="section-heading">4.1 Online Cybersecurity Training – 80 Hours</div>
<p>The first 80 hours were dedicated to structured online learning through the program's training platform. The training covered the fundamental concepts of cybersecurity and provided an understanding of the different threats, vulnerabilities and security mechanisms encountered in modern computing environments.</p>
<p>The major areas of learning included:</p>
<ol>
    <li><b>Introduction to Cybersecurity:</b> Understanding the meaning, importance and objectives of cybersecurity. Introduction to information security and the protection of digital assets.</li>
    <li><b>Fundamentals of Information Security:</b> Understanding the CIA Triad, consisting of Confidentiality, Integrity and Availability, and its importance in maintaining information security.</li>
    <li><b>Cybersecurity Threats and Attacks:</b> Introduction to common cyber threats, including malware, ransomware, phishing, social engineering, password attacks and unauthorized access.</li>
    <li><b>Network Security Fundamentals:</b> Understanding basic network security concepts, communication protocols, firewalls, secure communication and the importance of protecting network infrastructure.</li>
    <li><b>Cryptography and Data Protection:</b> Introduction to encryption, decryption, hashing and digital signatures, along with their role in protecting sensitive information.</li>
    <li><b>Authentication and Access Control:</b> Understanding authentication mechanisms, authorization, user permissions, password security and the principle of least privilege.</li>
    <li><b>Vulnerability Assessment and Risk Management:</b> Learning about security vulnerabilities, threat identification, risk evaluation and the importance of implementing appropriate security controls.</li>
    <li><b>Web and Cloud Security Fundamentals:</b> Introduction to cloud security, shared responsibility, web application protection, access management and common configuration risks.</li>
    <li><b>Security Monitoring and Incident Response:</b> Understanding the importance of security monitoring, identifying suspicious activities, responding to security incidents and minimizing their impact.</li>
</ol>
`));

// ================= PAGE 10 (Body Page 5): Chapter 4.2 & 4.3 =================
pages.push(makeBodyPage(5, `
<ol start="10">
    <li><b>Cybersecurity Best Practices:</b> Learning about secure computing practices, software updates, password management, data protection and maintaining a secure digital environment.</li>
</ol>
<p>The structured training established a foundation in cybersecurity and helped develop an understanding of how security principles are applied across different computing environments.</p>
<div class="section-heading">4.2 Guided Practical Work and Project Development – 40 Hours</div>
<p>The remaining 40 hours were dedicated to guided practical activities and project development. This phase provided an opportunity to apply the concepts learned during the online training to a practical cybersecurity application.</p>
<p>The practical work focused on understanding web application security challenges and developing CyberShield using Java 21, Spring Boot 3, and React 18.</p>
<p>The major activities included:</p>
<ol>
    <li>Understanding web application architectures and the security features associated with HTTP, TLS and REST APIs.</li>
    <li>Identifying common security misconfigurations and OWASP Top 10 vulnerabilities in web environments.</li>
    <li>Learning to interact with web targets securely using the native Java 21 HttpClient and Jsoup parser.</li>
    <li>Implementing automated checks for HTTP security headers, SSL/TLS protocols and sensitive endpoint exposure.</li>
    <li>Developing dynamic injection assessment modules for SQL Injection and reflected Cross-Site Scripting (XSS).</li>
    <li>Engineering a robust SSRF protection module blocking loopback, link-local, RFC 1918 subnets and cloud metadata.</li>
    <li>Developing a risk scoring mechanism to classify identified security issues and calculate a 0–100 Security Score.</li>
    <li>Implementing automated PDF report generation using the OpenPDF library.</li>
    <li>Developing an interactive React 18 dashboard to visualize the assessment results, charts and metrics.</li>
    <li>Testing the application with JUnit 5 and Mockito, containerizing with Docker, and documenting findings.</li>
</ol>
<div class="section-heading">4.3 Overall Training Experience</div>
<p>The combination of 80 hours of structured online training and 40 hours of guided practical work provided a balanced learning experience.</p>
<p>The online training established a foundation in cybersecurity concepts, while the practical activities demonstrated how these concepts could be applied to real-world security challenges.</p>
<p>The development of CyberShield provided an opportunity to understand the importance of securing web application resources and identifying configuration weaknesses through automated assessment.</p>
<p>Overall, the 120-hour program improved my understanding of cybersecurity fundamentals and provided practical exposure to full-stack security engineering and application development.</p>
`));

// ================= PAGE 11 (Body Page 6): Chapter 5 =================
pages.push(makeBodyPage(6, `
<div class="chapter-heading">5. Specific Skills Acquired</div>
<p>The cybersecurity internship provided an opportunity to develop technical and practical skills in cybersecurity, enterprise software engineering and full-stack application development. The major skills acquired during the internship are described below.</p>
<ol>
    <li><b>Cybersecurity Fundamentals:</b> Developed an understanding of cybersecurity principles, including the CIA Triad (Confidentiality, Integrity and Availability), common security threats, vulnerabilities, unauthorized access and data protection.</li>
    <li><b>Web Application Security & OWASP Top 10:</b> Gained practical knowledge of web vulnerabilities, particularly SQL Injection, Cross-Site Scripting (XSS), missing security headers, insecure TLS configurations and sensitive file exposure.</li>
    <li><b>Enterprise Java 21 & Spring Boot 3 Development:</b> Mastered enterprise Java architecture, Spring Boot dependency injection, JPA/Hibernate persistence, @Transactional boundaries, and centralized exception handling with @RestControllerAdvice.</li>
    <li><b>Spring Security & Stateless JWT Authentication:</b> Learned to configure Spring Security filter chains, implement BCrypt password hashing, issue and validate cryptographically signed JSON Web Tokens (JWT), and enforce Role-Based Access Control.</li>
    <li><b>Defensive Network Programming & SSRF Prevention:</b> Engineered pre-flight DNS validation and IP filtering to block Server-Side Request Forgery attacks targeting loopback, private subnets and cloud metadata endpoints.</li>
    <li><b>Vulnerability Assessment and Risk Analysis:</b> Developed skills in identifying common security misconfigurations, assigning risk scores, classifying vulnerabilities into severity tiers, and generating recommendations for improving security.</li>
    <li><b>Automated PDF Document Engineering:</b> Gained experience using OpenPDF to programmatically generate structured, styled executive security reports with metrics, severity badges, and remediation steps.</li>
    <li><b>Dashboard Development and Data Visualization:</b> Gained experience using React 18, Vite, Tailwind CSS and Recharts to develop an interactive security dashboard, display assessment metrics, visualize severity distribution and present detailed security findings.</li>
    <li><b>Testing and DevOps Containerization:</b> Wrote 23 automated tests using JUnit 5 and Mockito, containerized multi-container services with Docker Compose, and managed version control on GitHub.</li>
</ol>
`));

// ================= PAGE 12 (Body Page 7): Chapter 6.1 =================
pages.push(makeBodyPage(7, `
<div class="chapter-heading">6. CyberShield Vulnerability Scanner – Project Overview</div>
<p>Source: [CyberShield – GitHub Repository] (https://github.com/Pavithra-Devadiga/CyberSecurity)</p>
<div class="section-heading">6.1 Introduction to the Project</div>
<p>CyberShield is an enterprise web application vulnerability scanner and security assessment platform developed to identify common security misconfigurations and vulnerabilities in web applications and REST APIs.</p>
<p>Web applications are central to modern digital business, processing confidential user data, payment transactions and enterprise workflows. Improperly configured servers, missing security headers, weak TLS ciphers, exposed administrative endpoints and unvalidated form inputs can expose sensitive information, increase the possibility of unauthorized access and create severe security risks.</p>
<p>The application automates the assessment of web targets using a modular Java 21 engine. It performs eight major security checks:</p>
<ul>
    <li><b>HTTP Security Headers Analysis:</b> Verifies the presence of CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, and checks for server banner leaks.</li>
    <li><b>SSL/TLS Cipher Suite Auditing:</b> Inspects certificate validity, expiration, SAN, and checks for deprecated protocols (TLS 1.0/1.1).</li>
    <li><b>SQL Injection Assessment:</b> Injects benign verification probes to detect database syntax errors and reflection.</li>
    <li><b>Cross-Site Scripting (XSS) Assessment:</b> Probes input parameters for unescaped script tag reflection.</li>
    <li><b>Endpoint Exposure Discovery:</b> Probes for sensitive files such as .env, .git/HEAD, and Spring Boot /actuator endpoints.</li>
    <li><b>Sensitive Information Leakage:</b> Regex analysis detecting AWS keys, RSA private keys, and JWT tokens in responses.</li>
    <li><b>Website Technology Fingerprinting:</b> Identifies web server, framework, and CMS metadata.</li>
    <li><b>OWASP ZAP Integration:</b> Connects via REST API for active automated DAST scanning.</li>
</ul>
<p>The application incorporates a risk assessment mechanism that assigns scores to identified security issues and classifies targets into LOW, MEDIUM, ELEVATED and CRITICAL risk categories.</p>
<p>An interactive dashboard developed using React 18 presents the assessment results through security metrics, visualizations, detailed findings and downloadable PDF reports generated via OpenPDF.</p>
<p>The project demonstrates how Java-based automation can simplify web application security auditing and help identify configuration weaknesses in production environments.</p>
`));

// ================= PAGE 13 (Body Page 8): Chapter 6.2 - 6.4 =================
pages.push(makeBodyPage(8, `
<div class="section-heading">6.2 Problem Statement</div>
<p>Organizations increasingly deploy web applications and APIs to deliver services, process payments and manage business data. However, incorrectly configured web servers and unvalidated input parameters can introduce critical security vulnerabilities.</p>
<p>Manually inspecting individual web endpoints to identify configuration weaknesses can be time-consuming and difficult, particularly when multiple microservices are involved.</p>
<p>Security issues such as missing security headers, disabled HSTS, exposed .env files, unprotected actuator endpoints, SQL injection and cross-site scripting may go unnoticed without systematic assessment.</p>
<p>Furthermore, security assessment tools themselves must be defended against exploitation, ensuring they cannot be manipulated to launch Server-Side Request Forgery (SSRF) attacks against internal networks.</p>
<p>Therefore, there is a need for an automated security assessment tool that can inspect web application configurations, identify common security misconfigurations, evaluate their potential risks, enforce SSRF protection and generate understandable security reports.</p>
<div class="section-heading">6.3 Project Objectives</div>
<p>The primary objectives of the project are:</p>
<ul>
    <li>To automate the discovery and security assessment of web applications and APIs.</li>
    <li>To engineer a 100% Java-based backend using Spring Boot 3, strictly eliminating Python.</li>
    <li>To verify HTTP security headers, TLS ciphers, and certificate configurations.</li>
    <li>To identify exposed configuration files, .git repositories, and framework actuators.</li>
    <li>To detect potential SQL injection and reflected XSS vulnerabilities.</li>
    <li>To enforce strict SSRF validation blocking private subnets, loopbacks, and cloud metadata.</li>
    <li>To calculate cumulative risk scores and normalized 0–100 security scores.</li>
    <li>To classify web targets according to their security risk levels.</li>
    <li>To generate security recommendations and downloadable PDF audit reports using OpenPDF.</li>
    <li>To develop an interactive React dashboard for monitoring and analysing security findings.</li>
</ul>
<div class="section-heading">6.4 Scope and Features</div>
<p>The project focuses on assessing common configuration-related security risks and input validation flaws associated with web applications. Its major features include automated target discovery, multi-scanner orchestration, risk scoring, security score calculation, OpenPDF export, and an interactive dashboard.</p>
`));

// ================= PAGE 14 (Body Page 9): Chapter 7.1 =================
pages.push(makeBodyPage(9, `
<div class="chapter-heading">7. PROJECT ARCHITECTURE AND DESIGN</div>
<div class="section-heading">7.1 System Architecture</div>
<p>CyberShield follows a modular, layered enterprise architecture consisting of three major components: web integration and security scanning, risk assessment and report generation, and dashboard-based visualization.</p>
<p>The system begins by receiving a target URL from an authenticated user through the React frontend. The request is authenticated by Spring Security using JWT. The ScanOrchestratorService initiates pre-flight SSRF validation using the SsrfProtectionValidator. Once approved, a scan record is created in PostgreSQL and predefined security checks are dispatched concurrently across the target.</p>
<p>The identified security issues are processed by the risk assessment mechanism, which calculates cumulative risk scores and normalized security scores. The assessment results are persisted to PostgreSQL and used to generate styled PDF reports using OpenPDF.</p>
<p>The React dashboard presents the assessment results through security metrics, tables, charts and detailed findings, allowing users to understand the security posture of their web applications.</p>
<p>The architecture follows a two-tier model: a Spring Boot REST API backend and a React 18 Single Page Application frontend, orchestrated via Docker Compose. This flow is shown in Figure 7.1.</p>
<pre class="code-box">
+-----------------------------------------------------------------------------------+
|                                PRESENTATION LAYER                                 |
|       React 18 SPA | Vite 5 | Tailwind CSS | Recharts | Lucide React Icons       |
+-----------------------------------------+-----------------------------------------+
                                          | JSON over HTTPS (JWT Authenticated)
+-----------------------------------------v-----------------------------------------+
|                                  SECURITY LAYER                                   |
|       Spring Security Filter Chain | JwtAuthenticationFilter | BCrypt Hasher      |
+-----------------------------------------+-----------------------------------------+
                                          | Authenticated DTO Request
+-----------------------------------------v-----------------------------------------+
|                                 CONTROLLER LAYER                                  |
|   AuthController | DashboardController | ScanController | VulnerabilityController  |
|               ReportController | NotificationController                           |
+-----------------------------------------+-----------------------------------------+
                                          | Service Invocation
+-----------------------------------------v-----------------------------------------+
|                                  SERVICE LAYER                                    |
|   AuthService | ScanService | ScanOrchestratorService | VulnerabilityService      |
|   SecurityScoreService | SeverityClassificationService | ReportService (OpenPDF)   |
+-------------------+-------------------------------------------+-------------------+
                    |                                           |
+-------------------v-------------------+   +-------------------v-------------------+
|           SCANNING ENGINE             |   |           PERSISTENCE LAYER           |
|  - HttpHeaderScanner                  |   |  - UserRepository                     |
|  - SSLTLSScanner                      |   |  - ScanRepository                     |
|  - SQLInjectionScanner                |   |  - VulnerabilityRepository            |
|  - XSSScanner                         |   |  - NotificationRepository             |
|  - EndpointExposureScanner            |   |  - PostgreSQL / H2 Database           |
|  - SensitiveInformationScanner        |   +---------------------------------------+
|  - WebsiteTechnologyScanner           |
|  - OWASPZapIntegrationService         |
+---------------------------------------+
</pre>
<p class="center bold" style="font-size: 11pt;">Figure 7.1: System Architecture of CyberShield</p>
`));

// ================= PAGE 15 (Body Page 10): Chapter 7.2 =================
pages.push(makeBodyPage(10, `
<div class="section-heading">7.2 Technologies and Tools Used</div>
<p>The project was developed strictly using Java 21 and Spring Boot 3 on the backend, completely eliminating Python, supported by modern web technologies for data visualization and report generation.</p>
<table class="clean-table">
    <thead>
        <tr>
            <th style="width: 35%;">Technology</th>
            <th style="width: 65%;">Purpose</th>
        </tr>
    </thead>
    <tbody>
        <tr><td><b>Java 21 LTS</b></td><td>Core programming language providing modern features, records and native HttpClient</td></tr>
        <tr><td><b>Spring Boot 3.4.1</b></td><td>Enterprise framework for dependency injection, REST controllers and lifecycle management</td></tr>
        <tr><td><b>Spring Security</b></td><td>Security framework managing filter chains, endpoint authorization and session policies</td></tr>
        <tr><td><b>JWT (jjwt 0.12.6)</b></td><td>Stateless, cryptographically signed user authentication tokens</td></tr>
        <tr><td><b>Spring Data JPA</b></td><td>Object-Relational Mapping (ORM) and abstracted database interactions via Hibernate</td></tr>
        <tr><td><b>PostgreSQL 16</b></td><td>Production relational database for persistent storage</td></tr>
        <tr><td><b>H2 Database</b></td><td>In-memory relational database for rapid automated integration testing</td></tr>
        <tr><td><b>Java HttpClient</b></td><td>High-performance HTTP client for asynchronous target scanning</td></tr>
        <tr><td><b>Jsoup 1.18.3</b></td><td>HTML parsing engine for inspecting DOM trees, forms and reflected payloads</td></tr>
        <tr><td><b>Java SSL APIs</b></td><td>Low-level TLS socket engine for auditing certificate chains and cipher suites</td></tr>
        <tr><td><b>OpenPDF 2.0.3</b></td><td>Server-side library for automated PDF security report generation</td></tr>
        <tr><td><b>React 18</b></td><td>Component-based frontend Single Page Application (SPA)</td></tr>
        <tr><td><b>Vite 5</b></td><td>Modern frontend build tool providing fast bundling and hot module replacement</td></tr>
        <tr><td><b>Tailwind CSS</b></td><td>Utility-first CSS framework for clean, responsive styling</td></tr>
        <tr><td><b>Recharts</b></td><td>Data visualization library for rendering risk distribution and severity charts</td></tr>
        <tr><td><b>Docker Compose</b></td><td>Multi-container orchestration for backend, frontend and PostgreSQL</td></tr>
        <tr><td><b>Git and GitHub</b></td><td>Version control and source code management</td></tr>
    </tbody>
</table>
`));

// ================= PAGE 16 (Body Page 11): Chapter 7.3 =================
pages.push(makeBodyPage(11, `
<div class="section-heading">7.3 Security Assessment Methodology</div>
<p>The application follows a systematic 6-step approach to evaluate the security configurations of target web applications:</p>
<ol>
    <li><b>Target Input and SSRF Validation:</b> The user submits a target URL. The SsrfProtectionValidator parses the URL, performs DNS resolution, and ensures resolved IPs do not match loopback, RFC 1918 private subnets or cloud metadata endpoints.</li>
    <li><b>Scan Record Initialization:</b> A new Scan record is created in PostgreSQL with status RUNNING and an audit timestamp.</li>
    <li><b>Concurrent Scanner Execution:</b> The ScanOrchestratorService creates an isolated SafeHttpClient and dispatches the target to all active scanner modules asynchronously.</li>
    <li><b>Vulnerability Analysis & Normalization:</b> Each scanner analyzes responses (headers, TLS handshake, HTML DOM, status codes) and produces standardized Vulnerability records.</li>
    <li><b>Risk Scoring and Classification:</b> The SeverityClassificationService and SecurityScoreService evaluate findings, compute the Cumulative Risk Score, and calculate the 0–100 Security Score.</li>
    <li><b>Persistence, Notification & PDF Export:</b> Scan status is updated to COMPLETED, duration is calculated, an in-app alert is generated, and the scan becomes exportable as an OpenPDF document.</li>
</ol>
<pre class="code-box">
                                Start
                                  |
                                  v
                    [ User Submits Target URL ]
                                  |
                                  v
                    [ SSRF Validation Check ] ---> (Invalid IP) ---> [ Abort Scan ]
                                  | (Safe URL)
                                  v
                    [ Record Scan Status: RUNNING ]
                                  |
        +-------------------------+-------------------------+
        |                         |                         |
        v                         v                         v
[ HttpHeaderScanner ]     [ SSLTLSScanner ]      [ SQLInjectionScanner ]
[ XSSScanner ]            [ EndpointExposure ]   [ SensitiveInfoScanner ]
[ WebsiteTechScanner ]    [ OWASPZapService ]
        |                         |                         |
        +-------------------------+-------------------------+
                                  |
                                  v
                    [ Collect & Deduplicate Findings ]
                                  |
                                  v
                    [ Calculate Risk & Security Scores ]
                                  |
                                  v
                    [ Generate OpenPDF Report ]
                                  |
                                  v
                    [ Display on React Dashboard ]
                                  |
                                 End
</pre>
<p class="center bold" style="font-size: 11pt;">Figure 7.2: Security Assessment Workflow</p>
`));

// ================= PAGE 17 (Body Page 12): Chapter 7.4 =================
pages.push(makeBodyPage(12, `
<div class="section-heading">7.4 Risk Scoring and Compliance Assessment</div>
<p>The project incorporates a weighted risk assessment mechanism to evaluate the security posture of individual web targets.</p>
<p>Each identified security misconfiguration is assigned a predefined risk weight according to its potential impact.</p>
<div class="subsection-heading">Risk Score Calculation</div>
<p>The cumulative risk score is calculated by adding the weights assigned to all identified security issues.</p>
<div class="equation-box">
Equation 7.1: Risk Score Calculation<br><br>
R = ∑ Wi &nbsp;&nbsp;(for i = 1 to n)
</div>
<p>Where:</p>
<ul>
    <li>R = Total risk score.</li>
    <li>Wi = Risk weight assigned to each identified security issue.</li>
    <li>n = Total number of identified security issues.</li>
</ul>
<p>The implemented risk weights are shown below:</p>
<table class="clean-table">
    <thead>
        <tr>
            <th style="width: 70%;">Security Findings</th>
            <th style="width: 30%;">Risk Weight</th>
        </tr>
    </thead>
    <tbody>
        <tr><td>Critical Vulnerability (SQLi, Exposed .env)</td><td class="center bold">10</td></tr>
        <tr><td>High Vulnerability (Reflected XSS, Exposed Actuator)</td><td class="center bold">7</td></tr>
        <tr><td>Medium Vulnerability (Missing CSP, Missing HSTS)</td><td class="center bold">4</td></tr>
        <tr><td>Low Vulnerability (Missing Referrer-Policy)</td><td class="center bold">2</td></tr>
        <tr><td>Informational Finding (Server Banner Disclosure)</td><td class="center bold">0</td></tr>
    </tbody>
</table>
<p>Risk Classification is based on the calculated risk score; each target is assigned one of the following risk categories:</p>
<table class="clean-table">
    <thead>
        <tr>
            <th style="width: 50%;">Risk Score</th>
            <th style="width: 50%;">Classification</th>
        </tr>
    </thead>
    <tbody>
        <tr><td class="center">0 - 7</td><td class="center bold">LOW</td></tr>
        <tr><td class="center">8 - 15</td><td class="center bold">MEDIUM</td></tr>
        <tr><td class="center">16 and above</td><td class="center bold">CRITICAL</td></tr>
    </tbody>
</table>
`));

// ================= PAGE 18 (Body Page 13): Chapter 7.4 (Cont.) =================
pages.push(makeBodyPage(13, `
<p>The weights, risk thresholds and compliance deductions used by the scanner are summarised below:</p>
<div style="text-align: center; margin: 15px 0;">
    <span style="border: 1px solid #16a34a; background: #dcfce7; padding: 4px 10px; font-weight: bold; margin: 0 5px;">LOW: 0 - 7</span>
    <span style="border: 1px solid #d97706; background: #fef3c7; padding: 4px 10px; font-weight: bold; margin: 0 5px;">MEDIUM: 8 - 15</span>
    <span style="border: 1px solid #dc2626; background: #fee2e2; padding: 4px 10px; font-weight: bold; margin: 0 5px;">CRITICAL: 16+</span>
</div>
<p class="center bold" style="font-size: 11pt;">Figure 7.3: Risk Scoring Model</p>
<p>For example, consider a web target with SQL Injection detected, missing CSP, and missing HSTS:</p>
<div class="equation-box">
Equation 7.2: Example Risk Score<br><br>
R = 10 + 4 + 4 = 18
</div>
<p>Therefore, the web application is classified as CRITICAL risk.</p>
<div class="subsection-heading">Compliance Score Calculation</div>
<p>The application begins with a compliance score of 100 and deducts predefined points for each identified security issue.</p>
<div class="equation-box">
Equation 7.3: Compliance Score<br><br>
C = max(0, &nbsp; 100 - ∑ Di) &nbsp;&nbsp;(for i = 1 to n)
</div>
<p>Where:</p>
<ul>
    <li>C = Final compliance / security score (0–100%).</li>
    <li>Di = Compliance deduction for each identified security issue.</li>
</ul>
<p>The implemented compliance deductions are:</p>
<table class="clean-table">
    <thead>
        <tr>
            <th style="width: 70%;">Security Findings</th>
            <th style="width: 30%;">Deduction</th>
        </tr>
    </thead>
    <tbody>
        <tr><td>Critical Vulnerability</td><td class="center bold">25</td></tr>
        <tr><td>High Vulnerability</td><td class="center bold">15</td></tr>
        <tr><td>Medium Vulnerability</td><td class="center bold">8</td></tr>
        <tr><td>Low Vulnerability</td><td class="center bold">3</td></tr>
        <tr><td>Informational Finding</td><td class="center bold">0</td></tr>
    </tbody>
</table>
<p>For the previous example:</p>
<div class="equation-box">
Equation 7.4: Example Compliance Score<br><br>
C = 100 - (25 + 8 + 8) = 59%
</div>
`));

// ================= PAGE 19 (Body Page 14): Chapter 7.5 =================
pages.push(makeBodyPage(14, `
<p>Therefore, the final compliance score is 59%.</p>
<p>The final compliance score is restricted to a minimum of zero. These risk and compliance calculations are based on a project-defined scoring model and are intended to provide an objective security assessment rather than an official regulatory certification.</p>
<div class="section-heading">7.5 Project Structure and Software Requirements</div>
<p>The project is organised into two functional modules and supporting files, as shown below:</p>
<pre class="code-box">
cybersecurity/
|-- backend/                       # Spring Boot 3.4.1 Java 21 Backend
|   |-- pom.xml                    # Maven dependencies (Spring, OpenPDF, Jsoup)
|   |-- Dockerfile                 # Multi-stage Maven + Temurin 21 JRE
|   \-- src/main/java/com/security/scanner/
|       |-- config/                # SecurityConfig, JwtAuthenticationFilter
|       |-- controller/            # Auth, Dashboard, Scan, Report Controllers
|       |-- dto/                   # Request & Response DTOs
|       |-- entity/                # User, Scan, Vulnerability entities
|       |-- repository/            # Spring Data JPA repositories
|       |-- scanner/               # 8 Scanner Modules + SafeHttpClient, SSRF
|       \-- service/               # Orchestrator, Score, Report Services
|-- frontend/                      # React 18 Single Page Application
|   |-- package.json               # Frontend dependencies (React, Vite, Tailwind)
|   |-- Dockerfile                 # Multi-stage Node.js build + Nginx Alpine
|   \-- src/                       # Components, Pages, Context, API client
|-- docker-compose.yml             # Orchestration for Backend, Frontend, Postgres
\-- README.md
</pre>
<p>The software environment required to run the project is summarised in the following table:</p>
<table class="clean-table">
    <thead>
        <tr>
            <th style="width: 35%;">Component</th>
            <th style="width: 65%;">Requirement</th>
        </tr>
    </thead>
    <tbody>
        <tr><td><b>Operating System</b></td><td>Windows 10/11, Ubuntu 20.04+ or macOS 12+</td></tr>
        <tr><td><b>Programming Language</b></td><td>Java 21 LTS (Eclipse Temurin)</td></tr>
        <tr><td><b>Framework</b></td><td>Spring Boot 3.4.1</td></tr>
        <tr><td><b>Frontend Library</b></td><td>React 18 with Vite 5 and Tailwind CSS</td></tr>
        <tr><td><b>Database</b></td><td>PostgreSQL 16 (Production) / H2 (Testing)</td></tr>
        <tr><td><b>PDF Engine</b></td><td>OpenPDF 2.0.3</td></tr>
        <tr><td><b>HTML Parser</b></td><td>Jsoup 1.18.3</td></tr>
        <tr><td><b>Build Automation</b></td><td>Apache Maven 3.9+ and Node.js v18+</td></tr>
        <tr><td><b>Container Platform</b></td><td>Docker Desktop with Docker Compose v2</td></tr>
    </tbody>
</table>
`));

// ================= PAGE 20 (Body Page 15): Chapter 8.1 - 8.2 =================
pages.push(makeBodyPage(15, `
<div class="chapter-heading">8. Project Implementation</div>
<p>CyberShield was implemented using Java 21 and Spring Boot 3 to automate the security assessment of web applications. The implementation consists of Spring Security integration, automated security checks, SSRF validation, risk calculation, OpenPDF report generation and React dashboard development.</p>
<p>The project is organized into separate Java packages to maintain a clean layered architecture. The structure of the project is described in Section 7.5.</p>
<div class="section-heading">8.1 Backend Implementation & Architecture</div>
<p>The backend uses Spring Boot 3.4.1. Security is enforced through a stateless JWT authentication filter. Passwords are encrypted using BCrypt with strength 12. Incoming requests are validated, and JPA entities are strictly decoupled from public APIs using Data Transfer Objects (DTOs). Exception handling is centralized using @RestControllerAdvice.</p>
<pre class="code-box">
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http.csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .anyRequest().authenticated())
            .sessionManagement(s -> s.sessionCreationPolicy(STATELESS))
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }
}
</pre>
<div class="section-heading">8.2 Automated Security Checks</div>
<p>The scanner performs eight major security checks on each target web application:</p>
<p><b>A. HTTP Security Headers Verification:</b> The HttpHeaderScanner checks for Content-Security-Policy, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, and server banner leaks. Missing CSP or HSTS records a Medium finding (risk weight 4, deduction 8).</p>
<p><b>B. SSL/TLS Cipher Verification:</b> The SSLTLSScanner audits certificate expiration, Subject Alternative Names, and identifies deprecated TLS 1.0/1.1 protocols using native Java javax.net.ssl APIs.</p>
`));

// ================= PAGE 21 (Body Page 16): Chapter 8.2 (Cont.) - 8.4 =================
pages.push(makeBodyPage(16, `
<p><b>C. SQL Injection Assessment:</b> The SQLInjectionScanner injects benign verification payloads into discovered URL parameters and inspects responses for database syntax error signatures across MySQL, PostgreSQL, Oracle and SQLite. A confirmed finding receives a Critical severity (risk weight 10, deduction 25).</p>
<p><b>D. Cross-Site Scripting (XSS) Assessment:</b> The XSSScanner injects benign script probe markers and uses Jsoup to verify whether user input is returned unescaped in the HTML DOM. A confirmed reflection receives a High severity (risk weight 7, deduction 15).</p>
<p><b>E. Endpoint Exposure Discovery:</b> The EndpointExposureScanner asynchronously probes for sensitive files such as /.env, /.git/HEAD, and Spring Boot /actuator/env endpoints. An exposed .env file is classified as Critical.</p>
<p><b>F. Sensitive Information Scanning:</b> The SensitiveInformationScanner uses precompiled regular expressions to detect leaked AWS access keys, RSA private keys, and hardcoded JWT tokens in HTTP response bodies.</p>
<p><b>G. Website Technology Fingerprinting:</b> The WebsiteTechnologyScanner analyzes response headers and HTML meta tags to detect underlying web servers, frameworks and CMS engines.</p>
<p><b>H. OWASP ZAP REST Integration:</b> The OWASPZapIntegrationService communicates with the ZAP daemon REST API to trigger automated active scans and import standardized alert findings.</p>
<div class="section-heading">8.3 SSRF Defense & Safe HTTP Client Architecture</div>
<p>To prevent the scanner from being weaponized to attack internal corporate infrastructure, the SsrfProtectionValidator resolves target hostnames and validates all resolved IP addresses against loopback (127.0.0.1), RFC 1918 private subnets (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16), and cloud metadata endpoints (169.254.169.254). Any private address immediately triggers a SsrfValidationException, aborting the scan.</p>
<div class="section-heading">8.4 Risk Classification and Security Recommendations</div>
<p>After completing the security checks, the application calculates the cumulative risk score and compliance score for each target. Based on the score, targets are classified into LOW, MEDIUM, ELEVATED or CRITICAL risk levels. Actionable remediation advice is generated for every finding.</p>
`));

// ================= PAGE 22 (Body Page 17): Chapter 8.5 - 8.6 =================
pages.push(makeBodyPage(17, `
<div class="section-heading">8.5 OpenPDF Report Generation</div>
<p>After completing the assessment of a web target, the ReportService generates a structured, multi-page PDF audit report using OpenPDF.</p>
<p>The report contains the overall scan timestamp, target URL, risk distribution, security score gauge, and detailed vulnerability tables with severities, OWASP categories, and remediation instructions.</p>
<pre class="code-box">
Document document = new Document(PageSize.A4, 36, 36, 54, 36);
PdfWriter writer = PdfWriter.getInstance(document, out);
document.open();
Paragraph title = new Paragraph("CYBERSHIELD SECURITY AUDIT REPORT", fontTitle);
document.add(title);
PdfPTable metaTable = new PdfPTable(2);
metaTable.addCell(new Phrase("Target: " + scan.getTargetUrl()));
metaTable.addCell(new Phrase("Score: " + scan.getSecurityScore() + "%"));
document.add(metaTable);
PdfPTable findingsTable = new PdfPTable(new float[]{1.5f, 3.5f, 1.5f, 3.5f});
for (Vulnerability v : vulnerabilities) {
    findingsTable.addCell(createSeverityCell(v.getSeverity()));
    findingsTable.addCell(new Phrase(v.getTitle()));
    findingsTable.addCell(new Phrase(v.getCategory().name()));
    findingsTable.addCell(new Phrase(v.getRemediation()));
}
document.add(findingsTable);
document.close();
</pre>
<div class="section-heading">8.6 React Dashboard Implementation</div>
<p>React 18 was used to develop an interactive web-based dashboard for presenting the security assessment results. The dashboard fetches data via Axios from the Spring Boot REST API.</p>
<p>The main components of the dashboard are:</p>
<ol>
    <li><b>Security Metrics Overview:</b> Displays the total number of scans, average security score, and active scan count.</li>
    <li><b>Score Gauge Component:</b> A circular SVG gauge rendering the 0–100 security score with dynamic color gradients.</li>
    <li><b>Severity Distribution Charts:</b> Uses Recharts donut and bar graphs to illustrate the distribution of vulnerabilities across Critical, High, Medium, and Low tiers.</li>
    <li><b>Vulnerability Drawer:</b> Expandable inspection drawer displaying raw payloads, URLs, and remediation guidance.</li>
    <li><b>Report Download:</b> Direct button downloading the OpenPDF-compiled audit report.</li>
</ol>
`));

// ================= PAGE 23 (Body Page 18): Chapter 8.7 =================
pages.push(makeBodyPage(18, `
<div class="section-heading">8.7 Project Execution</div>
<p>The application is executed through two main stages, or unified through Docker Compose:</p>
<div class="subsection-heading">Stage 1: Running the Spring Boot Backend</div>
<p>The following commands compile and launch the backend service:</p>
<pre class="code-box">
cd backend
mvn clean package -DskipTests
java -jar target/security-scanner-1.0.0.jar
</pre>
<p>The backend initializes on http://localhost:8080 with full REST endpoints.</p>
<div class="subsection-heading">Stage 2: Launching the React Dashboard</div>
<p>The following commands install dependencies and launch the frontend:</p>
<pre class="code-box">
cd frontend
npm install
npm run dev
</pre>
<p>The dashboard loads at http://localhost:5173 and communicates with the backend via JWT.</p>
<div class="subsection-heading">Stage 3: Full Stack Deployment via Docker Compose</div>
<p>The entire environment can be started with a single command:</p>
<pre class="code-box">
docker-compose up --build -d
</pre>
`));

// ================= PAGE 24 (Body Page 19): Chapter 9.1 - 9.2 =================
pages.push(makeBodyPage(19, `
<div class="chapter-heading">9. PROJECT RESULTS AND ANALYSIS</div>
<p>CyberShield was developed to automate the identification and assessment of common security misconfigurations in web applications. The application integrates Java-based security scanning with an interactive React dashboard and OpenPDF reporting.</p>
<p>The implementation demonstrates how web security configurations can be systematically evaluated and how identified security issues can be classified according to their potential risk.</p>
<div class="section-heading">9.1 Security Assessment Results</div>
<p>The scanner performs eight major security checks: HTTP security headers, SSL/TLS ciphers, SQL injection, XSS reflection, endpoint exposure, sensitive data disclosure, website tech fingerprinting, and OWASP ZAP scanning.</p>
<p>The assessment identifies the following potential security issues:</p>
<table class="clean-table">
    <thead>
        <tr>
            <th style="width: 25%;">Security Check</th>
            <th style="width: 40%;">Expected Configuration</th>
            <th style="width: 35%;">Potential Findings</th>
        </tr>
    </thead>
    <tbody>
        <tr><td>HTTP Headers</td><td>CSP, HSTS, X-Frame-Options configured</td><td>Missing Security Headers</td></tr>
        <tr><td>SSL/TLS</td><td>TLS 1.2/1.3 with valid certificate</td><td>Deprecated TLS / Expired Certificate</td></tr>
        <tr><td>SQL Injection</td><td>Parameterized queries / prepared statements</td><td>SQL Injection Detected</td></tr>
        <tr><td>XSS</td><td>Context-aware output encoding</td><td>Reflected XSS Detected</td></tr>
        <tr><td>Endpoint Exposure</td><td>Sensitive files restricted (HTTP 403/404)</td><td>Exposed .env / Actuator</td></tr>
        <tr><td>Sensitive Data</td><td>No hardcoded credentials in HTML/JS</td><td>Leaked AWS / JWT Keys</td></tr>
    </tbody>
</table>
<div class="section-heading">9.2 Sample Scan Results</div>
<p>The scanner was executed against a sample set of three targets representing a hardened production gateway, a staging application and an insecure test environment:</p>
<table class="clean-table">
    <thead>
        <tr>
            <th style="width: 40%;">Target Application</th>
            <th style="width: 15%; text-align: center;">Risk Score</th>
            <th style="width: 15%; text-align: center;">Risk Level</th>
            <th style="width: 15%; text-align: center;">Compliance</th>
            <th style="width: 15%; text-align: center;">Findings</th>
        </tr>
    </thead>
    <tbody>
        <tr><td>Target A: Hardened API Gateway</td><td class="center">2</td><td class="center bold">LOW</td><td class="center">97%</td><td class="center">1 Low</td></tr>
        <tr><td>Target B: Staging Web Portal</td><td class="center">15</td><td class="center bold">MEDIUM</td><td class="center">79%</td><td class="center">1 High, 2 Med</td></tr>
        <tr><td>Target C: Insecure Test App</td><td class="center">46</td><td class="center bold">CRITICAL</td><td class="center">16%</td><td class="center">2 Crit, 2 High, 3 Med</td></tr>
    </tbody>
</table>
`));

// ================= PAGE 25 (Body Page 20): Chapter 9.2 (Cont.) - 9.3 =================
pages.push(makeBodyPage(20, `
<p>Target A has full headers, TLS 1.3 and no exposed files, so only a minor Referrer-Policy finding is recorded (score 97%). Target B has missing CSP and an exposed test endpoint, giving a risk score of 15 and compliance score of 79%. Target C has SQL injection, an exposed .env file, reflected XSS, an exposed actuator endpoint, and missing CSP/HSTS; its risk score is 46 and its compliance score is 16%, so it is classified as CRITICAL. The audit log for this target is shown below:</p>
<pre class="code-box">
Scanning Target: http://vulnerable-test-app.local:8080
--------------------------------------------------
[!] CRITICAL: SQL Injection Detected in Parameter "id"
[!] CRITICAL: Sensitive Configuration File Exposed: /.env
[!] HIGH: Reflected Cross-Site Scripting (XSS) in Parameter "q"
[!] HIGH: Spring Boot Actuator Endpoint Exposed: /actuator/env
[!] MEDIUM: Missing Content-Security-Policy (CSP) Header
[!] MEDIUM: Missing Strict-Transport-Security (HSTS) Header
[!] MEDIUM: Missing X-Frame-Options Header (Clickjacking Risk)
Risk Score : 46
Risk Level : CRITICAL
Compliance : 16%
Recommendations:
- Enforce Parameterized Queries / Hibernate PreparedStatements
- Restrict web server access to dotfiles (.env)
- Apply context-aware HTML entity encoding
- Restrict actuator endpoints behind administrative IAM
- Configure Content-Security-Policy and HSTS headers
</pre>
<p>The same results are presented graphically by the React dashboard, as illustrated in Figure 9.1:</p>
<div style="text-align: center; margin: 15px 0;">
    <span style="border: 1px solid #dc2626; background: #fee2e2; padding: 4px 10px; font-weight: bold; margin: 0 5px;">Score Gauge: 16%</span>
    <span style="border: 1px solid #475569; background: #f1f5f9; padding: 4px 10px; font-weight: bold; margin: 0 5px;">Severity Donut: 2 Crit | 2 High | 3 Med</span>
</div>
<p class="center bold" style="font-size: 11pt;">Figure 9.1: Risk Score, Compliance Score and Severity Distribution</p>
<div class="section-heading">9.3 Risk Distribution and Compliance Analysis</div>
<p>The application calculates a cumulative risk score for each target based on the security issues identified during scanning. Targets are classified into LOW, MEDIUM, ELEVATED and CRITICAL risk levels.</p>
<p>The compliance score provides an additional measure of the security configuration status of each target, starting at 100 and reduced by predefined deductions.</p>
`));

// ================= PAGE 26 (Body Page 21): Chapter 9.4 - 9.5 =================
pages.push(makeBodyPage(21, `
<p>The following metrics are displayed:</p>
<ul>
    <li>Total number of targets scanned.</li>
    <li>Number of LOW-risk targets.</li>
    <li>Number of MEDIUM-risk targets.</li>
    <li>Number of CRITICAL-risk targets.</li>
    <li>Individual target risk scores.</li>
    <li>Individual target compliance / security scores.</li>
</ul>
<div class="section-heading">9.4 Dashboard Visualization and Reporting</div>
<p>The React dashboard provides a centralized interface for examining the security assessment results.</p>
<p>The dashboard displays the total number of scanned targets and their distribution across different risk categories.</p>
<p>The target security overview table presents individual target URLs, risk scores, risk classifications and compliance percentages.</p>
<p>A donut chart provides a comparison of severity distribution, while bar charts illustrate vulnerability categories.</p>
<p>Additionally, expandable sections allow users to examine detailed security findings and the corresponding recommendations for individual targets.</p>
<p>The application also generates a downloadable PDF security report containing the scan timestamp, assessment summary, individual findings, risk scores and recommendations.</p>
<p>This reporting mechanism makes the assessment results easier to store, review and analyse.</p>
<div class="section-heading">9.5 Overall Project Analysis</div>
<p>The developed application demonstrates the practical application of cybersecurity principles in enterprise web application environments.</p>
<p>By automating predefined security checks, the scanner reduces the effort required to manually inspect individual web application configurations.</p>
<p>The risk assessment mechanism provides a structured way to prioritize identified security issues, while compliance scoring offers an additional metric for evaluating overall security health.</p>
<p>The interactive dashboard improves the presentation and interpretation of security findings, making the results accessible through tables, charts and downloadable reports.</p>
<p>The project successfully demonstrates the integration of Java 21, Spring Boot 3, PostgreSQL, OpenPDF and React 18 to develop a production-ready web application security assessment platform.</p>
<p>However, the assessment is limited to the implemented security checks and predefined scoring model. The results should therefore be considered an automated baseline assessment rather than an exhaustive manual penetration test.</p>
`));

// ================= PAGE 27 (Body Page 22): Chapter 10.1 - 10.5 =================
pages.push(makeBodyPage(22, `
<div class="chapter-heading">10. LEARNING OUTCOMES AND CYBERSECURITY RELEVANCE</div>
<p>The cybersecurity internship provided an opportunity to apply theoretical concepts to a practical web application security project. The development of CyberShield helped strengthen my understanding of application infrastructure, security assessment, vulnerability identification and automation.</p>
<p>The major learning outcomes and their relevance to cybersecurity are described below.</p>
<div class="section-heading">10.1 Understanding Web Application Security</div>
<p>Gained an understanding of web security principles and the importance of protecting web applications against unauthorized access, data exposure, injection attacks and security misconfigurations.</p>
<p>The project demonstrated how improper configurations in web servers and unsanitized parameters can introduce severe security risks and why regular automated assessments are essential.</p>
<div class="section-heading">10.2 Practical Experience with Enterprise Java Architecture</div>
<p>Developed practical knowledge of enterprise Java 21 and Spring Boot 3, and learned how to build high-concurrency security tools using the native Java HttpClient and Jsoup.</p>
<p>This provided an understanding of how web application configurations and responses can be retrieved, inspected and evaluated programmatically without relying on Python.</p>
<div class="section-heading">10.3 Vulnerability Identification and Risk Assessment</div>
<p>Learned to identify common security misconfigurations involving HTTP headers, TLS ciphers, SQL injection, XSS reflection, and endpoint exposures.</p>
<p>The implementation of a weighted risk assessment mechanism provided practical experience in assigning severity levels to identified security issues and prioritizing them for further investigation.</p>
<div class="section-heading">10.4 Security Automation & Defensive Architecture</div>
<p>Gained experience in developing automated security assessment operations using Java and Spring Boot.</p>
<p>The project demonstrated how repetitive security checks can be automated using concurrent tasks, exception handling and structured data processing, reducing the need for manual inspection. Furthermore, implementing SSRF protection emphasized the importance of defensive architecture in security tooling.</p>
<div class="section-heading">10.5 Security Monitoring and Reporting</div>
<p>Developed an understanding of how security assessment results can be organized and presented through structured reports and visual dashboards.</p>
<p>The use of OpenPDF and React 18 helped in displaying security metrics, risk classifications, detailed findings and recommendations in an understandable format.</p>
`));

// ================= PAGE 28 (Body Page 23): Chapter 10.6 - 10.7 =================
pages.push(makeBodyPage(23, `
<div class="section-heading">10.6 Application Development and Problem-Solving</div>
<p>Improved practical programming and problem-solving abilities through the development, debugging and integration of different application components.</p>
<p>Working with Spring Security, PostgreSQL, OpenPDF and React components provided experience in building an application that combines enterprise software engineering with cybersecurity functionality.</p>
<div class="section-heading">10.7 Relevance to Real-World Cybersecurity</div>
<p>The project addresses an important aspect of modern cybersecurity: identifying and evaluating web application misconfigurations before they lead to potential security incidents.</p>
<p>The concepts implemented are relevant to web security auditing, security engineering, vulnerability management and DevSecOps practices.</p>
<p>Overall, the internship strengthened my technical knowledge and provided practical exposure to the application of cybersecurity principles in enterprise environments. It also encouraged further learning in application security, infrastructure protection and automated vulnerability assessment.</p>
`));

// ================= PAGE 29 (Body Page 24): Chapter 11.1 - 11.2 =================
pages.push(makeBodyPage(24, `
<div class="chapter-heading">11. Challenges and Limitations</div>
<p>During the development of CyberShield, several technical and implementation challenges were encountered. Addressing these challenges provided practical experience in debugging, enterprise integration, security analysis and application development.</p>
<div class="section-heading">11.1 Challenges Faced</div>
<ol>
    <li><b>Server-Side Request Forgery (SSRF) Defense:</b> Ensuring that the scanner could not be abused to probe internal network infrastructure or cloud metadata services required implementing pre-flight DNS resolution and IP address filtering using InetAddress.</li>
    <li><b>Java 21 Mockito Dynamic Agent Loading:</b> Java 21 restricts dynamic agent loading by ByteBuddy, emitting warnings that corrupted Surefire IPC pipes during Maven builds. This was resolved by configuring -XX:+EnableDynamicAgentLoading in pom.xml.</li>
    <li><b>Stateless JWT Filter Chain Ordering:</b> Misconfigured Spring Security filter chains initially blocked unauthenticated pre-flight OPTIONS requests from the React frontend, requiring careful filter chain reordering.</li>
    <li><b>Concurrent Scanner Orchestration:</b> Running eight scanner modules sequentially resulted in excessive scan latency (>25s), which was solved by refactoring ScanOrchestratorService to dispatch scanners concurrently using CompletableFuture.</li>
    <li><b>Risk Scoring Mechanism:</b> Developing a consistent risk assessment mechanism required assigning numerical weights to different security findings and establishing thresholds for LOW, MEDIUM and CRITICAL classifications.</li>
    <li><b>OpenPDF Document Formatting:</b> Formatting multi-page tables, severity badge cells, and header/footer rules dynamically across varying vulnerability counts required detailed layout engineering.</li>
</ol>
<div class="section-heading">11.2 Project Limitations</div>
<p>Although the application successfully demonstrates automated web application security assessment, certain limitations exist in its current implementation.</p>
<ol>
    <li><b>Limited Active Payloads:</b> The SQL injection and XSS modules perform benign verification probes rather than extensive multi-payload fuzzing dictionaries.</li>
    <li><b>Client-Side Single Page Application Crawling:</b> The scanner analyzes HTML responses via Jsoup but does not execute heavy client-side JavaScript applications using a headless browser engine.</li>
    <li><b>Target Rate Limiting and WAF Evasion:</b> Rapid bursts of probe requests may trigger rate limiting or IP blocking on targets defended by commercial Web Application Firewalls.</li>
</ol>
`));

// ================= PAGE 30 (Body Page 25): Chapter 11.2 (Cont.) =================
pages.push(makeBodyPage(25, `
<ol start="4">
    <li><b>Custom Risk Assessment:</b> The risk scoring mechanism uses predefined weights and thresholds developed for the project rather than an official industry-standard risk assessment framework.</li>
    <li><b>No Automated Remediation:</b> The application generates security recommendations but does not automatically modify web server configurations or code.</li>
    <li><b>Single-Node Architecture:</b> The scanning orchestrator operates within a single Spring Boot application instance rather than a distributed queue-worker cluster.</li>
    <li><b>Limited Compliance Validation:</b> The calculated compliance score is based on the project's predefined checks and should not be considered an official regulatory certification.</li>
    <li><b>Broad Exception Handling:</b> Certain connection timeouts treat unresponsive endpoints as inaccessible rather than differentiating transient network drops.</li>
    <li><b>Unauthenticated Scope:</b> The scanner audits primarily public unauthenticated endpoints and does not support multi-step form-based authentication contexts.</li>
    <li><b>Third-Party Dependency:</b> Deep active scanning requires an active OWASP ZAP daemon running in Docker or on the host.</li>
</ol>
<p>Despite these limitations, the project demonstrates the practical application of cybersecurity principles through automated web vulnerability assessment, risk classification and security reporting.</p>
`));

// ================= PAGE 31 (Body Page 26): Chapter 12 =================
pages.push(makeBodyPage(26, `
<div class="chapter-heading">12. Conclusion</div>
<p>The 120-hour Cybersecurity Internship conducted under the Honeywell Future Skills Edge Program, implemented by BharatCares, provided valuable exposure to cybersecurity fundamentals and their practical applications. The combination of structured online training and guided project work helped develop an understanding of security threats, vulnerabilities, web application security, access control, risk assessment and data protection.</p>
<p>The development of CyberShield served as the primary practical component of the internship. The project demonstrated how Java 21 and Spring Boot 3 can be used to automate security assessments of web applications by examining HTTP headers, SSL/TLS configurations, SQL injection, XSS reflection, sensitive endpoint exposure and sensitive data leaks.</p>
<p>The implementation of a risk assessment mechanism provided a structured approach to identifying security misconfigurations, calculating risk scores and classifying targets according to their potential security risks. Additionally, the React dashboard provided an interactive interface for presenting security metrics, visualizing severity distribution and examining detailed assessment findings. OpenPDF report generation further enabled the assessment results to be stored and reviewed.</p>
<p>Throughout the internship, I gained practical experience in enterprise Java development, Spring Boot architecture, web security, vulnerability assessment, security automation and full-stack application development. The project also improved my problem-solving, analytical and technical documentation skills.</p>
<p>Overall, the internship helped bridge the gap between theoretical cybersecurity knowledge and practical implementation. It strengthened my understanding of web security challenges and encouraged me to explore advanced areas of cybersecurity, particularly application security engineering, vulnerability management and DevSecOps.</p>
<p>The knowledge and experience gained through this internship will serve as a valuable foundation for my future academic and professional development in the field of cybersecurity.</p>
`));

// ================= PAGE 32 (Body Page 27): Chapter 13 =================
pages.push(makeBodyPage(27, `
<div class="chapter-heading">13. References</div>
<ol>
    <li>Open Web Application Security Project (OWASP), <i>OWASP Top 10: 2021 – The Ten Most Critical Web Application Security Risks</i>. Available at: https://owasp.org/Top10/</li>
    <li>OWASP Foundation, <i>OWASP Zed Attack Proxy (ZAP) Documentation and REST API Specification</i>. Available at: https://www.zaproxy.org/docs/</li>
    <li>National Institute of Standards and Technology (NIST), <i>Technical Guide to Information Security Testing and Assessment</i>, NIST Special Publication 800-115. Available at: https://csrc.nist.gov/publications/detail/sp/800-115/final</li>
    <li>Oracle Corporation, <i>Java Platform, Standard Edition Documentation (JDK 21)</i>. Available at: https://docs.oracle.com/en/java/javase/21/</li>
    <li>VMware Tanzu / Broadcom, <i>Spring Boot Reference Documentation (v3.4.x)</i>. Available at: https://docs.spring.io/spring-boot/reference/</li>
    <li>Spring Security Team, <i>Spring Security Architecture and Reference Guide</i>. Available at: https://docs.spring.io/spring-security/reference/</li>
    <li>Internet Engineering Task Force (IETF), <i>Address Allocation for Private Internets</i>, RFC 1918. Available at: https://datatracker.ietf.org/doc/html/rfc1918</li>
    <li>Internet Engineering Task Force (IETF), <i>JSON Web Token (JWT)</i>, RFC 7519. Available at: https://datatracker.ietf.org/doc/html/rfc7519</li>
    <li>Jsoup Author Team, <i>Jsoup: Java HTML Parser Specification and API Reference</i>. Available at: https://jsoup.org/</li>
    <li>OpenPDF Development Team, <i>OpenPDF – Open Source Java Library for PDF Generation</i>. Available at: https://github.com/LibrePDF/OpenPDF</li>
    <li>PostgreSQL Global Development Group, <i>PostgreSQL 16 Documentation</i>. Available at: https://www.postgresql.org/docs/16/</li>
    <li>React Development Team, <i>React 18 Documentation</i>. Available at: https://react.dev/</li>
    <li>Honeywell, <i>Official Website</i>. Available at: https://www.honeywell.com/</li>
    <li>BharatCares, <i>Official Organizational Resources and Honeywell Future Skills Edge Program</i>. Available at: https://bharatcares.org/</li>
    <li>Pavithra Devadiga, <i>CyberShield: Enterprise Web Application Vulnerability Scanner – Source Code and Documentation</i>. GitHub Repository: https://github.com/Pavithra-Devadiga/CyberSecurity</li>
</ol>
`));

// ================= PAGE 33 (Body Page 28): Chapter 14 =================
pages.push(makeBodyPage(28, `
<div class="chapter-heading">14. Certificate</div>
<p class="center italic" style="margin: 20px 0;">[ AFFIX OFFICIAL BHARATCARES / HONEYWELL CERTIFICATE HERE ]</p>
<div style="border: 2px solid #0284c7; padding: 25px; text-align: center; background-color: #f0f9ff; border-radius: 6px; margin: 20px auto;">
    <div style="font-size: 15pt; font-weight: bold; color: #0369a1; margin-bottom: 5px;">BharatCares</div>
    <div class="chapter-heading" style="margin: 15px 0 10px 0;">Certificate of Internship</div>
    <p style="font-size: 11pt; margin-bottom: 15px;">This certificate is proudly presented to</p>
    <div style="font-size: 15pt; font-weight: bold; color: #1e3a8a; text-decoration: underline; margin-bottom: 15px;">PAVITHRA DEVADIGA</div>
    <p style="font-size: 11pt; line-height: 1.6; max-width: 90%; margin: 0 auto 25px auto;">
        For successfully completing a 120-hours internship program in <b>Cybersecurity</b>, conducted from June to July 2026, and organized by <b>BharatCares</b> under the <b>Honeywell Future Skills Edge Program</b>, demonstrating dedication and proficiency in the field. During this internship, the participant gained hands-on experience in real-world applications, demonstrated strong technical skills, and successfully completed assigned projects and tasks in the respective domain.
    </p>
    <table style="width: 100%; border: none; margin-top: 30px;">
        <tr>
            <td style="width: 50%; border: none; text-align: left;">
                <div style="width: 160px; border-top: 1px solid #000; padding-top: 5px;">
                    <b>Mr. Utkarsh Sharma</b><br>
                    <span style="font-size: 9pt;">Associate Vice President,<br>Future Tech Program<br>BharatCares</span>
                </div>
            </td>
            <td style="width: 50%; border: none; text-align: right;">
                <div style="width: 160px; border-top: 1px solid #000; padding-top: 5px; margin-left: auto;">
                    <b>Mr. Sacheth Sanal</b><br>
                    <span style="font-size: 9pt;">Sr. Manager - Future Tech &<br>CSR Programs<br>BharatCares</span>
                </div>
            </td>
        </tr>
    </table>
</div>
`));

const fullHtml = htmlHeader + pages.join('\n') + '\n</body>\n</html>';

// Write .html
fs.writeFileSync(outputHtmlPath, fullHtml, 'utf-8');
console.log('Successfully written HTML report to: ' + outputHtmlPath);

// Write .doc (Word format)
const formattedDocPath = path.join(__dirname, '..', '..', 'docs', 'CyberShield_Internship_Report_Formatted.doc');
fs.writeFileSync(formattedDocPath, fullHtml, 'utf-8');
console.log('Successfully written formatted Word Document to: ' + formattedDocPath);

try {
    fs.writeFileSync(outputDocPath, fullHtml, 'utf-8');
    console.log('Successfully written Word Document (.doc) to: ' + outputDocPath);
} catch (e) {
    console.log('Note: CyberShield_Internship_Report.doc is currently open in Microsoft Word. Created CyberShield_Internship_Report_Formatted.doc and CyberShield_Internship_Report.docx!');
}
