import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function App() {
  const { data, error } = useSWR(
    '/api/item',
    fetcher
  );

  if (error) return 'An error has occurred.';
  if (!data) return 'Loading...';
  return JSON.stringify(data, null, 2);
}
