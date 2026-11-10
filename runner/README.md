# Beatscript code runner

Runs PHP, Java and C++ for the website. HTML, CSS and JavaScript do not need it.

    browser  ->  gateway (public, port 8080)  ->  Piston (private sandbox)

- **Piston** (https://github.com/engineer-man/piston) compiles and runs the code in a sandbox.
  It has no published port and no internet access for the programs it runs.
  The public Piston API is no longer free for general use, so it is self-hosted here.
- **gateway** (`server.mjs`, no dependencies) is the only public service. It accepts
  `POST /run` with `{language, code}` for `php`, `java` and `cpp`, and enforces:
  allowed languages only, code up to 20,000 characters, 20 runs per minute per client,
  at most 3 programs at once, 3 s run time, 10 s compile time, limited memory,
  limited output, and the allowed website origin only (CORS).
  `GET /health` tells the website which languages work.

## If it shares a server with your other projects

A separate server is safest, but if you have none, this setup is a reasonable compromise:

1. **Back up first.** Take a snapshot of the server (your host's panel) and a backup of your databases.
   If anything ever goes wrong, you can go back.
2. **Keep the limits in `docker-compose.yml`.** They cap the runner at 2 GB of memory, 2 CPUs, a small RAM
   area for running programs, and rotating logs. A busy or abusive visitor can slow the runner down,
   but not the rest of your server. Lower them with `RUNNER_MEM` and `RUNNER_CPUS` if your server is small.
3. **Do not connect it to your other containers.** Leave Coolify's "predefined network" option off for this
   resource, and never mount the Docker socket into it (the compose file does not).
4. **Keep the server updated** (`apt update && apt upgrade`, and reboot when the kernel changes).
5. **Watch it.** If the server gets slow, `docker stats` shows which container is busy. You can stop the
   runner at any time; the website keeps working and just shows "coming soon" for PHP, Java and C++.
6. Leave about 3 GB of free disk for the installed languages.

What this does **not** remove: a rare break-out from Piston's sandbox would reach the host. If the server holds
customer data, payments or anything you cannot afford to lose, use a separate server instead.

## Security: read this first

Piston needs `privileged: true`. Anyone who finds a way out of its sandbox could reach the
machine it runs on. So:

1. Run the runner on its **own small server** that holds nothing else, if you can.
2. Do not put it next to databases, other projects or secrets.
3. Keep Piston unpublished (the compose file does this). Only the gateway gets a domain.
4. Keep the host updated, and keep the rate limits.

Host requirement: Linux with cgroup v2. Check with `stat -fc %T /sys/fs/cgroup/`
(it must print `cgroup2fs`).

## Deploy with Coolify

1. DNS: add an A record `run` (for example `run.labupgrade.ai`) pointing to the runner server. Use DNS only.
2. Coolify: New Resource, Public Repository, this repository, build pack **Docker Compose**,
   base directory `/runner`, compose file `docker-compose.yml`.
3. For the `gateway` service set the domain `https://run.labupgrade.ai:8080`.
   If your site is on another address, change `ALLOWED_ORIGINS` in the compose file.
4. Deploy.
5. Install the languages (a few minutes, once). Open a terminal in the `gateway` container and run:

       node install-runtimes.mjs

6. Open `https://run.labupgrade.ai/health`. You should see `{"ok":true,"languages":["php","java","cpp"]}`.
7. Reload the Beatscript website. The PHP, Java and C++ tabs now say "on server" instead of "coming soon".

## Settings (environment variables on the gateway)

    PISTON_URL       default http://piston:2000
    ALLOWED_ORIGINS  comma-separated website origins, default https://beatscript.labupgrade.ai
    RATE_PER_MIN     runs per minute per client, default 20
    MAX_PARALLEL     programs running at once, default 3
    TRUST_PROXY      1 when behind Coolify/Traefik (uses the address the proxy added), 0 otherwise

## Check that it works

Open `https://beatscript.labupgrade.ai/#/status` and press **Check everything**. The page checks, in order:

1. the runner answers (DNS, HTTPS, CORS and the site's security policy are fine),
2. Piston is running behind it,
3. PHP, Java and C++ are installed,
4. a small test program really runs in each language.

Where it stops, it tells you what to look at. When all four pass, the PHP, Java and C++ tabs on the
website switch from "coming soon" to "on server" by themselves.

## Troubleshooting

- *"The site cannot reach the runner"*: check the DNS record `run`, that the `gateway` service is running
  in Coolify, and that `https://run.<your domain>/health` opens in a browser. If it opens there but not from
  the site, the site's Content-Security-Policy may not allow connections to that address (`connect-src`),
  or `ALLOWED_ORIGINS` does not match the site's address exactly.
- *"Cannot find Piston"*: look at the `piston` service log. Piston needs a host with cgroup v2.
- *"Missing: ..."*: run `node install-runtimes.mjs` in the gateway container. Each language can take
  30 to 90 seconds to install; Java is the slowest. Then press the check again (the health answer is cached for 10 seconds).
- *A program times out*: the limits are 3 s to run and 10 s to compile. The first Java run is the slowest.

If your runner lives on another address, change `runnerUrl` in `js/config.js`.

## Local test without Docker

`server.mjs` has no dependencies: `PISTON_URL=http://localhost:2000 node server.mjs`.

The settings used in `docker-compose.yml` (`PISTON_DISABLE_NETWORKING`, `PISTON_RUN_TIMEOUT`, `PISTON_COMPILE_TIMEOUT`) are documented in Piston's configuration page; the other `PISTON_*` limits there are optional extra safety.
