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

## Local test without Docker

`server.mjs` has no dependencies: `PISTON_URL=http://localhost:2000 node server.mjs`.
