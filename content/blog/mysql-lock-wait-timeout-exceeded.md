---
layout: post
title: "MySQL Lock Wait Timeout Exceeded"
author: Michael Minter
date: 2014-06-17
comments: true
tags: [mysql, error, "lock wait", "wait timeout", "timeout exceeded"]
thumbnail: https://images.unsplash.com/photo-1514820402329-de527fdd2e6d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bG9jayUyMHdhaXQlMjB0aW1lb3V0fGVufDB8fDB8fHww
---

What to do when you encounter:

> ActiveRecord::StatementInvalid: Mysql2::Error: Lock wait timeout exceeded; 

<!-- more -->

One solution I've used, if you have an uber query or series of queries, is to extend the wait timeout.

If you can't currently restart the server or MySQL, enter the following in the MySQL terminal:

    mysql> set GLOBAL wait_timeout=28800;

This setting will go away when the current MySQL instance is terminated.

To set the wait_timeout parameter permanently, edit your MySQL configuration file:

    ~$ vim /etc/my.conf

Insert the following line:

    wait_timeout = 28800

Now restart MySQL:

    sudo /etc/init.d/mysql restart

Or on Redhat:

    sudo service mysqld restart

__Notes__

__wait_timeout__  
The number of seconds the server waits for activity on a noninteractive connection before closing it. This timeout applies only to TCP/IP and Unix socket file connections, not to connections made using named pipes, or shared memory.

__interactive_timeout__  
The number of seconds the server waits for activity on an interactive connection before closing it. An interactive client is defined as a client that uses the CLIENT_INTERACTIVE option to mysql_real_connect().

Can be set like:

    interactive_timeout = 28800

__my.cnf__  
Possible locations of my.cnf:

* /etc/my.cnf
* /etc/mysql/my.cnf
* $MYSQL_HOME/my.cnf
* [datadir]/my.cnf
* ~/.my.cnf
