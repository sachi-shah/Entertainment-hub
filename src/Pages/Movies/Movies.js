
import axios from "axios";
import { useEffect, useState } from "react";
import SingleContent from '../../components/SingleContent/SingleContent';
import useGenre from '../../hooks/useGenre';
import Genres from '../../components/Genres/Genres';
import CustomPagination from "../../components/Pagination/CustomPagination";

const Movies = () => {
  
    const [genres, setGenres] = useState([]);
    const [page, setPage] = useState(1);
    const [content, setContent] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const genreforURL = useGenre(selectedGenres);
    const [numOfPages, setNumOfPages] = useState();

    const fetchMovies = async () => {
        //const { data } = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&sort_by=primary_release_date.desc&include_adult=false&include_video=false&page=${page}&with_genres=${genreforURL}&primary_release_date.lte=2021-01-01`);
         const { data } = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&sort_by=primary_release_date.desc&primary_release_date.gte=2010-01-01&primary_release_date.lte=2020-12-01&vote_average.gte=7&include_adult=false&include_video=false&page=${page}&with_genres=${genreforURL}`);

        
        setContent(data.results);
        setNumOfPages(data.total_pages);
        console.log(data.total_pages);
    }

    useEffect(() => {
        fetchMovies();
    }, [page, genreforURL])

    return (
        <div>
      <span className="pageTitle">Discover Movies</span>
      <Genres
        type="movie"
        selectedGenres={selectedGenres}
        setSelectedGenres={setSelectedGenres}
        genres={genres}
        setGenres={setGenres}
        setPage={setPage}
      />
      <div className="trending">
        {
        content &&
          content.map((c) => (

            <SingleContent
              key={c.id}
              id={c.id}
              poster={c.poster_path}
              title={c.title || c.name}
              date={c.first_air_date || c.release_date}
              media_type="movie"
              vote_average={c.vote_average}
            />
          ))}
      </div>
      {numOfPages > 1 && (
        <CustomPagination setPage={setPage} numOfPages={numOfPages} />
      )}
      </div>
    )
}
export default Movies;