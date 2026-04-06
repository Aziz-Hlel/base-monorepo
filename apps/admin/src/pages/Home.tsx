import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className='flex w-full flex-col items-center gap-2'>
        <div>Home</div>
        <button
          className='rounded-lg border bg-blue-600 p-1 text-white transition hover:cursor-pointer hover:bg-blue-700'
          onClick={() => navigate('/signin')}
        >
          sign In
        </button>
        <button
          className='rounded-lg border bg-green-600 p-1 text-white transition hover:cursor-pointer hover:bg-green-700'
          onClick={() => navigate('/signup')}
        >
          sign Up
        </button>
      </div>
    </>
  );
};

export default Home;
