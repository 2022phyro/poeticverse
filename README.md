To run the backend => cd into the backend directory
`cd backend`
run `flask --app 'api:create_app()' run --debug`, debug since we're still in development

TO run the frontend, cd into the frontend react app
`cd frontend/poeticverse`
run `npm install` This will allow you install the necessary modules in your system as I didn't push those
then run
`npm run dev`
This exposes the react app to a port on the localhost
</br>
You may run into compatibility issues if your node is not at the latest stabele  version to fix that,
- Cd into your frontend react app and delete your node modules
  `rm -rf frontend/poeticverse/node_modules`
- Update your node by installing n utility
  `npm install -g n`
  `n lts` _This installs the latest version of node_
- Cd back to your frontend react app
  `cd frontend/poeticverse`
  `npm install`
- Then try running it again
  `npm run dev`

For the frontend, I'm not so sure about it because i haven't tried it but the backend should work. In the backend, there are some modules you might need to install. Use `pip install -r requirements.txt`. I've created a requirements.txt but I'm not so sure it won't break stuff in your own systems so it might be advisable to use a virtual environment
The database will appear empty because I'm not using sqllite. So the data is only in my system. To begin run `cat setup.sql | mysql -u root -p` and then input in your root password or whatever user you're using
then `mysql -u root -p poeticverse < poeticverse_dump.sql`
You'll be prompted for a password again. enter in your password and you're good to go :joy: hopefully
