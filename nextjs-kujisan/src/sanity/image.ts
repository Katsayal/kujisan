import { createImageUrlBuilder } from '@sanity/image-url' 
import { client } from './client'

// Initialize the builder
const builder = createImageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}