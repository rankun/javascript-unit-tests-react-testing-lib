import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "../App.css";

const Letter = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loadingMessage, setLoadingMessage] = useState('Dados dos usuários não carregados do servidor.')

  useEffect(() => {
    axios
      .get(`https://jsonplaceholder.typicode.com/users`)
      .then((res) => {
        console.log(res.data);
        setUsers(res.data);
        setLoadingMessage('Dados dos usuários carregados do servidor.');
      })
      .catch((error) => {
        console.error(error);
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Error data: ', error.response.data);
          console.error('Error status: ', error.response.status);
          console.error('Error headers: ', error.response.headers);

          setLoadingMessage('Um erro ocorreu ao carregar dados dos usuários do servidor.');
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.error('Error request: ', error.request);
          setLoadingMessage('O servidor não respondeu com os dados dos usuários.');
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error message: ', error.message);
          setLoadingMessage('Um erro ocorreu ao carregar dados dos usuários do servidor.');
        }
      });
  }, []);

  useEffect(() => {
    axios
      .get(`https://jsonplaceholder.typicode.com/posts`)
      .then((res) => {
        console.log(res.data);
        setPosts(res.data);
      })
      .catch((error) => {
        console.error(error);
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error(error.response.data);
          console.error(error.response.status);
          console.error(error.response.headers);

          console.error('Um erro ocorreu ao carregar dados dos posts do servidor.');
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.error(error.request);
          console.error('O servidor não respondeu com os dados dos posts.');
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error', error.message);
        }
      });
  }, []);

  const profiles = useMemo(() => {
    return users.map(user => {

      const userAddress = user.hasOwnProperty('address') ? user.address : '';
      const userSuite = userAddress.hasOwnProperty('suite') ? userAddress.suite : '';
      const userStreet = userAddress.hasOwnProperty('street') ? userAddress.street : '';
      const userCity = userAddress.hasOwnProperty('city') ? userAddress.city : '';

      const userCompany = user.hasOwnProperty('company') ? user.company : '';
      const userCompanyName = userCompany.hasOwnProperty('name') ? userCompany.name : '';

      const userPosts = posts.filter((post) => post.hasOwnProperty('userId') &&
        user.hasOwnProperty('id') &&
        post.userId === user.id);

      let userProfile = user;

      if (user.hasOwnProperty('address')) {
        userProfile = {
          ...userProfile,
          address: userStreet + ' ' + userSuite + ' ' + userCity,
        }
      }

      if (user.hasOwnProperty('company')) {
        userProfile = {
          ...userProfile,
          company: userCompanyName
        }
      }

      if (userPosts.length > 0) {
        userProfile = {
          ...userProfile,
          posts: userPosts
        }
      }

      return userProfile;
    });
  }, [users, posts])

  const listStyle = {
    color: "black",
    textDecoration: "none",
    listStyle: "none",
  };

  return (
    <>
      {profiles.length > 0 && profiles.map((user) => (
        user.hasOwnProperty('id') &&
        user.hasOwnProperty('username') &&
        <div key={user.id + user.username} className="card">
          <div className="user" data-testid={`user-${user.id}`}>
            {user.hasOwnProperty('name') && <h4 data-testid={`name-${user.id}`}>Name: {user.name}</h4>}
            {user.hasOwnProperty('username') && <h4 data-testid={`username-${user.id}`}>Username: {user.username}</h4>}
            {user.hasOwnProperty('email') && <h4 data-testid={`email-${user.id}`}>Email: {user.email}</h4>}
            {user.hasOwnProperty('address') && <h4 data-testid={`address-${user.id}`}>Address: {user.address}</h4>}
            {user.hasOwnProperty('phone') && <h4 data-testid={`phone-${user.id}`}>Phone: {user.phone}</h4>}
            {user.hasOwnProperty('website') && <h4 data-testid={`website-${user.id}`}>Website: {user.website}</h4>}
            {user.hasOwnProperty('company') && <h4 data-testid={`company-${user.id}`}>Company: {user.company}</h4>}
            {user.hasOwnProperty('id') && <h4 data-testid={`id-${user.id}`}>User Id: {user.id}</h4>}
            {user.hasOwnProperty('posts') && <h4>Posts: </h4>}
            <ul>
              {user.hasOwnProperty('posts') && user.posts
                .map((post) => (
                  post.hasOwnProperty('id') &&
                  post.hasOwnProperty('userId') &&
                  <li key={post.id + post.userId} style={listStyle}>
                    <p data-testid={`postid-${post.id}`}>Post id: {post.id}</p>
                    {post.hasOwnProperty('title') && <p data-testid={`posttitle-${post.id}`}>Post title: {post.title}</p>}
                    {post.hasOwnProperty('body') && <p data-testid={`postbody-${post.id}`}>Post body: {post.body}</p>}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      ))}
      <p data-testid="loading-message">{loadingMessage}</p>
    </>
  );
};

export default Letter;
