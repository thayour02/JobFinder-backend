const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Company = require('./model/companyModel');
const Jobs = require('./model/jobModel');
const { companies, jobsData } = require('./seedData');
require('dotenv').config();

const seedDatabase = async () => {
    try {
        // Connect to database
        await mongoose.connect(process.env.URI_STRING);
        console.log('Connected to database');

        // Clear existing data
        await Company.deleteMany({});
        await Jobs.deleteMany({});
        console.log('Cleared existing data');

        // Hash passwords for companies
        const hashedCompanies = await Promise.all(
            companies.map(async (company) => {
                const hashedPassword = await bcrypt.hash(company.password, 12);
                return {
                    ...company,
                    password: hashedPassword
                };
            })
        );

        // Insert companies
        const createdCompanies = await Company.insertMany(hashedCompanies);
        console.log(`Created ${createdCompanies.length} companies`);

        // Create a mapping of company names to their IDs
        const companyMap = {};
        createdCompanies.forEach(company => {
            companyMap[company.name] = company._id;
        });

        // Prepare jobs with company references
        const jobsWithCompanyRefs = jobsData.map(job => ({
            ...job,
            company: companyMap[job.companyName],
            detail: job.detail
        }));

        // Insert jobs
        const createdJobs = await Jobs.insertMany(jobsWithCompanyRefs);
        console.log(`Created ${createdJobs.length} jobs`);

        // Update companies with their job references
        for (const company of createdCompanies) {
            const companyJobs = createdJobs.filter(job => 
                job.company.toString() === company._id.toString()
            );
            
            await Company.findByIdAndUpdate(
                company._id,
                { $push: { jobPosts: { $each: companyJobs.map(job => job._id) } } }
            );
        }

        console.log('Updated companies with job references');
        console.log('Database seeded successfully!');

        // Display summary
        console.log('\n=== SEEDING SUMMARY ===');
        console.log(`Companies created: ${createdCompanies.length}`);
        console.log(`Jobs created: ${createdJobs.length}`);
        console.log('\nCompanies:');
        createdCompanies.forEach(company => {
            const jobCount = createdJobs.filter(job => 
                job.company.toString() === company._id.toString()
            ).length;
            console.log(`- ${company.name}: ${jobCount} jobs`);
        });

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from database');
    }
};

// Run the seed function
seedDatabase();
