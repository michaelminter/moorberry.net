---
layout: post
title: "HTML Not Rendering in Gmail"
author: '<a href="/" target="_blank" alt="Homepage" title="Michael Minter">Michael Minter</a>'
date: 2011-12-10
comments: true
tags: [Ruby, API, Gmail, HTML]
thumbnail: https://images.unsplash.com/photo-1679051866316-725226c711e1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTA1fHxwYWNrYWdlJTIwZGVsaXZlcnl8ZW58MHwwfDB8fHwy
---

I’ve been handling many of my company’s email campaigns for some time now and I can honestly say that it’s been pretty fun from a technical stand-point. There’s a lot that goes into email marketing (not including the marketing/sales implications). It has it’s own conventions, ideologies, and I believe to the utmost that there’s a larger future than presumed in store for the sometimes misunderstood technology. (I’m patiently waiting for a mobile device header-type.)

<!--more-->

<img src="/images/posts/sendgrid-banner.jpeg" title="SendGrid" alt="SendGrid" style="width:100%;" />

Recently I’ve been using my new skills while working on my own applications using [SendGrid](http://sendgrid.tellapal.com/a/clk/1zzx0 "SendGrid") as an alternative SMTP and email analytics tool. And I’ve only really come across one major programmable error. If you use a desktop client instead of a browser for viewing emails, as I do oftentimes, then this issue might not be so apparent (till now).

I recently was witness to how Gmail handles email headers in regards to HTML v. text-only. Gmail’s SaaS actually only reads the latter MIME-type and throws away the rest. So if you have a text version being made available, and you want your emails to be seen strictly as HTML, you must render the HTML version in your code LAST. Here is a Ruby on Rails example:

``` ruby
class Notifier < ActionMailer::Base
  include SendGrid
  default :from => Rails.configuration.sendgrid.reply_to
  sendgrid_enable :opentrack, :clicktrack, :ganalytics
  sendgrid_category :testing
  
  def user_updated(user)
    @user = user
    mail( :to => @user.email, 
          :subject => "Your information has been updated.") do |format|
      format.text { "#{user.first_name},\n\nThis is an auto-response to inform you that your information has changed." }
      format.html { render :layout => 'autoresponse' }
    end
  end
end
```

Super “thanks” go out to the [SendGrid](http://sendgrid.tellapal.com/a/clk/1zzx0 "SendGrid") crew for their constantly superior customer service skills and for helping me out on my way to becoming an email marketing specialist.
