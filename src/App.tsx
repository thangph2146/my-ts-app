import React, { useEffect, useRef, useState } from "react";
import Title from "antd/es/typography/Title";
import Search from "antd/es/input/Search";
import { Image } from "antd";
import "./style.scss";
import { DataType, ProductType } from "./App.dto";
import { getAllProducts, searchProducts } from "./App.api";

function App() {
  const [data, setData] = useState<ProductType[] | undefined>([]);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [filtered, setFiltered] = useState(false);
  const elementRef = useRef(null);

  const fetchData = async () => {
    await getAllProducts(limit).then((res) => {
      const dataRes = res.data.products;
      if (dataRes?.length == 0) {
        setHasMore(false);
      } else {
        setData((prevData: any) => [...prevData, dataRes]);
        setLimit((prevLimit) => prevLimit + 20);
      }
      setData(dataRes);
    });
  };
  const searchData = async (e: string) => {
    setLoading(true);
    setFiltered(e ? true : false);
    setLimit(20);
    await searchProducts(search)
      .then((res) => {
        console.debug(res.data.products);
        setData(res.data.products);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const onInterSection = (entries: any) => {
    const firstEntry = entries[0];
    if (firstEntry.isIntersecting && hasMore) {
      fetchData();
    }
  };
  useEffect(() => {
    if (filtered) {
      return;
    }
    const observer = new IntersectionObserver(onInterSection);
    if (observer && elementRef.current) {
      observer.observe(elementRef.current);
    }
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [data, filtered]);

  const filterData = (search: string) => {
    setData(
      data?.filter((item) =>
        item.title
          ?.toLocaleLowerCase()
          .includes(search.toLocaleLowerCase().trim())
      )
    );
  };
  return (
    <div className="App">
      <Title>
        Coding Project: Infinite Scrolling and Searchable Product List
      </Title>

      <Search
        placeholder="input search text"
        enterButton="Search"
        size="large"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        onSearch={(e) => {
          searchData(e);
        }}
        loading={loading}
      />
      <div className="scrolling_board" style={{ marginTop: "30px" }}>
        {!loading &&
          data?.map((item: ProductType, index) => {
            return (
              <div key={index}>
                {item?.images && <Image width={200} src={item.thumbnail} />}
                <Title level={3}> Name: {item.title}</Title>
                <Title level={3}> Description: {item.description}</Title>
                <Title level={3}> Price: ${item.price}</Title>
                <Title level={3}> Stock: {item.stock}</Title>
                <Title level={3}> Brand: {item.brand}</Title>
                <Title level={3}> Category: {item.category}</Title>
                <Title level={3}> Rating: {item.rating}</Title>

                <hr style={{ marginBottom: "30px" }} />
              </div>
            );
          })}
        {hasMore && (
          <Title level={3} ref={elementRef}>
            Load more products
          </Title>
        )}
      </div>
    </div>
  );
}

export default App;
