# PROBA deployment

The static production build is served from `/opt/proba-miniapp/current` by the dedicated `probaclinical.ru` Caddy site block.

Neighbouring services remain unchanged:

- `claude.applaza.ru` → `127.0.0.1:3001`
- `text2pdf.ru` → `127.0.0.1:8177`

Before each release, build locally with `npm run build`, upload `dist/client` into a new timestamped directory under `/opt/proba-miniapp/releases`, then atomically update the `current` symlink. Validate the complete Caddy configuration before reloading it.

The complete Russian operations guide, including DNS, Telegram, verification and rollback, is maintained in [`docs/OPERATIONS.md`](../docs/OPERATIONS.md).
