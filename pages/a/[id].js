import { useRouter } from 'next/router';
import fetch from 'isomorphic-unfetch';
import useSWR from 'swr';
import Link from 'next/link';
import Router from 'next/router'

const fetcher = url => fetch(url).then(r => r.json())

function Page(props) {
    return (
        <div>
          <button
            onClick={() => Router.push(`/a/${(parseInt(props.status.currentPage) - 1)}`)}
            disabled={props.status.currentPage <= 1}
          >
            PREV
          </button>
          <Link href="/">
            <a>Home page</a>
          </Link>
          <button onClick={() => Router.push(`/a/${parseInt(props.status.currentPage) + 1}`)}
            disabled={props.status.currentPage >= props.status.totalPage}
          >
            NEXT
          </button>
          <style jsx>{`
            div {
                display: flex;
                justify-content: center;
                align-items: center;
            }

            button {
                display: inline-flex;
                cursor: pointer;
                font-weight: 500;
                line-height: 1.75;
                border-radius: 4px;
                font-size: 0.875rem;
                min-width: 64px;
                border: 1px solid rgba(255, 255, 255, 0.23);
                padding: 5px 15px;
                color: rgba(0, 0, 0, 0.87);
                background-color: #e0e0e0;
                margin: 1rem;
            }

            button:disabled {
                cursor: default;
                color: rgba(0, 0, 0, 0.26);;
                background-color: rgba(0, 0, 0, 0.12);
            }
            `}</style>
        </div>
      )
}

function Pagination(props) {
    const articleSet = 'https://api.github.com/repos/bbc/news-coding-test-dataset/contents/data';
    const { data, error} = useSWR(articleSet, fetcher)
    if (error) return <div>failed to load</div>
    if (!data) return <div>loading...</div>
    console.log(data);
    const numOfArticles = data.length;
    
    const pageState = {totalPage: numOfArticles, currentPage: props.currentPage}
    console.log(pageState);

    return <Page status={pageState} />
}

function Body(props) {
    switch(props.item.type) {
        case 'heading':
            return <div>{props.item.model.text} <style jsx>{`
            div {
                margin: 0;
                line-height: 1.15;
                font-size: 2rem;
            }
            `}</style></div>
        case 'paragraph':    
            return <div>{props.item.model.text}</div>
        case 'list':
            return (<ul>
                {props.item.model.items.map(listItem => (
                    <li>{listItem}</li>
                ))}
            </ul>)
        case 'image': 
            return <img src={props.item.model.url} alt={props.item.model.altText} />
    }
}

export default function Context() {
    const router = useRouter();
    const url = `https://raw.githubusercontent.com/bbc/news-coding-test-dataset/master/data/article-${router.query.id}.json`;
    const { data, error } = useSWR(url, fetcher)
    if (error) return <div>failed to load</div>
    if (!data) return <div>loading...</div>

    return (
        <div>
            <ul>
                {data.body.map(item => (
                    <Body item={item} />
                ))}
            </ul>
            <Pagination currentPage={router.query.id} />
            <style jsx>{`
            div {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }

            ul {
                display: flex;
                flex-direction: column;
                justify-content: center;
                padding: 1rem;
            }

            `}</style>
        </div>
    )
}
