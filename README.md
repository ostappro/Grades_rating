# Grades-Rating-NaUKMA

### Hey fellow dev. Wanna checkout new hot projects near you. Than find another one
This is just two dudes messin' with JS (one of whom prefers writing TS tho)

### If ya still wanna build this thing then follow this steps:
- `git clone <project-url>` - duh.
- `npm install` or `yarn install` - whatever suits you best <3

Now's the real business:
This project supports three environments: prod, dev, test.
By default repo ships in "incomplete production mode". Meaning you'll have to provide your own .env file with following vars:
- `NODE_ENV` - in production should be set to `prod`
- `PORT` - port on which app will operate
- `DBPORT` - mongodb port, if you are planning to launch local mongodb instance with npm `mongo` script
- `MONGO_URL` - url to a mongodb instance

If you want to mess around, feel free to use pre-populated `dev` environment.

To switch envs, use `npm run env -- <env-name>` or `yarn env -- <env-name>`

All of the environment overrides are located inside `env/<env-name>/override` folder. Mongodb instance will locate itself inside `env/<env-name>/mongo`, if you are using npm `mongo` script to start mongodb

So... You are still here. Great! Only things left to run this bad boi is to:
- `npm run build` or `yarn build` - to build repo
- `npm start` or `yarn start` - to launch

If you are not seeing `Started server on port <port-name>` check if you are running mongodb instance and MONGO_URL path is correct

## I covered the whole thing (back-end) in tests

It uses JEST, and if you want to run them, to see if ya dunce broke something, just `npm run test` this bad boi.
It automatically changes environment to `test` and runs temporary in-memory instance of mongodb

_why am I writing README.md instead of real code?_
