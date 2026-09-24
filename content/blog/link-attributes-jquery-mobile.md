---
layout: post
title: "Clicked Link Attributes in jQuery Mobile Events"
author: Michael Minter
date: 2013-02-06
comments: true
tags: [jQuery, Mobile]
thumbnail: https://images.unsplash.com/photo-1590496793907-4d66e2994b4d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGNvbnRhaW5lcnN8ZW58MHwwfDB8fHwy
---
So...are you tired of writing and rewriting (or commenting out) Javascript and want to handle your clicked link attributes inside of a <a href="http://jquerymobile.com/" target="_blank">jQuery Mobile</a> event? Here's how:

<!--more-->

``` perl
var params = {};

$('a').live('click', function(event)
{
  $.each($(event.target)[0].attributes, function(key, value){
    params[value.name] = value.value;
  });
});

$('div[data-role="page"]').live('pageshow',function(event, ui)
{
 console.log(params)
});
```

The click event has to be done separately and parsed before the _pageshow_ event takes place.

Doing things this way you can also take full advantage of the rest of jQuery Mobile's special page responsive <a href="http://jquerymobile.com/test/docs/api/events.html" target="_blank">events</a> that happen throughtout the life of your application.

Please, if you have any ideas for an alternative method of injecting clicked link attributes into event functions, comment below.
