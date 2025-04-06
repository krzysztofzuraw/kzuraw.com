---
title: Custom metrics using @vercel/otel
description: Learn how to properly implement custom metrics in Next.js applications using @vercel/otel and ensure they are correctly flushed in Route Handlers
pubDate: 2025-04-06T10:07:53Z
slug: vercel-otel-custom-metrics
---

This guide explains how to properly implement custom metrics in Next.js applications using [@vercel/otel](https://www.npmjs.com/package/@vercel/otel). Before proceeding, you should be familiar with:

- [OpenTelemetry (OTEL)](https://opentelemetry.io) fundamentals
- [OTEL metrics](https://opentelemetry.io/docs/specs/otel/metrics/)
- Basic usage of `@vercel/otel` in Next.js applications

## Problem

When implementing custom metrics with `@vercel/otel` in Next.js [Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers), you might notice that metrics aren't being properly reported to your OTEL collector. This happens because Route Handlers complete their execution before the metrics have a chance to be flushed to the collector.

## Solution

To ensure all metrics are properly collected, we need to:

1. Create a custom `MetricProvider`
2. Register it with OTEL
3. Manually flush metrics at the end of Route Handler execution

Here's the step-by-step implementation:

First, create a custom metric provider:

```ts
// meter-provider.ts
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";

import { Resource } from "@opentelemetry/resources";
import { MeterProvider } from "@opentelemetry/sdk-metrics";
import { createMetricsReader } from "@saleor/apps-otel/src/metrics-reader-factory";

export const meterProvider = new MeterProvider({
  readers: [
    new PeriodicExportingMetricReader({
      exporter: new OTLPMetricExporter(),
    }),
  ],
  // Create new resource as `@vercel/otel` creates its own under the hood and doesn't expose it
  // https://github.com/vercel/otel/issues/153
  resource: new Resource(),
});
```

Next, set up the OTEL instrumentation:

```ts
// src/instrumentation.ts
import { metrics } from "@opentelemetry/api";
import { registerOTel } from "@vercel/otel";

export const register = () => {
  registerOTel();
  metrics.setGlobalMeterProvider(meterProvider);
};
```

Finally, implement the manual flush in your Route Handlers:

```ts
// app/api/route.ts
import { headers } from "next/headers";

import { meterProvider } from "./meter-provider"; // previously created file

export async function GET(request: Request) {
  after(async () => {
    await meterProvider.forceFlush();
  });

  return new Response("Hello from Route Handler", {
    status: 200,
  });
}
```

With this setup, your custom metrics will be properly flushed and collected before the Route Handler completes its execution. This ensures no data loss and accurate metric reporting in your observability pipeline.
