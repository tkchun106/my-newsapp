import Head from 'next/head';
import fetch from 'isomorphic-unfetch';
import useSWR from 'swr';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

function Ranker(props) {
  const { register, handleSubmit } = useForm();
  const onSubmit = data => {
    fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: JSON.stringify(data)
    }).then(r => r.json())
    .then(data => alert(JSON.stringify(data)))
  }

  const numOfArticles = props.data.length;
  const options = [...Array(numOfArticles).keys()].map(key=>key+1)

  return (
    <form className="form-group" onSubmit={handleSubmit(onSubmit)}>
      {props.data.map(data => (
          <div>
            <Rows download_url={data.download_url} />
            <select className="select-form" name={data.name.replace(/-|.json/g, "")} required ref={register}>
            <option value="">--Please rank--</option>
            {options.map(val => (
              <option value={val}>
                {val}
              </option>
            ))}
            </select>
          </div>
      ))}
      <input className="submit" type="submit" />

      <style jsx>{`
      .form-group {
        display: grid;
      }

      div {
        border-bottom: 2px solid #eee;
        padding-bottom: 1em;
        margin-top: 1em;
      }
      .select-form {
        display: inline-block;
        font-family: inherit;
        border: 1px solid #ced4da;
        padding: .375rem .75rem;
        font-size: 1rem;
        line-height: 1.5;
        border-radius: .2rem;
        height: calc(1.8125rem + 2px);
        margin-top: 1rem;
      }
      
      .submit {
        color: #fff;
        background-color: #5cb85c;
        border-color: #4cae4c;
        padding: 6px 12px;
        font-size: 16px;
        line-height: 1.42857143;
        border-radius: 6px;
        cursor: pointer;
      }

    `}</style>
    </form>
  );
}

function Content(props) {
  const pic = props.data.body.filter(item => item.type == "image")
  return (
    <div className="article">
        <h2>
          <Link href="/a/[id]" passHref as={`/a/${props.data.url.replace(/\D/g, "")}`}>
            <a className="title">{props.data.title}</a>
          </Link>
        </h2>
        <div className="heading">{props.data.body.filter(item => item.type == "heading")[0].model.text}</div>
        <div className="paragraph">{props.data.body.filter(item => item.type == "paragraph")[0].model.text}</div>
    <style jsx>{`
      .title {
        color: #0070f3;
        text-decoration: none;
      }
      
      h2 {
        margin-top: 0;
        display: inline;
        font-size: 28px;
        font-weight: 500;
        line-height: 1.1;
      }

      h2 a:hover, 
      h2 a:focus,
      h2 a:active {
        text-decoration: underline;
        color: #007c08;
      }

      div div {
        font-size: 16px;
        line-height: 1.5;
        color: #333;
      }
    `}</style>
    </div>
  );
}

async function fetcher(url) {
  const res = await fetch(url);
  const json = await res.json();
  return json;
}

function Articles(){
  const url = 'https://api.github.com/repos/bbc/news-coding-test-dataset/contents/data';
  const { data, error } = useSWR(url, fetcher)
  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>
  return (
    <div>
      <Ranker data={data} />
    </div>
  );
}

function Rows(props) {
  const url = props.download_url
  const { data, error } = useSWR(url, fetcher)
  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>
  data.url = props.download_url
  return <Content data={data} />
}

const Home = () => (
  <div className="container">
    <Head>
      <title>My News App</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <main>
      <h1 className="heading"> Articles Ranker </h1>
      <p className="description">
        This site presents articles provided on <a href="https://github.com/bbc/news-coding-test-dataset">https://github.com/bbc/news-coding-test-dataset</a>. <br></br>You can rank the articles on a scale of 1 to 5 (with 1 being the best) after you read them. 
      </p>
      <Articles />
    </main>

    <style jsx>{`
      .container {
        min-height: 100vh;
        padding: 0 0.5rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      main {
        padding: 2rem 0;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      .description a {
        color: #0070f3;
        text-decoration: none;
      }

      .description a:hover,
      .description a:focus,
      .description a:active {
        text-decoration: underline;
      }

      .heading {
        margin: 0;
        line-height: 1.15;
        font-size: 4rem;
      }

      .heading,
      .description {
        text-align: center;
      }

      .description {
        line-height: 1.5;
        font-size: 1.5rem;
        margin-bottom: 0;
      }
    `}</style>

    <style jsx global>{`
      html,
      body {
        padding: 0;
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
          Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
      }

      * {
        box-sizing: border-box;
      }
    `}</style>
  </div>
)

export default Home
