const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

// Use dynamic import for inquirer
import("inquirer").then(({ default: inquirer }) => {
    const Manager = require("./lib/Manager");
    const Engineer = require("./lib/Engineer");
    const Intern = require("./lib/Intern");

    const render = require("./src/page-template.js");

    // Define functions for prompting user input
    async function promptUser() {
        return inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: "Enter team manager's name:",
            },
            {
                type: 'input',
                name: 'id',
                message: "Enter team manager's employee ID:",
            },
            {
                type: 'input',
                name: 'email',
                message: "Enter team manager's email address:",
            },
            {
                type: 'input',
                name: 'officeNumber',
                message: "Enter team manager's office number:",
            },
            {
                type: 'list',
                name: 'memberType',
                message: 'Which type of team member would you like to add?',
                choices: ['Engineer', 'Intern', 'Finish building the team'],
            },
        ]);
    }

    async function promptEngineer() {
        return inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: "Enter engineer's name:",
            },
            {
                type: 'input',
                name: 'id',
                message: "Enter engineer's employee ID:",
            },
            {
                type: 'input',
                name: 'email',
                message: "Enter engineer's email address:",
            },
            {
                type: 'input',
                name: 'github',
                message: "Enter engineer's GitHub username:",
            },
        ]);
    }

    async function promptIntern() {
        return inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: "Enter intern's name:",
            },
            {
                type: 'input',
                name: 'id',
                message: "Enter intern's employee ID:",
            },
            {
                type: 'input',
                name: 'email',
                message: "Enter intern's email address:",
            },
            {
                type: 'input',
                name: 'school',
                message: "Enter intern's school:",
            },
        ]);
    }

    // Main function to initialize the application
    async function init() {
        console.log("Welcome to the Team Profile Generator!");

        const managerAnswers = await promptUser();
        const manager = new Manager(managerAnswers.name, managerAnswers.id, managerAnswers.email, managerAnswers.officeNumber);
        const teamMembers = [manager];

        let addMember = true;
        while (addMember) {
            if (managerAnswers.memberType === 'Engineer') {
                const engineerAnswers = await promptEngineer();
                const engineer = new Engineer(engineerAnswers.name, engineerAnswers.id, engineerAnswers.email, engineerAnswers.github);
                teamMembers.push(engineer);
            } else if (managerAnswers.memberType === 'Intern') {
                const internAnswers = await promptIntern();
                const intern = new Intern(internAnswers.name, internAnswers.id, internAnswers.email, internAnswers.school);
                teamMembers.push(intern);
            } else if (managerAnswers.memberType === 'Finish building the team') {
                addMember = false;
            }

            if (addMember) {
                managerAnswers.memberType = (await inquirer.prompt({
                    type: 'list',
                    name: 'memberType',
                    message: 'Which type of team member would you like to add?',
                    choices: ['Engineer', 'Intern', 'Finish building the team'],
                })).memberType;
            }
        }

        // Generate HTML and write to file
        const htmlContent = render(teamMembers);
        if (!fs.existsSync(OUTPUT_DIR)) {
            fs.mkdirSync(OUTPUT_DIR);
        }
        fs.writeFileSync(outputPath, htmlContent);
        console.log(`HTML file generated at ${outputPath}`);
    }

    init();
}).catch((error) => {
    console.error("Error loading inquirer:", error);
});
