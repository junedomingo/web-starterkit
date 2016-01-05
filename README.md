A Jade and Stylus starter project using Gulp for task automation.

### Installation

Install NodeJS

- [NodeJS](http://nodejs.org/)

```sh
# Install Gulp
$ npm install gulp -g

# Clone this repository
$ git clone git@github.com:CynderTech/web-starterkit.git && cd web-starterkit

# Install dependencies
$ npm install
```

### Tasks

- `gulp start` Compile Jade, Stylus and JS files and watch for changes ...then go to `http://localhost:8080` and you’ll see your local site preview. 
- `gulp start-browser-sync` Same as `gulp start` but you will able to do cross browser and cross device testing on the same internet connection.
- `gulp build` Compile Jade, Stylus and JS files
- `gulp clean-build` Delete build files
- `gulp re-build` Delete build files and compile it 


### Sub-Tasks (optional)
- `gulp js` Compile js files
- `gulp html` Compile jade files
- `gulp css` Compile stylus files
- `gulp copyfonts` Copy font files
- `gulp imagemin` Compress image files
