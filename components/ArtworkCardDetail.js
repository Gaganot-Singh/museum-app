import { useEffect, useState } from "react";
import useSWR from "swr";
import Card from "react-bootstrap/Card";
import Link from "next/link";
import Error from "next/error";
import { useAtom } from "jotai"; 
import { addToFavourites, removeFromFavourites } from "@/lib/userData"; 
import { favouritesAtom } from "@/store"; 

const ArtworkCardDetail = ({ objectID }) => {
  const { data, error } = useSWR(objectID ? `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}` : null, {
    revalidateOnFocus: false,
  });
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom); 

  const [showAdded, setShowAdded] = useState(false);

  useEffect(() => {
    setShowAdded(favouritesList.includes(objectID));
     console.log(favouritesList)
  }, [favouritesList, objectID]);

  const favouritesClicked = async () => { 
    if (showAdded) {
      setFavouritesList(await removeFromFavourites(objectID)); 
      setShowAdded(false);
    } else {
      setFavouritesList(await addToFavourites(objectID));
      setShowAdded(true); 
    }
  };

  if (error) {
    return <Error statusCode={404} />;
  }

  if (!data) {
    return null;
  }

  const {
    title,
    primaryImage,
    objectDate,
    classification,
    medium,
    artistDisplayName,
    creditLine,
    dimensions,
    artistWikidata_URL
  } = data;

  return (
    <Card>
      {primaryImage && <Card.Img variant="top" src={primaryImage} />}
      <Card.Body>
        <Card.Text>
          <h4> {title} </h4>
          <strong>Date:</strong> {objectDate || "N/A"}
          <br/>
          <strong>Classification:</strong> {classification || "N/A"}
          <br/>
          <strong>Medium:</strong> {medium || "N/A"}
          <br />
          <br />
          {artistDisplayName && (
            <>
              <strong>Artist:</strong> {artistDisplayName}{" "}
              {artistWikidata_URL && (
                <Link href={artistWikidata_URL} target="_blank" rel="noreferrer" passHref legacyBehavior>
                  wiki
                </Link>
              )}
              <br />
            </>
          )}
          <strong>Credit Line:</strong> {creditLine || "N/A"}
          <br />
          <strong>Dimensions:</strong> {dimensions || "N/A"}
        </Card.Text>
        <button 
          className={`btn btn-${showAdded ? "primary" : "outline-primary"}`} 
          onClick={favouritesClicked}
        >
          + Favourite {showAdded ? "(added)" : ""}
        </button>
      </Card.Body>
    </Card>
  );
};

export default ArtworkCardDetail;
