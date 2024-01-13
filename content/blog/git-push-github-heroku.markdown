---
layout: post
title: "Git Push to Github and Heroku"
author: Michael Minter
date: 2014-05-08
comments: true
tags: [Git, Multiple, Remote, Heroku, OpenShift]
thumbnail: https://images.unsplash.com/photo-1544919423-d8dd1d706aea?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE1fHx8ZW58MHx8fHx8
---

Group assign any git repository, on any git provider, and for as many remotes as you wish.

<!-- more -->

<img src="/images/posts/remotes.jpg" alt="Remotes Funny" style="width:100%;" />

From your terminal, `cd` into where your repository is located and run:

```
$> git remote -v
```

Should look something like:

```
heroku  git@heroku.com:activezoo.git (fetch)
heroku  git@heroku.com:activezoo.git (push)
openshift ssh://5340404b5973ca1ff800034d@ruby-activezoo.rhcloud.com/~/git/ruby.git (push)
openshift ssh://5340404b5973ca1ff800034d@ruby-activezoo.rhcloud.com/~/git/ruby.git (fetch)
origin  git@github.com:michaelminter/active_zoo.git (push)
origin  git@github.com:michaelminter/active_zoo.git (fetch)
```

Find the Github repo. Usually set up under the __origin__ label.

To create the group remote, add the following command, with your Github repo address switched out with the one listed.

```
$> git remote add all git@github.com:michaelminter/test.git
```

Find the Heroku git repo address and switch it out with the repo in this command. Run the command.

```
$> git remote set-url --add all git@heroku.com:test.git
```

Keep executing the previous command, switching out the git address, to add more repos to the new "all" remote.

```
$> git remote -v
all git@github.com:michaelminter/active_zoo.git (fetch)
all git@heroku.com:activezoo.git (push)
all git@github.com:michaelminter/active_zoo.git (push)
heroku  git@heroku.com:activezoo.git (fetch)
heroku  git@heroku.com:activezoo.git (push)
openshift ssh://5340404b5973ca1ff800034d@ruby-activezoo.rhcloud.com/~/git/ruby.git (push)
openshift ssh://5340404b5973ca1ff800034d@ruby-activezoo.rhcloud.com/~/git/ruby.git (fetch)
origin  git@github.com:michaelminter/active_zoo.git (push)
origin  git@github.com:michaelminter/active_zoo.git (fetch)
```

Now you can push the same code to multiple remotes with one command.

```
$> git push all [branch]
```
