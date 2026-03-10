import CatalogueClient from "@/components/CatalogueClient"
import { getCatalogueItems } from "@/lib/catalogue"

export const metadata = {
  title: "Catalogue | PrepSight",
}

export default function CataloguePage() {
  return <CatalogueClient items={getCatalogueItems()} />
}
