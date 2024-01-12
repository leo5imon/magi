import React, { useState } from "react";
import Image from "next/image";
import {
  InstantSearch,
  Hits,
  SearchBox,
  Configure,
  useHits,
} from "react-instantsearch";
import TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter";
import styles from "./SearchBar.module.css";

const searchBoxClassNames = {
  root: styles.searchBoxRoot,
  form: styles.searchBoxForm,
  input: styles.searchBoxInput,
  submit: styles.searchBoxSubmit,
  reset: styles.searchBoxReset,
  loadingIndicator: styles.searchBoxLoadingIndicator, // The loading indicator element
  submitIcon: styles.searchBoxSubmitIcon, // The submit icon
  resetIcon: styles.searchBoxResetIcon, // The reset icon
  loadingIcon: styles.searchBoxLoadingIcon, // The loading icon
};

function CustomHits(props) {
  const { hits } = useHits(props);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  // Close the full-width view when the background is clicked
  const handleClose = () => {
    setSelectedImage(null);
  };

  return (
    <div>
      {selectedImage && (
        <div
          onClick={handleClose}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.8)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            src={selectedImage}
            alt="Selected"
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
      )}
      <div className={styles.hitsContainer}>
        {hits.map((hit, index) => (
          <div
            key={hit.id}
            className={styles.hitItem}
            onClick={() => handleClick(hit.images_url)}
          >
            <Image
              src={hit.images_url}
              alt={hit.id}
              width={200}
              height={200}
              className={styles.hitImage}
              priority
            />
          </div>
        ))}
      </div>
    </div>
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
      cacheSearchResultsForSeconds: 2 * 60,
    },

    additionalSearchParameters: {
      query_by: "images_tag",
    },
  });
  const searchClient = typesenseInstantsearchAdapter.searchClient;

  return (
    <InstantSearch
      indexName="images"
      searchClient={searchClient}
      future={{ preserveSharedStateOnUnmount: true }}
    >
      <Configure hitsPerPage={40} />
      <SearchBox
        classNames={searchBoxClassNames}
        autoFocus
        placeholder="Search for images..."
      />
      <CustomHits />
    </InstantSearch>
  );
};

export default SearchBar;