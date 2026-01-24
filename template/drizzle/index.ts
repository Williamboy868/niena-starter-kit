import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

    // Disable prefetch or prepared statements as it is not supported for "Transaction" pool mode //disable when using supabase transaction pool mode or AWS platform
    const client = postgres(process.env.DATABASE_URL!,/* { prepare: false }*/)
  export  const db = drizzle({ client });



