# Inherify

[![Build Status][travis-badge]][travis-url]
[![Coverage Status][coverage-badge]][coverage-url]
[![Slack Status][slack-badge]][slack-url]
[![Version][version-badge]][npm-url]
[![Downloads][downloads-badge]][npm-url]
[![Node][node-badge]][npm-url]
[![License][license-badge]][license-url]

[![Issues Open][issues-open-badge]][issues-url]
[![Issue Resolution][issues-reso-badge]][issues-url]

[Inherify][site-url] is a function constructor to make easy and clean inherits prototypes.

[![NPM][npm-img]][npm-url]
[![GRID][coverage-img]][coverage-url]

Installation
============

Install with `npm install inherify --save`.

Usage
=====

To use, add the `require` node module:

```JavaScript

    const Inherify = require('inherify');

    const CustomError = Inherify(Error, {
        __constructor: function(settings) {
            settings = typeof(settings) === 'string' ? {
                message: settings
            } : settings || {};
            this.name = 'CustomError';
            this.type = settings.type || 'Application';
            this.message = settings.message || 'An error occurred.';
            this.detail = settings.detail || '';
            this.extendedInfo = settings.extendedInfo || '';
            this.errorCode = settings.errorCode || '';
            Error.captureStackTrace(this, CustomError);
        }
    });

    throw new CustomError('Custom error raised!');
```

[![WTF][wtfpl-img]][wtfpl-url]

[site-url]: http://inherify.rubeniskov.com

[npm-url]: https://www.npmjs.com/package/inherify
[npm-img]: https://nodei.co/npm/inherify.png?downloads=true

[travis-url]: https://travis-ci.org/rubeniskov/inherify?branch=master
[travis-badge]: https://travis-ci.org/rubeniskov/inherify.svg?style=flat-square

[license-url]: LICENSE
[license-badge]: https://img.shields.io/badge/license-WTFPL-blue.svg?style=flat-square

[coverage-url]: https://codecov.io/github/rubeniskov/inherify
[coverage-img]: https://codecov.io/gh/rubeniskov/inherify/branch/master/graphs/icicle.svg?width=400&height=72
[coverage-badge]: https://img.shields.io/codecov/c/github/rubeniskov/inherify.svg?style=flat-square

[slack-url]: http://slack.rubeniskov.com/
[slack-badge]: http://slack.rubeniskov.com/badge.svg?style=flat-square&maxAge=2592000

[version-badge]: https://img.shields.io/npm/v/inherify.svg?style=flat-square&maxAge=2592000
[downloads-badge]: https://img.shields.io/npm/dm/inherify.svg?style=flat-square&maxAge=2592000
[node-badge]: https://img.shields.io/node/v/inherify.svg?style=flat-square

[issues-url]: https://github.com/rubeniskov/inherify/issues
[issues-open-badge]: http://isitmaintained.com/badge/open/rubeniskov/inherify.svg
[issues-reso-badge]: http://isitmaintained.com/badge/resolution/rubeniskov/inherify.svg

[wtfpl-url]: http://www.wtfpl.net/
[wtfpl-img]: http://www.wtfpl.net/wp-content/uploads/2012/12/wtfpl.svg
