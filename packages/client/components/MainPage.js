import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo-hooks';
import Navbar from 'components/Navbar';
import UserCard from 'components/UserCard';
import NewTweetWithMutation from 'components/NewTweetWithMutation';
import Feed from 'components/Feed';
import WhoToFollow from 'components/WhoToFollow';
import Footer from 'components/Footer';
import TweetModal from 'components/TweetModal';
import ComposeNewTweetModal from 'components/ComposeNewTweetModal';

const GET_USER_QUERY = gql`
  query getUserProfile {
    me {
      id
      name
      username
      tweetsCount
      followersCount
      followingCount
    }
  }
`;

const MainPage = () => {
  const [currentModalData, setCurrentModalData] = useState({});
  const { data, loading } = useQuery(GET_USER_QUERY);

  if (loading) return <div>Loading...</div>;

  const { me: user } = data;

  const openNewTweetModal = () => setCurrentModalData({ type: 'NEW_TWEET' });
  const openTweetModal = tweetId =>
    setCurrentModalData({ type: 'TWEET', tweetId });
  const closeModal = () => setCurrentModalData({});

  return (
    <div className="main">
      <Navbar
        currentPage="home"
        user={user}
        onNewTweetClick={openNewTweetModal}
      />

      <div className="container">
        <div className="main-left">
          <UserCard user={user} />
        </div>

        <div className="content">
          <NewTweetWithMutation />
          <Feed onTweetClick={tweetId => openTweetModal(tweetId)} />
        </div>

        <div className="main-right">
          <WhoToFollow user={user} />
          <Footer />
        </div>
      </div>

      <TweetModal
        isOpen={currentModalData.type === 'TWEET'}
        tweetId={currentModalData.tweetId}
        onClose={closeModal}
        onTweetClick={id => openTweetModal(id)}
      />
      <ComposeNewTweetModal
        isOpen={currentModalData.type === 'NEW_TWEET'}
        onClose={closeModal}
      />

      <style jsx>{`
        .main {
          padding-top: 46px;
          min-height: 100vh;
          background: #e6ecf0;
        }

        .main-left,
        .main-right {
          width: 290px;
          padding: 0 8px;
        }

        .container {
          margin-top: 1rem;
          display: flex;
        }

        .content {
          flex: 1 1 auto;
        }

        .main :global(.footer) {
          margin-top: 12px;
        }

        @media (max-width: 1280px) {
          .main-right {
            display: none;
          }

          .content {
            padding-right: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default MainPage;
