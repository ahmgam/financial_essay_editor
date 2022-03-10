# financial_essay_editor
This project is a self training on using django framework with django channels and multiple database.
the aim is to create blog for financial blogs, the blog page has the same style of juypter notebook, consists of block.
there are 3 types of blocks: text block, Image block and chart block
the text block uses markdown rules, 
the image block uploads the image to the server (intended to be S3 bucket, but for testing it uploads to static files) 
and the chart block draws chart using apex charts for selected companies (for now 6 sample companies) in selcted period
the blog is drafted and has auto save feature implemented using websocket and django channels.
normal sqlite database is used for user credientials and mongodb used for storing blogs and drafts
project is still under development.

