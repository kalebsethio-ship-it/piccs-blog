#!/usr/bin/env python3
"""Voice + structure audit for a single article file."""
import re
import sys

path = sys.argv[1]
t = open(path, encoding="utf-8").read()
body = t.split("---", 2)[2]
words = len(re.findall(r"\b[\w'-]+\b", body))

print("file:", path)
print("words:", words)
print("emoji found:", re.findall(r"[\U0001F300-\U0001FAFF\u2600-\u27BF\uFE0F]", t))
print("H1 in body:", re.findall(r"^# .*", body, re.M))
print("'Anda' occurrences:", re.findall(r"\bAnda\b", t))
print("opens with Hi Creative Friends!:", body.strip().startswith("Hi Creative Friends!"))
print("tagline present:", "Do you need a space? BOOK NOW!" in body)
print("WA closing line present:", "Butuh bantuan merencanakan event?" in body)
print("numbered list items:", len(re.findall(r"^\d+\. ", body, re.M)))
print("H2 sections:", len(re.findall(r"^## ", body, re.M)))
print("internal links:", re.findall(r"\]\((/[^)\s]+)\)", body))
print("wp-content refs:", len(re.findall(r"wp-content", t)))
bad_host = "piccreativespace.id/wp-content"
print("legacy wp uploads:", bad_host in t)
print("inline images:", re.findall(r"!\[[^\]]*\]\((https://photos\.piccreativespace\.id/[^)]+)\)", body))

prose_lines = [l for l in body.split("\n") if not l.strip().startswith("|")]
prose = "\n".join(prose_lines)
print("prose-only words (tables excluded):", len(re.findall(r"\b[\w'-]+\b", prose)))
