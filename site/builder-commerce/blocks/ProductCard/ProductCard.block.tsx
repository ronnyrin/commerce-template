import React from 'react';

import ProductCard from '@components/product/ProductCard'
import commerce from "@lib/api/commerce";

const ProductCardBlock = ({
                            productSlug,
                            name,
                            config,
                            preview,
                            product,
                            size,
                          }: {
  productSlug: string;
  size: number;
  name: string;
  config: any;
  preview: boolean;
  product: any;
}) => {
  const [productData, setProductData] = React.useState<any>(product);
  React.useEffect(() => {
    if (productSlug && productSlug !== productData?.slug) {
      commerce.getProduct({
        variables: {slug: productSlug},
        config,
        preview,
      }).then(data => {
        setProductData(data.product);
      })
    }
  }, [config, preview, product, productData?.slug, productSlug])

  return (
    <div style={{ display: 'inline-block', width: `${size}px`, height: `${size}px` }}>
      {
        productData ?
        <ProductCard product={productData} name={name} variant="simple"/> :
        <>Loading...</>
      }
    </div>
  )
}

export default ProductCardBlock;
