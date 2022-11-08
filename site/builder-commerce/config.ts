if (!process.env.BUILDER_PUBLIC_KEY) {
  throw new Error('Missing env varialbe BUILDER_PUBLIC_KEY')
}

export default {
  apiKey: process.env.BUILDER_PUBLIC_KEY,
  collectionHandleName: process.env.BUILDER_PLUGIN_COLLECTION_HANDLE,
  productHandleName: process.env.BUILDER_PLUGIN_PRODUCT_HANDLE,
  isDemo: Boolean(process.env.IS_DEMO),
}
