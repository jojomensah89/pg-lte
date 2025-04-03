/* eslint-disable @typescript-eslint/no-unused-vars */
import { PGlite } from '@electric-sql/pglite'
import { worker } from '@electric-sql/pglite/worker'

worker({
    async init(options) {
        const meta = options.meta
        // Do something with additional metadata.
        // or even run your own code in the leader along side the PGlite
        return new PGlite({
            dataDir: options.dataDir,
        })
    },
})