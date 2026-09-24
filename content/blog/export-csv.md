---
layout: post
title: "Export Data as CSV"
author: '<a href="/" target="_blank" alt="Homepage" title="Michael Minter">Michael Minter</a>'
date: 2011-11-14
comments: true
tags: [Ruby, Rails, MongoDB, Postgres, MySQL, CSV, Export]
thumbnail: https://images.unsplash.com/photo-1447279506476-3faec8071eee?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGFzdGElMjBtYWtlcnxlbnwwfDB8MHx8fDI%3D
---

In my research I found a hundred and more different ways to manage the task of exporting data into a CSV file. Whenever I’m learning something new, on a new system or with a new language, I like to build the process myself from scratch. And being a minimalist programmer it just seems fitting. Enjoy

<!--more-->

``` ruby
def export_inverts
  require 'fastercsv'
  inverts  = Invert.all
  filename = params[:action] + ".csv"

  #this is required if you want this to work with IE
  if request.env['HTTP_USER_AGENT'] =~ /msie/i
    headers['Pragma'] = 'public'
    headers["Content-type"] = "text/plain"
    headers['Cache-Control'] = 'no-cache, must-revalidate, post-check=0, pre-check=0'
    headers['Content-Disposition'] = "attachment; filename=\"#{filename}\""
    headers['Expires'] = "0"
  else
    headers["Content-Type"] ||= 'text/csv'
    headers["Content-Disposition"] = "attachment; filename=\"#{filename}\""
    headers["Content-Transfer-Encoding"] = "binary"
  end

  csv_string = FasterCSV.generate do |csv|
    csv << ["Genus","Species","Common Name","Pet Name","Gender"]
    inverts.each do |i|
      csv << [i.scientific_name,i.scientific_name,i.common_name,i.pet_name,i.gender]
    end
  end
  render :text => csv_string
end
```

NOTE: *Developers using Ruby 1.8 <= must install gem:fastercsv*
