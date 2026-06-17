# Milimili Observability

Milimili uses three layers for quick full-stack monitoring:

- Sentry: frontend/backend errors, browser replay, and application performance traces.
- Grafana Alloy + Grafana Cloud: OTLP traces/logs/metrics pipeline and dashboards.
- Uptime Kuma: public uptime and health checks for the website and API.

## Required Accounts And Secrets

### Sentry

Create two Sentry projects:

- `milimili-web` for `apps/web`
- `milimili-server` for `apps/server`

Values to copy:

- `NEXT_PUBLIC_SENTRY_DSN`: browser DSN for the web project.
- `SENTRY_DSN`: server DSN for backend and Next.js server runtime.
- `SENTRY_ORG`: Sentry org slug.
- `SENTRY_PROJECT`: Sentry project slug, used for source map uploads.
- `SENTRY_AUTH_TOKEN`: Sentry auth token with release/source-map upload permissions.
- `SENTRY_UPLOAD_SOURCEMAPS=true`: enable source map uploads in CI/deployment builds.

Put runtime values in production environment files or deployment secrets. Do not commit real DSNs or tokens.

### Grafana Cloud

Create or open a Grafana Cloud stack, then copy:

- `GRAFANA_CLOUD_OTLP_ENDPOINT`
- `GRAFANA_CLOUD_INSTANCE_ID`
- `GRAFANA_CLOUD_API_TOKEN`

Use `observability/.env.observability.example` as the template for local Alloy.

### Uptime Kuma

Start the local monitor:

```bash
cp observability/.env.observability.example observability/.env.observability
docker compose -f observability/docker-compose.yml up -d uptime-kuma
```

Open `http://127.0.0.1:3002` and create the first admin account there.

Recommended monitors:

- Website: `https://www.mtobdvlb.icu`
- API liveness: `https://www.mtobdvlb.icu/api/v1/healthz`
- API readiness: `https://www.mtobdvlb.icu/api/v1/readyz`

## Local OTLP Pipeline

After filling Grafana Cloud values:

```bash
OBSERVABILITY_ENV_FILE=.env.observability docker compose -f observability/docker-compose.yml up -d alloy
```

Point the server at Alloy:

```bash
OTEL_ENABLED=true
OTEL_EXPORTER_OTLP_TRACES_ENDPOINT=http://127.0.0.1:4318/v1/traces
OTEL_SERVICE_NAME=milimili-server
```

## Production Environment Variables

Backend:

- `SENTRY_DSN`
- `SENTRY_ENVIRONMENT=production`
- `SENTRY_TRACES_SAMPLE_RATE=0.1`
- `OTEL_ENABLED=true`
- `OTEL_SERVICE_NAME=milimili-server`
- `OTEL_EXPORTER_OTLP_TRACES_ENDPOINT=http://127.0.0.1:4318/v1/traces`
- `LOG_LEVEL=info`

Frontend:

- `NEXT_PUBLIC_SENTRY_DSN`
- `NEXT_PUBLIC_SENTRY_ENVIRONMENT=production`
- `NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE=0.1`
- `NEXT_PUBLIC_SENTRY_REPLAY_SAMPLE_RATE=0.01`
- `SENTRY_AUTH_TOKEN`
- `SENTRY_UPLOAD_SOURCEMAPS=true`
- `SENTRY_ORG`
- `SENTRY_PROJECT`

Run Alloy on the production server if you want traces to reach Grafana Cloud from the backend.
