import React from "react";
import { getSearchStaticProps } from '@lib/search-props'
import type { GetStaticPropsContext } from 'next'
import Search from '@builder-commerce/components/search'

export async function getStaticProps(context: GetStaticPropsContext) {
  return getSearchStaticProps(context)
}

export default Search
