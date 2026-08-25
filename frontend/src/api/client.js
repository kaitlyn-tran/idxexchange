async function handleResponse(response) {
  if (!response.ok) {
    let errorMessage = `HTTP error! Status: ${response.status}`;

    try {
      const errorData = await response.json();

      if (errorData.message) {
        errorMessage = errorData.message;
      }
    } catch {
      //
    }

    throw new Error(errorMessage);
  }

  return response.json();
}

export async function fetchProperties(filters = {}) {
  const query = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      query.append(key, value);
    }
  });

  const queryString = query.toString();

  const endpoint = `/api/properties${
    queryString ? `?${queryString}` : ''
  }`;

  const response = await fetch(endpoint);

  return handleResponse(response);
}

export async function fetchPropertyById(id) {
  const response = await fetch(`/api/properties/${id}`);

  return handleResponse(response);
}

export async function fetchOpenHouses(id) {
  const response = await fetch(
    `/api/properties/${id}/openhouses`
  );

  return handleResponse(response);
}