const fs = require('fs');
const path = require('path');
const docx = require('docx');

const {
    Document, Paragraph, TextRun, Table, TableRow, TableCell,
    HeadingLevel, AlignmentType, PageBreak, Header, Footer,
    PageNumber, BorderStyle, WidthType, ShadingType, UnderlineType
} = docx;

// Common styles
const FONT_NAME = 'Times New Roman';
const CLG_NAME_SIZE = 32;     // 16pt
const HEADING_SIZE = 28;      // 14pt
const SECTION_TITLE_SIZE = 26; // 13pt
const CONTENT_SIZE = 24;       // 12pt
const FOOTER_SIZE = 20;        // 10pt
const SPACING_1_5 = { line: 360, lineRule: 'auto', after: 140, before: 40 };

// Section Page Border Definition (A4 with 1pt solid black border)
const pageBorderConfig = {
    top: { style: BorderStyle.SINGLE, size: 8, space: 16, color: '000000' },
    bottom: { style: BorderStyle.SINGLE, size: 8, space: 16, color: '000000' },
    left: { style: BorderStyle.SINGLE, size: 8, space: 16, color: '000000' },
    right: { style: BorderStyle.SINGLE, size: 8, space: 16, color: '000000' }
};

// Helper: Running Header (Top-Right "Summer Internship - II" + bottom border line)
function createRunningHeader() {
    return new Header({
        children: [
            new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { after: 120 },
                border: {
                    bottom: { style: BorderStyle.SINGLE, size: 6, color: '000000', space: 4 }
                },
                children: [
                    new TextRun({
                        text: 'Summer Internship - II',
                        font: FONT_NAME,
                        size: FOOTER_SIZE,
                        bold: true
                    })
                ]
            })
        ]
    });
}

// Helper: Running Footer ("Dept. of CSE" | "2026-27" | PageNumber)
function createRunningFooter() {
    return new Footer({
        children: [
            new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                borders: {
                    top: { style: BorderStyle.NONE },
                    bottom: { style: BorderStyle.NONE },
                    left: { style: BorderStyle.NONE },
                    right: { style: BorderStyle.NONE },
                    insideHorizontal: { style: BorderStyle.NONE },
                    insideVertical: { style: BorderStyle.NONE }
                },
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({
                                width: { size: 33, type: WidthType.PERCENTAGE },
                                borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                                children: [
                                    new Paragraph({
                                        children: [
                                            new TextRun({ text: 'Dept. of CSE', font: FONT_NAME, size: FOOTER_SIZE })
                                        ]
                                    })
                                ]
                            }),
                            new TableCell({
                                width: { size: 34, type: WidthType.PERCENTAGE },
                                borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                                children: [
                                    new Paragraph({
                                        alignment: AlignmentType.CENTER,
                                        children: [
                                            new TextRun({ text: '2026-27', font: FONT_NAME, size: FOOTER_SIZE })
                                        ]
                                    })
                                ]
                            }),
                            new TableCell({
                                width: { size: 33, type: WidthType.PERCENTAGE },
                                borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                                children: [
                                    new Paragraph({
                                        alignment: AlignmentType.RIGHT,
                                        children: [
                                            new TextRun({ children: [PageNumber.CURRENT], font: FONT_NAME, size: FOOTER_SIZE })
                                        ]
                                    })
                                ]
                            })
                        ]
                    })
                ]
            })
        ]
    });
}

// Paragraph creators
function pHeading(text) {
    return new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 240, after: 240 },
        children: [
            new TextRun({ text, font: FONT_NAME, size: HEADING_SIZE, bold: true })
        ]
    });
}

function pSectionTitle(text) {
    return new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { before: 180, after: 100 },
        children: [
            new TextRun({ text, font: FONT_NAME, size: SECTION_TITLE_SIZE, bold: true })
        ]
    });
}

function pSubsectionTitle(text) {
    return new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { before: 140, after: 60 },
        children: [
            new TextRun({ text, font: FONT_NAME, size: CONTENT_SIZE, bold: true, italics: true })
        ]
    });
}

function pBody(text) {
    return new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: SPACING_1_5,
        children: [
            new TextRun({ text, font: FONT_NAME, size: CONTENT_SIZE })
        ]
    });
}

function pBodyRuns(runs) {
    return new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: SPACING_1_5,
        children: runs.map(r => new TextRun({
            text: r.text,
            font: FONT_NAME,
            size: CONTENT_SIZE,
            bold: !!r.bold,
            italics: !!r.italics,
            underline: r.underline ? { type: UnderlineType.SINGLE } : undefined
        }))
    });
}

function pBullet(boldPrefix, text) {
    const children = [];
    if (boldPrefix) {
        children.push(new TextRun({ text: boldPrefix + ' ', font: FONT_NAME, size: CONTENT_SIZE, bold: true }));
    }
    children.push(new TextRun({ text, font: FONT_NAME, size: CONTENT_SIZE }));
    return new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        bullet: { level: 0 },
        spacing: { line: 360, lineRule: 'auto', after: 80 },
        children
    });
}

function pNumbered(numStr, boldPrefix, text) {
    const children = [
        new TextRun({ text: numStr + ' ', font: FONT_NAME, size: CONTENT_SIZE, bold: true })
    ];
    if (boldPrefix) {
        children.push(new TextRun({ text: boldPrefix + ' ', font: FONT_NAME, size: CONTENT_SIZE, bold: true }));
    }
    children.push(new TextRun({ text, font: FONT_NAME, size: CONTENT_SIZE }));
    return new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { line: 360, lineRule: 'auto', after: 100 },
        indent: { left: 400, hanging: 400 },
        children
    });
}

function pCodeBlock(lines) {
    return lines.map(line => new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { line: 240, after: 20 },
        shading: { type: ShadingType.CLEAR, fill: 'F3F4F6' },
        indent: { left: 200 },
        children: [
            new TextRun({ text: line, font: 'Courier New', size: 19 })
        ]
    }));
}

function createTable(headers, rows, colWidthPercentages) {
    const tableRows = [];

    // Header row
    tableRows.push(new TableRow({
        tableHeader: true,
        children: headers.map((h, i) => new TableCell({
            width: { size: colWidthPercentages[i], type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, fill: 'E5E7EB' },
            borders: {
                top: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
                bottom: { style: BorderStyle.SINGLE, size: 6, color: '000000' },
                left: { style: BorderStyle.SINGLE, size: 4, color: '000000' },
                right: { style: BorderStyle.SINGLE, size: 4, color: '000000' }
            },
            children: [
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 80, after: 80 },
                    children: [new TextRun({ text: h, font: FONT_NAME, size: CONTENT_SIZE - 2, bold: true })]
                })
            ]
        }))
    }));

    // Data rows
    rows.forEach(r => {
        tableRows.push(new TableRow({
            children: r.map((cellText, i) => new TableCell({
                width: { size: colWidthPercentages[i], type: WidthType.PERCENTAGE },
                borders: {
                    top: { style: BorderStyle.SINGLE, size: 2, color: '666666' },
                    bottom: { style: BorderStyle.SINGLE, size: 2, color: '666666' },
                    left: { style: BorderStyle.SINGLE, size: 2, color: '666666' },
                    right: { style: BorderStyle.SINGLE, size: 2, color: '666666' }
                },
                children: [
                    new Paragraph({
                        alignment: i === 0 && colWidthPercentages[i] < 20 ? AlignmentType.CENTER : AlignmentType.LEFT,
                        spacing: { before: 60, after: 60 },
                        children: [new TextRun({ text: cellText, font: FONT_NAME, size: CONTENT_SIZE - 3 })]
                    })
                ]
            }))
        }));
    });

    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: tableRows
    });
}

console.log('Helpers defined. Assembling document...');

// ================= BUILD DOCUMENT =================
const doc = new Document({
    creator: 'Pavithra Devadiga',
    title: 'CyberShield - Cybersecurity Internship Report',
    description: 'Summer Internship - II Report on CyberShield Vulnerability Scanner',
    styles: {
        default: {
            document: {
                run: { font: FONT_NAME, size: CONTENT_SIZE }
            }
        }
    },
    sections: [
        // ================= SECTION 1: FRONT MATTER (Pages 1 to 5) =================
        {
            properties: {
                page: {
                    pageBorders: pageBorderConfig,
                    margin: { top: 1100, bottom: 1100, left: 1100, right: 1100 }
                }
            },
            children: [
                // ----- PAGE 1: TITLE PAGE -----
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 100, after: 60 },
                    children: [
                        new TextRun({ text: 'UNIVERSITY OF VISVESVARAYA COLLEGE OF ENGINEERING', font: FONT_NAME, size: CLG_NAME_SIZE, bold: true })
                    ]
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 40 },
                    children: [
                        new TextRun({ text: '(First State Autonomous University on IIT Model)', font: FONT_NAME, size: CONTENT_SIZE })
                    ]
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 300 },
                    children: [
                        new TextRun({ text: 'K R Circle, Bengaluru – 560 001', font: FONT_NAME, size: CONTENT_SIZE })
                    ]
                }),

                // College Seal Box
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 100, after: 200 },
                    children: [
                        new TextRun({ text: '★  ★  ★\n[ COLLEGE SEAL / EMBLEM ]\nESTD 1917\nविद्या सर्वस्य गौरवं\n★  ★  ★', font: FONT_NAME, size: 20, bold: true, italics: true })
                    ]
                }),

                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 180, after: 60 },
                    children: [
                        new TextRun({ text: 'A Report on Summer Internship-II', font: FONT_NAME, size: CONTENT_SIZE + 2 })
                    ]
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 140 },
                    children: [
                        new TextRun({ text: '"CYBERSECURITY INTERNSHIP"', font: FONT_NAME, size: HEADING_SIZE, bold: true })
                    ]
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 60 },
                    children: [
                        new TextRun({ text: 'Submitted under the mandatory Summer Internship required for the III Year (V Semester)', font: FONT_NAME, size: CONTENT_SIZE - 2 })
                    ]
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 40 },
                    children: [
                        new TextRun({ text: 'Bachelor of Technology', font: FONT_NAME, size: CONTENT_SIZE, bold: true })
                    ]
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 40 },
                    children: [
                        new TextRun({ text: 'in', font: FONT_NAME, size: CONTENT_SIZE })
                    ]
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 360 },
                    children: [
                        new TextRun({ text: 'Information Science and Engineering', font: FONT_NAME, size: CONTENT_SIZE, bold: true })
                    ]
                }),

                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 20 },
                    children: [
                        new TextRun({ text: 'Submitted by:', font: FONT_NAME, size: CONTENT_SIZE, bold: true })
                    ]
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 20 },
                    children: [
                        new TextRun({ text: 'PAVITHRA DEVADIGA (U25UV24TXXXXXX)', font: FONT_NAME, size: CONTENT_SIZE, bold: true })
                    ]
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 240 },
                    children: [
                        new TextRun({ text: 'V Sem, B.Tech, ISE', font: FONT_NAME, size: CONTENT_SIZE })
                    ]
                }),

                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 20 },
                    children: [
                        new TextRun({ text: 'Conducted by:', font: FONT_NAME, size: CONTENT_SIZE, bold: true })
                    ]
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 20 },
                    children: [
                        new TextRun({ text: 'HONEYWELL', font: FONT_NAME, size: CONTENT_SIZE, bold: true })
                    ]
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 200 },
                    children: [
                        new TextRun({ text: 'Powered by BharatCares', font: FONT_NAME, size: CONTENT_SIZE - 2, italics: true })
                    ]
                }),

                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 20 },
                    children: [
                        new TextRun({ text: 'Proctor:', font: FONT_NAME, size: CONTENT_SIZE, bold: true })
                    ]
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 20 },
                    children: [
                        new TextRun({ text: 'Dr. Tanuja R', font: FONT_NAME, size: CONTENT_SIZE })
                    ]
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 280 },
                    children: [
                        new TextRun({ text: 'Associate Professor', font: FONT_NAME, size: CONTENT_SIZE - 2 })
                    ]
                }),

                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 20 },
                    children: [
                        new TextRun({ text: 'DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING', font: FONT_NAME, size: CONTENT_SIZE, bold: true })
                    ]
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 20 },
                    children: [
                        new TextRun({ text: 'UVCE, KR Circle, Bengaluru- 560 001', font: FONT_NAME, size: CONTENT_SIZE, bold: true })
                    ]
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 100 },
                    children: [
                        new TextRun({ text: '2026-2027', font: FONT_NAME, size: CONTENT_SIZE, bold: true })
                    ]
                }),

                // ----- PAGE BREAK -> PAGE 2: CERTIFICATE -----
                new Paragraph({ children: [new PageBreak()] }),

                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 100, after: 40 },
                    children: [
                        new TextRun({ text: 'UNIVERSITY OF VISVESVARAYA COLLEGE OF ENGINEERING', font: FONT_NAME, size: CLG_NAME_SIZE, bold: true })
                    ]
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 240 },
                    children: [
                        new TextRun({ text: 'K R Circle, Bengaluru – 560 001', font: FONT_NAME, size: CONTENT_SIZE })
                    ]
                }),

                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 60, after: 200 },
                    children: [
                        new TextRun({ text: '[ UVCE SEAL ]', font: FONT_NAME, size: 22, bold: true })
                    ]
                }),

                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 100 },
                    children: [
                        new TextRun({ text: 'Department of Computer Science and Engineering', font: FONT_NAME, size: CONTENT_SIZE, bold: true })
                    ]
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 320 },
                    children: [
                        new TextRun({ text: 'Certificate', font: FONT_NAME, size: HEADING_SIZE, bold: true, underline: { type: UnderlineType.SINGLE } })
                    ]
                }),

                pBodyRuns([
                    { text: 'This is to certify that ' },
                    { text: 'PAVITHRA DEVADIGA', bold: true },
                    { text: ', bearing Register Number ' },
                    { text: 'U25UV24TXXXXXX', bold: true },
                    { text: ', has successfully completed the Summer Internship – II work on ' },
                    { text: '"Cybersecurity"', bold: true },
                    { text: ' conducted by the ' },
                    { text: 'Honeywell Future Skills Edge Program', bold: true },
                    { text: ', implemented by ' },
                    { text: 'BharatCares', bold: true },
                    { text: ', for a duration of 120 hours from June 2026 to July 2026, in partial fulfilment of the requirements for the V Semester, Bachelor of Technology in Information Science and Engineering, University of Visvesvaraya College of Engineering, during the academic year 2026–2027.' }
                ]),

                new Paragraph({ spacing: { before: 400 } }),

                // Signatures Table
                new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    borders: {
                        top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
                        left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
                        insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE }
                    },
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({
                                    width: { size: 50, type: WidthType.PERCENTAGE },
                                    borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                                    children: [
                                        new Paragraph({ children: [new TextRun({ text: 'Proctor:', font: FONT_NAME, size: CONTENT_SIZE, bold: true })] }),
                                        new Paragraph({ spacing: { before: 300 }, children: [new TextRun({ text: '--------------------------------', font: FONT_NAME, size: CONTENT_SIZE })] }),
                                        new Paragraph({ children: [new TextRun({ text: 'Dr. Tanuja R', font: FONT_NAME, size: CONTENT_SIZE, bold: true })] }),
                                        new Paragraph({ children: [new TextRun({ text: 'Associate Professor', font: FONT_NAME, size: CONTENT_SIZE - 2 })] }),
                                        new Paragraph({ children: [new TextRun({ text: 'Dept. of CSE, UVCE, Bengaluru', font: FONT_NAME, size: CONTENT_SIZE - 2 })] })
                                    ]
                                }),
                                new TableCell({
                                    width: { size: 50, type: WidthType.PERCENTAGE },
                                    borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                                    children: [
                                        new Paragraph({ children: [new TextRun({ text: 'Chairperson:', font: FONT_NAME, size: CONTENT_SIZE, bold: true })] }),
                                        new Paragraph({ spacing: { before: 300 }, children: [new TextRun({ text: '--------------------------------', font: FONT_NAME, size: CONTENT_SIZE })] }),
                                        new Paragraph({ children: [new TextRun({ text: 'Dr. Manjula S H', font: FONT_NAME, size: CONTENT_SIZE, bold: true })] }),
                                        new Paragraph({ children: [new TextRun({ text: 'Professor', font: FONT_NAME, size: CONTENT_SIZE - 2 })] }),
                                        new Paragraph({ children: [new TextRun({ text: 'Dept. of CSE, UVCE, Bengaluru', font: FONT_NAME, size: CONTENT_SIZE - 2 })] })
                                    ]
                                })
                            ]
                        }),
                        new TableRow({
                            children: [
                                new TableCell({
                                    width: { size: 50, type: WidthType.PERCENTAGE },
                                    borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                                    children: [
                                        new Paragraph({ spacing: { before: 360 }, children: [new TextRun({ text: 'Examiner 1', font: FONT_NAME, size: CONTENT_SIZE, bold: true })] }),
                                        new Paragraph({ spacing: { before: 300 }, children: [new TextRun({ text: '--------------------------------', font: FONT_NAME, size: CONTENT_SIZE })] })
                                    ]
                                }),
                                new TableCell({
                                    width: { size: 50, type: WidthType.PERCENTAGE },
                                    borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                                    children: [
                                        new Paragraph({ spacing: { before: 360 }, children: [new TextRun({ text: 'Examiner 2', font: FONT_NAME, size: CONTENT_SIZE, bold: true })] }),
                                        new Paragraph({ spacing: { before: 300 }, children: [new TextRun({ text: '--------------------------------', font: FONT_NAME, size: CONTENT_SIZE })] })
                                    ]
                                })
                            ]
                        })
                    ]
                }),

                // ----- PAGE BREAK -> PAGE 3: ACKNOWLEDGEMENT -----
                new Paragraph({ children: [new PageBreak()] }),
                pHeading('ACKNOWLEDGEMENT'),
                pBody('I express my sincere gratitude to the University of Visvesvaraya College of Engineering (UVCE), Bengaluru, and the Department of Information Science and Engineering for providing me with the opportunity and support to undertake this internship.'),
                pBody('I am especially thankful to my academic guide, Dr. TANUJA R, for her valuable guidance, suggestions and encouragement throughout the project and report preparation.'),
                pBody('I would also like to express my sincere gratitude to the Chairperson of the Department and the Director of UVCE for providing me with this valuable opportunity and for their support in facilitating the internship, which contributed significantly to my academic and professional learning.'),
                pBody('I sincerely thank Honeywell and BharatCares for providing the opportunity to participate in the Honeywell Future Skills Edge Program on Cybersecurity and complete the 120-hour internship. The program enhanced my understanding of cybersecurity fundamentals, network security and vulnerability assessment.'),
                pBody('As part of the internship, I developed CyberShield, an enterprise web application vulnerability scanner and security assessment platform built purely in Java 21 and Spring Boot 3 with a React 18 frontend. The project provided practical experience in automated security checks, SSRF defense, risk assessment, security score formulation, OpenPDF report generation, and interactive dashboard development.'),
                pBody('Finally, I thank my parents, friends, classmates and well-wishers for their constant encouragement and support throughout this learning journey.'),
                new Paragraph({ spacing: { before: 360 } }),
                new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    spacing: { after: 40 },
                    children: [new TextRun({ text: 'Name: Pavithra Devadiga', font: FONT_NAME, size: CONTENT_SIZE, bold: true })]
                }),
                new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    children: [new TextRun({ text: 'USN: U25UV24TXXXXXX', font: FONT_NAME, size: CONTENT_SIZE, bold: true })]
                }),

                // ----- PAGE BREAK -> PAGE 4: ABSTRACT -----
                new Paragraph({ children: [new PageBreak()] }),
                pHeading('ABSTRACT'),
                pBody('Cybersecurity has become essential with the rapid growth of digital services, cloud computing and interconnected web applications. As organizations increasingly store sensitive information on digital platforms and expose APIs, protecting web applications from unauthorized access, data exposure, injection attacks and security misconfigurations is a major requirement.'),
                pBody('This report presents the experience gained during a 120-hour Cybersecurity Internship organized by BharatCares under the Honeywell Future Skills Edge Program from June 2026 to July 2026, following the 80-hour cybersecurity training completed. The training covered cybersecurity fundamentals, security threats, network protocols, cryptography, vulnerability assessment, access control, data protection and risk analysis.'),
                pBody('As part of the internship, I developed CyberShield, an automated web application vulnerability scanner and security assessment platform developed purely in Java 21 and Spring Boot 3 with a React 18 Single Page Application, consciously eliminating Python. The platform incorporates eight modular scanners: HTTP Security Headers, SSL/TLS Ciphers, SQL Injection, Cross-Site Scripting (XSS), Endpoint Exposure, Sensitive Information Leakage, Website Technology Fingerprinting, and OWASP ZAP REST integration. It provides SSRF protection, risk classification, a normalized 0–100 security score, remediation recommendations, automated PDF reports using OpenPDF, and an interactive React dashboard.'),
                pBody('The internship provided practical experience in web application security, enterprise Java architecture, full-stack development, vulnerability assessment and risk management. This report describes the internship objectives, training, project development, technologies used, skills acquired and overall learning outcomes.'),

                // ----- PAGE BREAK -> PAGE 5: TABLE OF CONTENTS -----
                new Paragraph({ children: [new PageBreak()] }),
                pHeading('TABLE OF CONTENTS'),
                createTable(
                    ['Sl. No.', 'Title', 'Page no.'],
                    [
                        ['1', 'Introduction', '1'],
                        ['2', 'About the Organisation', '2'],
                        ['3', 'Objectives of the internship', '3'],
                        ['4', 'Cybersecurity Training and Guided Project Work', '4'],
                        ['5', 'Specific Skills Acquired', '6'],
                        ['6', 'CyberShield Vulnerability Scanner – Project Overview', '7'],
                        ['7', 'Project Architecture and Design', '9'],
                        ['8', 'Project Implementation', '15'],
                        ['9', 'Project Results and Analysis', '19'],
                        ['10', 'Learning Outcomes and Cybersecurity Relevance', '22'],
                        ['11', 'Challenges and Limitations', '24'],
                        ['12', 'Conclusion', '26'],
                        ['13', 'References', '27'],
                        ['14', 'Certificate', '28']
                    ],
                    [15, 70, 15]
                )
            ]
        },

        // ================= SECTION 2: REPORT BODY (Chapters 1 to 14, Pages 1 to 28) =================
        {
            properties: {
                page: {
                    pageBorders: pageBorderConfig,
                    margin: { top: 1100, bottom: 1100, left: 1100, right: 1100 }
                }
            },
            headers: { default: createRunningHeader() },
            footers: { default: createRunningFooter() },
            children: [
                // ----- CHAPTER 1: INTRODUCTION (Page 1) -----
                pHeading('1. INTRODUCTION'),
                pBody('Cybersecurity has become an essential component of modern computing due to the rapid growth of digital services, cloud platforms, connected devices and online communication. Organizations increasingly depend on digital infrastructure to store, process and exchange sensitive information. Consequently, protecting these systems against unauthorized access, data breaches, security misconfigurations and cyberattacks has become a critical requirement.'),
                pBody('Web applications have transformed how organizations conduct business by providing scalable portals, transactional endpoints and cloud services. However, they also introduce security challenges concerning access permissions, input validation, configuration management and public exposure of sensitive information.'),
                pBody('This report presents the learning and experience gained during a 120-hour Cybersecurity Internship organized by BharatCares under the Honeywell Future Skills Edge Program, from June 2026 to July 2026, following the 80-hour Honeywell Future Skills Edge training on Cybersecurity completed on their platform.'),
                pBody('The internship provided an opportunity to understand cybersecurity concepts and explore their practical applications. The learning activities covered cybersecurity fundamentals, security threats, network protocols, vulnerability identification, access control, risk assessment and data protection.'),
                pBody('As part of the internship, I developed CyberShield, an enterprise web application vulnerability scanner and security assessment platform developed purely in Java 21 and Spring Boot 3 with a React 18 frontend, strictly eliminating Python. The application automates multi-vector security checks including HTTP security headers, SSL/TLS certificate configurations, SQL injection, reflected Cross-Site Scripting (XSS), sensitive file exposure, and hardcoded secrets. It also incorporates a risk assessment mechanism to classify security issues, calculate an objective 0–100 Security Score and generate security recommendations.'),
                pBody('An interactive dashboard was developed using React 18, Vite and Tailwind CSS to present security assessment results. It provides security metrics, severity distribution visualizations, target-wise findings and downloadable PDF reports generated using OpenPDF.'),
                pBody('The project provided practical exposure to web application security, enterprise Java development, Spring Boot architecture, security automation and vulnerability assessment. It demonstrated how automated security tools can help identify configuration weaknesses and improve the security posture of web application environments.'),
                pBody('Overall, the internship helped bridge the gap between theoretical knowledge and practical implementation while strengthening my understanding of cybersecurity and its applications in enterprise software engineering.'),

                // ----- CHAPTER 2: ABOUT THE ORGANISATION (Page 2) -----
                new Paragraph({ children: [new PageBreak()] }),
                pHeading('2. About the Organisation'),
                pSectionTitle('Honeywell'),
                pBody('Honeywell is a multinational technology and engineering company that provides solutions across industries such as aerospace, building automation, industrial operations and digital technologies. The organization focuses on innovation, automation and advanced technological solutions. Through initiatives such as the Honeywell Future Skills Edge Program, it supports skill development and provides students with exposure to emerging technologies, including cybersecurity.'),
                pSectionTitle('BharatCares'),
                pBody('BharatCares is an organization involved in social development, education and skill-development initiatives. It works towards creating learning opportunities and improving employability through industry-oriented training programs. As the implementation partner of the Honeywell Future Skills Edge Program, BharatCares facilitated the cybersecurity training and internship, providing an opportunity to gain practical knowledge and technical skills.'),
                pSectionTitle('Honeywell Future Skills Edge Program'),
                pBody('The Honeywell Future Skills Edge Program is a skill-development initiative designed to equip students with industry-relevant knowledge and practical skills. Under this program, I completed 80 hours of cybersecurity training from their platform, followed by a 120-hour internship from June 2026 to July 2026. The program provided exposure to cybersecurity fundamentals and their practical applications through project development.'),

                // ----- CHAPTER 3: OBJECTIVES OF THE INTERNSHIP (Page 3) -----
                new Paragraph({ children: [new PageBreak()] }),
                pHeading('3. Objectives of the Internship'),
                pBody('The primary objective of the internship was to develop a practical understanding of cybersecurity concepts and explore their applications in web application and enterprise environments. The internship aimed to bridge theoretical knowledge with practical implementation through the development of CyberShield.'),
                pBody('The major objectives were:'),
                pNumbered('1.', 'To understand fundamental concepts of cybersecurity,', 'including common threats, vulnerabilities, the CIA Triad and attack techniques.'),
                pNumbered('2.', 'To gain knowledge of web application security', 'and understand the importance of securing online services against OWASP Top 10 risks.'),
                pNumbered('3.', 'To implement an enterprise backend in Java 21 and Spring Boot 3,', 'strictly without Python, following clean layered architecture.'),
                pNumbered('4.', 'To engineer robust Server-Side Request Forgery (SSRF) defenses', 'blocking loopback, internal subnets and cloud metadata endpoints.'),
                pNumbered('5.', 'To develop automated security scanners', 'for HTTP headers, SSL/TLS ciphers, SQL injection, XSS reflection and endpoint exposures.'),
                pNumbered('6.', 'To integrate OWASP ZAP through its REST API', 'for automated active vulnerability scanning.'),
                pNumbered('7.', 'To implement a risk assessment mechanism', 'for classifying identified security issues based on their severity.'),
                pNumbered('8.', 'To calculate security scores and compliance metrics', 'and generate recommendations for improving web application security.'),
                pNumbered('9.', 'To develop an interactive React 18 dashboard', 'for visualizing security findings, metrics and assessment results.'),
                pNumbered('10.', 'To gain practical experience in software development,', 'debugging, automated testing with JUnit 5/Mockito, and technical documentation.'),

                // ----- CHAPTER 4: TRAINING & GUIDED PROJECT WORK (Pages 4-5) -----
                new Paragraph({ children: [new PageBreak()] }),
                pHeading('4. CYBERSECURITY TRAINING AND GUIDED PROJECT WORK'),
                pBody('The Honeywell Future Skills Edge Program, implemented by BharatCares, included a total of 120 hours of cybersecurity learning and practical activities conducted through an online learning platform from June 2026 to July 2026.'),
                pBody('The program consisted of 80 hours of structured online cybersecurity training and 40 hours of guided practical work and project development. The training introduced fundamental cybersecurity concepts before progressing towards practical applications and project implementation.'),
                pSectionTitle('4.1 Online Cybersecurity Training – 80 Hours'),
                pBody('The first 80 hours were dedicated to structured online learning through the program\'s training platform. The training covered the fundamental concepts of cybersecurity and provided an understanding of the different threats, vulnerabilities and security mechanisms encountered in modern computing environments.'),
                pBody('The major areas of learning included:'),
                pNumbered('1.', 'Introduction to Cybersecurity:', 'Understanding the meaning, importance and objectives of cybersecurity. Introduction to information security and the protection of digital assets.'),
                pNumbered('2.', 'Fundamentals of Information Security:', 'Understanding the CIA Triad, consisting of Confidentiality, Integrity and Availability, and its importance in maintaining information security.'),
                pNumbered('3.', 'Cybersecurity Threats and Attacks:', 'Introduction to common cyber threats, including malware, ransomware, phishing, social engineering, password attacks and unauthorized access.'),
                pNumbered('4.', 'Network Security Fundamentals:', 'Understanding basic network security concepts, communication protocols, firewalls, secure communication and the importance of protecting network infrastructure.'),
                pNumbered('5.', 'Cryptography and Data Protection:', 'Introduction to encryption, decryption, hashing and digital signatures, along with their role in protecting sensitive information.'),
                pNumbered('6.', 'Authentication and Access Control:', 'Understanding authentication mechanisms, authorization, user permissions, password security and the principle of least privilege.'),
                pNumbered('7.', 'Vulnerability Assessment and Risk Management:', 'Learning about security vulnerabilities, threat identification, risk evaluation and the importance of implementing appropriate security controls.'),
                pNumbered('8.', 'Web and Cloud Security Fundamentals:', 'Introduction to cloud security, shared responsibility, web application protection, access management and common configuration risks.'),
                pNumbered('9.', 'Security Monitoring and Incident Response:', 'Understanding the importance of security monitoring, identifying suspicious activities, responding to security incidents and minimizing their impact.'),
                pNumbered('10.', 'Cybersecurity Best Practices:', 'Learning about secure computing practices, software updates, password management, data protection and maintaining a secure digital environment.'),

                // Page 5
                new Paragraph({ children: [new PageBreak()] }),
                pBody('The structured training established a foundation in cybersecurity and helped develop an understanding of how security principles are applied across different computing environments.'),
                pSectionTitle('4.2 Guided Practical Work and Project Development – 40 Hours'),
                pBody('The remaining 40 hours were dedicated to guided practical activities and project development. This phase provided an opportunity to apply the concepts learned during the online training to a practical cybersecurity application.'),
                pBody('The practical work focused on understanding web application security challenges and developing CyberShield using Java 21, Spring Boot 3, and React 18.'),
                pBody('The major activities included:'),
                pNumbered('1.', 'Understanding web application architectures and the security features associated with HTTP, TLS and REST APIs.'),
                pNumbered('2.', 'Identifying common security misconfigurations and OWASP Top 10 vulnerabilities in web environments.'),
                pNumbered('3.', 'Learning to interact with web targets securely using the native Java 21 HttpClient and Jsoup parser.'),
                pNumbered('4.', 'Implementing automated checks for HTTP security headers, SSL/TLS protocols and sensitive endpoint exposure.'),
                pNumbered('5.', 'Developing dynamic injection assessment modules for SQL Injection and reflected Cross-Site Scripting (XSS).'),
                pNumbered('6.', 'Engineering a robust SSRF protection module blocking loopback, link-local, RFC 1918 subnets and cloud metadata.'),
                pNumbered('7.', 'Developing a risk scoring mechanism to classify identified security issues and calculate a 0–100 Security Score.'),
                pNumbered('8.', 'Implementing automated PDF report generation using the OpenPDF library.'),
                pNumbered('9.', 'Developing an interactive React 18 dashboard to visualize the assessment results, charts and metrics.'),
                pNumbered('10.', 'Testing the application with JUnit 5 and Mockito, containerizing with Docker, and documenting findings.'),
                pSectionTitle('4.3 Overall Training Experience'),
                pBody('The combination of 80 hours of structured online training and 40 hours of guided practical work provided a balanced learning experience.'),
                pBody('The online training established a foundation in cybersecurity concepts, while the practical activities demonstrated how these concepts could be applied to real-world security challenges.'),
                pBody('The development of CyberShield provided an opportunity to understand the importance of securing web application resources and identifying configuration weaknesses through automated assessment.'),
                pBody('Overall, the 120-hour program improved my understanding of cybersecurity fundamentals and provided practical exposure to full-stack security engineering and application development.'),

                // ----- CHAPTER 5: SPECIFIC SKILLS ACQUIRED (Page 6) -----
                new Paragraph({ children: [new PageBreak()] }),
                pHeading('5. Specific Skills Acquired'),
                pBody('The cybersecurity internship provided an opportunity to develop technical and practical skills in cybersecurity, enterprise software engineering and full-stack application development. The major skills acquired during the internship are described below.'),
                pNumbered('1.', 'Cybersecurity Fundamentals:', 'Developed an understanding of cybersecurity principles, including the CIA Triad (Confidentiality, Integrity and Availability), common security threats, vulnerabilities, unauthorized access and data protection.'),
                pNumbered('2.', 'Web Application Security & OWASP Top 10:', 'Gained practical knowledge of web vulnerabilities, particularly SQL Injection, Cross-Site Scripting (XSS), missing security headers, insecure TLS configurations and sensitive file exposure.'),
                pNumbered('3.', 'Enterprise Java 21 & Spring Boot 3 Development:', 'Mastered enterprise Java architecture, Spring Boot dependency injection, JPA/Hibernate persistence, @Transactional boundaries, and centralized exception handling with @RestControllerAdvice.'),
                pNumbered('4.', 'Spring Security & Stateless JWT Authentication:', 'Learned to configure Spring Security filter chains, implement BCrypt password hashing, issue and validate cryptographically signed JSON Web Tokens (JWT), and enforce Role-Based Access Control.'),
                pNumbered('5.', 'Defensive Network Programming & SSRF Prevention:', 'Engineered pre-flight DNS validation and IP filtering to block Server-Side Request Forgery attacks targeting loopback, private subnets and cloud metadata endpoints.'),
                pNumbered('6.', 'Vulnerability Assessment and Risk Analysis:', 'Developed skills in identifying common security misconfigurations, assigning risk scores, classifying vulnerabilities into severity tiers, and generating recommendations for improving security.'),
                pNumbered('7.', 'Automated PDF Document Engineering:', 'Gained experience using OpenPDF to programmatically generate structured, styled executive security reports with metrics, severity badges, and remediation steps.'),
                pNumbered('8.', 'Dashboard Development and Data Visualization:', 'Gained experience using React 18, Vite, Tailwind CSS and Recharts to develop an interactive security dashboard, display assessment metrics, visualize severity distribution and present detailed security findings.'),
                pNumbered('9.', 'Testing and DevOps Containerization:', 'Wrote 23 automated tests using JUnit 5 and Mockito, containerized multi-container services with Docker Compose, and managed version control on GitHub.'),

                // ----- CHAPTER 6: PROJECT OVERVIEW (Pages 7-8) -----
                new Paragraph({ children: [new PageBreak()] }),
                pHeading('6. CyberShield Vulnerability Scanner – Project Overview'),
                pBody('Source: [CyberShield – GitHub Repository] (https://github.com/Pavithra-Devadiga/CyberSecurity)'),
                pSectionTitle('6.1 Introduction to the Project'),
                pBody('CyberShield is an enterprise web application vulnerability scanner and security assessment platform developed to identify common security misconfigurations and vulnerabilities in web applications and REST APIs.'),
                pBody('Web applications are central to modern digital business, processing confidential user data, payment transactions and enterprise workflows. Improperly configured servers, missing security headers, weak TLS ciphers, exposed administrative endpoints and unvalidated form inputs can expose sensitive information, increase the possibility of unauthorized access and create severe security risks.'),
                pBody('The application automates the assessment of web targets using a modular Java 21 engine. It performs eight major security checks:'),
                pBullet('•', 'HTTP Security Headers Analysis: Verifies the presence of CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, and checks for server banner leaks.'),
                pBullet('•', 'SSL/TLS Cipher Suite Auditing: Inspects certificate validity, expiration, SAN, and checks for deprecated protocols (TLS 1.0/1.1).'),
                pBullet('•', 'SQL Injection Assessment: Injects benign verification probes to detect database syntax errors and reflection.'),
                pBullet('•', 'Cross-Site Scripting (XSS) Assessment: Probes input parameters for unescaped script tag reflection.'),
                pBullet('•', 'Endpoint Exposure Discovery: Probes for sensitive files such as .env, .git/HEAD, and Spring Boot /actuator endpoints.'),
                pBullet('•', 'Sensitive Information Leakage: Regex analysis detecting AWS keys, RSA private keys, and JWT tokens in responses.'),
                pBullet('•', 'Website Technology Fingerprinting: Identifies web server, framework, and CMS metadata.'),
                pBullet('•', 'OWASP ZAP Integration: Connects via REST API for active automated DAST scanning.'),
                pBody('The application incorporates a risk assessment mechanism that assigns scores to identified security issues and classifies targets into LOW, MEDIUM, ELEVATED and CRITICAL risk categories.'),
                pBody('An interactive dashboard developed using React 18 presents the assessment results through security metrics, visualizations, detailed findings and downloadable PDF reports generated via OpenPDF.'),
                pBody('The project demonstrates how Java-based automation can simplify web application security auditing and help identify configuration weaknesses in production environments.'),

                // Page 8
                new Paragraph({ children: [new PageBreak()] }),
                pSectionTitle('6.2 Problem Statement'),
                pBody('Organizations increasingly deploy web applications and APIs to deliver services, process payments and manage business data. However, incorrectly configured web servers and unvalidated input parameters can introduce critical security vulnerabilities.'),
                pBody('Manually inspecting individual web endpoints to identify configuration weaknesses can be time-consuming and difficult, particularly when multiple microservices are involved.'),
                pBody('Security issues such as missing security headers, disabled HSTS, exposed .env files, unprotected actuator endpoints, SQL injection and cross-site scripting may go unnoticed without systematic assessment.'),
                pBody('Furthermore, security assessment tools themselves must be defended against exploitation, ensuring they cannot be manipulated to launch Server-Side Request Forgery (SSRF) attacks against internal networks.'),
                pBody('Therefore, there is a need for an automated security assessment tool that can inspect web application configurations, identify common security misconfigurations, evaluate their potential risks, enforce SSRF protection and generate understandable security reports.'),
                pSectionTitle('6.3 Project Objectives'),
                pBody('The primary objectives of the project are:'),
                pBullet('•', 'To automate the discovery and security assessment of web applications and APIs.'),
                pBullet('•', 'To engineer a 100% Java-based backend using Spring Boot 3, strictly eliminating Python.'),
                pBullet('•', 'To verify HTTP security headers, TLS ciphers, and certificate configurations.'),
                pBullet('•', 'To identify exposed configuration files, .git repositories, and framework actuators.'),
                pBullet('•', 'To detect potential SQL injection and reflected XSS vulnerabilities.'),
                pBullet('•', 'To enforce strict SSRF validation blocking private subnets, loopbacks, and cloud metadata.'),
                pBullet('•', 'To calculate cumulative risk scores and normalized 0–100 security scores.'),
                pBullet('•', 'To classify web targets according to their security risk levels.'),
                pBullet('•', 'To generate security recommendations and downloadable PDF audit reports using OpenPDF.'),
                pBullet('•', 'To develop an interactive React dashboard for monitoring and analysing security findings.'),
                pSectionTitle('6.4 Scope and Features'),
                pBody('The project focuses on assessing common configuration-related security risks and input validation flaws associated with web applications. Its major features include:'),
                pBullet('•', 'Automated Target Assessment: Concurrently scans target web URLs using 8 independent scanner modules.'),
                pBullet('•', 'SSRF Defense: Validates all target hostnames and IPs against loopback, RFC 1918 private subnets and 169.254.169.254.'),
                pBullet('•', 'Risk Scoring: Assigns predefined numerical weights to identified security issues and calculates an overall risk score.'),
                pBullet('•', 'Security Score Calculation: Computes a percentage-based 0–100 assessment score based on detected security misconfigurations.'),
                pBullet('•', 'Risk Classification: Categorizes targets into LOW, MEDIUM, ELEVATED and CRITICAL risk levels.'),
                pBullet('•', 'Security Recommendations: Provides corrective suggestions and code examples for identified configuration weaknesses.'),
                pBullet('•', 'OpenPDF Report Generation: Generates structured, styled PDF reports containing scan timestamps, risk scores, findings and recommendations.'),
                pBullet('•', 'Interactive Dashboard: Displays security metrics, risk distribution charts, target-wise assessment results and detailed findings.'),

                // ----- CHAPTER 7: ARCHITECTURE & DESIGN (Pages 9-14) -----
                new Paragraph({ children: [new PageBreak()] }),
                pHeading('7. PROJECT ARCHITECTURE AND DESIGN'),
                pSectionTitle('7.1 System Architecture'),
                pBody('CyberShield follows a modular, layered enterprise architecture consisting of three major components: web integration and security scanning, risk assessment and report generation, and dashboard-based visualization.'),
                pBody('The system begins by receiving a target URL from an authenticated user through the React frontend. The request is authenticated by Spring Security using JWT. The ScanOrchestratorService initiates pre-flight SSRF validation using the SsrfProtectionValidator. Once approved, a scan record is created in PostgreSQL and predefined security checks are dispatched concurrently across the target.'),
                pBody('The identified security issues are processed by the risk assessment mechanism, which calculates cumulative risk scores and normalized security scores. The assessment results are persisted to PostgreSQL and used to generate styled PDF reports using OpenPDF.'),
                pBody('The React dashboard presents the assessment results through security metrics, tables, charts and detailed findings, allowing users to understand the security posture of their web applications.'),
                pBody('The architecture follows a two-tier model: a Spring Boot REST API backend and a React 18 Single Page Application frontend, orchestrated via Docker Compose. This flow is shown in Figure 7.1.'),
                new Paragraph({ spacing: { before: 100 } }),
                ...pCodeBlock([
                    '+-----------------------------------------------------------------------------------+',
                    '|                                PRESENTATION LAYER                                 |',
                    '|       React 18 SPA | Vite 5 | Tailwind CSS | Recharts | Lucide React Icons       |',
                    '+-----------------------------------------+-----------------------------------------+',
                    '                                          | JSON over HTTPS (JWT Authenticated)',
                    '+-----------------------------------------v-----------------------------------------+',
                    '|                                  SECURITY LAYER                                   |',
                    '|       Spring Security Filter Chain | JwtAuthenticationFilter | BCrypt Hasher      |',
                    '+-----------------------------------------+-----------------------------------------+',
                    '                                          | Authenticated DTO Request',
                    '+-----------------------------------------v-----------------------------------------+',
                    '|                                 CONTROLLER LAYER                                  |',
                    '|   AuthController | DashboardController | ScanController | VulnerabilityController  |',
                    '|               ReportController | NotificationController                           |',
                    '+-----------------------------------------+-----------------------------------------+',
                    '                                          | Service Invocation',
                    '+-----------------------------------------v-----------------------------------------+',
                    '|                                  SERVICE LAYER                                    |',
                    '|   AuthService | ScanService | ScanOrchestratorService | VulnerabilityService      |',
                    '|   SecurityScoreService | SeverityClassificationService | ReportService (OpenPDF)   |',
                    '+-------------------+-------------------------------------------+-------------------+',
                    '                    |                                           |',
                    '+-------------------v-------------------+   +-------------------v-------------------+',
                    '|           SCANNING ENGINE             |   |           PERSISTENCE LAYER           |',
                    '|  - HttpHeaderScanner                  |   |  - UserRepository                     |',
                    '|  - SSLTLSScanner                      |   |  - ScanRepository                     |',
                    '|  - SQLInjectionScanner                |   |  - VulnerabilityRepository            |',
                    '|  - XSSScanner                         |   |  - NotificationRepository             |',
                    '|  - EndpointExposureScanner            |   |  - PostgreSQL / H2 Database           |',
                    '|  - SensitiveInformationScanner        |   +---------------------------------------+',
                    '|  - WebsiteTechnologyScanner           |',
                    '|  - OWASPZapIntegrationService         |',
                    '|  - SafeHttpClientFactory              |',
                    '|  - SsrfProtectionValidator            |',
                    '+---------------------------------------+'
                ]),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 80, after: 140 },
                    children: [new TextRun({ text: 'Figure 7.1: System Architecture of CyberShield', font: FONT_NAME, size: CONTENT_SIZE - 2, bold: true })]
                }),

                // Page 10
                new Paragraph({ children: [new PageBreak()] }),
                pSectionTitle('7.2 Technologies and Tools Used'),
                pBody('The project was developed strictly using Java 21 and Spring Boot 3 on the backend, completely eliminating Python, supported by modern web technologies for data visualization and report generation.'),
                createTable(
                    ['Technology', 'Purpose'],
                    [
                        ['Java 21 LTS', 'Core programming language providing modern features, records and native HttpClient'],
                        ['Spring Boot 3.4.1', 'Enterprise framework for dependency injection, REST controllers and lifecycle management'],
                        ['Spring Security', 'Security framework managing filter chains, endpoint authorization and session policies'],
                        ['JWT (jjwt 0.12.6)', 'Stateless, cryptographically signed user authentication tokens'],
                        ['Spring Data JPA / Hibernate', 'Object-Relational Mapping (ORM) and abstracted database interactions'],
                        ['PostgreSQL 16', 'Production relational database for persistent storage'],
                        ['H2 Database', 'In-memory relational database for rapid automated integration testing'],
                        ['Java HttpClient', 'High-performance HTTP client for asynchronous target scanning'],
                        ['Jsoup 1.18.3', 'HTML parsing engine for inspecting DOM trees, forms and reflected payloads'],
                        ['Java SSL APIs', 'Low-level TLS socket engine for auditing certificate chains and cipher suites'],
                        ['OpenPDF 2.0.3', 'Server-side library for automated PDF security report generation'],
                        ['React 18', 'Component-based frontend Single Page Application (SPA)'],
                        ['Vite 5', 'Modern frontend build tool providing fast bundling and hot module replacement'],
                        ['Tailwind CSS', 'Utility-first CSS framework for clean, responsive styling'],
                        ['Recharts', 'Data visualization library for rendering risk distribution and severity charts'],
                        ['Docker & Docker Compose', 'Multi-container orchestration for backend, frontend and PostgreSQL'],
                        ['Git and GitHub', 'Version control and source code management']
                    ],
                    [35, 65]
                ),

                // Page 11
                new Paragraph({ children: [new PageBreak()] }),
                pSectionTitle('7.3 Security Assessment Methodology'),
                pBody('The application follows a systematic 6-step approach to evaluate the security configurations of target web applications:'),
                pNumbered('1.', 'Target Input and SSRF Validation:', 'The user submits a target URL. The SsrfProtectionValidator parses the URL, performs DNS resolution, and ensures resolved IPs do not match loopback, RFC 1918 private subnets or cloud metadata endpoints.'),
                pNumbered('2.', 'Scan Record Initialization:', 'A new Scan record is created in PostgreSQL with status RUNNING and an audit timestamp.'),
                pNumbered('3.', 'Concurrent Scanner Execution:', 'The ScanOrchestratorService creates an isolated SafeHttpClient and dispatches the target to all active scanner modules asynchronously.'),
                pNumbered('4.', 'Vulnerability Analysis & Normalization:', 'Each scanner analyzes responses (headers, TLS handshake, HTML DOM, status codes) and produces standardized Vulnerability records.'),
                pNumbered('5.', 'Risk Scoring and Classification:', 'The SeverityClassificationService and SecurityScoreService evaluate findings, compute the Cumulative Risk Score, and calculate the 0–100 Security Score.'),
                pNumbered('6.', 'Persistence, Notification & PDF Export:', 'Scan status is updated to COMPLETED, duration is calculated, an in-app alert is generated, and the scan becomes exportable as an OpenPDF document.'),
                new Paragraph({ spacing: { before: 80 } }),
                ...pCodeBlock([
                    '                                Start',
                    '                                  |',
                    '                                  v',
                    '                    [ User Submits Target URL ]',
                    '                                  |',
                    '                                  v',
                    '                    [ SSRF Validation Check ] ---> (Invalid IP) ---> [ Abort Scan ]',
                    '                                  | (Safe URL)',
                    '                                  v',
                    '                    [ Record Scan Status: RUNNING ]',
                    '                                  |',
                    '        +-------------------------+-------------------------+',
                    '        |                         |                         |',
                    '        v                         v                         v',
                    '[ HttpHeaderScanner ]     [ SSLTLSScanner ]      [ SQLInjectionScanner ]',
                    '[ XSSScanner ]            [ EndpointExposure ]   [ SensitiveInfoScanner ]',
                    '[ WebsiteTechScanner ]    [ OWASPZapService ]',
                    '        |                         |                         |',
                    '        +-------------------------+-------------------------+',
                    '                                  |',
                    '                                  v',
                    '                    [ Collect & Deduplicate Findings ]',
                    '                                  |',
                    '                                  v',
                    '                    [ Calculate Risk & Security Scores ]',
                    '                                  |',
                    '                                  v',
                    '                    [ Generate OpenPDF Report ]',
                    '                                  |',
                    '                                  v',
                    '                    [ Display on React Dashboard ]',
                    '                                  |',
                    '                                 End'
                ]),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 80, after: 140 },
                    children: [new TextRun({ text: 'Figure 7.2: Security Assessment Workflow', font: FONT_NAME, size: CONTENT_SIZE - 2, bold: true })]
                }),

                // Page 12
                new Paragraph({ children: [new PageBreak()] }),
                pSectionTitle('7.4 Risk Scoring and Compliance Assessment'),
                pBody('The project incorporates a weighted risk assessment mechanism to evaluate the security posture of individual web targets.'),
                pBody('Each identified security misconfiguration is assigned a predefined risk weight according to its potential impact.'),
                pSubsectionTitle('Risk Score Calculation'),
                pBody('The cumulative risk score is calculated by adding the weights assigned to all identified security issues.'),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 120, after: 60 },
                    children: [new TextRun({ text: 'Equation 7.1: Risk Score Calculation', font: FONT_NAME, size: CONTENT_SIZE, bold: true, italics: true })]
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 120 },
                    children: [new TextRun({ text: 'R = ∑ Wi  (from i = 1 to n)', font: FONT_NAME, size: CONTENT_SIZE + 2, bold: true })]
                }),
                pBody('Where:'),
                pBullet('•', 'R = Total risk score.'),
                pBullet('•', 'Wi = Risk weight assigned to each identified security issue.'),
                pBullet('•', 'n = Total number of identified security issues.'),
                pBody('The implemented risk weights are shown below:'),
                createTable(
                    ['Security Findings', 'Risk Weight'],
                    [
                        ['Critical Vulnerability (SQLi, Exposed .env)', '10'],
                        ['High Vulnerability (Reflected XSS, Exposed Actuator)', '7'],
                        ['Medium Vulnerability (Missing CSP, Missing HSTS)', '4'],
                        ['Low Vulnerability (Missing Referrer-Policy)', '2'],
                        ['Informational Finding (Server Banner Disclosure)', '0']
                    ],
                    [70, 30]
                ),
                pBody('Risk Classification is based on the calculated risk score; each target is assigned one of the following risk categories:'),
                createTable(
                    ['Risk Score', 'Classification'],
                    [
                        ['0 - 7', 'LOW'],
                        ['8 - 15', 'MEDIUM'],
                        ['16 and above', 'CRITICAL']
                    ],
                    [50, 50]
                ),

                // Page 13
                new Paragraph({ children: [new PageBreak()] }),
                pBody('The weights, risk thresholds and compliance deductions used by the scanner are summarised below:'),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 80, after: 80 },
                    children: [new TextRun({ text: '[ LOW: 0-7 ]  ---  [ MEDIUM: 8-15 ]  ---  [ CRITICAL: 16+ ]', font: FONT_NAME, size: CONTENT_SIZE, bold: true })]
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 140 },
                    children: [new TextRun({ text: 'Figure 7.3: Risk Scoring Model', font: FONT_NAME, size: CONTENT_SIZE - 2, bold: true })]
                }),
                pBody('For example, consider a web target with SQL Injection detected, missing CSP, and missing HSTS:'),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 80, after: 40 },
                    children: [new TextRun({ text: 'Equation 7.2: Example Risk Score', font: FONT_NAME, size: CONTENT_SIZE, bold: true, italics: true })]
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 120 },
                    children: [new TextRun({ text: 'R = 10 + 4 + 4 = 18', font: FONT_NAME, size: CONTENT_SIZE + 2, bold: true })]
                }),
                pBody('Therefore, the web application is classified as CRITICAL risk.'),
                pSubsectionTitle('Compliance Score Calculation'),
                pBody('The application begins with a compliance score of 100 and deducts predefined points for each identified security issue.'),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 80, after: 40 },
                    children: [new TextRun({ text: 'Equation 7.3: Compliance Score', font: FONT_NAME, size: CONTENT_SIZE, bold: true, italics: true })]
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 120 },
                    children: [new TextRun({ text: 'C = max(0,  100 - ∑ Di)', font: FONT_NAME, size: CONTENT_SIZE + 2, bold: true })]
                }),
                pBody('Where:'),
                pBullet('•', 'C = Final compliance / security score (0–100%).'),
                pBullet('•', 'Di = Compliance deduction for each identified security issue.'),
                pBody('The implemented compliance deductions are:'),
                createTable(
                    ['Security Findings', 'Deduction'],
                    [
                        ['Critical Vulnerability', '25'],
                        ['High Vulnerability', '15'],
                        ['Medium Vulnerability', '8'],
                        ['Low Vulnerability', '3'],
                        ['Informational Finding', '0']
                    ],
                    [70, 30]
                ),
                pBody('For the previous example:'),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 60, after: 40 },
                    children: [new TextRun({ text: 'Equation 7.4: Example Compliance Score', font: FONT_NAME, size: CONTENT_SIZE, bold: true, italics: true })]
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 100 },
                    children: [new TextRun({ text: 'C = 100 - (25 + 8 + 8) = 59%', font: FONT_NAME, size: CONTENT_SIZE + 2, bold: true })]
                }),

                // Page 14
                new Paragraph({ children: [new PageBreak()] }),
                pBody('Therefore, the final compliance score is 59%.'),
                pBody('The final compliance score is restricted to a minimum of zero. These risk and compliance calculations are based on a project-defined scoring model and are intended to provide an objective security assessment.'),
                pSectionTitle('7.5 Project Structure and Software Requirements'),
                pBody('The project is organised into two functional modules (backend and frontend) and supporting configurations, as shown below:'),
                ...pCodeBlock([
                    'cybersecurity/',
                    '|-- backend/                       # Spring Boot 3.4.1 Java 21 Backend',
                    '|   |-- pom.xml                    # Maven dependencies (Spring, OpenPDF, Jsoup)',
                    '|   |-- Dockerfile                 # Multi-stage Maven + Temurin 21 JRE',
                    '|   `-- src/main/java/com/security/scanner/',
                    '|       |-- config/                # SecurityConfig, JwtAuthenticationFilter',
                    '|       |-- controller/            # Auth, Dashboard, Scan, Report Controllers',
                    '|       |-- dto/                   # Request & Response DTOs',
                    '|       |-- entity/                # User, Scan, Vulnerability entities',
                    '|       |-- repository/            # Spring Data JPA repositories',
                    '|       |-- scanner/               # 8 Scanner Modules + SafeHttpClient, SSRF',
                    '|       `-- service/               # Orchestrator, Score, Report Services',
                    '|-- frontend/                      # React 18 Single Page Application',
                    '|   |-- package.json               # Frontend dependencies (React, Vite, Tailwind)',
                    '|   |-- Dockerfile                 # Multi-stage Node.js build + Nginx Alpine',
                    '|   `-- src/                       # Components, Pages, Context, API client',
                    '|-- docker-compose.yml             # Orchestration for Backend, Frontend, Postgres',
                    '`-- README.md'
                ]),
                new Paragraph({ spacing: { before: 100 } }),
                pBody('The software environment required to run the project is summarised in the following table:'),
                createTable(
                    ['Component', 'Requirement'],
                    [
                        ['Operating System', 'Windows 10/11, Ubuntu 20.04+ or macOS 12+'],
                        ['Programming Language', 'Java 21 LTS (Eclipse Temurin)'],
                        ['Framework', 'Spring Boot 3.4.1'],
                        ['Frontend Library', 'React 18 with Vite 5 and Tailwind CSS'],
                        ['Database', 'PostgreSQL 16 (Production) / H2 (Testing)'],
                        ['PDF Engine', 'OpenPDF 2.0.3'],
                        ['HTML Parser', 'Jsoup 1.18.3'],
                        ['Build Automation', 'Apache Maven 3.9+ and Node.js v18+'],
                        ['Container Platform', 'Docker Desktop with Docker Compose v2']
                    ],
                    [35, 65]
                ),

                // ----- CHAPTER 8: PROJECT IMPLEMENTATION (Pages 15-18) -----
                new Paragraph({ children: [new PageBreak()] }),
                pHeading('8. Project Implementation'),
                pBody('CyberShield was implemented using Java 21 and Spring Boot 3 to automate the security assessment of web applications. The implementation consists of Spring Security integration, automated security checks, SSRF validation, risk calculation, OpenPDF report generation and React dashboard development.'),
                pBody('The project is organized into separate Java packages to maintain a clean layered architecture. The structure of the project is described in Section 7.5.'),
                pSectionTitle('8.1 Backend Implementation & Architecture'),
                pBody('The backend uses Spring Boot 3.4.1. Security is enforced through a stateless JWT authentication filter. Passwords are encrypted using BCrypt with strength 12. Incoming requests are validated, and JPA entities are strictly decoupled from public APIs using Data Transfer Objects (DTOs). Exception handling is centralized using @RestControllerAdvice.'),
                ...pCodeBlock([
                    '@Configuration',
                    '@EnableWebSecurity',
                    'public class SecurityConfig {',
                    '    @Bean',
                    '    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {',
                    '        return http.csrf(AbstractHttpConfigurer::disable)',
                    '            .authorizeHttpRequests(auth -> auth',
                    '                .requestMatchers("/api/auth/**").permitAll()',
                    '                .anyRequest().authenticated())',
                    '            .sessionManagement(s -> s.sessionCreationPolicy(STATELESS))',
                    '            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)',
                    '            .build();',
                    '    }',
                    '}'
                ]),
                pSectionTitle('8.2 Automated Security Checks'),
                pBody('The scanner performs eight major security checks on each target web application:'),
                pNumbered('A.', 'HTTP Security Headers Verification:', 'The HttpHeaderScanner checks for Content-Security-Policy, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, and server banner leaks. Missing CSP or HSTS records a Medium finding (risk weight 4, deduction 8).'),
                pNumbered('B.', 'SSL/TLS Cipher Verification:', 'The SSLTLSScanner audits certificate expiration, Subject Alternative Names, and identifies deprecated TLS 1.0/1.1 protocols using native Java javax.net.ssl APIs.'),

                // Page 16
                new Paragraph({ children: [new PageBreak()] }),
                pNumbered('C.', 'SQL Injection Assessment:', 'The SQLInjectionScanner injects benign verification payloads into discovered URL parameters and inspects responses for database syntax error signatures across MySQL, PostgreSQL, Oracle and SQLite. A confirmed finding receives a Critical severity (risk weight 10, deduction 25).'),
                pNumbered('D.', 'Cross-Site Scripting (XSS) Assessment:', 'The XSSScanner injects benign script probe markers and uses Jsoup to verify whether user input is returned unescaped in the HTML DOM. A confirmed reflection receives a High severity (risk weight 7, deduction 15).'),
                pNumbered('E.', 'Endpoint Exposure Discovery:', 'The EndpointExposureScanner asynchronously probes for sensitive files such as /.env, /.git/HEAD, and Spring Boot /actuator/env endpoints. An exposed .env file is classified as Critical.'),
                pNumbered('F.', 'Sensitive Information Scanning:', 'The SensitiveInformationScanner uses precompiled regular expressions to detect leaked AWS access keys, RSA private keys, and hardcoded JWT tokens in HTTP response bodies.'),
                pNumbered('G.', 'Website Technology Fingerprinting:', 'The WebsiteTechnologyScanner analyzes response headers and HTML meta tags to detect underlying web servers, frameworks and CMS engines.'),
                pNumbered('H.', 'OWASP ZAP REST Integration:', 'The OWASPZapIntegrationService communicates with the ZAP daemon REST API to trigger automated active scans and import standardized alert findings.'),
                pSectionTitle('8.3 SSRF Defense & Safe HTTP Client Architecture'),
                pBody('To prevent the scanner from being weaponized to attack internal corporate infrastructure, the SsrfProtectionValidator resolves target hostnames and validates all resolved IP addresses against loopback (127.0.0.1), RFC 1918 private subnets (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16), and cloud metadata endpoints (169.254.169.254). Any private address immediately triggers a SsrfValidationException, aborting the scan.'),
                pSectionTitle('8.4 Risk Classification and Security Recommendations'),
                pBody('After completing the security checks, the application calculates the cumulative risk score and compliance score for each target. Based on the score, targets are classified into LOW, MEDIUM, ELEVATED or CRITICAL risk levels. Actionable remediation advice is generated for every finding.'),

                // Page 17
                new Paragraph({ children: [new PageBreak()] }),
                pSectionTitle('8.5 OpenPDF Report Generation'),
                pBody('After completing the assessment of a web target, the ReportService generates a structured, multi-page PDF audit report using OpenPDF.'),
                pBody('The report contains the overall scan timestamp, target URL, risk distribution, security score gauge, and detailed vulnerability tables with severities, OWASP categories, and remediation instructions.'),
                ...pCodeBlock([
                    'Document document = new Document(PageSize.A4, 36, 36, 54, 36);',
                    'PdfWriter writer = PdfWriter.getInstance(document, out);',
                    'document.open();',
                    'Paragraph title = new Paragraph("CYBERSHIELD SECURITY AUDIT REPORT", fontTitle);',
                    'document.add(title);',
                    'PdfPTable metaTable = new PdfPTable(2);',
                    'metaTable.addCell(new Phrase("Target: " + scan.getTargetUrl()));',
                    'metaTable.addCell(new Phrase("Score: " + scan.getSecurityScore() + "%"));',
                    'document.add(metaTable);',
                    'PdfPTable findingsTable = new PdfPTable(new float[]{1.5f, 3.5f, 1.5f, 3.5f});',
                    'for (Vulnerability v : vulnerabilities) {',
                    '    findingsTable.addCell(createSeverityCell(v.getSeverity()));',
                    '    findingsTable.addCell(new Phrase(v.getTitle()));',
                    '    findingsTable.addCell(new Phrase(v.getCategory().name()));',
                    '    findingsTable.addCell(new Phrase(v.getRemediation()));',
                    '}',
                    'document.add(findingsTable);',
                    'document.close();'
                ]),
                pSectionTitle('8.6 React Dashboard Implementation'),
                pBody('React 18 was used to develop an interactive web-based dashboard for presenting the security assessment results. The dashboard fetches data via Axios from the Spring Boot REST API.'),
                pBody('The main components of the dashboard are:'),
                pNumbered('1.', 'Security Metrics Overview:', 'Displays the total number of scans, average security score, and active scan count.'),
                pNumbered('2.', 'Score Gauge Component:', 'A circular SVG gauge rendering the 0–100 security score with dynamic color gradients.'),
                pNumbered('3.', 'Severity Distribution Charts:', 'Uses Recharts donut and bar graphs to illustrate the distribution of vulnerabilities across Critical, High, Medium, and Low tiers.'),
                pNumbered('4.', 'Vulnerability Drawer:', 'Expandable inspection drawer displaying raw payloads, URLs, and remediation guidance.'),
                pNumbered('5.', 'Report Download:', 'Direct button downloading the OpenPDF-compiled audit report.'),

                // Page 18
                new Paragraph({ children: [new PageBreak()] }),
                pSectionTitle('8.7 Project Execution'),
                pBody('The application is executed through two main stages, or unified through Docker Compose:'),
                pSubsectionTitle('Stage 1: Running the Spring Boot Backend'),
                pBody('The following commands compile and launch the backend service:'),
                ...pCodeBlock([
                    'cd backend',
                    'mvn clean package -DskipTests',
                    'java -jar target/security-scanner-1.0.0.jar'
                ]),
                pBody('The backend initializes on http://localhost:8080 with full REST endpoints.'),
                pSubsectionTitle('Stage 2: Launching the React Dashboard'),
                pBody('The following commands install dependencies and launch the frontend:'),
                ...pCodeBlock([
                    'cd frontend',
                    'npm install',
                    'npm run dev'
                ]),
                pBody('The dashboard loads at http://localhost:5173 and communicates with the backend via JWT.'),
                pSubsectionTitle('Stage 3: Full Stack Deployment via Docker Compose'),
                pBody('The entire environment can be started with a single command:'),
                ...pCodeBlock([
                    'docker-compose up --build -d'
                ]),

                // ----- CHAPTER 9: RESULTS AND ANALYSIS (Pages 19-21) -----
                new Paragraph({ children: [new PageBreak()] }),
                pHeading('9. PROJECT RESULTS AND ANALYSIS'),
                pBody('CyberShield was developed to automate the identification and assessment of common security misconfigurations in web applications. The application integrates Java-based security scanning with an interactive React dashboard and OpenPDF reporting.'),
                pBody('The implementation demonstrates how web security configurations can be systematically evaluated and how identified security issues can be classified according to their potential risk.'),
                pSectionTitle('9.1 Security Assessment Results'),
                pBody('The scanner performs eight major security checks: HTTP security headers, SSL/TLS ciphers, SQL injection, XSS reflection, endpoint exposure, sensitive data disclosure, website tech fingerprinting, and OWASP ZAP scanning.'),
                pBody('The assessment identifies the following potential security issues:'),
                createTable(
                    ['Security Check', 'Expected Configuration', 'Potential Findings'],
                    [
                        ['HTTP Headers', 'CSP, HSTS, X-Frame-Options configured', 'Missing Security Headers'],
                        ['SSL/TLS', 'TLS 1.2/1.3 with valid certificate', 'Deprecated TLS / Expired Certificate'],
                        ['SQL Injection', 'Parameterized queries / prepared statements', 'SQL Injection Detected'],
                        ['XSS', 'Context-aware output encoding', 'Reflected XSS Detected'],
                        ['Endpoint Exposure', 'Sensitive files restricted (HTTP 403/404)', 'Exposed .env / Actuator'],
                        ['Sensitive Data', 'No hardcoded credentials in HTML/JS', 'Leaked AWS / JWT Keys']
                    ],
                    [25, 40, 35]
                ),
                pSectionTitle('9.2 Sample Scan Results'),
                pBody('The scanner was executed against a sample set of three targets representing a hardened production gateway, a staging application and an insecure test environment:'),
                createTable(
                    ['Target Application', 'Risk Score', 'Risk Level', 'Compliance', 'Findings'],
                    [
                        ['Target A: Hardened API Gateway', '2', 'LOW', '97%', '1 Low'],
                        ['Target B: Staging Web Portal', '15', 'MEDIUM', '79%', '1 High, 2 Med'],
                        ['Target C: Insecure Test App', '46', 'CRITICAL', '16%', '2 Crit, 2 High, 3 Med']
                    ],
                    [40, 15, 15, 15, 15]
                ),

                // Page 20
                new Paragraph({ children: [new PageBreak()] }),
                pBody('Target A has full headers, TLS 1.3 and no exposed files, so only a minor Referrer-Policy finding is recorded (score 97%). Target B has missing CSP and an exposed test endpoint, giving a risk score of 15 and compliance score of 79%. Target C has SQL injection, an exposed .env file, reflected XSS, an exposed actuator endpoint, and missing CSP/HSTS; its risk score is 46 and its compliance score is 16%, so it is classified as CRITICAL. The audit log for this target is shown below:'),
                ...pCodeBlock([
                    'Scanning Target: http://vulnerable-test-app.local:8080',
                    '--------------------------------------------------',
                    '[!] CRITICAL: SQL Injection Detected in Parameter "id"',
                    '[!] CRITICAL: Sensitive Configuration File Exposed: /.env',
                    '[!] HIGH: Reflected Cross-Site Scripting (XSS) in Parameter "q"',
                    '[!] HIGH: Spring Boot Actuator Endpoint Exposed: /actuator/env',
                    '[!] MEDIUM: Missing Content-Security-Policy (CSP) Header',
                    '[!] MEDIUM: Missing Strict-Transport-Security (HSTS) Header',
                    '[!] MEDIUM: Missing X-Frame-Options Header (Clickjacking Risk)',
                    'Risk Score : 46',
                    'Risk Level : CRITICAL',
                    'Compliance : 16%',
                    'Recommendations:',
                    '- Enforce Parameterized Queries / Hibernate PreparedStatements',
                    '- Restrict web server access to dotfiles (.env)',
                    '- Apply context-aware HTML entity encoding',
                    '- Restrict actuator endpoints behind administrative IAM',
                    '- Configure Content-Security-Policy and HSTS headers'
                ]),
                new Paragraph({ spacing: { before: 100 } }),
                pBody('The same results are presented graphically by the React dashboard, as illustrated in Figure 9.1:'),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 80, after: 80 },
                    children: [new TextRun({ text: '[ Score Gauge: 16% ]  ---  [ Severity Donut: 2 Crit | 2 High | 3 Med ]', font: FONT_NAME, size: CONTENT_SIZE, bold: true })]
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 140 },
                    children: [new TextRun({ text: 'Figure 9.1: Risk Score, Compliance Score and Severity Distribution', font: FONT_NAME, size: CONTENT_SIZE - 2, bold: true })]
                }),
                pSectionTitle('9.3 Risk Distribution and Compliance Analysis'),
                pBody('The application calculates a cumulative risk score for each target based on the security issues identified during scanning.'),
                pBody('Based on the calculated score, targets are classified into LOW, MEDIUM, ELEVATED and CRITICAL risk levels.'),
                pBody('The compliance score provides an additional measure of the security configuration status of each target. It starts at 100 and is reduced according to the predefined deductions associated with identified security issues.'),
                pBody('The dashboard presents these values through summary metrics and graphical visualizations, allowing users to understand the overall assessment results.'),

                // Page 21
                new Paragraph({ children: [new PageBreak()] }),
                pBody('The following metrics are displayed:'),
                pBullet('•', 'Total number of targets scanned.'),
                pBullet('•', 'Number of LOW-risk targets.'),
                pBullet('•', 'Number of MEDIUM-risk targets.'),
                pBullet('•', 'Number of CRITICAL-risk targets.'),
                pBullet('•', 'Individual target risk scores.'),
                pBullet('•', 'Individual target compliance / security scores.'),
                pSectionTitle('9.4 Dashboard Visualization and Reporting'),
                pBody('The React dashboard provides a centralized interface for examining the security assessment results.'),
                pBody('The dashboard displays the total number of scanned targets and their distribution across different risk categories.'),
                pBody('The target security overview table presents individual target URLs, risk scores, risk classifications and compliance percentages.'),
                pBody('A donut chart provides a comparison of severity distribution, while bar charts illustrate vulnerability categories.'),
                pBody('Additionally, expandable sections allow users to examine detailed security findings and the corresponding recommendations for individual targets.'),
                pBody('The application also generates a downloadable PDF security report containing the scan timestamp, assessment summary, individual findings, risk scores and recommendations.'),
                pBody('This reporting mechanism makes the assessment results easier to store, review and analyse.'),
                pSectionTitle('9.5 Overall Project Analysis'),
                pBody('The developed application demonstrates the practical application of cybersecurity principles in enterprise web application environments.'),
                pBody('By automating predefined security checks, the scanner reduces the effort required to manually inspect individual web application configurations.'),
                pBody('The risk assessment mechanism provides a structured way to prioritize identified security issues, while compliance scoring offers an additional metric for evaluating overall security health.'),
                pBody('The interactive dashboard improves the presentation and interpretation of security findings, making the results accessible through tables, charts and downloadable reports.'),
                pBody('The project successfully demonstrates the integration of Java 21, Spring Boot 3, PostgreSQL, OpenPDF and React 18 to develop a production-ready web application security assessment platform.'),
                pBody('However, the assessment is limited to the implemented security checks and predefined scoring model. The results should therefore be considered an automated baseline assessment rather than an exhaustive manual penetration test.'),

                // ----- CHAPTER 10: LEARNING OUTCOMES (Pages 22-23) -----
                new Paragraph({ children: [new PageBreak()] }),
                pHeading('10. LEARNING OUTCOMES AND CYBERSECURITY RELEVANCE'),
                pBody('The cybersecurity internship provided an opportunity to apply theoretical concepts to a practical web application security project. The development of CyberShield helped strengthen my understanding of application infrastructure, security assessment, vulnerability identification and automation.'),
                pBody('The major learning outcomes and their relevance to cybersecurity are described below.'),
                pSectionTitle('10.1 Understanding Web Application Security'),
                pBody('Gained an understanding of web security principles and the importance of protecting web applications against unauthorized access, data exposure, injection attacks and security misconfigurations.'),
                pBody('The project demonstrated how improper configurations in web servers and unsanitized parameters can introduce severe security risks and why regular automated assessments are essential.'),
                pSectionTitle('10.2 Practical Experience with Enterprise Java Architecture'),
                pBody('Developed practical knowledge of enterprise Java 21 and Spring Boot 3, and learned how to build high-concurrency security tools using the native Java HttpClient and Jsoup.'),
                pBody('This provided an understanding of how web application configurations and responses can be retrieved, inspected and evaluated programmatically without relying on Python.'),
                pSectionTitle('10.3 Vulnerability Identification and Risk Assessment'),
                pBody('Learned to identify common security misconfigurations involving HTTP headers, TLS ciphers, SQL injection, XSS reflection, and endpoint exposures.'),
                pBody('The implementation of a weighted risk assessment mechanism provided practical experience in assigning severity levels to identified security issues and prioritizing them for further investigation.'),
                pSectionTitle('10.4 Security Automation & Defensive Architecture'),
                pBody('Gained experience in developing automated security assessment operations using Java and Spring Boot.'),
                pBody('The project demonstrated how repetitive security checks can be automated using concurrent tasks, exception handling and structured data processing, reducing the need for manual inspection. Furthermore, implementing SSRF protection emphasized the importance of defensive architecture in security tooling.'),
                pSectionTitle('10.5 Security Monitoring and Reporting'),
                pBody('Developed an understanding of how security assessment results can be organized and presented through structured reports and visual dashboards.'),
                pBody('The use of OpenPDF and React 18 helped in displaying security metrics, risk classifications, detailed findings and recommendations in an understandable format.'),

                // Page 23
                new Paragraph({ children: [new PageBreak()] }),
                pSectionTitle('10.6 Application Development and Problem-Solving'),
                pBody('Improved practical programming and problem-solving abilities through the development, debugging and integration of different application components.'),
                pBody('Working with Spring Security, PostgreSQL, OpenPDF and React components provided experience in building an application that combines enterprise software engineering with cybersecurity functionality.'),
                pSectionTitle('10.7 Relevance to Real-World Cybersecurity'),
                pBody('The project addresses an important aspect of modern cybersecurity: identifying and evaluating web application misconfigurations before they lead to potential security incidents.'),
                pBody('The concepts implemented are relevant to web security auditing, security engineering, vulnerability management and DevSecOps practices.'),
                pBody('Overall, the internship strengthened my technical knowledge and provided practical exposure to the application of cybersecurity principles in enterprise environments. It also encouraged further learning in application security, infrastructure protection and automated vulnerability assessment.'),

                // ----- CHAPTER 11: CHALLENGES & LIMITATIONS (Pages 24-25) -----
                new Paragraph({ children: [new PageBreak()] }),
                pHeading('11. Challenges and Limitations'),
                pBody('During the development of CyberShield, several technical and implementation challenges were encountered. Addressing these challenges provided practical experience in debugging, enterprise integration, security analysis and application development.'),
                pSectionTitle('11.1 Challenges Faced'),
                pNumbered('1.', 'Server-Side Request Forgery (SSRF) Defense:', 'Ensuring that the scanner could not be abused to probe internal network infrastructure or cloud metadata services required implementing pre-flight DNS resolution and IP address filtering using InetAddress.'),
                pNumbered('2.', 'Java 21 Mockito Dynamic Agent Loading:', 'Java 21 restricts dynamic agent loading by ByteBuddy, emitting warnings that corrupted Surefire IPC pipes during Maven builds. This was resolved by configuring -XX:+EnableDynamicAgentLoading in pom.xml.'),
                pNumbered('3.', 'Stateless JWT Filter Chain Ordering:', 'Misconfigured Spring Security filter chains initially blocked unauthenticated pre-flight OPTIONS requests from the React frontend, requiring careful filter chain reordering.'),
                pNumbered('4.', 'Concurrent Scanner Orchestration:', 'Running eight scanner modules sequentially resulted in excessive scan latency (>25s), which was solved by refactoring ScanOrchestratorService to dispatch scanners concurrently using CompletableFuture.'),
                pNumbered('5.', 'Risk Scoring Mechanism:', 'Developing a consistent risk assessment mechanism required assigning numerical weights to different security findings and establishing thresholds for LOW, MEDIUM and CRITICAL classifications.'),
                pNumbered('6.', 'OpenPDF Document Formatting:', 'Formatting multi-page tables, severity badge cells, and header/footer rules dynamically across varying vulnerability counts required detailed layout engineering.'),
                pSectionTitle('11.2 Project Limitations'),
                pBody('Although the application successfully demonstrates automated web application security assessment, certain limitations exist in its current implementation.'),
                pNumbered('1.', 'Limited Active Payloads:', 'The SQL injection and XSS modules perform benign verification probes rather than extensive multi-payload fuzzing dictionaries.'),
                pNumbered('2.', 'Client-Side Single Page Application Crawling:', 'The scanner analyzes HTML responses via Jsoup but does not execute heavy client-side JavaScript applications using a headless browser engine.'),
                pNumbered('3.', 'Target Rate Limiting and WAF Evasion:', 'Rapid bursts of probe requests may trigger rate limiting or IP blocking on targets defended by commercial Web Application Firewalls.'),

                // Page 25
                new Paragraph({ children: [new PageBreak()] }),
                pNumbered('4.', 'Custom Risk Assessment:', 'The risk scoring mechanism uses predefined weights and thresholds developed for the project rather than an official industry-standard risk assessment framework.'),
                pNumbered('5.', 'No Automated Remediation:', 'The application generates security recommendations but does not automatically modify web server configurations or code.'),
                pNumbered('6.', 'Single-Node Architecture:', 'The scanning orchestrator operates within a single Spring Boot application instance rather than a distributed queue-worker cluster.'),
                pNumbered('7.', 'Limited Compliance Validation:', 'The calculated compliance score is based on the project\'s predefined checks and should not be considered an official regulatory certification.'),
                pNumbered('8.', 'Broad Exception Handling:', 'Certain connection timeouts treat unresponsive endpoints as inaccessible rather than differentiating transient network drops.'),
                pNumbered('9.', 'Unauthenticated Scope:', 'The scanner audits primarily public unauthenticated endpoints and does not support multi-step form-based authentication contexts.'),
                pNumbered('10.', 'Third-Party Dependency:', 'Deep active scanning requires an active OWASP ZAP daemon running in Docker or on the host.'),
                pBody('Despite these limitations, the project demonstrates the practical application of cybersecurity principles through automated web vulnerability assessment, risk classification and security reporting.'),

                // ----- CHAPTER 12: CONCLUSION (Page 26) -----
                new Paragraph({ children: [new PageBreak()] }),
                pHeading('12. Conclusion'),
                pBody('The 120-hour Cybersecurity Internship conducted under the Honeywell Future Skills Edge Program, implemented by BharatCares, provided valuable exposure to cybersecurity fundamentals and their practical applications. The combination of structured online training and guided project work helped develop an understanding of security threats, vulnerabilities, web application security, access control, risk assessment and data protection.'),
                pBody('The development of CyberShield served as the primary practical component of the internship. The project demonstrated how Java 21 and Spring Boot 3 can be used to automate security assessments of web applications by examining HTTP headers, SSL/TLS configurations, SQL injection, XSS reflection, sensitive endpoint exposure and sensitive data leaks.'),
                pBody('The implementation of a risk assessment mechanism provided a structured approach to identifying security misconfigurations, calculating risk scores and classifying targets according to their potential security risks. Additionally, the React dashboard provided an interactive interface for presenting security metrics, visualizing severity distribution and examining detailed assessment findings. OpenPDF report generation further enabled the assessment results to be stored and reviewed.'),
                pBody('Throughout the internship, I gained practical experience in enterprise Java development, Spring Boot architecture, web security, vulnerability assessment, security automation and full-stack application development. The project also improved my problem-solving, analytical and technical documentation skills.'),
                pBody('Overall, the internship helped bridge the gap between theoretical cybersecurity knowledge and practical implementation. It strengthened my understanding of web security challenges and encouraged me to explore advanced areas of cybersecurity, particularly application security engineering, vulnerability management and DevSecOps.'),
                pBody('The knowledge and experience gained through this internship will serve as a valuable foundation for my future academic and professional development in the field of cybersecurity.'),

                // ----- CHAPTER 13: REFERENCES (Page 27) -----
                new Paragraph({ children: [new PageBreak()] }),
                pHeading('13. References'),
                pNumbered('1.', 'Open Web Application Security Project (OWASP),', 'OWASP Top 10: 2021 – The Ten Most Critical Web Application Security Risks. Available at: https://owasp.org/Top10/'),
                pNumbered('2.', 'OWASP Foundation,', 'OWASP Zed Attack Proxy (ZAP) Documentation and REST API Specification. Available at: https://www.zaproxy.org/docs/'),
                pNumbered('3.', 'National Institute of Standards and Technology (NIST),', 'Technical Guide to Information Security Testing and Assessment, NIST Special Publication 800-115. Available at: https://csrc.nist.gov/publications/detail/sp/800-115/final'),
                pNumbered('4.', 'Oracle Corporation,', 'Java Platform, Standard Edition Documentation (JDK 21). Available at: https://docs.oracle.com/en/java/javase/21/'),
                pNumbered('5.', 'VMware Tanzu / Broadcom,', 'Spring Boot Reference Documentation (v3.4.x). Available at: https://docs.spring.io/spring-boot/reference/'),
                pNumbered('6.', 'Spring Security Team,', 'Spring Security Architecture and Reference Guide. Available at: https://docs.spring.io/spring-security/reference/'),
                pNumbered('7.', 'Internet Engineering Task Force (IETF),', 'Address Allocation for Private Internets, RFC 1918. Available at: https://datatracker.ietf.org/doc/html/rfc1918'),
                pNumbered('8.', 'Internet Engineering Task Force (IETF),', 'JSON Web Token (JWT), RFC 7519. Available at: https://datatracker.ietf.org/doc/html/rfc7519'),
                pNumbered('9.', 'Jsoup Author Team,', 'Jsoup: Java HTML Parser Specification and API Reference. Available at: https://jsoup.org/'),
                pNumbered('10.', 'OpenPDF Development Team,', 'OpenPDF – Open Source Java Library for PDF Generation. Available at: https://github.com/LibrePDF/OpenPDF'),
                pNumbered('11.', 'PostgreSQL Global Development Group,', 'PostgreSQL 16 Documentation. Available at: https://www.postgresql.org/docs/16/'),
                pNumbered('12.', 'React Development Team,', 'React 18 Documentation. Available at: https://react.dev/'),
                pNumbered('13.', 'Honeywell,', 'Official Website. Available at: https://www.honeywell.com/'),
                pNumbered('14.', 'BharatCares,', 'Official Organizational Resources and Honeywell Future Skills Edge Program. Available at: https://bharatcares.org/'),
                pNumbered('15.', 'Pavithra Devadiga,', 'CyberShield: Enterprise Web Application Vulnerability Scanner – Source Code and Documentation. GitHub Repository: https://github.com/Pavithra-Devadiga/CyberSecurity'),

                // ----- CHAPTER 14: CERTIFICATE (Page 28) -----
                new Paragraph({ children: [new PageBreak()] }),
                pHeading('14. Certificate'),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 200, after: 200 },
                    children: [
                        new TextRun({ text: '[ AFFIX OFFICIAL BHARATCARES / HONEYWELL CERTIFICATE HERE ]', font: FONT_NAME, size: CONTENT_SIZE, bold: true, italics: true })
                    ]
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 100 },
                    children: [
                        new TextRun({ text: 'Certificate of Internship', font: FONT_NAME, size: HEADING_SIZE, bold: true })
                    ]
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 60 },
                    children: [
                        new TextRun({ text: 'This certificate is proudly presented to', font: FONT_NAME, size: CONTENT_SIZE })
                    ]
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 140 },
                    children: [
                        new TextRun({ text: 'PAVITHRA DEVADIGA', font: FONT_NAME, size: HEADING_SIZE, bold: true, underline: { type: UnderlineType.SINGLE } })
                    ]
                }),
                pBody('For successfully completing a 120-hours internship program in Cybersecurity, conducted from June to July 2026, and organized by BharatCares under the Honeywell Future Skills Edge Program, demonstrating dedication and proficiency in the field. During this internship, the participant gained hands-on experience in real-world applications, demonstrated strong technical skills, and successfully completed assigned projects and tasks in the respective domain.'),
                new Paragraph({ spacing: { before: 360 } }),
                new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    borders: {
                        top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
                        left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
                        insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE }
                    },
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({
                                    width: { size: 50, type: WidthType.PERCENTAGE },
                                    borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                                    children: [
                                        new Paragraph({ children: [new TextRun({ text: 'Mr. Utkarsh Sharma', font: FONT_NAME, size: CONTENT_SIZE, bold: true })] }),
                                        new Paragraph({ children: [new TextRun({ text: 'Associate Vice President, Future Tech Program', font: FONT_NAME, size: CONTENT_SIZE - 2 })] }),
                                        new Paragraph({ children: [new TextRun({ text: 'BharatCares', font: FONT_NAME, size: CONTENT_SIZE - 2 })] })
                                    ]
                                }),
                                new TableCell({
                                    width: { size: 50, type: WidthType.PERCENTAGE },
                                    borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                                    children: [
                                        new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Mr. Sacheth Sanal', font: FONT_NAME, size: CONTENT_SIZE, bold: true })] }),
                                        new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Sr. Manager - Future Tech & CSR Programs', font: FONT_NAME, size: CONTENT_SIZE - 2 })] }),
                                        new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'BharatCares', font: FONT_NAME, size: CONTENT_SIZE - 2 })] })
                                    ]
                                })
                            ]
                        })
                    ]
                })
            ]
        }
    ]
});

// Write to .docx
const outputDocxPath = path.join(__dirname, '..', '..', 'docs', 'CyberShield_Internship_Report.docx');
docx.Packer.toBuffer(doc).then(buffer => {
    fs.writeFileSync(outputDocxPath, buffer);
    console.log('Successfully generated CyberShield_Internship_Report.docx at: ' + outputDocxPath);
}).catch(err => {
    console.error('Error generating docx:', err);
});
