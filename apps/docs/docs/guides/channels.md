---
title: Channels & Interoperability
sidebar_position: 6
description: How IPC channel names are generated and how to interoperate with manual IPC or other tools.
---

# Channels & Interoperability

Electron IPC Bridge abstracts away the underlying [Electron IPC](https://www.electronjs.org/docs/latest/api/ipc-main) channel names, but understanding how they are generated is useful for debugging, auditing, or manual interoperability.

## Channel Naming Convention

Channels are generated using a consistent pattern:

`[namespace].[method_name]`

Where:

- `namespace`: The controller's namespace. E.g., `users` for `UsersController` (or your custom namespace)
- `method_name`: The method name, converted to **snake_case**.

### Snake Case Conversion

Method names are automatically converted from `camelCase` to `snake_case` to follow common IPC conventions.

**Examples:**

| Class Method        | Generated Channel           |
| :------------------ | :-------------------------- |
| `getUser`           | `users.get_user`            |
| `createUserProfile` | `users.create_user_profile` |
| `updateID`          | `users.update_id`           |
