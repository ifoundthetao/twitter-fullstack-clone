import React from 'react';
import { useQuery } from 'react-apollo-hooks';
import InfiniteScroll from 'react-infinite-scroller';
import Tweet from './Tweet';

const LoadingMessage = ({ initial }) => (
  <div className="feed-loader">
    {initial ? 'Loading tweets...' : 'Loading more tweets...'}

    <style jsx>{`
      .feed-loader {
        background: #fff;
        padding: 20px;
        text-align: center;
      }
    `}</style>
  </div>
);

const InfiniteTweetsList = ({
  fetchQuery,
  variables,
  loadMoreEntries,
  hasMore,
  extractEdges,
}) => {
  const { data, loading, fetchMore, refetch, errors } = useQuery(fetchQuery, {
    variables,
  });

  if (loading) {
    return <LoadingMessage key="initial-feed-loader" initial />;
  }

  const loader = <LoadingMessage key="feed-loader" />;

  return (
    <div className="feed">
      <InfiniteScroll
        hasMore={hasMore(data)}
        loader={loader}
        loadMore={() => loadMoreEntries(data, fetchMore)}
      >
        {extractEdges(data).map(edge => {
          const { node } = edge;
          const { originalTweet, contextTweet, contextUser } = node;

          const id = contextTweet ? contextTweet.id : originalTweet.id;
          const context = contextUser
            ? { user: contextUser, action: node.type }
            : null;

          return (
            <Tweet
              key={id}
              id={originalTweet.id}
              content={originalTweet.content}
              name={originalTweet.user.name}
              username={originalTweet.user.username}
              retweetCount={originalTweet.retweetCount}
              likeCount={originalTweet.likeCount}
              retweeted={originalTweet.retweeted}
              liked={originalTweet.liked}
              refetch={refetch}
              context={context}
            />
          );
        })}
      </InfiniteScroll>
    </div>
  );
};

export default InfiniteTweetsList;