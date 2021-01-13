let child = require("child_process")

if (process.argv.length > 2) {
    child.execSync(`cp -Rf env/${process.argv[2]}/override/ ./`)
    console.log(`Changed local environment to ${process.argv[2]}.`)
}

console.log("Injecting .env environment variables...")
child.execSync("export $(cat .env | xargs)")