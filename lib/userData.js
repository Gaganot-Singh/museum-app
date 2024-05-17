
import { getToken } from './authenticate';

async function fetchRequest(url, method = 'GET', body = null) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  const config = { method, headers };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, config);
    if (!response.ok) throw new Error('Failed To Fetch Data');
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

// Add to Favourites function
export async function addToFavourites(id) {
  return await fetchRequest(`/favourites/${id}`, 'PUT');
}

// Remove from Favourites function
export async function removeFromFavourites(id) {
  return await fetchRequest(`/favourites/${id}`, 'DELETE');
}

// get list of favorites of a user
export async function getFavourites() {
  return await fetchRequest('/favourites');
}

// add to history
export async function addToHistory(id) {
  return await fetchRequest(`/history/${id}`, 'PUT');
}

// remove from history
export async function removeFromHistory(id) {
  return await fetchRequest(`/history/${id}` , 'DELETE');
}

// get search history of user
export async function getHistory() {
  return await fetchRequest('/history');
}