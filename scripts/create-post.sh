#!/usr/bin/env bash	

echo "---	
title: WIP	
description:	
pubDate: $(date -u +%Y-%m-%dT%H:%M:%SZ)	
slug: slugify-wip	
---	
" > src/content/writing/$(date +%F)-wip.md

code src/content/writing/$(date +%F)-wip.md

echo 'Writing post created'
