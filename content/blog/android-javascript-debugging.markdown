---
layout: post
title: "Android Javascript Debugging"
author: Michael Minter
date: 2013-08-12
comments: true
tags: [Javascript, Android, debugging, console, log, logging]
thumbnail: https://images.unsplash.com/photo-1678287759127-1ad7f38855cb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c3dpdGNoYm9hcmR8ZW58MHwwfDB8fHwy
---
As a web developer, I have to use `console.log` a lot to see what's going on with Javascript in my web applications, and Android Browser does __not__ make this __an easy task__.

<!-- more -->

Initial searches brought up articles suggesting use of the Android SDK, plugging my phone into my computer, setting up the debug bridge, et cetera. That's a lot of work.

There is a way to do __Javascript debugging__ entirely on your phone __without the Android SDK__.

__Install__ a log viewer from the Android Market (example: _logcat_). This shows all of your systems log messages. Most log viewers will let you search/filter. __Search__ for the term, "_browser_". All `console.log` messages will show up using this keyword.

One difference from desktop web inspectors: Android Browser __only prints the first argument__ from `console.log`. So instead of:

``` javascript
console.log("here's my variable ", var);
```

you should write it like:

``` javascript
console.log("here's my variable " + var);
```
