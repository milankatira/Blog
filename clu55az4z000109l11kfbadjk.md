**Handling authentication is a complicated yet crucial task. Recognizing the importance of a robust and secure authentication system,** [**Lucia**](https://lucia-auth.com/) **be an excellent solution for your next project. As a lightweight auth library specifically designed for TypeScript, Lucia abstracts the intricacies of managing users and sessions, making the developer’s job significantly easier.**

1. **Ease of Use:** With Lucia's lightweight design and TypeScript support, developers can easily integrate it into their projects and start managing authentication without dealing with intricate details.
    
2. **Security:** Authentication is a critical aspect of application security. Lucia's focus on security features can help developers implement best practices without needing to reinvent the wheel.
    
3. **Scalability:** As projects grow, managing authentication can become increasingly complex. Lucia's abstraction can help keep the authentication system organized and scalable as the project evolves.
    
4. **Community Support:** Being designed for TypeScript, Lucia likely has a supportive community of developers who can contribute to its improvement and provide assistance when needed.
    
5. **Customization:** While abstracting away complexities, Lucia likely still offers customization options, allowing developers to tailor the authentication system to their project's specific requirements.
    

### **Setting up Lucia with Next.js**

To set up Lucia with Next.js, follow these steps

1. **Create a new Next.js app**:
    
    Run the following command in your terminal to create a new Next.js app
    

```bash
npx create-next-app@latest
```

2. **Install Lucia**:
    
    Navigate to your project directory and install Lucia and adapter using yarn:
    

```bash
yarn add lucia   
```

```bash
yarn add @lucia-auth/adapter-drizzle drizzle-orm argon2
```

### To create a schema for PostgreSQL using TypeScript and a Drizzle ORM

```javascript
// lib/database/schema.ts
import { pgTable, text, timestamp } from "drizzle-orm/pg-core"

export const userTable = pgTable("user", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  hashedPassword: text("hashed_password"),
})

export const sessionTable = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
})
```

```javascript
/// lib/database/index.ts
import { Pool } from "pg"
import { NodePgDatabase, drizzle } from "drizzle-orm/node-postgres"
import * as schema from "./schema"

const pool = new Pool({
  connectionString: process.env.DB_URL!,
})

const db = drizzle(pool, { schema }) as NodePgDatabase<typeof schema>

export default db
```

### Adapter for Lucia

```javascript
// lib/lucia/adapter.ts
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle"
import db from "@/lib/database"
import { sessionTable, userTable } from "@/lib/database/schema"

const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable)

export default adapter
```

### Lucia instance setup

```javascript
// lib/lucia/index.ts
import { Lucia } from "lucia"
import adapter from "./adapter"
import { cookies } from "next/headers"
import { cache } from "react"

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === "production",
    },
  },
})

export const validateRequest = cache(async () => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null

  if (!sessionId)
    return {
      user: null,
      session: null,
    }

  const { user, session } = await lucia.validateSession(sessionId)
  try {
    if (session?.fresh) {
      const sessionCookie = lucia.createSessionCookie(session.id)
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      )
    }
    if (!session) {
      const sessionCookie = lucia.createBlankSessionCookie()
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      )
    }
  } catch {
    // Next.js throws error when attempting to set cookies when rendering page
  }
  return {
    user,
    session,
  }
})

// IMPORTANT!
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia
  }
}
```

we instantiate Lucia with an adapter and configuration settings. Additionally, we define a function, validateRequest, responsible for validating requests and retrieving user and session data. With Lucia set up, we're equipped to implement `login`, `logout`, `signup`, and `protected routes` seamlessly in our Next.js application

### setting up server action for authentication

```javascript
// actions/auth.actions.ts
"use server"
import { z } from "zod"
import { SignInSchema, SignUpSchema } from "../types"
import { generateId } from "lucia"
import db from "@/lib/database"
import { userTable } from "@/lib/database/schema"
import { lucia, validateRequest } from "@/lib/lucia"
import { cookies } from "next/headers"
import { eq } from "drizzle-orm"
import * as argon2 from "argon2"

export const signUp = async (values: z.infer<typeof SignUpSchema>) => {
  const hashedPassword = await argon2.hash(values.password)
  const userId = generateId(15)

  try {
    await db
      .insert(userTable)
      .values({
        id: userId,
        username: values.username,
        hashedPassword,
      })
      .returning({
        id: userTable.id,
        username: userTable.username,
      })

    const session = await lucia.createSession(userId, {
      expiresIn: 60 * 60 * 24 * 30,
    })

    const sessionCookie = lucia.createSessionCookie(session.id)

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    )

    return {
      success: true,
      data: {
        userId,
      },
    }
  } catch (error: any) {
    return {
      error: error?.message,
    }
  }
}

export const signIn = async (values: z.infer<typeof SignInSchema>) => {
  try {
    SignInSchema.parse(values)
  } catch (error: any) {
    return {
      error: error.message,
    }
  }

  const existingUser = await db.query.userTable.findFirst({
    where: (table) => eq(table.username, values.username),
  })

  if (!existingUser) {
    return {
      error: "User not found",
    }
  }

  if (!existingUser.hashedPassword) {
    return {
      error: "User not found",
    }
  }

  const isValidPassword = await argon2.verify(
    existingUser.hashedPassword,
    values.password
  )

  if (!isValidPassword) {
    return {
      error: "Incorrect username or password",
    }
  }

  const session = await lucia.createSession(existingUser.id, {
    expiresIn: 60 * 60 * 24 * 30,
  })

  const sessionCookie = lucia.createSessionCookie(session.id)

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  )

  return {
    success: "Logged in successfully",
  }
}

export const signOut = async () => {
  try {
    const { session } = await validateRequest()

    if (!session) {
      return {
        error: "Unauthorized",
      }
    }

    await lucia.invalidateSession(session.id)

    const sessionCookie = lucia.createBlankSessionCookie()

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    )
  } catch (error: any) {
    return {
      error: error?.message,
    }
  }
}
```

### Protected routes

we are protecting the routes using the Lucia validateRequest function.

```javascript
// app/page.tsx
import { Button } from "@/components/ui/button"
import { validateRequest } from "@/lib/lucia"
import { redirect } from "next/navigation"
import { signOut } from "@/actions/auth.actions"

export default async function Home() {
  const { user } = await validateRequest()

  if (!user) {
    return redirect("/sign-in")
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <p>Protected route</p>
      <p>{JSON.stringify(user)}</p>
      <form action={signOut}>
        <Button type="submit">Sign out</Button>
      </form>
    </main>
  )
}
```
