---
layout: post
title: "Special Notes Lookup in Rails"
author: Michael Minter
date: 2012-11-06
description: "Rails notes feature explained"
comments: true
tags: [Ruby, Rails, Rake, notes, todos, fixme, optimize, annotate, annotations]
thumbnail: https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
---

Add special notes to your source code comments in Rails to later remind you of tasks you need to complete:

<!--more-->

``` rb
class Article < ActiveRecord::Base
  # TODO add named_scopes
  # FIXME method A is broken
  # OPTIMIZE improve the code 
	
  has_many :comments
  ....
end
```

Some programming IDEs, such as <a href="http://www.aptana.com/" target="_blank">Aptana Studio 3</a> (free), will even highlight the key notation part.

Now, from the command line, you can list these special notes with a rake task:

``` bash
$ rake notes
app/models/article.rb:
  * [2] [TODO] add named_scopes
  * [3] [FIXME] method A is broken
  * [4] [OPTIMIZE] improve the code
```

You can also list notes of each kind individually with `rake notes:todo`, `rake notes:fixme` and `rake notes:optimize`.

You can even list your own, custom notes with `rake notes:custom ANNOTATION=MYANNO`.
