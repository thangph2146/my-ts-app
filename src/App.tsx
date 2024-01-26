import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Title from "antd/es/typography/Title";
import Search from "antd/es/input/Search";
import { Image } from "antd";
import "./style.scss";

const api = axios.create();

export type ApiResultType<T> = {
  isSuccess: boolean;
  data: T;
  errorCode?: number;
  errors?: string[];
};
export type DataType = {
  limit?: number;
  products?: ProductType[];
  skip?: number;
  total?: number;
};
export type ProductType = {
  id?: number;
  title?: string;
  description?: string;
  price?: number;
  discountPercentage?: number;
  rating?: number;
  stock?: number;
  brand?: string;
  category?: string;
  thumbnail?: string;
  images?: string[];
};
function App() {
  const [data, setData] = useState<ProductType[] | undefined>([]);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [filtered, setFiltered] = useState(false);
  const elementRef = useRef(null);
  const getAllProducts = () => {
    return api.get<DataType>(`https://dummyjson.com/products?limit=${limit}`);
  };
  const fetchData = async () => {
    await getAllProducts().then((res) => {
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
    await api
      .get<DataType>(
        `https://dummyjson.com/products/search?q=${search
          .toLocaleLowerCase()
          .trim()}`
      )
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
                {item?.images && <Image width={200} src={item?.images[0]} />}
                <Title level={3}>{item.title}</Title>
                <Title level={3}>{item.price}</Title>
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