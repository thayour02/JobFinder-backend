const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Company = require('./model/companyModel');
const Jobs = require('./model/jobModel');
require('dotenv').config();

// Sample company data
const companies = [
    {
        name: "TechCorp Solutions",
        email: "careers@techcorp.com",
        password: "company123",
        contact: "+1234567890",
        location: "San Francisco, CA",
        about: "Leading technology company specializing in innovative software solutions and cloud services.",
        profileUrl: "https://example.com/techcorp-logo.jpg",
        url: "https://techcorp.com",
        isVerified: true
    },
    {
        name: "Digital Marketing Pro",
        email: "jobs@digitalmarketing.com",
        password: "company123",
        contact: "+1234567891",
        location: "New York, NY",
        about: "Full-service digital marketing agency helping brands grow their online presence.",
        profileUrl: "https://example.com/digital-marketing-logo.jpg",
        url: "https://digitalmarketing.com",
        isVerified: true
    },
    {
        name: "HealthCare Plus",
        email: "hr@healthcareplus.com",
        password: "company123",
        contact: "+1234567892",
        location: "Boston, MA",
        about: "Healthcare technology company focused on improving patient care through innovation.",
        profileUrl: "https://example.com/healthcare-logo.jpg",
        url: "https://healthcareplus.com",
        isVerified: true
    },
    {
        name: "FinanceHub Inc",
        email: "recruitment@financehub.com",
        password: "company123",
        contact: "+1234567893",
        location: "Chicago, IL",
        about: "Financial services company providing innovative solutions for modern banking.",
        profileUrl: "https://example.com/financehub-logo.jpg",
        url: "https://financehub.com",
        isVerified: true
    },
    {
        name: "EduTech Innovations",
        email: "careers@edutech.com",
        password: "company123",
        contact: "+1234567894",
        location: "Austin, TX",
        about: "Educational technology company transforming learning through digital solutions.",
        profileUrl: "https://example.com/edutech-logo.jpg",
        url: "https://edutech.com",
        isVerified: true
    },
    {
        name: "Green Energy Systems",
        email: "jobs@greenenergy.com",
        password: "company123",
        contact: "+1234567895",
        location: "Seattle, WA",
        about: "Renewable energy company focused on sustainable solutions for the future.",
        profileUrl: "https://example.com/greenenergy-logo.jpg",
        url: "https://greenenergy.com",
        isVerified: true
    },
    {
        name: "RetailMax Solutions",
        email: "hiring@retailmax.com",
        password: "company123",
        contact: "+1234567896",
        location: "Los Angeles, CA",
        about: "Retail technology company providing innovative solutions for modern commerce.",
        profileUrl: "https://example.com/retailmax-logo.jpg",
        url: "https://retailmax.com",
        isVerified: true
    },
    {
        name: "CloudNet Technologies",
        email: "careers@cloudnet.com",
        password: "company123",
        contact: "+1234567897",
        location: "Denver, CO",
        about: "Cloud computing company providing scalable infrastructure solutions.",
        profileUrl: "https://example.com/cloudnet-logo.jpg",
        url: "https://cloudnet.com",
        isVerified: true
    },
    {
        name: "BioPharma Research",
        email: "jobs@biopharma.com",
        password: "company123",
        contact: "+1234567898",
        location: "Philadelphia, PA",
        about: "Pharmaceutical research company developing innovative treatments.",
        profileUrl: "https://example.com/biopharma-logo.jpg",
        url: "https://biopharma.com",
        isVerified: true
    },
    {
        name: "AutoTech Industries",
        email: "recruitment@autotech.com",
        password: "company123",
        contact: "+1234567899",
        location: "Detroit, MI",
        about: "Automotive technology company pioneering the future of transportation.",
        profileUrl: "https://example.com/autotech-logo.jpg",
        url: "https://autotech.com",
        isVerified: true
    }
];

// Sample job data - multiple jobs per company
const jobsData = [
    // TechCorp Solutions Jobs
    {
        jobTitle: "Senior Frontend Developer",
        jobType: "Full-time",
        location: "San Francisco, CA",
        salary: 120000,
        vacancy: 2,
        experience: 5,
        detail: [
            {
                desc: "We are looking for an experienced Frontend Developer to join our engineering team. You will be responsible for building responsive web applications using modern JavaScript frameworks.",
                requirement: "5+ years of experience with React, Vue.js or Angular. Strong knowledge of HTML5, CSS3, and JavaScript. Experience with RESTful APIs and version control."
            }
        ],
        companyName: "TechCorp Solutions"
    },
    {
        jobTitle: "Backend Engineer",
        jobType: "Full-time",
        location: "San Francisco, CA",
        salary: 130000,
        vacancy: 3,
        experience: 4,
        detail: [
            {
                desc: "Join our backend team to build scalable APIs and microservices. You'll work with Node.js, Python, and cloud technologies.",
                requirement: "4+ years of backend development experience. Proficiency in Node.js or Python. Experience with databases and cloud platforms."
            }
        ],
        companyName: "TechCorp Solutions"
    },
    {
        jobTitle: "DevOps Engineer",
        jobType: "Full-time",
        location: "San Francisco, CA",
        salary: 140000,
        vacancy: 1,
        experience: 6,
        detail: [
            {
                desc: "We need a DevOps Engineer to manage our cloud infrastructure and CI/CD pipelines. Experience with AWS, Docker, and Kubernetes required.",
                requirement: "6+ years of DevOps experience. Strong knowledge of AWS, Docker, Kubernetes. Experience with infrastructure as code."
            }
        ],
        companyName: "TechCorp Solutions"
    },
    
    // Digital Marketing Pro Jobs
    {
        jobTitle: "Digital Marketing Manager",
        jobType: "Full-time",
        location: "New York, NY",
        salary: 85000,
        vacancy: 1,
        experience: 4,
        detail: [
            {
                desc: "Lead our digital marketing efforts and manage campaigns across multiple channels. Experience with SEO, SEM, and social media marketing required.",
                requirement: "4+ years of digital marketing experience. Proven track record of successful campaigns. Strong analytical skills."
            }
        ],
        companyName: "Digital Marketing Pro"
    },
    {
        jobTitle: "Content Strategist",
        jobType: "Full-time",
        location: "New York, NY",
        salary: 75000,
        vacancy: 2,
        experience: 3,
        detail: [
            {
                desc: "Create and execute content strategies for our clients. You'll be responsible for content planning, creation, and distribution.",
                requirement: "3+ years of content strategy experience. Excellent writing and editing skills. Experience with content management systems."
            }
        ],
        companyName: "Digital Marketing Pro"
    },
    {
        jobTitle: "Social Media Specialist",
        jobType: "Part-time",
        location: "New York, NY",
        salary: 45000,
        vacancy: 1,
        experience: 2,
        detail: [
            {
                desc: "Manage social media accounts and create engaging content for various platforms. Monitor analytics and optimize campaigns.",
                requirement: "2+ years of social media experience. Knowledge of major social media platforms. Creative thinking and visual design skills."
            }
        ],
        companyName: "Digital Marketing Pro"
    },

    // HealthCare Plus Jobs
    {
        jobTitle: "Medical Software Developer",
        jobType: "Full-time",
        location: "Boston, MA",
        salary: 110000,
        vacancy: 2,
        experience: 4,
        detail: [
            {
                desc: "Develop software solutions for healthcare applications. Work with medical data and ensure compliance with healthcare regulations.",
                requirement: "4+ years of software development experience. Knowledge of healthcare regulations (HIPAA). Experience with medical software preferred."
            }
        ],
        companyName: "HealthCare Plus"
    },
    {
        jobTitle: "Healthcare Data Analyst",
        jobType: "Full-time",
        location: "Boston, MA",
        salary: 95000,
        vacancy: 1,
        experience: 3,
        detail: [
            {
                desc: "Analyze healthcare data to provide insights and support decision-making. Work with large datasets and create visualizations.",
                requirement: "3+ years of data analysis experience. Proficiency in SQL and data visualization tools. Healthcare industry knowledge preferred."
            }
        ],
        companyName: "HealthCare Plus"
    },
    {
        jobTitle: "Product Manager - Healthcare",
        jobType: "Full-time",
        location: "Boston, MA",
        salary: 125000,
        vacancy: 1,
        experience: 5,
        detail: [
            {
                desc: "Lead product development for healthcare software solutions. Work with cross-functional teams to deliver innovative products.",
                requirement: "5+ years of product management experience. Healthcare industry experience required. Strong leadership and communication skills."
            }
        ],
        companyName: "HealthCare Plus"
    },

    // FinanceHub Inc Jobs
    {
        jobTitle: "Financial Analyst",
        jobType: "Full-time",
        location: "Chicago, IL",
        salary: 90000,
        vacancy: 3,
        experience: 3,
        detail: [
            {
                desc: "Analyze financial data and provide insights for business decisions. Create financial models and reports.",
                requirement: "3+ years of financial analysis experience. Strong Excel and financial modeling skills. CPA or CFA preferred."
            }
        ],
        companyName: "FinanceHub Inc"
    },
    {
        jobTitle: "Risk Management Specialist",
        jobType: "Full-time",
        location: "Chicago, IL",
        salary: 100000,
        vacancy: 2,
        experience: 4,
        detail: [
            {
                desc: "Identify and assess financial risks for the organization. Develop risk mitigation strategies and policies.",
                requirement: "4+ years of risk management experience. Knowledge of financial regulations. Strong analytical and problem-solving skills."
            }
        ],
        companyName: "FinanceHub Inc"
    },
    {
        jobTitle: "Investment Analyst",
        jobType: "Full-time",
        location: "Chicago, IL",
        salary: 95000,
        vacancy: 2,
        experience: 3,
        detail: [
            {
                desc: "Research investment opportunities and provide recommendations. Analyze market trends and financial statements.",
                requirement: "3+ years of investment analysis experience. Strong research and analytical skills. Series 7 license preferred."
            }
        ],
        companyName: "FinanceHub Inc"
    },

    // EduTech Innovations Jobs
    {
        jobTitle: "Instructional Designer",
        jobType: "Full-time",
        location: "Austin, TX",
        salary: 70000,
        vacancy: 2,
        experience: 3,
        detail: [
            {
                desc: "Design and develop educational content for online learning platforms. Create engaging learning experiences.",
                requirement: "3+ years of instructional design experience. Knowledge of learning theories and educational technology. Experience with authoring tools."
            }
        ],
        companyName: "EduTech Innovations"
    },
    {
        jobTitle: "Learning Management System Developer",
        jobType: "Full-time",
        location: "Austin, TX",
        salary: 85000,
        vacancy: 1,
        experience: 4,
        detail: [
            {
                desc: "Develop and maintain learning management systems. Work with educational technologies to improve user experience.",
                requirement: "4+ years of software development experience. Experience with LMS platforms. Knowledge of educational technology standards."
            }
        ],
        companyName: "EduTech Innovations"
    },
    {
        jobTitle: "Education Technology Consultant",
        jobType: "Contract",
        location: "Austin, TX",
        salary: 80000,
        vacancy: 1,
        experience: 5,
        detail: [
            {
                desc: "Consult with educational institutions on technology implementation. Provide training and support for ed-tech solutions.",
                requirement: "5+ years of ed-tech consulting experience. Strong presentation and communication skills. Knowledge of educational trends."
            }
        ],
        companyName: "EduTech Innovations"
    },

    // Green Energy Systems Jobs
    {
        jobTitle: "Renewable Energy Engineer",
        jobType: "Full-time",
        location: "Seattle, WA",
        salary: 95000,
        vacancy: 2,
        experience: 4,
        detail: [
            {
                desc: "Design and implement renewable energy systems. Work on solar, wind, and other sustainable energy projects.",
                requirement: "4+ years of renewable energy experience. Engineering degree required. Knowledge of energy systems and regulations."
            }
        ],
        companyName: "Green Energy Systems"
    },
    {
        jobTitle: "Environmental Compliance Specialist",
        jobType: "Full-time",
        location: "Seattle, WA",
        salary: 75000,
        vacancy: 1,
        experience: 3,
        detail: [
            {
                desc: "Ensure compliance with environmental regulations and standards. Conduct audits and develop compliance programs.",
                requirement: "3+ years of environmental compliance experience. Knowledge of environmental laws. Strong attention to detail."
            }
        ],
        companyName: "Green Energy Systems"
    },
    {
        jobTitle: "Energy Data Analyst",
        jobType: "Full-time",
        location: "Seattle, WA",
        salary: 85000,
        vacancy: 1,
        experience: 3,
        detail: [
            {
                desc: "Analyze energy consumption data and optimize efficiency. Create reports and recommendations for energy savings.",
                requirement: "3+ years of data analysis experience. Knowledge of energy systems. Strong analytical and problem-solving skills."
            }
        ],
        companyName: "Green Energy Systems"
    },

    // RetailMax Solutions Jobs
    {
        jobTitle: "E-commerce Manager",
        jobType: "Full-time",
        location: "Los Angeles, CA",
        salary: 90000,
        vacancy: 1,
        experience: 4,
        detail: [
            {
                desc: "Manage e-commerce operations and online sales strategies. Optimize user experience and conversion rates.",
                requirement: "4+ years of e-commerce experience. Knowledge of e-commerce platforms. Strong analytical and marketing skills."
            }
        ],
        companyName: "RetailMax Solutions"
    },
    {
        jobTitle: "Retail Technology Consultant",
        jobType: "Full-time",
        location: "Los Angeles, CA",
        salary: 85000,
        vacancy: 2,
        experience: 3,
        detail: [
            {
                desc: "Consult with retail clients on technology implementation. Provide solutions for POS systems, inventory management, and customer analytics.",
                requirement: "3+ years of retail technology experience. Strong consulting and communication skills. Knowledge of retail operations."
            }
        ],
        companyName: "RetailMax Solutions"
    },
    {
        jobTitle: "Supply Chain Analyst",
        jobType: "Full-time",
        location: "Los Angeles, CA",
        salary: 80000,
        vacancy: 1,
        experience: 3,
        detail: [
            {
                desc: "Analyze supply chain data and optimize logistics. Improve efficiency and reduce costs in retail operations.",
                requirement: "3+ years of supply chain experience. Strong analytical skills. Knowledge of logistics and inventory management."
            }
        ],
        companyName: "RetailMax Solutions"
    },

    // CloudNet Technologies Jobs
    {
        jobTitle: "Cloud Architect",
        jobType: "Full-time",
        location: "Denver, CO",
        salary: 130000,
        vacancy: 2,
        experience: 6,
        detail: [
            {
                desc: "Design and implement cloud infrastructure solutions. Architect scalable and secure cloud systems.",
                requirement: "6+ years of cloud architecture experience. AWS/Azure/GCP certifications required. Strong technical leadership skills."
            }
        ],
        companyName: "CloudNet Technologies"
    },
    {
        jobTitle: "Solutions Engineer",
        jobType: "Full-time",
        location: "Denver, CO",
        salary: 110000,
        vacancy: 2,
        experience: 4,
        detail: [
            {
                desc: "Provide technical solutions for client needs. Work with sales team to design and implement cloud solutions.",
                requirement: "4+ years of solutions engineering experience. Strong technical and communication skills. Knowledge of cloud technologies."
            }
        ],
        companyName: "CloudNet Technologies"
    },
    {
        jobTitle: "Cloud Security Engineer",
        jobType: "Full-time",
        location: "Denver, CO",
        salary: 120000,
        vacancy: 1,
        experience: 5,
        detail: [
            {
                desc: "Implement and manage cloud security solutions. Ensure compliance with security standards and best practices.",
                requirement: "5+ years of cloud security experience. Security certifications preferred. Knowledge of security frameworks."
            }
        ],
        companyName: "CloudNet Technologies"
    },

    // BioPharma Research Jobs
    {
        jobTitle: "Clinical Research Coordinator",
        jobType: "Full-time",
        location: "Philadelphia, PA",
        salary: 75000,
        vacancy: 3,
        experience: 2,
        detail: [
            {
                desc: "Coordinate clinical trials and research studies. Ensure compliance with protocols and regulations.",
                requirement: "2+ years of clinical research experience. Knowledge of clinical trial processes. Strong organizational skills."
            }
        ],
        companyName: "BioPharma Research"
    },
    {
        jobTitle: "Biostatistician",
        jobType: "Full-time",
        location: "Philadelphia, PA",
        salary: 95000,
        vacancy: 1,
        experience: 4,
        detail: [
            {
                desc: "Analyze clinical trial data and provide statistical insights. Design studies and interpret results.",
                requirement: "4+ years of biostatistics experience. Advanced degree in statistics or related field. Experience with clinical data."
            }
        ],
        companyName: "BioPharma Research"
    },
    {
        jobTitle: "Regulatory Affairs Specialist",
        jobType: "Full-time",
        location: "Philadelphia, PA",
        salary: 85000,
        vacancy: 2,
        experience: 3,
        detail: [
            {
                desc: "Manage regulatory submissions and compliance. Ensure adherence to pharmaceutical regulations.",
                requirement: "3+ years of regulatory affairs experience. Knowledge of FDA regulations. Strong attention to detail."
            }
        ],
        companyName: "BioPharma Research"
    },

    // AutoTech Industries Jobs
    {
        jobTitle: "Automotive Software Engineer",
        jobType: "Full-time",
        location: "Detroit, MI",
        salary: 100000,
        vacancy: 3,
        experience: 4,
        detail: [
            {
                desc: "Develop software for automotive applications. Work on embedded systems and vehicle connectivity.",
                requirement: "4+ years of software development experience. Knowledge of automotive systems. C++ and Python experience required."
            }
        ],
        companyName: "AutoTech Industries"
    },
    {
        jobTitle: "Electric Vehicle Engineer",
        jobType: "Full-time",
        location: "Detroit, MI",
        salary: 95000,
        vacancy: 2,
        experience: 3,
        detail: [
            {
                desc: "Design and develop electric vehicle systems. Work on battery technology and power electronics.",
                requirement: "3+ years of EV engineering experience. Knowledge of electric vehicle systems. Strong problem-solving skills."
            }
        ],
        companyName: "AutoTech Industries"
    },
    {
        jobTitle: "Automotive Quality Engineer",
        jobType: "Full-time",
        location: "Detroit, MI",
        salary: 85000,
        vacancy: 2,
        experience: 3,
        detail: [
            {
                desc: "Ensure quality standards in automotive manufacturing. Implement quality control processes and improvements.",
                requirement: "3+ years of quality engineering experience. Knowledge of automotive quality standards. Strong analytical skills."
            }
        ],
        companyName: "AutoTech Industries"
    }
];

module.exports = { companies, jobsData };
