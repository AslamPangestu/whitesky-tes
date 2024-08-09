"use client";
import { useEffect, useMemo, useReducer } from "react";
import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import { toast } from "react-hot-toast";

import Loader from "src/components/Loader";
import useOnScreen from "src/hooks/useOnScreen";
import { Get } from "src/utils/service";

import type { GetRequest, Response } from "src/utils/service";
import type { NewsType } from "src/models/NewsModel";

import styles from "../index.module.css";

interface Props {
  baseData: Array<NewsType>;
  baseHaveMore: boolean;
}

const DataItem = (props: NewsType) => (
  <article>
    <div>
      <Image
        src={props.image}
        alt={`Img ${props.title}`}
        width={200}
        height={150}
      />
    </div>
    <div>
      <h2>{props.title}</h2>
      <div>
        <span>{props.author}</span>
        <span>, {dayjs(props.created_at).format("DD MMMM YYYY HH:mm")}</span>
      </div>
      <p>{props.description}</p>
    </div>
  </article>
);

interface InitialState {
  data: Array<NewsType>;
  page: number;
  more: boolean;
  loading: boolean;
}

interface ActionState {
  type: "setData" | "loading";
  payload?: object;
}

const initialState: InitialState = {
  data: [],
  more: false,
  page: 1,
  loading: false,
};

const reducer = (state: InitialState, action: ActionState) => {
  switch (action.type) {
    case "setData":
      return {
        ...state,
        ...action.payload,
      };
    case "loading":
      return {
        ...state,
        loading: true,
      };
    default:
      throw new Error();
  }
};

// TODO: Infinite Scrolling
const DataSection = ({ baseData, baseHaveMore }: Props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { measureRef, isIntersecting, observer } = useOnScreen();

  const realData = useMemo(() => {
    if (!state.data.length) {
      return baseData;
    }
    return [...baseData, ...state.data];
  }, [state.data, baseData]);

  useEffect(() => {
    if (!baseHaveMore) {
      observer?.disconnect();
    }
  }, [baseHaveMore]);

  useEffect(() => {
    if (
      isIntersecting &&
      ((state.data.length && state.more) || (baseData.length && baseHaveMore))
    ) {
      const _onFetch = async () => {
        dispatch({ type: "loading" });
        const request: GetRequest = {
          query: {
            page: state.page + 1,
          },
        };
        const response: Response = await Get(request)("/news");
        if (!response.status) {
          toast.error("Failed get data news");
          return;
        }
        const more = response.data.have_more;
        if (!more) {
          observer?.disconnect();
        }
        // const currentScroll = document.documentElement.scrollTop;
        // scrollTo(currentScroll);

        dispatch({
          type: "setData",
          payload: {
            data: response.data.data,
            more,
            page: state.page + 1,
            loading: false,
          },
        });
      };

      _onFetch();
    }
  }, [isIntersecting, state.more]);

  return (
    <>
      <section className={styles.newsContainer}>
        {realData.map((item: NewsType) => (
          <Link key={item.id} href={`/${item.slug}`}>
            <DataItem {...item} />
          </Link>
        ))}
      </section>
      <div ref={measureRef} />
      {isIntersecting && <Loader />}
    </>
  );
};

export default DataSection;
