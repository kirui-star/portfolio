KiruiLabs Portfolio — AWS Deployment & CI/CD Documentation
1. Project objective
The goal was to migrate the KiruiLabs portfolio website to AWS and create an automated deployment process.
The final architecture is:
Local Development
     │
     ▼
VS Code
     │
     │ git push
     ▼
GitHub Repository
     │
     ▼
GitHub Actions
     │
     │ AWS authentication
     ▼
Amazon S3
     │
     ▼
Amazon CloudFront
     │
     ▼
Amazon Route 53
     │
     ▼
kiruilabs.com
www.kiruilabs.com
The result is that changes made locally can be published automatically after pushing them to GitHub.
________________________________________
2. Technologies used
The deployment involved:
•	HTML/CSS/JavaScript portfolio
•	VS Code
•	Git
•	GitHub
•	GitHub Actions
•	AWS
•	Amazon S3
•	Amazon CloudFront
•	Amazon Route 53
•	AWS IAM/security credentials
•	SSL/TLS for HTTPS
•	Custom domain kiruilabs.com
•	Domain registrar nameserver configuration
________________________________________
3. Local portfolio project
The portfolio was maintained locally in:
C:\Users\ekipr\OneDrive\Desktop\portfolio
The main website file is:
index.html
The Git repository uses:
main
as the production branch.
________________________________________
4. GitHub repository
The local project was connected to the GitHub repository:
github.com/kirui-star/portfolio
The basic deployment workflow starts locally:
git add .
git commit -m "Describe the update"
git push origin main
We also used:
git pull --rebase origin main
when making sure the local main branch was synchronized with GitHub before pushing.
During our final test, Git confirmed:
Current branch main is up to date.
and the push successfully updated:
main -> main
________________________________________
5. AWS S3 website storage
The portfolio files were moved to Amazon S3.
S3 acts as the storage/origin for the static website files, including:
index.html
CSS
JavaScript
images
assets
Instead of maintaining the production website manually on the previous hosting environment, AWS became the hosting infrastructure for the portfolio.
One important confirmation during testing was the HTTP response:
Server: AmazonS3
This showed that the website content was being delivered from the AWS S3 infrastructure.
________________________________________
6. CloudFront configuration
We placed Amazon CloudFront in front of S3.
The architecture therefore became:
Visitor
   │
   ▼
CloudFront
   │
   ▼
S3
CloudFront provides the public distribution layer and allows the website to be served efficiently through AWS's content delivery infrastructure.
During testing, the headers showed:
X-Cache: Hit from cloudfront
or:
X-Cache: Miss from cloudfront
and:
Via: ...cloudfront.net (CloudFront)
That confirmed CloudFront was serving the website.
A Miss from cloudfront is not necessarily an error. It can mean CloudFront had to retrieve the requested object from the origin instead of serving an already cached copy.
________________________________________
7. HTTPS/SSL configuration
HTTPS was configured so that the portfolio could be accessed securely through:
https://kiruilabs.com
and:
https://www.kiruilabs.com
During our earlier testing, we encountered:
curl: (35) Recv failure: Connection was reset
This initially made it appear that the HTTPS configuration might still have a problem.
However, after switching networks and allowing DNS/configuration changes to propagate, the request succeeded.
The final test returned:
HTTP/1.1 200 OK
for the domain.
________________________________________
8. Route 53 DNS
We moved DNS management to Amazon Route 53.
The Route 53 hosted zone provided four AWS nameservers:
ns-465.awsdns-58.com
ns-666.awsdns-19.net
ns-1128.awsdns-13.org
ns-1704.awsdns-21.co.uk
These nameservers became important because the domain registrar originally used another DNS provider.
Before the migration, DNS lookups showed nameservers such as:
ns1.rrpproxy.net
ns2.rrpproxy.net
ns3.rrpproxy.net
We therefore changed the domain to use the four Route 53 nameservers.
________________________________________
9. Domain registrar nameserver migration
At the registrar, we selected:
Use custom nameservers
and entered the four AWS Route 53 nameservers.
The registrar confirmed:
Changes Saved Successfully!
The registrar also warned that DNS changes could take time to propagate.
That meant we did not immediately assume something was broken when different networks initially produced different results.
________________________________________
10. Verifying nameserver propagation
We tested the domain against Google's public DNS resolver:
nslookup -type=ns kiruilabs.com 8.8.8.8
Eventually Google DNS returned:
kiruilabs.com nameserver = ns-1704.awsdns-21.co.uk
kiruilabs.com nameserver = ns-465.awsdns-58.com
kiruilabs.com nameserver = ns-666.awsdns-19.net
kiruilabs.com nameserver = ns-1128.awsdns-13.org
This was an important milestone.
It confirmed that public DNS was now recognizing the Route 53 nameservers.
________________________________________
11. Testing with Cloudflare DNS
We also tested another independent public DNS resolver:
nslookup kiruilabs.com 1.1.1.1
The domain resolved to CloudFront addresses such as:
3.162.163.26
3.162.163.91
3.162.163.44
3.162.163.37
We had previously received the same CloudFront IP range from Google's DNS.
That gave us additional evidence that DNS propagation was working correctly.
________________________________________
12. Testing the production website
We used curl rather than relying only on the browser.
For the root domain:
curl -I https://kiruilabs.com
The successful result included:
HTTP/1.1 200 OK
Content-Type: text/html
Server: AmazonS3
X-Cache: Miss from cloudfront
For the www version:
curl -I https://www.kiruilabs.com
we also received:
HTTP/1.1 200 OK
with AWS/CloudFront headers.
This confirmed that both:
kiruilabs.com
and:
www.kiruilabs.com
were reaching the AWS-hosted portfolio.
________________________________________
13. Network issue we encountered
An interesting troubleshooting lesson came from the initial:
curl: (35) Recv failure: Connection was reset
DNS itself was already resolving to CloudFront.
After switching the computer to mobile data, the HTTPS request began succeeding.
This demonstrated an important troubleshooting principle:
Successful DNS resolution does not necessarily mean every network will immediately have the same cached DNS or connection behavior.
When changing nameservers, testing through multiple resolvers/networks can help distinguish an AWS configuration problem from DNS caching or local-network behavior.
________________________________________
14. GitHub Actions automatic deployment
After confirming the AWS website worked, we tested the automatic deployment pipeline.
The intended process was:
Edit code
    ↓
Git commit
    ↓
Git push
    ↓
GitHub Actions
    ↓
AWS S3 updated
    ↓
CloudFront serves updated website
This eliminates the need to manually upload index.html after every change.
________________________________________
15. Real deployment test
To make sure the automation actually worked, we changed the portfolio text in VS Code.
For example, the hero description was changed to:
<p class="hero-description">
    I am Designing software and data-driven solutions that
    automate workflows, uncover insights, and solve
    practical business problems.
</p>
The point of this small modification was not the wording itself—it gave us an easily visible production change to verify.
________________________________________
16. Staging the change
We staged index.html:
git add index.html
Git accepted the command without errors.
________________________________________
17. Committing the deployment test
We then committed it:
git commit -m "test automatic portfolio deployement"
Git reported:
1 file changed, 1 insertion(+), 1 deletion(-)
That confirmed the local modification was committed.
For future commits, I'd use the correctly spelled form:
git commit -m "test automatic portfolio deployment"
________________________________________
18. Synchronizing with GitHub
Before pushing, we checked the remote branch:
git pull --rebase origin main
Git returned:
Current branch main is up to date.
So there was nothing remote that needed to be merged.
________________________________________
19. Pushing to GitHub
We then ran:
git push origin main
Git reported the push successfully:
To https://github.com/kirui-star/portfolio.git
...
main -> main
That confirmed the new commit reached GitHub.
________________________________________
20. Automatic AWS deployment verification
After the GitHub push, the updated portfolio appeared on the production website.
That was the final proof that the automation worked.
We therefore established the complete pipeline:
┌─────────────────┐
│     VS Code     │
│ Local Portfolio │
└────────┬────────┘
         │
         │ git push
         ▼
┌─────────────────┐
│     GitHub      │
│  main branch    │
└────────┬────────┘
         │
         │ GitHub Actions
         ▼
┌─────────────────┐
│    AWS S3       │
│ Portfolio Files │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   CloudFront    │
│      CDN        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Route 53     │
│      DNS        │
└────────┬────────┘
         │
         ▼
   kiruilabs.com
________________________________________
21. Normal workflow from now on
For most portfolio updates, you only need to edit the website in VS Code and run:
git add .
git commit -m "Update portfolio projects"
git push origin main
The deployment pipeline takes care of the rest.
You don't need to manually upload the changed files to S3 each time.
________________________________________
22. Useful troubleshooting commands
These are worth keeping in your documentation.
Check nameservers:
nslookup -type=ns kiruilabs.com 8.8.8.8
Check Google DNS resolution:
nslookup kiruilabs.com 8.8.8.8
Check Cloudflare DNS resolution:
nslookup kiruilabs.com 1.1.1.1
Test HTTPS:
curl -I https://kiruilabs.com
Test www:
curl -I https://www.kiruilabs.com
Check Git:
git status
Synchronize before pushing when needed:
git pull --rebase origin main
Push:
git push origin main
________________________________________
23. What this project demonstrates
This is more than simply putting an HTML website online. It demonstrates experience with:
Cloud infrastructure: AWS S3, CloudFront and Route 53.
DNS: migrating authoritative nameservers and verifying propagation through multiple public DNS resolvers.
Security: HTTPS/TLS configuration and AWS access controls.
Version control: Git and GitHub.
CI/CD: automatically deploying production changes from the GitHub main branch.
Troubleshooting: diagnosing DNS propagation, network caching, HTTPS connectivity, CloudFront behavior and deployment synchronization.

