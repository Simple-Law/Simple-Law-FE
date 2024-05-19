// src/hooks/useFetchMails.js
import { useState, useEffect } from "react";
import { fetchMails } from "api/mails";

const useFetchMails = (url) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await fetchMails(url);
      if (result.error) {
        setError(result.error);
      } else {
        setData(result.data);
      }
      setLoading(false);
    };

    fetchData();
  }, [url]);

  return { data, error, loading };
};

export default useFetchMails;
