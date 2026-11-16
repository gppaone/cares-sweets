# Care's Sweet & Salty Treats: food truck website

A bright, mobile-friendly one-page site with a built-in admin editor.

- **Public site** (`/`): hero with cow mascots, rotating photo banner, menu board with three food photos beside it, an optional Joe's Dough to Go guest-baker section, locations and hours, about, contact form
- **Admin** (`/admin`): edit menu items and prices, upload photos (banner slides, menu photos, about photo), switch the Joe's Dough section on/off and edit its items, locations/events, weekly hours, site info (about text, phone, social links, announcement banner) and read contact-form messages
- **Stack**: SvelteKit 2 + Svelte 5, Tailwind CSS 4, PostgreSQL 17, Docker Compose
- **Reusable cows**: `src/lib/components/Cow.svelte` (also exported as plain SVGs in `static/cows/`)

The starting menu is copied from the printed menu board. Hours and the "usual spot" address are placeholders: change them in `/admin` after first launch.

## Photos and the Joe's Dough section

Everything is managed in `/admin`:

- **Photos tab**
  - *Banner slideshow*: wide photos shown under the top of the home page. One slide shows as a still image; two or more rotate every 6 seconds (pauses on hover, has arrows and dots, and doesn't auto-rotate for visitors who prefer reduced motion). Each slide can have an optional headline and smaller text. With no slides, the banner simply isn't shown.
  - *Menu photos*: three slots (top = donuts, middle = milkshakes, bottom = cookies, or whatever you caption them). They sit beside the menu on desktop and in a row above it on phones. Leave all three empty to hide the column.
  - *About photo*: shown next to the About text instead of the cow.
- **Joe's Dough tab**: a checkbox shows or hides the whole section on the site (and in the top navigation). It has its own name, intro text, availability note (e.g. "This weekend only"), photo and item list. Hidden sections keep their items, so you can switch it back on any time.

Uploads are converted to WebP, auto-rotated and resized (banner 2000 px wide, others 1000-1200 px), so phone photos upload fine as they are (15 MB max). They are stored in the `uploads` Docker volume (`/data/uploads` in the container).

## Project layout

```
src/
  lib/components/Cow.svelte      reusable cow mascot (poses: standing, sitting, head)
  lib/server/                    database, auth, rate limiting
  routes/(site)/                 public one-page site + contact form action
  routes/admin/                  login + editors (menu, locations, hours, settings, messages)
static/cows/                     standalone cow SVGs
Dockerfile, docker-compose.yml   web + postgres
```

---

## Deploy on Proxmox (LXC + Docker)

Tested against: Proxmox VE 9.x (Debian 13 "trixie") and Docker Engine from Docker's official apt repository. Proxmox's own guidance is that a VM is the more robust place for Docker; an LXC works well for a small homelab site like this, as long as the container has the right features enabled (below).

### 1. Create the LXC

1. On the Proxmox host, update the template list and download a Debian 13 template (or use the Datacenter UI: *local* storage, *CT Templates*, *Templates*):
   ```bash
   pveam update
   pveam available --section system | grep debian-13
   pveam download local <template-name-from-the-list>
   ```
2. Create the container (UI: *Create CT*). Suggested: **unprivileged**, 2 cores, 2 GB RAM, 1 GB swap, 8-10 GB disk, a static IP or a DHCP reservation.
3. Enable the features Docker needs. UI: *CT > Options > Features*, tick **Nesting** and **keyctl**. Or from the host shell:
   ```bash
   pct set <CTID> --features nesting=1,keyctl=1
   pct reboot <CTID>
   ```
4. Keep the host current (`apt update && apt full-upgrade` on the Proxmox host). If containers inside the LXC refuse to start with `permission denied` errors on a freshly installed PVE 9, update the host first: `pve-container` 6.0.3 or newer ships the AppArmor fix. Only if you are stuck on an older 9.x build, the forum workaround is to add `lxc.apparmor.raw: allow mqueue,` to `/etc/pve/lxc/<CTID>.conf` (don't add that line on PVE 8, it stops the container from starting).

### 2. Install Docker inside the LXC

Open a console in the container and run as root (from Docker's official Debian instructions):

```bash
apt update
apt install -y ca-certificates curl
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

tee /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/debian
Suites: $(. /etc/os-release && echo "$VERSION_CODENAME")
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF

apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
docker run --rm hello-world
```

### 3. Put the project on the server

From your computer (replace the IP):

```bash
scp -r cares-food-truck root@192.168.1.50:/opt/
```

(Or push it to a private Git repository and `git clone` it into `/opt/`.)

### 4. Configure and start

```bash
cd /opt/cares-food-truck
cp .env.example .env
nano .env
```

Set at least:

| Variable | What to put |
|---|---|
| `POSTGRES_PASSWORD` | letters and numbers only |
| `ADMIN_PASSWORD` | the password you will use at `/admin` |
| `SESSION_SECRET` | output of `openssl rand -hex 32` |
| `ORIGIN` | the exact URL people use, e.g. `http://192.168.1.50:3000` or `https://treats.example.com` (no trailing slash) |

Then:

```bash
docker compose up -d --build
docker compose logs -f web      # Ctrl+C to leave; look for "Listening on"
```

Open `http://<LXC-IP>:3000`, then `http://<LXC-IP>:3000/admin`. Tables and the starter menu are created automatically on first start.

### 5. Put it on the internet (optional)

Point a reverse proxy at `http://<LXC-IP>:3000` (Nginx Proxy Manager, Caddy, Traefik, or a Cloudflare Tunnel all work). When you do:

- raise the proxy's upload limit so photos can get through (Nginx and Nginx Proxy Manager default to 1 MB). In Nginx Proxy Manager add `client_max_body_size 20m;` under the proxy host's *Advanced* tab. For plain Nginx put it in the `server` block
- set `ORIGIN=https://your-domain` and `COOKIE_SECURE=true` in `.env`
- run `docker compose up -d` again to apply
- keep `/admin` behind HTTPS

### 6. Everyday operations

```bash
# update after changing code
docker compose up -d --build

# logs / restart / stop
docker compose logs -f web
docker compose restart web
docker compose down            # keeps data (the pgdata volume)

# backup the database
docker compose exec -T db pg_dump -U cares cares > backup-$(date +%F).sql

# restore a backup into an empty database
docker compose exec -T db psql -U cares cares < backup-2026-01-01.sql

# backup / restore uploaded photos
docker compose cp web:/data/uploads ./uploads-backup
docker compose cp ./uploads-backup/. web:/data/uploads
```

Also take regular Proxmox backups/snapshots of the container (*Datacenter > Backup*). Docker data lives in the `pgdata` and `uploads` volumes inside the LXC, so a container backup captures both. Back up the database and the photos together: the database refers to photo files by name.

Updating an existing install (for example after adding the photo features): copy the new files over, then run `docker compose up -d --build`. New tables and columns are added automatically and existing data is kept.

---

## Local development

```bash
docker run -d --name cares-db -e POSTGRES_USER=cares -e POSTGRES_PASSWORD=cares \
  -e POSTGRES_DB=cares -p 5432:5432 postgres:17-alpine

cp .env.example .env     # uncomment DATABASE_URL, set ADMIN_PASSWORD and SESSION_SECRET
npm install
npm run dev
```

Requires Node 22 or newer. Photos uploaded in dev mode are saved to `./uploads` (set `UPLOAD_DIR` in `.env` to change that).

## Customizing

- **Colors and fonts**: `src/app.css` (`@theme` block). Palette: `#cdb4db`, `#ffc8dd`, `#ffafcc`, `#bde0fe`, `#a2d2ff`. Text uses a dark brown ink color so it stays readable on the pastels.
- **Cows**: `<Cow pose="standing|sitting|head" holding="cookies|bowl|none" flip class="w-40" />`
- **About text, phone, email, social links**: `/admin/settings`

## Troubleshooting

- **"Cross-site POST form submissions are forbidden"**: `ORIGIN` in `.env` doesn't match the address in your browser (scheme, host and port must match exactly).
- **Admin login succeeds but sends you back to the login page**: you are on plain `http://` with `COOKIE_SECURE=true`. Set it to `false` for http, `true` only behind HTTPS.
- **`web` container keeps restarting**: run `docker compose logs web`. A wrong `POSTGRES_PASSWORD` after the first start is common: the database keeps the first password. Either restore the old one or reset with `docker compose down -v` (this deletes all data).
- **Photo upload fails or the page just reloads**: the file is over 15 MB, or a reverse proxy in front is limiting upload size (see step 5). Without a proxy, the app itself allows 20 MB (`BODY_SIZE_LIMIT` in `docker-compose.yml`).
- **Docker won't start inside the LXC**: confirm *Nesting* and *keyctl* are enabled and that the host is fully updated (step 1.4).

## Notes

- Contact-form messages are stored in the database and shown in `/admin/messages`; the site does not send email. Add an SMTP library (for example nodemailer) in `src/routes/(site)/+page.server.ts` if you want email alerts.
- Login attempts and contact submissions are rate limited in memory (reset when the container restarts).
