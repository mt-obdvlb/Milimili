import * as Sentry from '@sentry/node'
import { NodeSDK } from '@opentelemetry/sdk-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions'
import { env } from '@/config'
import { logger } from '@/utils/logger.util'

if (env.SENTRY_DSN) {
  Sentry.init({
    dsn: env.SENTRY_DSN,
    environment: env.SENTRY_ENVIRONMENT || env.NODE_ENV,
    tracesSampleRate: env.SENTRY_TRACES_SAMPLE_RATE,
  })
}

let otelSdk: NodeSDK | undefined

if (env.OTEL_ENABLED && env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT) {
  otelSdk = new NodeSDK({
    resource: resourceFromAttributes({
      [ATTR_SERVICE_NAME]: env.OTEL_SERVICE_NAME,
    }),
    traceExporter: new OTLPTraceExporter({
      url: env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT,
    }),
    instrumentations: [getNodeAutoInstrumentations()],
  })

  otelSdk.start()
  logger.info({ endpoint: env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT }, 'OpenTelemetry started')
}

const shutdownTelemetry = async () => {
  if (!otelSdk) return
  await otelSdk.shutdown()
  logger.info('OpenTelemetry shut down')
}

process.once('SIGTERM', () => {
  shutdownTelemetry().catch((error) => logger.error({ error }, 'OpenTelemetry shutdown failed'))
})

process.once('SIGINT', () => {
  shutdownTelemetry().catch((error) => logger.error({ error }, 'OpenTelemetry shutdown failed'))
})
