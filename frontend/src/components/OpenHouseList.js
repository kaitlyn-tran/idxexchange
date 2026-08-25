import React from 'react';

function formatDate(date) {
  if (!date) {
    return 'Date unavailable';
  }

  const parsedDate = new Date(date);

  if (isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString();
}

function formatTime(time) {
  if (!time) {
    return 'Time unavailable';
  }

  const parts = String(time).split(':');

  if (parts.length < 2) {
    return time;
  }

  let hours = Number(parts[0]);
  const minutes = parts[1];

  if (isNaN(hours)) {
    return time;
  }

  const period = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;

  if (hours == 0) {
    hours = 12;
  }

  return `${hours}:${minutes} ${period}`;
}

function getRemarks(allData) {
  if (!allData) {
    return '';
  }

  if (typeof allData == 'object') {
    return allData.OpenHouseRemarks || '';
  }

  try {
    const data = JSON.parse(allData);

    return data.OpenHouseRemarks || '';
  } catch {
    return '';
  }
}

function OpenHouseList({ openHouses }) {
  if (!openHouses || openHouses.length == 0) {
    return (
      <section className="open-houses">
        <h2>Open Houses</h2>
        <p>No open houses scheduled</p>
      </section>
    );
  }

  return (
    <section className="open-houses">
      <h2>Open Houses</h2>

      <div className="open-house-list">
        {openHouses.map((openHouse, index) => {
          const remarks = getRemarks(openHouse.all_data);

          return (
            <div
              className="open-house-card"
              key={index}
            >
              <h3>
                {formatDate(openHouse.OpenHouseDate)}
              </h3>

              <p>
                <strong>Time:</strong>{' '}
                {formatTime(openHouse.OH_StartTime)}
                {' - '}
                {formatTime(openHouse.OH_EndTime)}
              </p>

              {remarks && (
                <p>
                  <strong>Remarks:</strong>{' '}
                  {remarks}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default OpenHouseList;