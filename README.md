This is the codebase for the JustFix.nyc platform, including the Tenant Webapp, Advocate Dashboard, and the back-end API for managing data. For more information about our organization, please visit [www.justfix.nyc](https://www.justfix.nyc).

## Getting Started

This guide assumes that you are using a [UNIX](http://i.imgur.com/uE6fkx7.gif) system (most likely macOS), but everything is available on Windows if you follow the appropriate guides thru the links below.

There are two ways to get started. Both require a bit of common setup.

### Common setup

1. Get a copy of the code!

  ```
  git clone https://github.com/JustFixNYC/tenants.git
  ```

2. You should have a `development.js` copy from me. (If not, email me at [dan@justfix.nyc](mailto:dan@justfix.nyc)). Place that file in `config/env`.

Now you have the option to set up and run everything locally, or use Docker.

### Option 1: Run everything locally

#### Build tools and languages

0. Open terminal. Some of these steps may require `sudo` in order to install.

1. Install [Node.js](https://nodejs.org/en/) (v4.4.x is ideal) and make sure everything works:

  ```
  node -v
  ```

3. Update [npm](https://www.npmjs.com/) and make sure everything works:

  ```
  npm install -g npm@latest
  npm -v
  ```

4. Download and install [MongoDB](https://www.mongodb.com/download-center). Make sure that it runs on the default port (27017)

5. Use npm to install [bower](http://bower.io/) and [grunt](http://gruntjs.com/). You'll probably need sudo for this (using `-g` affects your machine globally).

  ```
  sudo npm install -g bower grunt-cli
  ```   

6. Set up [git](https://help.github.com/articles/set-up-git/) if you don't already have it.

7. Set up Ruby and Sass to compile CSS. See [here](https://github.com/gruntjs/grunt-contrib-sass#sass-task) for instructions.

#### Download and install libraries

Use npm to install the needed back-end and buildtool libraries. It should trigger a `bower install` for front-end dependencies automatically. Make sure you're in the root directory for the project - i.e. the same level as the `package.json` file.

  ```
  npm install
  ```  

#### Start everything up

1. To start, you'll need an active mongodb instance running. I like to do this in a folder within `app` - e.g. `app/mongodb` but it can be run globally or anywhere else.

  ```
  mongod --dbpath . &
  ```
Open a new terminal window and make sure it's running:
  ```
  ps aux | grep mongo
  ```
You should see the process running, as well as the `grep mongo` command process you just ran. Ex:

  ```
  dan@Dans-MacBook tenants (master) $ ps aux | grep mongo
  dan               4072   0.3  0.0  2583596   6272   ??  S    16Feb17  48:14.37 mongod --dbpath .
  dan              24473   0.0  0.0  2444056    796 s001  S+    4:26PM   0:00.01 grep mongo
  ```

2. After that, it should be quite simple to start the app (again, make sure this is from the root directory):
  ```
  grunt
  ```

#### Set environment variables

Set the `MONGODB_TEST_URI` environment variable to point to a test database
that will be wiped every time the test suite is run, e.g.:

```
export MONGODB_TEST_URI=mongodb://localhost:27017/unittests
```

### Option 2: Use Docker

1. Download [Docker Community Edition](https://www.docker.com/community-edition).

2. Run `bash docker-update.sh`.

   Note that in the future, you'll want to run this whenever you update the repository or switch branches, too, to make sure you have all the latest dependencies.

3. Run `docker-compose up`.

### Visit your local server

Now that you've got everything up and running, go to `http://localhost:3000` to see your development version! Grunt will watch for any changes you make to the code and automatically restart the server for live development.

### Tips on using Docker

If you decided to go the Docker route but aren't very familiar with Docker, here are some tips.

#### Running command-line tools

If you ever want to run an individual command-line tool on the project, such as a specific grunt task or linter, you can dive into your Docker's main `web` container by running:

```
docker-compose run web bash
```

You will be in the container's `/tenants` directory, which maps to the root of your repository on your local machine.

Alternatively, you can run individual commands just by running `docker-compose run web <command name>`. Some people do this so often that they create a shell alias called `dcr` that's short for `docker-compose run`.

#### Uninstalling or starting from scratch

If you ever get your Docker setup into a weird state where nothing works, or if you're done with the project and want to free all resources used by Docker, run `docker-compose down -v`.

You'll then need to re-run `bash docker-update.sh` set everything up again.

### Running the test suite

To run the test suite, run:

```
npm test
```

### More Questions

Check out [MEAN.JS](http://meanjs.org/docs/0.3.x/) - will have more tutorials on the architecture setup and things for troubleshooting.


## License

JustFix.nyc uses the GNU General Public License v3.0 Open-Source License. See `LICENSE.md` file for the full text.
