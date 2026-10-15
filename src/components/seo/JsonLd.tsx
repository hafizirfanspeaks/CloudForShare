import { Helmet } from 'react-helmet-async'
import type { Thing, WithContext } from 'schema-dts'

interface JsonLdProps {
  data: WithContext<Thing> | WithContext<Thing>[]
}

export default function JsonLd({ data }: JsonLdProps) {
  const schemas = Array.isArray(data) ? data : [data]

  return (
    <Helmet>
      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  )
}