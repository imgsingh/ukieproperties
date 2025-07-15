import { useRouter } from 'next/router';

const Docs = () => {
    const router = useRouter();
    const { slug } = router.query; // This will return an array of path segments

    return <div>Docs Path: {slug ? slug.join(' / ') : 'Loading...'}</div>;
};

export default Docs;
