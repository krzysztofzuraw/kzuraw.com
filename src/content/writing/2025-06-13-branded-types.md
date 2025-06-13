---
title: "Branded Types in TypeScript: techniques"
description: Guide to branded types in TypeScript, covering techniques to enhance type safety and prevent subtle bugs.
pubDate: 2025-06-13T13:25:37Z
slug: branded-types-typescript-techniques
source:
  url: https://dev.to/saleor/branded-types-in-typescript-techniques-340f
  title: "Branded Types in TypeScript: techniques"
---

In this post, I’ll walk you through several ways to implement branded types in TypeScript. If you’re new to the concept, check out [this intro to branded types](https://egghead.io/blog/using-branded-types-in-typescript) before diving in.

Branded types let you create more specific types from primitives like `string` or `number`. This helps TypeScript catch bugs where you might accidentally mix up values that are technically the same primitive type but represent different concepts (e.g., `UserId` vs. `string`).

## 1. Using a Type Wrapper

```tsx
type UserId = string & { __brand: "UserId" };

const createUserId = (raw: string): UserId => {
  // Add validation logic here if needed
  return raw as UserId;
};

const userId = createUserId("user_id_42");

function getUser(id: UserId) {
  /* ... */
}

getUser(userId); // ✅ Works
getUser("user_id_42"); // ❌ Type error
```

This pattern is lightweight and doesn’t require any extra dependencies. You define a branded type and enforce its usage via a factory function (`createUserId`). This ensures only properly branded values are passed around your codebase.

**Pros:**

- Zero dependencies
- Simple to implement

**Cons:**

- No runtime validation unless you add it yourself
- The `__brand` property is only a TypeScript construct—it doesn’t exist at runtime

## 2. Using JavaScript Classes / Objects

```tsx
class UserId {
  constructor(private _id: string) {}

  get id() {
    return this._id;
  }
}

const userId = new UserId("user_id_42");

function getUser(id: UserId) {
  /* ... */
}

getUser(userId); // ✅ Works
getUser("user_id_42"); // ❌ Type error
```

If you want to encapsulate logic (like validation, formatting, or transformation), classes are a good fit. For simple cases, though, this approach can be a bit verbose.

**Pros:**

- Can add methods, validation, and encapsulate logic
- Runtime type information

**Cons:**

- More boilerplate
- Not always necessary for simple cases
- Hard to compare classes - instead of comparing `UserId` you need to compare its internal `id` property

## 3. Using Zod’s `brand()` Method

```tsx
import { z } from "zod";

const userIdSchema = z.string().startsWith("user_id").brand("UserId");

export const createUserId = (raw: string) => userIdSchema.parse(raw);

export type UserId = z.infer<typeof userIdSchema>;

function getUser(id: UserId) {
  /* ... */
}

const userId = createUserId("user_id_42");
getUser(userId); // ✅ Works
getUser("user_id_42"); // ❌ Type error
```

If you’re already using [Zod](https://zod.dev/), its [**`.**brand()`](https://zod.dev/api#branded-types) method gives you branded types with built-in validation. This is especially handy for APIs or form inputs.

**Pros:**

- Built-in validation
- Clean integration with Zod schemas
- Type-safe and runtime-safe

**Cons:**

- Requires Zod as a dependency

## Summary

- **Type wrapper**: Great for lightweight use cases, no dependencies.
- **Class-based**: Useful when you need encapsulation or extra logic.
- **Zod brand**: Perfect if you already use Zod and want validation + branding.

Branded types are a powerful way to make your TypeScript code safer and more expressive. Pick the approach that fits your project and team best! We in Saleor use both [Zod brand](https://github.com/search?q=repo%3Asaleor%2Fapps+.brand+path%3A%2F%5Eapps%5C%2Fstripe%5C%2Fsrc%5C%2F%2F&type=code) and [classes](https://github.com/search?q=repo%3Asaleor%2Fapps+class+path%3A%2F%5Eapps%5C%2Fstripe%5C%2Fsrc%5C%2F%2F&type=code).
