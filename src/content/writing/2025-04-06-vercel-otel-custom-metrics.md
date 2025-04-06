---
title: Custom metrics using @vercel/otel
description:
pubDate: 2025-04-06T10:07:53Z
slug: slugify-wip
---

Before I dive into how to setup custom metrics using [@vercel/otel](https://www.npmjs.com/package/@vercel/otel) I assume that you know what OTEL is and what OTEL metric is. It will be awesome if you know how `@vercel/otel` works and how to use in your Next.js app as well.

## Problem

Vercel OTEL pkg is not automatically flushing custom metrics when your API route ended execution. It means that you will end up with incomplete data in your OTEL collector.

## Solution

To fix that you can create our own `MetricProvider` and flush it on the end of API route execution.

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
  // Create new resource as `@vercel/otel` creates its own under the hood and don't expose it
  // https://github.com/vercel/otel/issues/153
  resource: new Resource(),
});
```

Instruct OTEL to use your newly created provider:

```ts
// src/instrumentation.ts
import { metrics } from "@opentelemetry/api";
import { registerOTel } from "@vercel/otel";

export const register = () => {
  registerOTel();
  metrics.setGlobalMeterProvider(meterProvider);
};
```

Manually flush metric in your Route Handlers using after function

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
