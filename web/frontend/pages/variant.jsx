import {
  Page,
  Layout,
  Filters,
  ResourceItem,
  ResourceList,
} from "@shopify/polaris";
import { useCallback, useEffect, useState } from "react";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";

export default function Variant() {
  const [items, setItems] = useState([]);
  const [queryValue, setQueryValue] = useState("");

  useAppQuery({
    url: "/api/products",
    reactQueryOptions: {
      onSuccess: (data) => {
        console.log(data);
      },
    },
  });

  const handleFiltersQueryChange = useCallback((value) => {
    setQueryValue(value);
  });

  const arr = [
    {
      id: "108",
      url: "#",
      name: "Mae Jemison",
      location: "Decatur, USA",
    },
    {
      id: "208",
      url: "#",
      name: "Ellen Ochoa",
      location: "Los Angeles, USA",
    },
    {
      id: "308",
      url: "#",
      name: "wells",
      location: "Decatur, USA",
    },
    {
      id: "408",
      url: "#",
      name: "bobo",
      location: "Los Angeles, USA",
    },
  ];

  const renderItem = (item) => {
    const { id, url, name, location } = item;
    return (
      <ResourceList.Item>
        <div>{name}</div>
      </ResourceList.Item>
    );
  };

  useEffect(() => {
    console.log(items);
    setItems(
      arr.filter((item) => {
        return item.name.toUpperCase().indexOf(queryValue.toUpperCase()) > -1;
      })
    );
    console.log(items);
  }, [queryValue]);

  const filterControl = (
    <Filters
      queryValue={queryValue}
      filters={[]}
      onQueryChange={setQueryValue}
      onQueryClear={() => setQueryValue("")}
      // onClearAll={() => setQueryValue('')}
    />
  );

  return (
    <Page fullWidth>
      <Layout>
        <Layout.Section>
          <ResourceList
            items={items}
            renderItem={renderItem}
            filterControl={filterControl}
          />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
