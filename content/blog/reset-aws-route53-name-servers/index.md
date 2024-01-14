---
layout: post
title: Reset AWS Route 53 NS Records
author: Michael Minter
date: 2024-01-14
comments: true
tags: [AWS, Route 53, Hosted zone, Domain, DNS, Name Servers, NS, DevOps]
thumbnail: https://images.unsplash.com/photo-1559631274-6075af61815d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cmVzZXR8ZW58MHwwfDB8fHwy
---

Managing your domain's DNS settings is a crucial aspect of maintaining a robust online presence. AWS Route 53 provides a reliable and scalable domain name system (DNS) service. If you ever need to reset your domain name servers (DNS) in AWS Route 53, follow these step-by-step instructions.

## Prerequisites

Before you begin, ensure that you have the necessary permissions to modify DNS settings for your domain. Additionally, make sure you are logged in to the AWS Management Console.

## Step 1: Access Route 53 Console

1. Open the [AWS Management Console](https://aws.amazon.com/).
2. Navigate to the "Route 53" service.

## Step 2: Select Your Domain

1. In the Route 53 dashboard, select "Hosted zones" from the left navigation pane.
2. Create a "Hosted zone" for your registered domain name if you haven't already. 
3. Click on the radio button (bubble) next to the domain you want to reset.

## Step 3: Record Hosted Zone Name Servers

Default Hosted zone details will show up in the drawer. Copy them down.

## Step 4: Document Existing Settings

Before making any changes, it's essential to document your existing DNS settings. This includes the current Name Server (NS) records.

## Step 5: Update Name Servers

1. Click into the Hosted zone now.
2. Locate the current Name Server (NS) records.
3. Click the "Edit record" button.
4. Replace the existing NS records with the new ones you copied down earlier.
5. Click "Save" to apply the updated settings.

## Step 6: Verify Changes

After updating the DNS settings, it may take some time for the changes to propagate across the internet. You can use online tools or wait for the changes to reflect in the Route 53 console.

## Conclusion

Resetting AWS Route 53 domain name servers is a straightforward process that ensures your domain's DNS settings are up to date. Always exercise caution when modifying DNS records, as they play a critical role in directing traffic to your web services.

## Side Note

This could also be done programmatically through AWS-CLI, any of the numerous SDKs available, and a [Terraform Resource](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/route53domains_registered_domain) for updating DNS records that goes a little something like this (Overkill I'd like to get into sometime in another post).

```json
resource "aws_route53domains_registered_domain" "example" {
  domain_name = "example.com"

  name_server {
    name = "ns-195.awsdns-24.com"
  }

  name_server {
    name = "ns-874.awsdns-45.net"
  }

  tags = {
    Environment = "test"
  }
}
```

By following these steps, you can confidently manage and reset your AWS Route 53 domain name servers to align with your evolving infrastructure needs.
