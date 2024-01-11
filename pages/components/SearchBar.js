import React from "react";
import Image from 'next/image'
import { InstantSearch, Hits, SearchBox } from "react-instantsearch";
import TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter";

function Hit({ hit }) {
    return (
        <Image src={hit.images_url} alt={hit.id} width={200} height={200}/>
    );
  }

const SearchBar = () => {
    const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
    server: {
        apiKey: process.env.NEXT_PUBLIC_TYPESENSE_API_SEARCH_ONLY,
        nodes: [
        {
            host: process.env.NEXT_PUBLIC_TYPESENSE_HOST,
            port: "443",
            protocol: "https",
        },
        ],
        cacheSearchResultsForSeconds: 2 * 60, // Cache search results from server. Defaults to 2 minutes. Set to 0 to disable caching.
    },
    // The following parameters are directly passed to Typesense's search API endpoint.
    //  So you can pass any parameters supported by the search endpoint below.
    //  query_by is required.
    additionalSearchParameters: {
        query_by: "images_tag",
    },
    });
    const searchClient = typesenseInstantsearchAdapter.searchClient;
    
    return (
        <InstantSearch indexName="images" searchClient={searchClient} future={{ preserveSharedStateOnUnmount: true }}>
            <SearchBox />
            <Hits hitComponent={Hit} />
        </InstantSearch>
    );
}

export default SearchBar;