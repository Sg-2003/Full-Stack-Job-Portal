import mongoose from "mongoose";
import "dotenv/config";
import connectDB from "./config/db.js";
import Company from "./models/Company.js";
import Job from "./models/Job.js";
import User from "./models/User.js";
import JobApplication from "./models/JobApplication.js";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

// Ensure uploads folder exists
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Copy default and company logos if available
const logosToCopy = [
  { src: "company_icon.svg", dest: "company_icon.svg" },
  { src: "google.png", dest: "google.png" },
  { src: "microsoft_logo.svg", dest: "microsoft_logo.svg" },
  { src: "amazon_logo.png", dest: "amazon_logo.png" },
  { src: "adobe_logo.png", dest: "adobe_logo.png" },
  { src: "accenture_logo.png", dest: "accenture_logo.png" }
];

for (const logo of logosToCopy) {
  const sourcePath = path.join("../client/src/assets", logo.src);
  const destPath = path.join(uploadDir, logo.dest);
  try {
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`Copied ${logo.src} to uploads folder`);
    } else if (logo.src === "company_icon.svg") {
      // Write placeholder for default logo if missing
      fs.writeFileSync(
        destPath,
        `<svg width="50" height="50" xmlns="http://www.w3.org/2000/svg"><rect width="50" height="50" fill="#4F46E5"/><text x="12" y="30" fill="white" font-family="sans-serif" font-size="16" font-weight="bold">Job</text></svg>`
      );
      console.log("Created placeholder logo in uploads folder");
    }
  } catch (err) {
    console.error(`Logo file copy error for ${logo.src}:`, err.message);
  }
}


const sampleJobs = [
  {
    title: "Full Stack Developer",
    location: "California",
    category: "Programming",
    level: "Senior Level",
    salary: 82000,
    description: `
    <p>We are seeking a highly skilled Full Stack Developer to join our dynamic and innovative team. The ideal candidate will have a passion for developing scalable web applications and working across the entire technology stack, including front-end and back-end development.</p>
    <h2><strong>Key Responsibilities</strong></h2>
    <ol>
        <li>Build, test, and deploy highly responsive web applications.</li>
        <li>Design user-friendly interfaces using HTML, CSS, and JavaScript.</li>
        <li>Develop and maintain APIs and databases to support application functionality.</li>
    </ol>
    <h2><strong>Skills Required</strong></h2>
    <ol>
        <li>Proficiency in HTML, CSS, and JavaScript frameworks (e.g., React, Angular).</li>
        <li>Experience with server-side languages (e.g., Node.js, Python).</li>
        <li>Familiarity with relational and non-relational databases (e.g., MySQL, MongoDB).</li>
    </ol>`
  },
  {
    title: "Data Scientist",
    location: "New York",
    category: "Data Science",
    level: "Intermediate Level",
    salary: 72000,
    description: `
    <p>Join our analytics team to help drive business decisions using data. As a Data Scientist, you will leverage your analytical skills to uncover patterns and insights that will influence our strategic direction.</p>
    <h2><strong>Key Responsibilities</strong></h2>
    <ol>
        <li>Analyze large datasets to uncover trends and patterns that inform business strategies.</li>
        <li>Develop predictive models to forecast outcomes and improve decision-making.</li>
    </ol>
    <h2><strong>Skills Required</strong></h2>
    <ol>
        <li>Proficiency in Python or R for statistical analysis and data manipulation.</li>
        <li>Experience with data visualization tools (e.g., Tableau, Power BI).</li>
        <li>Strong knowledge of SQL and database management.</li>
    </ol>`
  },
  {
    title: "UI/UX Designer",
    location: "Bangalore",
    category: "Designing",
    level: "Beginner Level",
    salary: 61000,
    description: `
    <p>Create intuitive digital experiences as a UI/UX Designer. In this role, you will collaborate with product teams to design engaging user interfaces and ensure a seamless user journey.</p>
    <h2><strong>Key Responsibilities</strong></h2>
    <ol>
        <li>Conduct user research and usability testing to gather insights on user needs.</li>
        <li>Create wireframes, prototypes, and high-fidelity designs that communicate user flows.</li>
    </ol>
    <h2><strong>Skills Required</strong></h2>
    <ol>
        <li>Proficiency in design tools like Figma, Sketch, or Adobe XD.</li>
        <li>Strong understanding of user-centered design principles.</li>
    </ol>`
  },
  {
    title: "DevOps Engineer",
    location: "Washington",
    category: "Programming",
    level: "Senior Level",
    salary: 53000,
    description: `
    <p>Enhance our deployment pipeline as a DevOps Engineer. This role will involve automating deployment processes, managing cloud infrastructure, and implementing best practices for security and performance.</p>
    <h2><strong>Key Responsibilities</strong></h2>
    <ol>
        <li>Automate deployment processes using CI/CD tools to streamline development workflows.</li>
        <li>Manage cloud infrastructure, ensuring optimal performance and scalability.</li>
    </ol>
    <h2><strong>Skills Required</strong></h2>
    <ol>
        <li>Experience with CI/CD tools (e.g., Jenkins, GitLab CI).</li>
        <li>Strong knowledge of cloud platforms (e.g., AWS, Azure).</li>
    </ol>`
  },
  {
    title: "Software Engineer",
    location: "Hyderabad",
    category: "Programming",
    level: "Intermediate Level",
    salary: 91000,
    description: `
    <p>Develop and maintain software applications that fulfill user requirements. Collaborate with cross-functional teams to design scalable and efficient solutions.</p>
    <h2><strong>Key Responsibilities</strong></h2>
    <ol>
        <li>Develop and maintain software applications that fulfill user requirements.</li>
        <li>Participate in code reviews to ensure code quality and maintainability.</li>
    </ol>
    <h2><strong>Skills Required</strong></h2>
    <ol>
        <li>Proficient in Java or C# with a solid understanding of object-oriented programming.</li>
        <li>Experience with Agile methodologies and software development life cycle.</li>
    </ol>`
  },
  {
    title: "Network Engineer",
    location: "Bangalore",
    category: "Networking",
    level: "Senior Level",
    salary: 77000,
    description: `
    <p>We are looking for a Network Engineer to manage our infrastructure and ensure robust connectivity across all systems. Your expertise will help us design and implement network solutions.</p>
    <h2><strong>Key Responsibilities</strong></h2>
    <ol>
        <li>Design and implement network solutions that meet organizational needs.</li>
        <li>Monitor network performance and troubleshoot issues to ensure uptime.</li>
    </ol>
    <h2><strong>Skills Required</strong></h2>
    <ol>
        <li>Proficiency in network protocols and routing (e.g., TCP/IP, BGP, OSPF).</li>
        <li>Experience with firewalls, VPNs, and security technologies.</li>
    </ol>`
  },
  {
    title: "Project Manager",
    location: "Bangalore",
    category: "Management",
    level: "Senior Level",
    salary: 60000,
    description: `
    <p>Lead projects as a Project Manager ensuring timely delivery and alignment with organizational goals. You will oversee project planning, execution, and monitoring.</p>
    <h2><strong>Key Responsibilities</strong></h2>
    <ol>
        <li>Define project scope, objectives, and deliverables in collaboration with stakeholders.</li>
        <li>Develop detailed project plans and schedules to guide execution.</li>
    </ol>
    <h2><strong>Skills Required</strong></h2>
    <ol>
        <li>Proven experience as a Project Manager in a technology-focused environment.</li>
        <li>Familiarity with project management software (e.g., JIRA, Trello).</li>
    </ol>`
  },
  {
    title: "Mobile App Developer",
    location: "Hyderabad",
    category: "Programming",
    level: "Intermediate Level",
    salary: 112000,
    description: `
    <p>Join our team as a Mobile App Developer to create engaging mobile applications for iOS and Android platforms. You will be responsible for the full app development lifecycle.</p>
    <h2><strong>Key Responsibilities</strong></h2>
    <ol>
        <li>Design and build advanced mobile applications for iOS and Android.</li>
        <li>Ensure performance, quality, and responsiveness of applications.</li>
    </ol>
    <h2><strong>Skills Required</strong></h2>
    <ol>
        <li>Proficiency in Swift for iOS or Kotlin for Android development.</li>
        <li>Experience with RESTful APIs and third-party libraries.</li>
    </ol>`
  },
  {
    title: "Cloud Architect",
    location: "Hyderabad",
    category: "Programming",
    level: "Senior Level",
    salary: 96000,
    description: `
    <p>Design cloud solutions as a Cloud Architect, helping to transform our infrastructure and services. You will work closely with various teams to understand their requirements and translate them into secure, scalable, and efficient cloud-based solutions.</p>
    <h2><strong>Key Responsibilities</strong></h2>
    <ol>
        <li>Design and implement cloud solutions that align with business objectives.</li>
        <li>Provide guidance on best practices for cloud architecture and deployment.</li>
    </ol>
    <h2><strong>Skills Required</strong></h2>
    <ol>
        <li>Strong knowledge of cloud service providers (e.g., AWS, Azure, GCP).</li>
        <li>Experience with cloud architecture patterns and best practices.</li>
    </ol>`
  },
  {
    title: "Technical Writer",
    location: "Mumbai",
    category: "Marketing",
    level: "Intermediate Level",
    salary: 72000,
    description: `
    <p>Join us as a Technical Writer to create user-friendly documentation that supports our products and services. You will work closely with engineers and product managers to gather information and produce clear, concise, and accurate documentation.</p>
    <h2><strong>Key Responsibilities</strong></h2>
    <ol>
        <li>Create and maintain user manuals, API documentation, and other technical materials.</li>
        <li>Collaborate with development teams to gather and clarify technical information.</li>
    </ol>
    <h2><strong>Skills Required</strong></h2>
    <ol>
        <li>Proficiency in technical writing and documentation tools (e.g., MadCap Flare, Adobe FrameMaker).</li>
        <li>Strong understanding of technology and the ability to convey complex information clearly.</li>
    </ol>`
  },
  {
    title: "Cybersecurity Analyst",
    location: "Mumbai",
    category: "Cybersecurity",
    level: "Intermediate Level",
    salary: 62000,
    description: `
    <p>Protect our systems as a Cybersecurity Analyst. In this role, you will monitor security systems, analyze potential threats, and implement protective measures to safeguard our information and assets.</p>
    <h2><strong>Key Responsibilities</strong></h2>
    <ol>
        <li>Monitor and analyze security events to identify potential threats.</li>
        <li>Conduct risk assessments and vulnerability analyses to enhance security posture.</li>
    </ol>
    <h2><strong>Skills Required</strong></h2>
    <ol>
        <li>Strong knowledge of security protocols, standards, and tools.</li>
        <li>Experience with SIEM tools and incident response processes.</li>
    </ol>`
  },
  {
    title: "Business Analyst",
    location: "Mumbai",
    category: "Management",
    level: "Intermediate Level",
    salary: 68000,
    description: `
    <p>Join us as a Business Analyst to optimize our processes and improve overall efficiency. You will work closely with stakeholders to identify business needs and gather requirements for new projects.</p>
    <h2><strong>Key Responsibilities</strong></h2>
    <ol>
        <li>Gather and analyze business requirements from stakeholders.</li>
        <li>Develop detailed documentation of business processes and workflows.</li>
    </ol>
    <h2><strong>Skills Required</strong></h2>
    <ol>
        <li>Strong analytical skills and attention to detail.</li>
        <li>Proficiency in business analysis tools (e.g., Visio, JIRA).</li>
    </ol>`
  },
  {
    title: "Marketing Specialist",
    location: "Chennai",
    category: "Marketing",
    level: "Beginner Level",
    salary: 77000,
    description: `
    <p>Support our marketing efforts as a Marketing Specialist. In this role, you will assist with campaign execution, content creation, and social media management.</p>
    <h2><strong>Key Responsibilities</strong></h2>
    <ol>
        <li>Assist in the development and execution of marketing campaigns.</li>
        <li>Create engaging content for social media platforms and newsletters.</li>
    </ol>
    <h2><strong>Skills Required</strong></h2>
    <ol>
        <li>Basic understanding of digital marketing principles.</li>
        <li>Strong written and verbal communication skills.</li>
    </ol>`
  },
  {
    title: "UX/UI Designer",
    location: "Hyderabad",
    category: "Designing",
    level: "Intermediate Level",
    salary: 64000,
    description: `
    <p>We are seeking a talented UX/UI Designer to enhance our user experience across digital platforms. You will collaborate with product managers and developers to create intuitive and engaging interfaces.</p>
    <h2><strong>Key Responsibilities</strong></h2>
    <ol>
        <li>Conduct user research and usability testing to inform design decisions.</li>
        <li>Create wireframes, prototypes, and high-fidelity mockups for web and mobile applications.</li>
    </ol>
    <h2><strong>Skills Required</strong></h2>
    <ol>
        <li>Proficiency in design tools such as Sketch, Figma, or Adobe XD.</li>
        <li>Strong understanding of user-centered design principles.</li>
    </ol>`
  },
  {
    title: "Sales Manager",
    location: "New York",
    category: "Marketing",
    level: "Senior Level",
    salary: 59000,
    description: `
    <p>Join our team as a Sales Manager, where you will lead our sales efforts to drive growth and increase market share. You will develop sales strategies and manage client relationships.</p>
    <h2><strong>Key Responsibilities</strong></h2>
    <ol>
        <li>Develop and implement strategic sales plans to achieve company objectives.</li>
        <li>Manage and lead a team of sales representatives to meet and exceed sales targets.</li>
    </ol>
    <h2><strong>Skills Required</strong></h2>
    <ol>
        <li>Proven experience in sales management and team leadership.</li>
        <li>Strong negotiation and communication skills.</li>
    </ol>`
  },
  {
    title: "Human Resources Specialist",
    location: "Washington",
    category: "Management",
    level: "Intermediate Level",
    salary: 89000,
    description: `
    <p>As a Human Resources Specialist, you will support various HR functions, including recruitment, employee relations, and compliance. You will play a vital role in fostering a positive workplace culture.</p>
    <h2><strong>Key Responsibilities</strong></h2>
    <ol>
        <li>Assist with the recruitment process, including job postings and candidate screenings.</li>
        <li>Support employee onboarding and orientation programs.</li>
    </ol>
    <h2><strong>Skills Required</strong></h2>
    <ol>
        <li>Strong understanding of HR principles and practices.</li>
        <li>Excellent communication and interpersonal skills.</li>
    </ol>`
  },
  {
    title: "Content Marketing Manager",
    location: "Mumbai",
    category: "Marketing",
    level: "Senior Level",
    salary: 99000,
    description: `
    <p>We are looking for a Content Marketing Manager to lead our content strategy and execution. In this role, you will develop compelling content that engages our audience and drives brand awareness.</p>
    <h2><strong>Key Responsibilities</strong></h2>
    <ol>
        <li>Develop and implement a content marketing strategy aligned with business objectives.</li>
        <li>Create and oversee the production of high-quality content for blogs and social media.</li>
    </ol>
    <h2><strong>Skills Required</strong></h2>
    <ol>
        <li>Proven experience in content marketing and strategy development.</li>
        <li>Strong writing and editing skills with a keen eye for detail.</li>
    </ol>`
  },
  {
    title: "Graphic Designer",
    location: "Chennai",
    category: "Designing",
    level: "Intermediate Level",
    salary: 91000,
    description: `
    <p>Join our creative team as a Graphic Designer, where you will be responsible for creating visually appealing graphics and layouts that enhance our brand identity.</p>
    <h2><strong>Key Responsibilities</strong></h2>
    <ol>
        <li>Design graphics for digital and print media, including social media, websites, and marketing materials.</li>
        <li>Collaborate with cross-functional teams to understand project requirements.</li>
    </ol>
    <h2><strong>Skills Required</strong></h2>
    <ol>
        <li>Proficiency in design software such as Adobe Creative Suite (Photoshop, Illustrator, InDesign).</li>
        <li>Strong understanding of design principles and typography.</li>
    </ol>`
  },
  {
    title: "Software Tester",
    location: "Chennai",
    category: "Programming",
    level: "Intermediate Level",
    salary: 123000,
    description: `
    <p>As a Software Tester, you will play a critical role in ensuring the quality and reliability of our software applications. You will design test cases and execute tests.</p>
    <h2><strong>Key Responsibilities</strong></h2>
    <ol>
        <li>Develop and execute test plans and test cases based on software requirements.</li>
        <li>Identify, document, and track defects using bug tracking tools.</li>
    </ol>
    <h2><strong>Skills Required</strong></h2>
    <ol>
        <li>Experience with manual and automated testing techniques.</li>
        <li>Familiarity with testing tools (e.g., Selenium, JUnit).</li>
    </ol>`
  },
  {
    title: "Network Security Engineer",
    location: "Bangalore",
    category: "Cybersecurity",
    level: "Senior Level",
    salary: 87000,
    description: `
    <p>We are seeking a Network Security Engineer to protect our organization's IT infrastructure. You will design and implement security measures to safeguard systems from unauthorized access.</p>
    <h2><strong>Key Responsibilities</strong></h2>
    <ol>
        <li>Develop and implement security protocols for network systems.</li>
        <li>Monitor network traffic for suspicious activity and respond to incidents.</li>
    </ol>
    <h2><strong>Skills Required</strong></h2>
    <ol>
        <li>Strong knowledge of networking protocols and security technologies.</li>
        <li>Relevant certifications (e.g., CISSP, CEH) are preferred.</li>
    </ol>`
  },
  {
    title: "Cloud Engineer",
    location: "Hyderabad",
    category: "Programming",
    level: "Intermediate Level",
    salary: 102000,
    description: `
    <p>Join our technology team as a Cloud Engineer, where you will be responsible for designing and managing our cloud infrastructure. You will collaborate with development and operations teams.</p>
    <h2><strong>Key Responsibilities</strong></h2>
    <ol>
        <li>Design and implement cloud solutions using AWS, Azure, or Google Cloud Platform.</li>
        <li>Monitor and optimize cloud resources for performance and cost efficiency.</li>
    </ol>
    <h2><strong>Skills Required</strong></h2>
    <ol>
        <li>Experience with cloud platforms and services.</li>
        <li>Proficiency in scripting languages such as Python or Bash.</li>
    </ol>`
  }
];

const seedDB = async () => {
  try {
    await connectDB();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    // Check if mock company exists, or create one
    let company = await Company.findOne({ email: "slack@demo.com" });
    if (!company) {
      company = await Company.create({
        name: "Slack",
        email: "slack@demo.com",
        password: hashedPassword,
        image: "company_icon.svg"
      });
      console.log("Created mock Recruiter Company (Slack)");
    } else {
      // Update password to be encrypted in case it was stored as plain text before
      company.password = hashedPassword;
      await company.save();
      console.log("Updated mock Recruiter Company password to bcrypt hash");
    }

    // Check if mock candidate user exists, or create one
    let user = await User.findOne({ email: "user@demo.com" });
    if (!user) {
      user = await User.create({
        name: "Sukumar Gope",
        email: "user@demo.com",
        password: hashedPassword,
        resume: "",
        image: "profile_img.png"
      });
      console.log("Created mock Candidate User (Sukumar Gope)");
    } else {
      user.name = "Sukumar Gope";
      user.password = hashedPassword;
      user.image = "profile_img.png";
      await user.save();
      console.log("Updated mock Candidate User password and image");
    }

    // ── Extra companies (upsert by email) ────────────────────────────
    const extraCompanyDefs = [
      { name: "Google",      email: "google@demo.com",      image: "google.png"         },
      { name: "Microsoft",   email: "microsoft@demo.com",   image: "microsoft_logo.svg"  },
      { name: "Amazon",      email: "amazon@demo.com",       image: "amazon_logo.png"    },
      { name: "Adobe",       email: "adobe@demo.com",        image: "adobe_logo.png"     },
      { name: "Accenture",   email: "accenture@demo.com",    image: "accenture_logo.png" },
    ];

    const extraCompanies = {};
    for (const def of extraCompanyDefs) {
      let ec = await Company.findOne({ email: def.email });
      if (!ec) {
        ec = await Company.create({ ...def, password: hashedPassword });
        console.log(`Created company: ${def.name}`);
      } else {
        console.log(`Found existing company: ${def.name}`);
      }
      extraCompanies[def.name] = ec;
    }

    // ── Slack jobs (existing) ─────────────────────────────────
    await Job.deleteMany({});
    console.log("Cleared existing jobs from database");

    const jobsWithCompany = sampleJobs.map((job) => ({
      ...job,
      companyId: company._id
    }));

    await Job.insertMany(jobsWithCompany);
    console.log(`Seeded ${sampleJobs.length} Slack jobs`);

    // ── 25 new jobs across extra companies ──────────────────────────
    const newJobs = [
      // Google (5)
      { title: "Software Engineer III",         category: "Programming",     level: "Intermediate Level", location: "Bangalore",  salary: 180000, description: "<p>Work on Google-scale distributed systems.</p>",                         visible: true, companyId: extraCompanies["Google"]._id },
      { title: "AI Research Scientist",          category: "Data Science",    level: "Senior Level",       location: "California", salary: 220000, description: "<p>Research large language models and AI safety.</p>",                   visible: true, companyId: extraCompanies["Google"]._id },
      { title: "UX Researcher",                  category: "Design",          level: "Intermediate Level", location: "New York",   salary: 130000, description: "<p>Conduct user research for Google Workspace products.</p>",            visible: true, companyId: extraCompanies["Google"]._id },
      { title: "Site Reliability Engineer",      category: "DevOps",          level: "Senior Level",       location: "Hyderabad",  salary: 160000, description: "<p>Maintain reliability of production infrastructure.</p>",           visible: true, companyId: extraCompanies["Google"]._id },
      { title: "Android Developer",              category: "Programming",     level: "Intermediate Level", location: "Mumbai",     salary: 120000, description: "<p>Build next-gen Android features used by billions.</p>",              visible: true, companyId: extraCompanies["Google"]._id },
      // Microsoft (5)
      { title: "Azure Cloud Architect",          category: "Cloud",           level: "Senior Level",       location: "Hyderabad",  salary: 175000, description: "<p>Design enterprise Azure cloud solutions.</p>",                       visible: true, companyId: extraCompanies["Microsoft"]._id },
      { title: "Power BI Developer",             category: "Data Science",    level: "Intermediate Level", location: "Bangalore",  salary: 110000, description: "<p>Build analytical dashboards for enterprise clients.</p>",           visible: true, companyId: extraCompanies["Microsoft"]._id },
      { title: "Principal Product Manager",      category: "Management",      level: "Senior Level",       location: "Washington", salary: 200000, description: "<p>Lead product strategy for Microsoft 365.</p>",                       visible: true, companyId: extraCompanies["Microsoft"]._id },
      { title: "Security Engineer",              category: "Cybersecurity",   level: "Intermediate Level", location: "New York",   salary: 145000, description: "<p>Protect Microsoft products from emerging threats.</p>",             visible: true, companyId: extraCompanies["Microsoft"]._id },
      { title: "C# Backend Developer",           category: "Programming",     level: "Beginner Level",     location: "Mumbai",     salary:  90000, description: "<p>Develop backend services for Microsoft cloud apps.</p>",           visible: true, companyId: extraCompanies["Microsoft"]._id },
      // Amazon (5)
      { title: "Senior AWS Solutions Architect", category: "Cloud",           level: "Senior Level",       location: "Bangalore",  salary: 190000, description: "<p>Design scalable AWS architectures for enterprise.</p>",            visible: true, companyId: extraCompanies["Amazon"]._id },
      { title: "Supply Chain Analyst",           category: "Management",      level: "Intermediate Level", location: "Hyderabad",  salary:  95000, description: "<p>Optimize Amazon's global supply chain operations.</p>",           visible: true, companyId: extraCompanies["Amazon"]._id },
      { title: "Machine Learning Engineer",      category: "Data Science",    level: "Senior Level",       location: "California", salary: 210000, description: "<p>Build recommendation engines at Amazon scale.</p>",                 visible: true, companyId: extraCompanies["Amazon"]._id },
      { title: "iOS Developer",                  category: "Programming",     level: "Intermediate Level", location: "Washington", salary: 135000, description: "<p>Develop features for the Amazon Shopping iOS app.</p>",             visible: true, companyId: extraCompanies["Amazon"]._id },
      { title: "DevOps Engineer",               category: "DevOps",          level: "Intermediate Level", location: "Mumbai",     salary: 105000, description: "<p>Maintain CI/CD pipelines for Amazon's services.</p>",              visible: true, companyId: extraCompanies["Amazon"]._id },
      // Adobe (5)
      { title: "Creative Cloud Engineer",        category: "Programming",     level: "Senior Level",       location: "Bangalore",  salary: 155000, description: "<p>Build next-gen features for Adobe Creative Cloud.</p>",           visible: true, companyId: extraCompanies["Adobe"]._id },
      { title: "UI/UX Designer",                 category: "Design",          level: "Intermediate Level", location: "California", salary: 120000, description: "<p>Design beautiful interfaces for Adobe products.</p>",               visible: true, companyId: extraCompanies["Adobe"]._id },
      { title: "Data Engineer",                  category: "Data Science",    level: "Intermediate Level", location: "New York",   salary: 130000, description: "<p>Build data pipelines for Adobe Analytics platform.</p>",           visible: true, companyId: extraCompanies["Adobe"]._id },
      { title: "Product Designer",               category: "Design",          level: "Beginner Level",     location: "Hyderabad",  salary:  85000, description: "<p>Create user-centred product designs for Adobe Express.</p>",    visible: true, companyId: extraCompanies["Adobe"]._id },
      { title: "QA Automation Engineer",         category: "Testing",         level: "Intermediate Level", location: "Bangalore",  salary:  95000, description: "<p>Write automated test suites for Adobe Acrobat.</p>",              visible: true, companyId: extraCompanies["Adobe"]._id },
      // Accenture (5)
      { title: "SAP Consultant",                 category: "Management",      level: "Intermediate Level", location: "Mumbai",     salary: 105000, description: "<p>Implement SAP ERP solutions for global clients.</p>",             visible: true, companyId: extraCompanies["Accenture"]._id },
      { title: "Full Stack Java Developer",      category: "Programming",     level: "Intermediate Level", location: "Bangalore",  salary: 100000, description: "<p>Develop enterprise Java/Spring applications.</p>",                visible: true, companyId: extraCompanies["Accenture"]._id },
      { title: "Business Analyst",               category: "Management",      level: "Beginner Level",     location: "Hyderabad",  salary:  75000, description: "<p>Gather requirements and deliver digital transformation projects.</p>",visible: true, companyId: extraCompanies["Accenture"]._id },
      { title: "Network Security Consultant",    category: "Cybersecurity",   level: "Senior Level",       location: "New York",   salary: 145000, description: "<p>Secure enterprise network infrastructure for clients.</p>",       visible: true, companyId: extraCompanies["Accenture"]._id },
      { title: "RPA Developer",                  category: "Programming",     level: "Beginner Level",     location: "Washington", salary:  80000, description: "<p>Build robotic process automation workflows.</p>",                 visible: true, companyId: extraCompanies["Accenture"]._id },
    ];

    await Job.insertMany(newJobs);
    console.log(`Seeded ${newJobs.length} new jobs across Google, Microsoft, Amazon, Adobe & Accenture`);


    // ── Seed fake candidates ──────────────────────────────────
    const candidateNames = [
      "Aarav Sharma", "Aditya Patel", "Vihaan Iyer", "Arjun Mehta",
      "Sai Krishnan", "Reyansh Kapoor", "Krishna Das", "Ishaan Verma",
      "Shaurya Joshi", "Atharva Rao", "Ananya Sen", "Diya Mukherjee",
      "Pari Nair", "Pihu Reddy", "Riya Malhotra", "Aadhya Saxena",
      "Anvi Gupta", "Saanvi Choudhury", "Sanya Gill", "Kavya Bhat",
      "Pranav Kulkarni", "Neha Deshmukh", "Rahul Banerjee", "Pooja Trivedi",
      "Amit Mishra"
    ];

    // Clear all previous fake candidate accounts (keep only user@demo.com)
    await User.deleteMany({ email: { $ne: "user@demo.com" } });
    console.log("Cleared previous fake candidate users");

    const candidateUsers = [];
    for (let i = 0; i < candidateNames.length; i++) {
      const name = candidateNames[i];
      const email = `candidate${i + 1}@demo.com`;
      // Set distinct resume file names and mock profile avatars dynamically
      const resumeFile = `1783328342787-resume-Sukumar_Gope_Frontend_Vebbly_Resume.pdf`;
      
      // Direct mapping of stable, verified Unsplash photo IDs containing Indian people
      // 0-9: Boys, 10-19: Girls, 20-24: Mix boys/girls
      const photoId = [
        "1506794778202-cad84cf45f1d", // Aarav Sharma (Boy)
        "1507003211169-0a1dd7228f2d", // Aditya Patel (Boy)
        "1500648767791-00dcc994a43e", // Vihaan Iyer (Boy)
        "1539571696357-5a69c17a67c6", // Arjun Mehta (Boy)
        "1507003211169-0a1dd7228f2d", // Sai Krishnan (Boy)
        "1492562080023-ab3db95bfbce", // Reyansh Kapoor (Boy)
        "1522075469751-3a6694fb2f61", // Krishna Das (Boy)
        "1519085360753-af0119f7cbe7", // Ishaan Verma (Boy)
        "1544005313-94ddf0286df2", // Shaurya Joshi (Boy)
        "1506794778202-cad84cf45f1d", // Atharva Rao (Boy)
        "1494790108377-be9c29b29330", // Ananya Sen (Girl)
        "1524504388940-b1c1722653e1", // Diya Mukherjee (Girl)
        "1488426862026-3ee34a7d66df", // Pari Nair (Girl)
        "1531746020798-e6953c6e8e04", // Pihu Reddy (Girl)
        "1508214751196-bcfd4ca60f91", // Riya Malhotra (Girl)
        "1573496359142-b8d87734a5a2", // Aadhya Saxena (Girl)
        "1573497019940-1c28c88b4f3e", // Anvi Gupta (Girl)
        "1580489944761-15a19d654956", // Saanvi Choudhury (Girl)
        "1594744803329-e58b31de215f", // Sanya Gill (Girl)
        "1589156280159-27698a70f29e", // Kavya Bhat (Girl)
        "1624561172888-ac93c696e10c", // Pranav Kulkarni (Boy)
        "1601412436009-d964bd02edbc", // Neha Deshmukh (Girl)
        "1544005313-94ddf0286df2", // Rahul Banerjee (Boy)
        "1537368910025-700350fe46c7", // Pooja Trivedi (Girl)
        "1595211877493-41a4e5f236b3"  // Amit Mishra (Boy)
      ][i % 25];
      
      const avatarUrl = `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=150&h=150&q=80`;
      
      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        resume: resumeFile,
        image: avatarUrl
      });
      candidateUsers.push(newUser);
    }
    console.log(`Created ${candidateUsers.length} fake candidate users`);

    // ── Seed 100+ applications ────────────────────────────────
    // Fetch freshly inserted jobs
    const allJobs = await Job.find({});
    const statuses = ["Pending", "Accepted", "Rejected"];

    // Clear all previous applications
    await JobApplication.deleteMany({});
    console.log("Cleared previous applications");

    const applications = [];
    let appCount = 0;

    // Each candidate applies to 4-6 random jobs
    for (const user of candidateUsers) {
      const numApps = 4 + Math.floor(Math.random() * 3); // 4-6 applications each
      const shuffled = [...allJobs].sort(() => Math.random() - 0.5);
      const jobsToApply = shuffled.slice(0, numApps);

      for (const job of jobsToApply) {
        applications.push({
          jobId: job._id,
          userId: user._id,
          status: statuses[Math.floor(Math.random() * statuses.length)],
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
        });
        appCount++;
      }
    }

    await JobApplication.insertMany(applications);
    console.log(`Successfully seeded ${appCount} job applications!`);

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seedDB();
