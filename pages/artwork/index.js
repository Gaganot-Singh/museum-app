import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import useSWR from "swr";
import { Row, Col, Pagination, Card } from "react-bootstrap";
import ArtworkCard from "@/components/ArtworkCard";
import Error from "next/error";
import validObjectIDList from '@/public/data/validObjectIDList.json';


const PER_PAGE = 12;

const Artwork = () => {
  const router = useRouter();
  const { data, error } = useSWR(`https://collectionapi.metmuseum.org/public/collection/v1/search?${router.asPath.split("?")[1]}`);
  const [artworkList, setArtworkList] = useState([]);
  const [page, setPage] = useState(1);

  const previousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const nextPage = () => {
    if (page < artworkList.length) setPage(page + 1);
  };

  useEffect(() => {
    if (data) {
      const results = [];
      let filteredResults = validObjectIDList.objectIDs.filter(x => data.objectIDs?.includes(x));

      for (let i = 0; i < filteredResults.length; i += PER_PAGE) {
        const chunk = filteredResults.slice(i, i + PER_PAGE);
        results.push(chunk);
    }
    
      setArtworkList(results);
      setPage(1);
    }
  }, [data]);

  if (error) return <Error statusCode={404} />;
  
  return (
    <>
      {artworkList !== null && (
        <>
          {artworkList.length > 0 ? (
            <Row className="gy-4">
              {artworkList[page - 1].map(currentObjectID => (
                <Col lg={3} key={currentObjectID}>
                  <ArtworkCard objectID={currentObjectID} />
                </Col>
              ))}
            </Row>
          ) : (
            <Card>
              <h4>Nothing Here</h4>
              Try searching for something else.
            </Card>
          )}
          {artworkList.length > 0 && (
            <Row>
              <Col>
                <Pagination>
                  <Pagination.Prev onClick={previousPage} />
                  <Pagination.Item>{page}</Pagination.Item>
                  <Pagination.Next onClick={nextPage} />
                </Pagination>
              </Col>
            </Row>
          )}
        </>
      )}
    </>
  );
};

export default Artwork;
