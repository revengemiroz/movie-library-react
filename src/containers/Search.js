import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';

import { setHeader, getMoviesSearch } from '../actions';
import MoviesList from '../components/MoviesList';
import Loader from '../components/Loader';

const Search = ({
  geral,
  match,
  location,
  setHeader,
  getMoviesSearch,
  movies,
}) => {
  const { query } = match.params;
  const params = queryString.parse(location.search);
  const { base_url } = geral.base.images;

  // Change Header everytime query change
  useEffect(() => {
    const title = `Search results for: ${query}`;
    setHeader(title);
    // Clean up to remove page header
    return () => {
      setHeader();
    };
  }, [query]);

  // Fetch movies hook
  useFetchMoviesSearch(query, getMoviesSearch, params);

  //If there are no movies, still fetching, loading
  if (Object.entries(movies).length === 0) {
    return <Loader />;
  }

  //If there are no results
  else if (movies.total_results === 0) {
    return <div>No results</div>;
  }

  // Else show the results
  else {
    return <MoviesList movies={movies} baseUrl={base_url} />;
  }
};

// Hook to fetch the movies, will be called everytime the route for the search changes
function useFetchMoviesSearch(query, getMoviesSearch, params) {
  useEffect(() => {
    getMoviesSearch(query, params.page);
  }, [query, params.page]);
}

// Map State to Component Props
const mapStateToProps = ({ geral, movies }) => {
  return { geral, movies };
};

export default connect(
  mapStateToProps,
  {
    setHeader,
    getMoviesSearch,
  }
)(Search);
