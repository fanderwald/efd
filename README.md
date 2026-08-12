# Description

This is a hybrid WordPress theme using the Zurb [Foundation for Sites 6](https://get.foundation/sites.html) framework. The environment uses theme.json, along with custom sass settings for development. To simplify updates, setup and make changes in a local development environment prior to pushing to production server. 


# Requirements

**This theme requires [Node.js](http://nodejs.org) v20 to be installed on your machine.**  
This theme also uses Sass and style changes must be compiled into css before uploading. 

## Timber
This theme depends on [Timber](https://github.com/timber/timber), which is integrated into the theme directly via Composer.

## Advanced Custom Fields
This theme depends on the [Advanced Custom Fields Pro](https://www.advancedcustomfields.com) plugin being installed and activated.


# Setup Local Development

1. Install local development environment. [Local by WP Engine](https://wpengine.com/local/) is recommended.
2. Download theme folder to local development environment.
3. From a terminal window, go to the theme folder and install Node Modules:
```bash
% npm install
```
4. Configure the config-default.yml file with your local development server address for browser syncing.
5. Get started. Changes to php, twig, scss, and js during development are automatically processed with each save and the browser refreshed.
```bash
% npm start
```
6. When changes are complete, compile for production to minimize css and javascript. Final code is located in the dist folder.
```bash
% npm run build
```
7. To create a zip file of the theme, run:
```bash
% npm run package
```

# Theme structure
The `/blocks` folder contains all custom blocks created for this project.

In the `/src` folder you will find the working files (scss, js, settings) for assets. Every time you make a change to a file that is watched by Gulp, the output will be saved to the `/dist` folder. 

The `/page-templates` folder contains the PHP templates used by WordPress. The PHP files are only used to access WordPress application data and logic. The PHP files point to a twig file for html rendering.

The `/template-parts` folder contains code partials.

The `/library` folder contains source code for functions, such as custom blocks.

The `/vendor` folder contains plugin dependencies installed via [Composer](https://getcomposer.org).


# Deprecated

This theme is based on the Foundation 6 starter theme created by Ole Fredrik, [FoundationPress](https://github.com/olefredrik/FoundationPress). 

